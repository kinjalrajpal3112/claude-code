import { IsOptional } from 'class-validator';

/**
 * Flexible DTO for completing payment request
 * Allows additional fields to be passed through
 */
export class CompletePaymentDto {
  @IsOptional()
  rzp_paymentid?: string;

  @IsOptional()
  rzp_orderid?: string;

  @IsOptional()
  rzp_Signature?: string;

  @IsOptional()
  farmerId?: number;

  @IsOptional()
  bz_orderid?: number;

  @IsOptional()
  amount?: number;

  // Allow any additional fields
  [key: string]: any;
}
