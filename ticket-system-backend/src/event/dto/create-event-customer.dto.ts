import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsOptional, IsNumber, IsString, MinLength } from "class-validator"
import { CreateTicketDto } from "src/ticket/dto/create-ticket.dto"

export class CreateEventCustomerDto {
  @ApiProperty({
    example: 'The Vietnam Concert'
  })
  @IsString()
  @MinLength(6)
  name: string

  @ApiProperty({
    example: 'This is the Vietname national concert featuring top artists from around the country. Join us for an unforgettable night of music, culture, and celebration.',
    description: 'Detailed information about the event'
  })
  @IsString()
  @MinLength(20)
  information: string

  @ApiProperty({
    example: 'Van Phuc City, Ho Chi Minh City, Vietnam',
    description: 'The location where the event will take place'
  })
  @IsString()
  @MinLength(6)
  destination: string

  @ApiProperty({
    example: 'Yeah1',
    description: 'The organizer of the event'
  })
  @IsString()
  @MinLength(2)
  organizer: string

  // @ApiProperty({
  //   example: 1,
  //   description: 'Number of hosting days for the event'
  // })
  // @IsNumber()
  // countCarryOut: number

  @ApiProperty({
    example: '2025-10-20T18:30:00+07:00',
    description: 'Ticket sell date and time'
  })
  eventTicketTimes: Date

  @ApiProperty({
    example: [
      '2025-12-20T18:30:00+07:00',
      '2025-12-21T18:30:00+07:00'
    ],
    description: 'Array of event occurrence dates and times'
  })
  @IsArray()
  eventTimes: Date[]

  @IsArray()
  @ApiProperty({
    example: [
      {
        name: 'VIP Ticket',
        price: 150,
        benefit_info: 'Access to VIP seating area and complimentary drinks',
        tickets: [
          {
            seat: 'A1',
            status: 'AVAILABLE',
          },
          {
            seat: 'A2',
            status: 'AVAILABLE',
          }
        ]
      },
      {
        name: 'Standard Ticket',
        price: 50,
        benefit_info: 'Access to standard seating area',
        tickets: [
          {
            seat: 'B1',
            status: 'AVAILABLE',
          },
          {
            seat: 'B2',
            status: 'AVAILABLE',
          }
        ]
      }
    ],
    description: 'Array of tickets available for the event',
  })
  ticketsType: CreateTicketPriceDto[]
}


export class CreateTicketPriceDto {
  @ApiProperty({
    example: 'VIP',
    description: 'Name of the ticket type',
  })
  @IsString()
  @MinLength(3)
  name: string

  @ApiProperty({
    example: 500000,
    description: 'Price of the ticket in VND',
  })
  @IsNumber()
  price: number

  @ApiProperty({
    example: 'Access to VIP seating area and complimentary drinks',
    description: 'Benefits associated with the ticket type',
  })
  @IsString()
  @IsOptional()
  benefit_info?: string

  tickets: CreateTicketDto[]
}
