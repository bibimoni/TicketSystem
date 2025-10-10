import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class PublicAdminResponseDto {
  @IsString()
  @ApiProperty({
    required: true,
    nullable: false,
    example: '68e8c558dc27a404d99b4ca5',
    description: 'Admin\'s id.',
  })
  id: string
}