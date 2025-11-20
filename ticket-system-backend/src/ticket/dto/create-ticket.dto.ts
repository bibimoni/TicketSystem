import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateTicketTypeDto {
  @ApiProperty({ example: 'GA-A1', required: true, description: 'Ticket name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 10000, required: true, description: 'Ticket amount' })
  @IsString()
  amount: number;
}

export class CreateTicketPriceDto {
  @ApiProperty({
    type: () => [CreateTicketTypeDto],
    example: [
      {
        name: 'GA-A1',
        amount: 10000
      },
      {
        name: 'GA-B1',
        amount: 10000
      }
    ],
    description: 'Name and amount of the ticket type',
  })
  ticketTypes: CreateTicketTypeDto[]

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
}
