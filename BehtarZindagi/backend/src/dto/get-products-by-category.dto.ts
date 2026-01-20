import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { APP_CONSTANTS } from '../constants';

/**
 * Get Products By Category DTO
 * 
 * @description Data transfer object for fetching products by category
 */
export class GetProductsByCategoryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(APP_CONSTANTS.PAGINATION.MIN_PAGE_INDEX)
  PageIndex?: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_INDEX;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(APP_CONSTANTS.PAGINATION.MIN_PAGE_SIZE)
  PageSize?: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE;

  @IsString()
  CategoryId: string;
}

