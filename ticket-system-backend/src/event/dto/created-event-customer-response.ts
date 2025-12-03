import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsString, IsOptional } from 'class-validator';
import { event_format } from 'generated/prisma';



export class TicketTypeResponseDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58204',
    description: 'The unique identifier of the ticket.',
  })
  id: string;

  @ApiProperty({
    example: 'Anh tài',
    description: 'The name of the ticket type.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 10000,
    description: 'The amount of the ticket type.',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 500000,
    description: 'The price of the ticket type.',
    required: false,
    nullable: true
  })
  @IsNumber()
  @IsOptional()
  price?: number | null;

  @ApiProperty({
    example: 'Access to VIP area',
    description: 'Benefit info of the ticket type.',
    required: false,
    nullable: true
  })
  @IsString()
  benefit_info?: string | null;

  @ApiProperty({
    example: 'AVAILABLE',
    description: 'The status of the ticket.',
  })
  status: string;
}

export class VoucherResponseDto {
  @ApiProperty({ example: 'GIAMGIA10K', description: 'Human friendly voucher code (unique per event)' })
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
  @IsMongoId()
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
    description: 'The status of the event.',
    example: 'DRAFT'
  })
  status: string;

  @ApiProperty({
    enum: event_format,
    enumName: 'event_format',
    example: event_format.ONLINE,
  })
  @IsEnum(event_format)
  format: event_format;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Yeah1',
    description: 'The organizer of the event'
  })
  organizer?: string | null;

  @ApiProperty({
    description: 'Array of ticket types created for the event.',
    type: () => [TicketTypeResponseDto],
  })
  ticketTypes: TicketTypeResponseDto[];

  @ApiProperty({
    description: 'Vouchers created for this event (unique per event)',
    type: () => [VoucherResponseDto],
    required: false,
    nullable: true
  })
  vouchers?: VoucherResponseDto[];
}
