import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { SendOtpDto, VerifyOtpDto } from '../dto';
import { ERROR_CODES, URL_CONFIG } from '../constants';
import { AxiosService } from './axios.service';

/**
 * OTP Service
 * 
 * @description Service for OTP operations using third-party API
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly requestTimeout = 30000;

  constructor(private readonly axiosService: AxiosService) {}

  /**
   * Send OTP to phone number
   * 
   * @param sendOtpDto - OTP data (name and phone number)
   * @returns Promise<any> - OTP send response
   */
  async sendOtp(sendOtpDto: SendOtpDto): Promise<any> {
    try {
      this.logger.log(`Sending OTP to number: ${sendOtpDto.number}`);

      const params = {
        Name: sendOtpDto.name,
        Number: sendOtpDto.number,
        FromSource: 1,
        ToSource: 0,
      };

      const response = await this.axiosService.get(
        URL_CONFIG.OTP_SEND_URL,
        params,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to send OTP',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`OTP sent successfully. Status: ${response.statusCode}`);

      return {
        success: true,
        message: 'OTP sent successfully',
        data: {
          phoneNumber: sendOtpDto.number,
          name: sendOtpDto.name,
          status: response.data?.Status || true,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in OtpService.sendOtp:', error);
      this.logger.error(`Error sending OTP: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to send OTP',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify OTP
   * 
   * @param verifyOtpDto - OTP verification data (name, phone number, and OTP)
   * @returns Promise<any> - OTP verification response
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    try {
      this.logger.log(`Verifying OTP for number: ${verifyOtpDto.number}`);

      const params = {
        Name: verifyOtpDto.name,
        Number: verifyOtpDto.number,
        OTP: verifyOtpDto.otp,
      };

      const response = await this.axiosService.get(
        URL_CONFIG.OTP_VERIFY_URL,
        params,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to verify OTP',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`OTP verification completed. Status: ${response.statusCode}`);

      // Check if OTP verification was successful
      if (response.data?.LoginStatus === 'error' || response.data?.Status === false) {
        return {
          success: false,
          message: 'Invalid OTP',
          data: {
            phoneNumber: verifyOtpDto.number,
            name: verifyOtpDto.name,
            loginStatus: 'error',
            userDetails: null,
            status: false,
          },
          userDetails: null,
          rawResponse: response.data,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        message: 'OTP verified successfully',
        data: {
          phoneNumber: verifyOtpDto.number,
          name: verifyOtpDto.name,
          loginStatus: response.data?.LoginStatus || 'success',
          userDetails: response.data?.ds?.UserDetails || response.data?.UserDetails || null,
          status: response.data?.Status || true,
        },
        userDetails: response.data?.ds?.UserDetails || response.data?.UserDetails || null,
        rawResponse: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in OtpService.verifyOtp:', error);
      this.logger.error(`Error verifying OTP: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to verify OTP',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
