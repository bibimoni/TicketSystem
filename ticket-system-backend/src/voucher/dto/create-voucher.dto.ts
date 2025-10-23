import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum } from 'class-validator';

export class CreateVoucherDto {
  @ApiProperty({
    example: 'PERCENTAGE',
    enum: ['PERCENTAGE', 'FIXED'],
    description: 'Type of voucher reduction'
  })
  @IsEnum(['PERCENTAGE', 'FIXED'])
  reduce_type: 'PERCENTAGE' | 'FIXED';

  @ApiProperty({ example: 10, description: 'Reduction amount (10% or 10000 VND)' })
  @IsNumber()
  reduce_price: number;

  @ApiProperty({ example: 100, description: 'Number of vouchers available' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 100000, description: 'Minimum price (VND) to apply voucher' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: '2025-10-01T00:00:00.000Z', description: 'Start date' })
  start_date: Date;

  @ApiProperty({ example: '2025-12-31T23:59:59.999Z', description: 'End date' })
  end_date: Date;
}