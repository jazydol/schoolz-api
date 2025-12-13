import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { CreateUserAdminDto } from '../modules/users/dto/create-user-admin.dto';
import { UserType } from '../modules/users/enums/user-type.enum';
import { canCreateUserType } from '../common/utils/user-permissions.util';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Public registration - users can only register as STUDENT
  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData = {
      ...createUserDto,
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

    const createdUser = new this.userModel(createUserAdminDto);
    return createdUser.save();
  }
}

