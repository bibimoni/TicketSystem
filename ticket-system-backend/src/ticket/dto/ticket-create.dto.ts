import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, MinLength } from "class-validator"

export class CreateTicketPriceDto {
  @ApiProperty({
    example: 'Standard Price'
  })
  @IsString()
  @MinLength(3)
  name: string

  @ApiProperty({
    example: 50
  })
  @IsNumber()
  price: number

  @ApiProperty({
    example: 'Access to standard seating area'
  })
  @IsString()
  benefit_info: string
}

export class CreateTicketDto {
  @ApiProperty({
    example: 'VIP Ticket',
    description: 'Name of the ticket type',
  })
  @IsString()
  @MinLength(3)
  name: string

  @ApiProperty({
    example: 'A',
    description: 'Seat place identifier',
  })
  @IsString()
  seat: string

  @ApiProperty({
    example: 'available',
    description: 'Status of the ticket',
  })
  @IsString()
  status: string

  @ApiProperty({
    example: 100,
    description: 'Amount of tickets available',
  })
  @IsNumber()
  ammount: number
}

