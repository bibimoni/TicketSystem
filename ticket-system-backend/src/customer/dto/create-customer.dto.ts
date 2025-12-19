import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, MinLength } from "class-validator"

export class CreateCustomerDto {
  @ApiProperty({
    example: 'myemail.012345@hcmut.edu.vn'
  })
  @IsEmail()
  email: string

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
