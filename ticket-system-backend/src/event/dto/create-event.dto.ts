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
    example: '68ea6fb86acf163f42a91c2a'
  })
  @IsString()
  admin_id: string

  @ApiProperty({
    example: '68ea6756dfe71b734e5907b0'
  })
  @IsString()
  customer_id: string

  @ApiProperty({
    example: '2025-10-20T18:30:00+07:00',
    description: 'The date and time of the event in ISO 8601 format (UTC).'
  })
  eventTicketTimes: Date
}