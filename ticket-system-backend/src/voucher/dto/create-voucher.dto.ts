import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { voucher_reduce_type } from 'generated/prisma';

export class CreateVoucherDto {
  @ApiProperty({
    example: 'GIAMGIA30K',
    description: 'Code name of the voucher'
  })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty({
    example: 'PERCENTAGE',
    enum: voucher_reduce_type,
    description: 'Type of voucher reduction'
  })
  @IsEnum(voucher_reduce_type)
  @IsNotEmpty()
  reduce_type: voucher_reduce_type;

  @ApiProperty({ example: 10, description: 'Reduction amount (10% or 10000 VND)' })
  @IsNumber()
  @IsNotEmpty()
  reduce_price: number;

  @ApiProperty({ example: 100000, description: 'Minimum price (VND) to apply voucher' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: '2025-10-01T00:00:00.000Z', description: 'Start date' })
  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({ example: '2025-12-31T23:59:59.999Z', description: 'End date' })
  @IsDateString()
  @IsNotEmpty()
  end_date: Date;
}