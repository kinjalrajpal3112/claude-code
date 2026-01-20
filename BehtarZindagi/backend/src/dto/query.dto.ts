import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Pagination Query DTO
 * 
 * @description Data Transfer Object for pagination query parameters
 */
export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

/**
 * Search Query DTO
 * 
 * @description Data Transfer Object for search query parameters
 */
export class SearchQueryDto extends PaginationQueryDto {
  @IsString()
  q: string;
}
