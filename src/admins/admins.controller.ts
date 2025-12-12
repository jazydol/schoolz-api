import { Controller, Get } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Admin } from './schemas/admin.schema';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async findAll(): Promise<Admin[]> {
    return this.adminsService.findAll();
  }
}

