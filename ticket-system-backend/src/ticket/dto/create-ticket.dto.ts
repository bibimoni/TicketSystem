import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 'A1', required: false, description: 'Seat number' })
  @IsString()
  @IsOptional()
  seat?: string;
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
}