// cancel-pending.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CancelPendingTransactionDto {
  @IsString()
  @ApiProperty({
    example: '68e4e22c9815978759f58204'
  })
  transactionId: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    example: [
      '68e4e22c9815978759f58204',
      '68e4e22c9815978759f58204'
    ]
  })
  ticketTypeIds?: string[];
}
