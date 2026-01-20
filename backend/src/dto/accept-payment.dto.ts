import { IsOptional } from 'class-validator';

/**
 * Flexible DTO for accepting customer payment request
 * Allows additional fields to be passed through
 */
export class AcceptPaymentDto {
  @IsOptional()
  address?: string;

  @IsOptional()
  amount?: number;

  @IsOptional()
  contactNumber?: number;

  @IsOptional()
  email?: string | null;

  @IsOptional()
  name?: string;

  // Allow any additional fields
  [key: string]: any;
}
