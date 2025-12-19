import { ApiProperty } from "@nestjs/swagger"
import { MinLength } from "class-validator"

export class SignInDto {
  @ApiProperty({
    example: 'alice_admin'
  })
  @MinLength(6)
  username: string

  @ApiProperty({
    example: 'Pass@1234'
  })
  @MinLength(6)
  password: string
}
