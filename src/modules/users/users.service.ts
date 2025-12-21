import {
  Injectable,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { UserType } from './enums/user-type.enum';
import { canCreateUserType } from '../../common/utils/user-permissions.util';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
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
}

