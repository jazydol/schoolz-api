import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserType } from './enums/user-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Public registration endpoint - users can only register as STUDENT
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // Admin-only endpoint - only super_admin and school_admin can access
  // TODO: Add JWT AuthGuard before RolesGuard to populate request.user
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.SCHOOL_ADMIN)
  @Post('admin/create')
  async createByAdmin(
    @Body() createUserAdminDto: CreateUserAdminDto,
    @Request() req: any, // Will be properly typed when JWT guard is added
  ): Promise<User> {
    // Get the requester's role from the authenticated user
    // This will come from JWT token once authentication is implemented
    const requesterRole = req.user?.type as UserType;

    if (!requesterRole) {
      throw new Error('User role not found. Ensure JWT AuthGuard is implemented.');
    }

    return this.usersService.createByAdmin(createUserAdminDto, requesterRole);
  }
}

