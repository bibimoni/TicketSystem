import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateTicketTypeDto {
  @ApiProperty({ example: 'Anh tài', required: true, description: 'Ticket name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 10000, required: true, description: 'Ticket amount' })
  @IsString()
  amount: number;

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
