import { IsOptional } from 'class-validator';

/**
 * Flexible DTO for updating farmer data
 * Allows additional fields to be passed through
 */
export class UpdateFarmerDataDto {
  @IsOptional()
  Fname?: string;

  @IsOptional()
  Lname?: string;

  @IsOptional()
  Mobile?: number;

  @IsOptional()
  StateId?: number;

  @IsOptional()
  DistrictId?: number;

  @IsOptional()
  BlockId?: number;

  @IsOptional()
  VillageId?: number;

  @IsOptional()
  Address?: string;

  @IsOptional()
  FarmerId?: number;

  @IsOptional()
  PinCode?: string;

  @IsOptional()
  RefSource?: string;

  @IsOptional()
  apiKey?: string;

  @IsOptional()
  userid?: number;

  // Allow any additional fields
  [key: string]: any;
}
