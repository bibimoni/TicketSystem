import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { event_format, event_status } from 'generated/prisma';
import { TicketTypeResponseDto, VoucherResponseDto } from './created-event-customer-response';

export class PublicEventResponseDto {
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
  })
  information: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Van Phuc City, Ho Chi Minh City, Vietnam',
  })
  destination: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Yeah1',
    description: 'The organizer of the event'
  })
  organizer: string | null;

  @ApiProperty({
    enum: event_status,
    example: 'PUBLISHED'
  })
  status: event_status

  @ApiProperty({
    enum: event_format,
    example: 'ONLINE'
  })
  format: event_format

  @IsString()
  @ApiProperty({
    example: 'https://cloudinary...',
    required: false,
    nullable: true,
  })
  event_picture_url: string | null

  @IsString()
  @ApiProperty({
    example: 'https://cloudinary...',
    required: false,
    nullable: true,
  })
  event_banner_url: string | null

  @IsString()
  @ApiProperty({
    example: 'https://cloudinary...',
    required: false,
    nullable: true,
  })
  organizer_logo: string | null

  @IsString()
  @ApiProperty({
    example: 'This is...',
    required: false,
    nullable: true,
  })
  organizer_information: string | null


  @ApiProperty({
    required: true,
    nullable: false,
    example: "2025-10-10T09:00:00.000Z",
  })
  eventTime: Date;

  @ApiProperty({
    required: true,
    nullable: false,
    example: "2025-10-10T09:00:00.000Z"
  })
  eventTicketStart: Date;

  @ApiProperty({
    required: true,
    nullable: false,
    example: "2025-10-31T09:00:00.000Z"
  })
  eventTicketEnd: Date;

  @ApiProperty({
    required: true,
    type: () => [TicketTypeResponseDto]
  })
  ticketTypes: TicketTypeResponseDto[]


  @ApiProperty({
    required: true,
    type: () => [VoucherResponseDto]
  })
  vouchers: VoucherResponseDto[]
}
