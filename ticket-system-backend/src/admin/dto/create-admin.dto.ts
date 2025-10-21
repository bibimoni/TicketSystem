import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class CreateAdminDto {
  @IsString()
  @MinLength(6)
  @ApiProperty({
    required: true,
    nullable: false,
    example: "68e4e22c9815978759f58201"
  })
  user_id: string
}