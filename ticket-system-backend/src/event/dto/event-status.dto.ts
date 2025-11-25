import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { event_status } from "generated/prisma";

export class EventStatusDto {
  @ApiProperty({
    description: 'Event status filter: [DRAFT, PUBLISHED, CANCELLED, COMPLETED]',
    example: 'DRAFT',
    enum: event_status,
  })
  @IsEnum(event_status)
  @IsNotEmpty()
  status: event_status
}