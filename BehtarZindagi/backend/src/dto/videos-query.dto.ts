import { IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Videos Query DTO
 * 
 * @description Data Transfer Object for videos query parameters
 */
export class VideosQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  PageSize?: number = 4;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  HashTagId?: number = 0;
}
