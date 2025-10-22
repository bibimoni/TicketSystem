import { ApiProperty } from '@nestjs/swagger';


export class TicketResponseDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58204',
    description: 'The unique identifier of the ticket.',
  })
  id: string;

  @ApiProperty({
    example: 'A1',
    description: 'The seat identifier for the ticket.',
  })
  seat: string;

  @ApiProperty({
    example: 'AVAILABLE',
    description: 'The status of the ticket.',
  })
  status: string;
}

export class TicketPriceResponseDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58203',
    description: 'The unique identifier of the ticket price.',
  })
  id: string;

  @ApiProperty({
    example: 'Standard Price',
    description: 'The name of the ticket price tier.',
  })
  name: string;

  @ApiProperty({
    example: 50,
    description: 'The price of the ticket.',
  })
  price: number;

  @ApiProperty({
    example: 'Access to standard seating area',
    description: 'Benefits associated with this ticket price tier.',
  })
  benefit_info: string;

  @ApiProperty({
    description: 'Array of tickets associated with this ticket price.',
    type: [TicketResponseDto],
  })
  tickets: TicketResponseDto[];
}

export class CreatedEventCustomerResponseDto {
  @ApiProperty({
    description: 'Array of tickets created for the event.',
    type: [TicketResponseDto],
  })
  tickets: TicketResponseDto[];
}
