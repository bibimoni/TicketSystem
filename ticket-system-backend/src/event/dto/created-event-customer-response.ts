import { ApiProperty } from '@nestjs/swagger';

export class TicketPriceResponseDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58203',
    description: 'The unique identifier of the ticket price.',
  })
  id: string;

  @ApiProperty({
    example: 'Standard Price',
    description: 'The name of the ticket price tier.',
  })
  name?: string | null;

  @ApiProperty({
    example: 50,
    description: 'The price of the ticket.',
  })
  price: number;

  @ApiProperty({
    example: 'Access to standard seating area',
    description: 'Benefits associated with this ticket price tier.',
  })
  benefit_info?: string | null;
}

export class TicketResponseDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58204',
    description: 'The unique identifier of the ticket.',
  })
  id: string;

  @ApiProperty({
    example: 'A1',
    description: 'The seat identifier for the ticket.',
  })
  seat: string;

  @ApiProperty({
    example: 'AVAILABLE',
    description: 'The status of the ticket.',
  })
  status: string;

  @ApiProperty({
    description: 'Price of the ticket',
    type: [TicketPriceResponseDto],
  })
  ticketPrice: TicketPriceResponseDto
}

export class VoucherResponseDto {
  @ApiProperty({ example: '001', description: 'Human friendly voucher code (unique per event)' })
  code: string;

  @ApiProperty({ example: '68e4e22c9815978759f58206', description: 'Voucher id' })
  id: string;

  @ApiProperty({ example: 'FIXED', description: 'Reduce type (FIXED|PERCENTAGE)' })
  reduce_type: string;

  @ApiProperty({ example: 10, description: 'Reduce value (amount or percent)' })
  reduce_price: number;

  @ApiProperty({ example: 0, description: 'Optional price field meaning depends on business' })
  price?: number;

  @ApiProperty({ example: '2025-12-01T00:00:00.000Z' })
  start_date: Date;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z' })
  end_date: Date;
}

export class CreatedEventCustomerResponseDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58203',
    description: 'The unique identifier of the event.',
  })
  id: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: 'The Vietnam Concert',
    description: 'The name of the event.',
  })
  name: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Additional information about the event.',
    example: 'This is the Vietname national concert featuring top artists from around the country. Join us for an unforgettable night of music, culture, and celebration.'
  })
  information: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'The location where the event will take place',
    example: 'Van Phuc City, Ho Chi Minh City, Vietnam',
  })
  destination?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Yeah1',
    description: 'The organizer of the event'
  })
  organizer?: string | null;

  @ApiProperty({
    description: 'Array of tickets created for the event.',
    type: [TicketResponseDto],
  })
  tickets: TicketResponseDto[];

  @ApiProperty({
    description: 'Vouchers created for this event (unique per event)',
    type: [VoucherResponseDto],
    required: false,
    nullable: true
  })
  vouchers?: VoucherResponseDto[];
}
