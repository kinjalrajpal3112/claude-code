import { IsOptional } from 'class-validator';

/**
 * Flexible DTO for canceling order with reason
 * Allows additional fields to be passed through
 */
export class CancelReasonDto {
  @IsOptional()
  CancelReason?: string;

  @IsOptional()
  CancelReasonId?: number;

  @IsOptional()
  FarmerId?: number;

  @IsOptional()
  RecordId?: number;

  @IsOptional()
  TypeId?: number;

  // Allow any additional fields
  [key: string]: any;
}
