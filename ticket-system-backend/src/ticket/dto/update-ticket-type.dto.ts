import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTicketTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  benefit_info?: string;
}