import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTicketPriceDto {
  @ApiProperty({ example: 'VIP', description: 'Ticket price name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 500000, description: 'Price in VND' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'Front row seat, free drink', required: false })
  @IsString()
  @IsOptional()
  benefit_info?: string;
}