import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Add/Remove To Cart DTO
 * 
 * @description Data Transfer Object for adding or removing items from cart
 */
export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  InType: string; // "Add" or "Remove"

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  MobileNo: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  BzProductId: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  Quantity?: number;
}

