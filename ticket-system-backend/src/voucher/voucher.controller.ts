import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('voucher')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) { }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create voucher (Admin only)' })
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer admin token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @ApiBody({ type: CreateVoucherDto })
  @ApiResponse({
    status: 201,
    description: 'Voucher created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async create(@Body() createVoucherDto: CreateVoucherDto, @Request() req) {
    console.log('User from request:', req.user);
    console.log('Admin from request:', req.admin);
    return await this.voucherService.create(createVoucherDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active vouchers' })
  @ApiResponse({
    status: 200,
    description: 'List of all active vouchers',
  })
  async findAll() {
    return await this.voucherService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get voucher by ID' })
  @ApiParam({
    name: 'id',
    description: 'Voucher ID',
    example: '68ea665bdfe71b734e5907ad'
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher found',
  })
  @ApiResponse({
    status: 403,
    description: 'Voucher not found',
  })
  async findOne(@Param('id') id: string) {
    return await this.voucherService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete voucher (Admin only)' })
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer admin token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Voucher ID',
    example: '68ea665bdfe71b734e5907ad'
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Voucher not found',
  })
  async remove(@Param('id') id: string) {
    return await this.voucherService.remove(id);
  }
}