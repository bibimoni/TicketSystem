import { ApiProperty } from "@nestjs/swagger"
import { MinLength } from "class-validator"

export class SignInDto {
  @ApiProperty({
    example: 'cristiano messi'
  })
  @MinLength(6)
  username: string

  @ApiProperty({
    example: '1myverysecuredpassword1'
  })
  @MinLength(6)
  password: string
}
