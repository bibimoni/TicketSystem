import { Controller, Get, Post, Body, Param, Request, UseGuards, HttpStatus, HttpCode, UnauthorizedException, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PublicAdminResponseDto } from './dto/admin-response.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { PublicUserResponseDto } from 'src/customer/dto/customer-response.dto';
import { UpdateProfileDto } from 'src/customer/dto/update-profile.dto';

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
  async create(@Body() createAdminDto: CreateAdminDto): Promise<PublicAdminResponseDto> {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer admin token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsI...',
    }
  })
  @ApiResponse({
    description: "Successfully get admin's profile",
    type: PublicUserResponseDto
  })
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.adminService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsI...',
    }
  })
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto): Promise<any> {
    const user = req.user
    if (!user) {
      throw new UnauthorizedException()
    }
    return await this.adminService.updateProfile({ username: user.username, email: user.email }, updateProfileDto)
  }
}