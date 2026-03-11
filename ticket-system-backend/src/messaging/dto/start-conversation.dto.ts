import { IsOptional, IsMongoId, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartConversationDto {
  @ApiProperty({ required: false, description: 'Target user MongoDB ObjectId' })
  @IsOptional()
  @IsMongoId()
  other_user_id?: string;

  @ApiProperty({ required: false, description: 'Target user email address' })
  @IsOptional()
  @IsEmail()
  other_user_email?: string;
}
