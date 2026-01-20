import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength } from 'class-validator';

/**
 * Create Footer Icon DTO
 * 
 * @description Data transfer object for creating a footer icon
 */
export class CreateFooterIconDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  icon: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

