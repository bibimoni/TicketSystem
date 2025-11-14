import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class VoucherApplyDto {
  @ApiProperty({
    example: '68ea665bdfe71b734e5907ad',
    description: 'Voucher ID'
  })
  @IsString()
  @IsNotEmpty()
  voucher_id: string;
}

export class CheckoutIntentDto {
  @ApiProperty({
    example: ['68ea665bdfe71b734e5907ad', '68ea665bdfe71b734e5907ae'],
    description: 'Array of ticket IDs to purchase'
  })
  @IsArray()
  @IsString({ each: true })
  ticketIds: string[];

  @ApiProperty({
    type: [VoucherApplyDto],
    required: false,
    description: 'Optional vouchers to apply'
  })
  @IsOptional()
  @IsArray()
  vouchers?: VoucherApplyDto[];
}

export class ConfirmPaymentDto {
  @ApiProperty({
    example: 'pi_3Q1234567890abcdef',
    description: 'Stripe PaymentIntent ID from checkout response'
  })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;
}