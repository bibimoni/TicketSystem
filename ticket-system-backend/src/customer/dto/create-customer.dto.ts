import { IsEmail, MinLength } from "class-validator"

export class CreateCustomerDto {
  @IsEmail()
  email: string

  @MinLength(6)
  username: string

  @MinLength(6)
  password: string
}
