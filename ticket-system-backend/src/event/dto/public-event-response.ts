import { ApiProperty } from '@nestjs/swagger';

export class PublicEventResponseDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58203',
    description: 'The unique identifier of the event.',
  })
  id: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: 'The Vietnam Concert',
    description: 'The name of the event.',
  })
  name: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Additional information about the event.',
  })
  information: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Van Phuc City, Ho Chi Minh City, Vietnam',
  })
  destination: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Yeah1',
    description: 'The organizer of the event'
  })
  organizer: string | null;

  @ApiProperty({
    required: true,
    nullable: false,
    example: ["2025-10-10T09:00:00.000Z"],
  })
  eventTimes: Date[];

  @ApiProperty({
    required: true,
    nullable: false,
    example: "2025-10-10T09:00:00.000Z"
  })
  eventTicketTimes: Date;
}
