import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Verify Coupon DTO
 *
 * @description Data transfer object for verifying coupon availability
 */
export class VerifyCouponDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  AgentId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  PackageId: number;

  @IsString()
  @IsNotEmpty()
  CouponCode: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  quantity: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  TxnValue: number;
}

