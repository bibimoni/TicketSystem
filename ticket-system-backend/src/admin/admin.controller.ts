import { Controller, Get, Post, Body, Param, Request, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PublicAdminResponseDto } from './dto/admin-response.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin register' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    description: "Successfully register admin",
    type: PublicAdminResponseDto
  })
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  // @Get('all')
  // async findAll() {
  //   return this.adminService.findAll();
  // }
}