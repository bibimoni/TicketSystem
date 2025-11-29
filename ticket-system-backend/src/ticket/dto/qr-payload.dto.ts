import { ApiProperty } from "@nestjs/swagger"

export class QrPayloadDto {
  @ApiProperty({
    example: 'TKZ-...',
    description: 'Code of the ticket',
  })
  code: string

  @ApiProperty({
    example: '68e4e22c9815978759f58203',
    description: 'ID of the user.',
  })
  user_id: string

  @ApiProperty({
    example: '68e4e22c9815978759f58203',
    description: 'ID of the transaction.',
  })
  transaction_id: string
}