import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Get Top Selling Products DTO
 *
 * @description Data transfer object for fetching top selling products
 */
export class GetTopSellingDto {
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  @IsInt({ message: 'Category must be a valid integer' })
  @IsPositive({ message: 'Category must be greater than 0' })
  Category?: number;
}

