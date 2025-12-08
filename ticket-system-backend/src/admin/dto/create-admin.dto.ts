import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, MinLength } from "class-validator"

export class CreateAdminDto {
  @ApiProperty({
    example: 'adminexample@gmail.com'
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'administrator'
  })
  @MinLength(6)
  username: string

  @ApiProperty({
    example: 'Pass@1234'
  })
  @MinLength(6)
  password: string
}