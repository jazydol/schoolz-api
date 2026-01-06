import {
  Injectable,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { CreateFirstAdminDto } from './dto/create-first-admin.dto';
import { UserType } from './enums/user-type.enum';
import { canCreateUserType } from '../../common/utils/user-permissions.util';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Public registration - users can only register as STUDENT
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided
    const hashedPassword = createUserDto.password
      ? await this.authService.hashPassword(createUserDto.password)
      : undefined;

    const userData = {
      ...createUserDto,
      password: hashedPassword,
      type: UserType.STUDENT, // Force STUDENT type, ignore any type in DTO
    };

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  // Admin-only endpoint - validates permissions based on requester's role
  async createByAdmin(
    createUserAdminDto: CreateUserAdminDto,
    requesterRole: UserType,
  ): Promise<User> {
    // Check if requester has permission to create this user type
    if (!canCreateUserType(requesterRole, createUserAdminDto.type)) {
      throw new ForbiddenException(
        `You do not have permission to create users with role: ${createUserAdminDto.type}`,
      );
    }

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: createUserAdminDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided
    const hashedPassword = createUserAdminDto.password
      ? await this.authService.hashPassword(createUserAdminDto.password)
      : undefined;

    const userData = {
      ...createUserAdminDto,
      password: hashedPassword,
    };

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  // Bootstrap endpoint - creates first super admin
  // Only works if no super_admin exists and correct bootstrap token is provided
  async createFirstAdmin(
    createFirstAdminDto: CreateFirstAdminDto,
  ): Promise<User> {
    // Verify bootstrap token
    const bootstrapToken = this.configService.get<string>('app.bootstrapToken');
    if (!bootstrapToken) {
      throw new UnauthorizedException(
        'Bootstrap token is not configured. Cannot create first admin.',
      );
    }

    if (createFirstAdminDto.bootstrapToken !== bootstrapToken) {
      throw new UnauthorizedException('Invalid bootstrap token');
    }

    // Check if any super admin already exists
    const existingSuperAdmin = await this.userModel
      .findOne({ type: UserType.SUPER_ADMIN })
      .exec();

    if (existingSuperAdmin) {
      throw new BadRequestException(
        'A super admin already exists. Use the admin creation endpoint instead.',
      );
    }

    // Check if user with this email already exists
    const existingUser = await this.userModel.findOne({
      email: createFirstAdminDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.authService.hashPassword(
      createFirstAdminDto.password,
    );

    const userData = {
      name: createFirstAdminDto.name,
      email: createFirstAdminDto.email,
      password: hashedPassword,
      type: UserType.SUPER_ADMIN,
    };

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }
}
