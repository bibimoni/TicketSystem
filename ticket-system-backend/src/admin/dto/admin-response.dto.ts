import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class PublicAdminResponseDto {
  @IsString()
  @ApiProperty({
    required: true,
    nullable: false,
    example: '68e8c558dc27a404d99b4ca5',
    // 68e8c18291173321a86a8d4b
    description: 'The unique identifier of Admin.',
  })
  id: string;

  @ApiProperty({
    example: 'administrator',
    description: 'The username of Admin.',
  })
  username: string;

  @ApiProperty({
    example: 'adminexample@gmail.com',
    description: 'The email address of Admin.',
  })
  email: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'I am admin',
    description: 'The full name of Admin.',
  })
  name: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'female',
  })
  sex: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '268 Ly Thuong Kiet, Phuong Dien Hong, Ho Chi Minh City',
  })
  address: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Admin\'s birth date.',
  })
  birth_date: Date | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Additional information about Admin.',
  })
  information: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '000-123-1234-5',
  })
  phone_number: string | null;
}