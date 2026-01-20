import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { APP_CONSTANTS } from '../constants';

export class GetProductsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(APP_CONSTANTS.PAGINATION.MIN_PAGE_INDEX)
  pageIndex?: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_INDEX;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(APP_CONSTANTS.PAGINATION.MIN_PAGE_SIZE)
  @Max(APP_CONSTANTS.PAGINATION.MAX_PAGE_SIZE)
  pageSize?: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE;
}
