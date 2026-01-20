import { IsString, IsOptional, IsDateString } from 'class-validator';

/**
 * Create Website Traffic DTO
 * 
 * @description Data transfer object for creating website traffic records
 */
export class CreateWebsiteTrafficDto {
  @IsString()
  @IsOptional()
  userUuid?: string;

  @IsString()
  @IsOptional()
  utm_source?: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;
}

