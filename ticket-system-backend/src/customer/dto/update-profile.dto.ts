import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '+15551234567' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({ example: 'Male' })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiPropertyOptional({ example: '123 Main St, NY' })
  @IsOptional()
  @IsString()
  address?: string;
  @ApiPropertyOptional({ example: '1999-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birth_date?: Date;

  @ApiPropertyOptional({ example: 'I like coding...' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  information?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/my-pic.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Cloudinary Public ID for deletion' })
  @IsOptional()
  @IsString()
  avatar_public_id?: string;
}
