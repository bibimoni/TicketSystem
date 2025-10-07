import { ApiProperty } from '@nestjs/swagger';

export class PublicUserResponseDto {
  @ApiProperty({
    example: '68e4e22c9815978759f58201',
    description: 'The unique identifier of the user.',
  })
  id: string;

  @ApiProperty({
    example: 'cristiano messi',
    description: 'The username of the user.',
  })
  username: string;

  @ApiProperty({
    example: 'myemail.012345@hcmut.edu.vn',
    description: 'The email address of the user.',
  })
  email: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Cristiano Messi',
    description: 'The full name of the user.',
  })
  name: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'male',
  })
  sex: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '123 Football St, Soccer City',
  })
  address: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'The user\'s birth date.',
  })
  birth_date: Date | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Additional information about the user.',
  })
  information: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '123-456-7890',
  })
  phone_number: string | null;
}
