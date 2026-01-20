import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Price Range Search DTO
 * 
 * @description Data Transfer Object for searching products by price range
 */
export class PriceRangeSearchDto {
  @IsOptional()
  @IsString()
  SearchText?: string;

  @IsOptional()
  @Transform(({ value }) => {
    // Allow 0 as valid value
    if (value === 'null' || value === '' || value === null) return undefined;
    if (value === '0' || value === 0) return 0;
    const num = parseFloat(value);
    return Number.isNaN(num) ? undefined : num;
  })
  @IsNumber()
  @Min(0)
  MinPrice?: number;

  @IsOptional()
  @Transform(({ value }) => {
    // Allow 0 as valid value
    if (value === 'null' || value === '' || value === null) return undefined;
    if (value === '0' || value === 0) return 0;
    const num = parseFloat(value);
    return Number.isNaN(num) ? undefined : num;
  })
  @IsNumber()
  @Min(0)
  MaxPrice?: number;

  @IsOptional()
  @IsString()
  MobNo?: string;

  @IsOptional()
  @IsString()
  DeviceId?: string;
}

