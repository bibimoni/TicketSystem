import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { voucher_reduce_type } from 'generated/prisma';

export class UpdateVoucherDto {
  @ApiProperty({
    example: '68ea665bdfe71b734e5907ad',
    description: 'ID of the voucher'
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    example: 'GIAMGIA30K',
    description: 'Code name of the voucher'
  })
  @IsString()
  @IsOptional()
  code?: string

  @ApiProperty({
    example: 'PERCENTAGE',
    enum: voucher_reduce_type,
    description: 'Type of voucher reduction'
  })
  @IsEnum(voucher_reduce_type)
  @IsOptional()
  reduce_type?: voucher_reduce_type;

  @ApiProperty({ example: 10, description: 'Reduction amount (10% or 10000 VND)' })
  @IsNumber()
  @IsOptional()
  reduce_price?: number;

  @ApiProperty({ example: 100000, description: 'Minimum price (VND) to apply voucher' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: '2025-10-01T00:00:00.000Z', description: 'Start date' })
  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @ApiProperty({ example: '2025-12-31T23:59:59.999Z', description: 'End date' })
  @IsOptional()
  @IsDateString()
  end_date?: Date;
}