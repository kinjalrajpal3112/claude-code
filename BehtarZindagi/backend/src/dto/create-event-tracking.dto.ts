import { IsString, IsOptional, IsDateString } from 'class-validator';

/**
 * Create Event Tracking DTO
 * 
 * @description Data transfer object for creating event tracking records
 */
export class CreateEventTrackingDto {
  @IsString()
  @IsOptional()
  userUuid?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  pageUrl: string;

  @IsString()
  buttonClicked: string;

  @IsString()
  @IsOptional()
  event?: string;

  @IsOptional()
  timestamp?: string;
}

