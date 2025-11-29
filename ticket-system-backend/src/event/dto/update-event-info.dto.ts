import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
import { event_format } from "generated/prisma"
import { CreateTicketPriceDto, CreateTicketTypeDto } from "src/ticket/dto/create-ticket.dto"
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
  @MinLength(6)
  name?: string

  @ApiProperty({
    example: 'This is the Vietnam national concert featuring top artists from around the country. Join us for an unforgettable night of music, culture, and celebration.',
    description: 'Detailed information about the event'
  })
  @IsString()
  @MinLength(20)
  information?: string

  @ApiProperty({
    example: 'Van Phuc City, Ho Chi Minh City, Vietnam',
    description: 'The location where the event will take place'
  })
  @IsString()
  @MinLength(6)
  destination?: string

  @ApiProperty({
    example: 'Yeah1',
    description: 'The organizer of the event'
  })
  @IsString()
  @MinLength(2)
  organizer?: string

  @ApiProperty({
    enum: event_format,
    enumName: 'event_format',
    example: event_format.ONLINE,
  })
  @IsEnum(event_format)
  format?: event_format;

  @ApiProperty({
    example: '2025-10-20T18:30:00+07:00',
    description: 'Ticket sell start date and time'
  })
  eventTicketStart?: Date

  @ApiProperty({
    example: '2025-12-31T18:30:00+07:00',
    description: 'Ticket sell end date and time'
  })
  eventTicketEnd?: Date

  @ApiProperty({
    example: '2026-01-01T18:30:00+07:00',
    description: 'Event occurrence date and time'
  })
  @IsDateString()
  eventTime?: Date

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  event_custom_slug?: string

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

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  messages?: string

  @IsOptional()
  @ApiProperty({
    example: [
      {
        id: '6927ccef449dbf7b6bcedab7',
        name: 'Anh tài',
        amount: 3000
      }
    ],
    required: false
  })
  ticketTypes?: {
    id: string;
    name?: string;
    amount?: number;
  }[];
}
