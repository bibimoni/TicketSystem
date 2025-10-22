import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, MinLength } from "class-validator"

export class CreateAdminDto {
  // @IsString()
  // @MinLength(6)
  // @ApiProperty({
  //   required: true,
  //   nullable: false,
  //   example: "68e4e22c9815978759f58201"
  // })
  // user_id: string
  @ApiProperty({
    example: 'adminexample@gmail.com'
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'adminstrator'
  })
  @MinLength(6)
  username: string

  @ApiProperty({
    example: '1myverysecuredpassword1'
  })
  @MinLength(6)
  password: string
}