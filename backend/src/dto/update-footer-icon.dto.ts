import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

/**
 * Update Footer Icon DTO
 * 
 * @description Data transfer object for updating a footer icon
 */
export class UpdateFooterIconDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

