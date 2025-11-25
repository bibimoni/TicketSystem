import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
import { event_format } from "generated/prisma"
import { CreateTicketPriceDto } from "src/ticket/dto/create-ticket.dto"
import { CreateVoucherDto } from "src/voucher/dto/create-voucher.dto"

export class UpdateEventDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58203',
    description: 'Cannot empty when updating: The unique identifier of the event.',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'The Vietnam Concert'
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  name?: string

  @ApiProperty({
    example: 'This is the Vietname national concert featuring top artists from around the country. Join us for an unforgettable night of music, culture, and celebration.',
    description: 'Detailed information about the event'
  })
  @IsString()
  @MinLength(20)
  @IsOptional()
  information?: string

  @ApiProperty({
    example: 'Van Phuc City, Ho Chi Minh City, Vietnam',
    description: 'The location where the event will take place'
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  destination?: string

  @ApiProperty({
    example: 'Yeah1',
    description: 'The organizer of the event'
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  organizer?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://cloudinary...',
    required: false
  })
  event_picture_url?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://cloudinary...',
    required: false
  })
  organizer_logo?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'This is the organizer...',
    required: false
  })
  organizer_information?: string

  @ApiProperty({
    enum: event_format,
    enumName: 'event_format',
    example: event_format.ONLINE,
  })
  @IsOptional()
  @IsEnum(event_format)
  format?: event_format;

  @ApiProperty({
    example: '2025-10-20T18:30:00+07:00',
    description: 'Ticket sell start date and time'
  })
  @IsOptional()
  eventTicketStart?: Date

  @ApiProperty({
    example: '2025-11-20T18:30:00+07:00',
    description: 'Ticket sell end date and time'
  })
  @IsDateString()
  @IsOptional()
  eventTicketEnd?: Date

  @ApiProperty({
    example: '2025-12-20T18:30:00+07:00',
    description: 'Event occurrence date and time'
  })
  @IsOptional()
  @IsDateString()
  eventTime?: Date

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  event_custom_slug?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ required: true })
  messages?: string

  @IsArray()
  @ApiProperty({
    type: () => CreateTicketPriceDto,
    example: [
      {
        price: 1800000,
        benefit_info: 'Access to standard seating area',
        ticketTypes: [
          {
            name: 'GA-A1',
            amount: 15000,
          },
          {
            name: 'GA-A2',
            amount: 10000,
          }
        ]
      },
      {
        price: 2000000,
        benefit_info: 'Access to VIP seating area and complimentary drinks',
        ticketTypes: [
          {
            name: "VIP-A1",
            amount: 5000,
          },
          {
            name: "VIP-B1",
            amount: 5000,
          }
        ]
      }
    ],
    description: 'Array of ticket types and prices available for the event',
  })
  @IsOptional()
  ticketsPrice?: CreateTicketPriceDto[]

  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    type: () => CreateVoucherDto,
    example: [
      {
        reduce_type: 'FIXED',
        reduce_price: 100000,
        price: 1000000,
        start_date: '2025-12-01T00:00:00.000Z',
        end_date: '2025-12-31T23:59:59.000Z'
      }
    ],
    description: 'Optional vouchers created for this event (exclusive to this event)',
  })
  vouchers?: CreateVoucherDto[]
}