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
import { CreateFirstAdminDto } from './dto/create-first-admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserType } from './enums/user-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Bootstrap endpoint - creates first super admin
  // Requires bootstrap token from environment variables
  // Only works if no super_admin exists
  @Post('bootstrap')
  async bootstrap(
    @Body() createFirstAdminDto: CreateFirstAdminDto,
  ): Promise<User> {
    return this.usersService.createFirstAdmin(createFirstAdminDto);
  }

  // Public registration endpoint - users can only register as STUDENT
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // Admin-only endpoint - only super_admin and school_admin can access
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.SCHOOL_ADMIN)
  @Post('admin/create')
  async createByAdmin(
    @Body() createUserAdminDto: CreateUserAdminDto,
    @Request() req: { user?: { type: UserType } },
  ): Promise<User> {
    const requesterRole = req.user?.type as UserType;
    return this.usersService.createByAdmin(createUserAdminDto, requesterRole);
  }
}
