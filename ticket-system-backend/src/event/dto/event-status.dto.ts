import { IsEnum, IsNotEmpty } from "class-validator";
import { event_status } from "generated/prisma";

export class EventStatusDto {
  @IsEnum(event_status)
  @IsNotEmpty()
  status: event_status
}