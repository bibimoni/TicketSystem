import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class CreateEventDto {
  @ApiProperty({
    example: 'The Vietnam Concert'
  })
  @IsString()
  @MinLength(6)
  name: string

  @ApiProperty({
    example: '654c602a82046892558f6233'
  })
  @IsString()
  admin_id: string

  @ApiProperty({
    example: '68e4e22c9815978759f58201'
  })
  @IsString()
  customer_id: string

  @ApiProperty({
    example: '2025-10-20T18:30:00+07:00',
    description: 'The date and time of the event in ISO 8601 format (UTC).'
  })
  eventTicketTimes: Date
}
