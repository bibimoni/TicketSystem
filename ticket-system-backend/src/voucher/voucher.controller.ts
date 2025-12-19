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

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
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

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete voucher by ID' })
  @ApiBody({
    description: 'Voucher ID',
    examples: {
      sample: {
        summary: 'Example voucher ID',
        value: { id: '68ea665bdfe71b734e5907ad' }
      }
    }
  })
  async deleteVoucher(@Body('id') voucherId: string) {
    return this.voucherService.remove(voucherId);
  }
}