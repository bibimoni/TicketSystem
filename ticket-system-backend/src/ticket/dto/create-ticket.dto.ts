import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: '68ea665bdfe71b734e5907ad', description: 'Event ID' })
  @IsString()
  event_id: string;

  @ApiProperty({ example: '68ea665bdfe71b734e5907ae', description: 'Ticket Price ID' })
  @IsString()
  ticket_price_id: string;

  @ApiProperty({ example: 'A1', required: false, description: 'Seat number' })
  @IsString()
  @IsOptional()
  seat?: string;

  @ApiProperty({ example: 10, description: 'Number of tickets available' })
  @IsNumber()
  amount: number;
}