import { ApiProperty } from '@nestjs/swagger';

export class EventInTransactionDto {
  @ApiProperty({ example: '68f8beb3de728e3006433b22' })
  id: string;

  @ApiProperty({ example: '8WONDER WINTER 2025: SYMPHONY OF STARS' })
  name: string;

  @ApiProperty({ example: 'Hanoi' })
  destination?: string;

  @ApiProperty({ example: '8Wonder' })
  organzier?: string;

  @ApiProperty({ example: '2025-12-06T11:00:00.000+00:00' })
  eventTime: Date;
}

export class TicketTypeInTransactionDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 'GA-A1' })
  name: string;

  @ApiProperty({ type: () => EventInTransactionDto })
  event: EventInTransactionDto;

  @ApiProperty({ example: 500000, required: false, nullable: true })
  price?: number | null;

  @ApiProperty({ example: 'Front row seat, free drink', required: false })
  benefit_info?: string;
}

export class TicketInTransactionDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 'TKZ-' })
  code: string;

  @ApiProperty({ example: 'AVAILABLE' })
  status: string;

  @ApiProperty({ type: () => TicketTypeInTransactionDto })
  ticket_type: TicketTypeInTransactionDto;
}

export class TransactionHasTicketDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 2, description: 'Number of tickets' })
  amount: number;

  @ApiProperty({ type: () => TicketInTransactionDto })
  ticket: TicketInTransactionDto;
}

export class VoucherInTransactionDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'FIXED'] })
  reduce_type: string;

  @ApiProperty({ example: 10 })
  reduce_price: number;
}

export class TransactionApplyVoucherDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad' })
  id: string;

  @ApiProperty({ type: VoucherInTransactionDto })
  voucher: VoucherInTransactionDto;
}

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
    example: [
      {
        id: '68ea665bdfe71b734e5907ad',
        amount: 1,
        ticket: {
          id: '68ea665bdfe71b734e5907ad',
          seat: 'GA-A1',
          status: 'available',
          event: {
            id: '68f8beb3de728e3006433b22',
            name: '8WONDER WINTER 2025: SYMPHONY OF STARS',
            destination: 'Hanoi',
            organzier: '8Wonder',
            eventTime: '2025-12-06T18:00:00.000+07:00'
          },
          ticket_type: {
            id: '68ea665bdfe71b734e5907ad',
            name: 'VIP',
            price: 1400000,
            benefit_info: 'Front row seat, free drink'
          }
        }
      }
    ],
    type: () => TransactionHasTicketDto,
    description: 'List of tickets in this transaction'
  })
  tickets: TransactionHasTicketDto[];

  @ApiProperty({
    type: () => TransactionApplyVoucherDto,
    isArray: true,
    description: 'List of vouchers applied',
    required: false
  })
  vouchers?: TransactionApplyVoucherDto[];

  @ApiProperty({
    type: () => CustomerInTransactionDto,
    description: 'Customer information',
    required: false
  })
  customer?: CustomerInTransactionDto;
}