import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Product Details DTO
 * 
 * @description Data Transfer Object for product details query parameters
 */
export class ProductDetailsDto {
  @IsOptional()
  @IsString()
  deviceId?: string = '';

  @IsOptional()
  @IsString()
  gcmId?: string = '';

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  ProductId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  DistrictId: number;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  lat?: string = '0.0';

  @IsOptional()
  @IsString()
  lon?: string = '0.0';
}
