import { IsOptional } from 'class-validator';

/**
 * Flexible DTO for mapping partner order details
 * Allows additional fields to be passed through
 */
export class MapPartnerOrderDto {
  @IsOptional()
  FarmerId?: number;

  @IsOptional()
  OrderID?: number;

  @IsOptional()
  PartnershipAdminID?: string;

  @IsOptional()
  PartnershipID?: string;

  // Allow any additional fields
  [key: string]: any;
}
