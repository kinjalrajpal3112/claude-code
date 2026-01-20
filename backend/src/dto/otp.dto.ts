import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

/**
 * Send OTP DTO
 * 
 * @description Data Transfer Object for sending OTP to phone number
 */
export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name should contain only letters and spaces' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Phone number should be a valid Indian mobile number' })
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  number: string;
}

/**
 * Verify OTP DTO
 * 
 * @description Data Transfer Object for verifying OTP
 */
export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name should contain only letters and spaces' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Phone number should be a valid Indian mobile number' })
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  number: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}$/, { message: 'OTP should be exactly 5 digits' })
  @Length(5, 5, { message: 'OTP must be exactly 5 digits' })
  otp: string;
}
