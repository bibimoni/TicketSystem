// import { IsEnum, IsString, IsNumber, IsOptional, IsDateString, IsNotEmpty, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';

// export class PublicTransactionDto {
//   @IsNotEmpty()
//   @IsString({ each: true })
//   id: string;

//   @IsEnum(['CREDIT_CARD', 'BANK_TRANSFER', 'MOMO', 'ZALOPAY', 'CASH'])
//   method: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'MOMO' | 'ZALOPAY' | 'CASH';

//   @IsEnum(['PENDING', 'PAID', 'CANCELLED'])
//   status: 'PENDING' | 'PAID' | 'CANCELLED';

//   @IsString()
//   customer_id: string;

//   @IsNumber()
//   total_price: number;

//   @IsString()
//   time_date: Date;
// }
import { ApiProperty } from '@nestjs/swagger';

// DTO cho TicketPrice
export class TicketPriceInTransactionDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 'VIP' })
  name?: string;

  @ApiProperty({ example: 500000 })
  price: number;

  @ApiProperty({ example: 'Front row seat, free drink', required: false })
  benefit_info?: string;
}

// DTO cho Event
export class EventInTransactionDto {
  @ApiProperty({ example: '68f8beb3de728e3006433b22' })
  id: string;

  @ApiProperty({ example: '8WONDER WINTER 2025: SYMPHONY OF STARS' })
  name: string;

  @ApiProperty({ example: 'Hanoi' })
  destination?: string;

  @ApiProperty({ example: '8Wonder' })
  organzier?: string;

  @ApiProperty({ example: ['2025-12-06T11:00:00.000+00:00'] })
  eventTimes: Date[];
}

// DTO cho Ticket
export class TicketInTransactionDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 'A1', required: false })
  seat?: string;

  @ApiProperty({ example: 'available' })
  status: string;

  @ApiProperty({ type: EventInTransactionDto })
  event: EventInTransactionDto;

  @ApiProperty({ type: TicketPriceInTransactionDto })
  ticketPrice: TicketPriceInTransactionDto;
}

// DTO cho TransactionHasTicket
export class TransactionHasTicketDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 2, description: 'Number of tickets' })
  amount: number;

  @ApiProperty({ type: TicketInTransactionDto })
  ticket: TicketInTransactionDto;
}

// DTO cho Voucher
export class VoucherInTransactionDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'FIXED'] })
  reduce_type: string;

  @ApiProperty({ example: 10 })
  reduce_price: number;
}

// DTO cho TransactionApplyVoucher
export class TransactionApplyVoucherDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 1, description: 'Number of times voucher applied' })
  apply_count: number;

  @ApiProperty({ type: VoucherInTransactionDto })
  voucher: VoucherInTransactionDto;
}

// DTO cho Customer User
export class UserInTransactionDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;
}

// DTO cho Customer
export class CustomerInTransactionDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ type: UserInTransactionDto })
  user: UserInTransactionDto;
}

export class PublicTransactionResponseDto {
  @ApiProperty({
    example: '68ea665bdfe71b734e5907ad',
    description: 'Transaction ID'
  })
  id: string;

  @ApiProperty({
    example: '2025-10-22T10:30:00Z',
    description: 'Transaction date and time'
  })
  time_date: Date;

  @ApiProperty({
    example: 'stripe',
    enum: ['stripe', 'cash'],
    description: 'Payment method'
  })
  method: string;

  @ApiProperty({
    example: 'PAID',
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    description: 'Transaction status'
  })
  status: string;

  @ApiProperty({
    example: 500000,
    description: 'Price before applying vouchers'
  })
  price_before_voucher: number;

  @ApiProperty({
    example: 450000,
    description: 'Final price after vouchers'
  })
  total_price: number;

  @ApiProperty({
    example: '68ea665bdfe71b734e5907ad',
    description: 'Customer ID'
  })
  customer_id: string;

  @ApiProperty({
    type: [TransactionHasTicketDto],
    description: 'List of tickets in this transaction'
  })
  tickets: TransactionHasTicketDto[];

  @ApiProperty({
    type: [TransactionApplyVoucherDto],
    description: 'List of vouchers applied',
    required: false
  })
  vouchers?: TransactionApplyVoucherDto[];

  @ApiProperty({
    type: CustomerInTransactionDto,
    description: 'Customer information',
    required: false
  })
  customer?: CustomerInTransactionDto;
}