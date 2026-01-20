import { IsNotEmpty, IsOptional, IsObject, IsArray } from 'class-validator';

/**
 * Flexible DTO for order creation
 * Allows additional fields to be passed through
 */
export class CreateOrderDto {
  @IsOptional()
  Farmer?: {
    FarmerId: number;
    FarmerName?: string;
    FatherName?: string;
    Mobile: number;
    OtherVillageName?: string;
    Address?: string;
    VillageId?: number;
    BlockId?: number;
    DistrictId?: number;
    StateId?: number;
    PinCode?: string;
    [key: string]: any;
  };

  @IsOptional()
  userid?: number;

  @IsOptional()
  farmerId?: number;

  @IsOptional()
  apiKey?: string;

  @IsOptional()
  AdvancePayment?: number;

  @IsOptional()
  RemainingPayment?: number;

  @IsOptional()
  Amount?: number;

  @IsOptional()
  ModeOfPayment?: string;

  @IsOptional()
  Product?: Array<{
    PackageId?: number;
    Quantity?: number;
    RecordId?: number;
    COD?: number;
    onlinePrice?: number;
    SellerId?: number;
    [key: string]: any;
  }>;

  // Allow any additional fields
  [key: string]: any;
}
