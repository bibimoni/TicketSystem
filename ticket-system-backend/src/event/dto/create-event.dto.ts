import { IsString, MinLength } from "class-validator"

export class CreateEventDto {
  @IsString()
  @MinLength(6)
  name: string

  @IsString()
  admin_id: string

  @IsString()
  customer_id: string

  eventTicketTimes: Date | string

}
