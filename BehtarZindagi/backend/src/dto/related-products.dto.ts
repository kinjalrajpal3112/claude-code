import { IsString } from 'class-validator';

/**
 * Related Products DTO
 * 
 * @description Data Transfer Object for related products query parameters
 */
export class RelatedProductsDto {
  @IsString()
  ProductName: string;
}
