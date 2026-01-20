import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { environmentConfig } from '../config';
import { ERROR_CODES } from '../constants';

/**
 * JWT Service
 * 
 * @description Service for JWT token operations
 */
@Injectable()
export class JwtService {
  private readonly jwtSecret: string;
  private readonly refreshSecret: string;

  constructor() {
    this.jwtSecret = environmentConfig().jwtSecret;
    this.refreshSecret = environmentConfig().jwtRefreshSecret;
  }

  /**
   * Generate access token (lifetime)
   * 
   * @param payload - User data to encode in token
   * @returns string - JWT access token
   */
  generateAccessToken(payload: any): string {
    try {
      return jwt.sign(
        {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: payload.role || 'user',
        },
        this.jwtSecret,
        {
          // No expiration - lifetime token
          algorithm: 'HS256',
        }
      );
    } catch (error) {
      console.error('Error generating access token:', error);
      throw new Error(`Failed to generate access token: ${ERROR_CODES.CONFIGURATION_ERROR}`);
    }
  }

  /**
   * Generate refresh token (lifetime)
   * 
   * @param payload - User data to encode in token
   * @returns string - JWT refresh token
   */
  generateRefreshToken(payload: any): string {
    try {
      return jwt.sign(
        {
          id: payload.id,
          email: payload.email,
          type: 'refresh',
        },
        this.refreshSecret,
        {
          // No expiration - lifetime token
          algorithm: 'HS256',
        }
      );
    } catch (error) {
      console.error('Error generating refresh token:', error);
      throw new Error(`Failed to generate refresh token: ${ERROR_CODES.CONFIGURATION_ERROR}`);
    }
  }

  /**
   * Verify access token
   * 
   * @param token - JWT access token
   * @returns any - Decoded token payload
   */
  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      console.error('Error verifying access token:', error);
      throw new Error(`Invalid access token: ${ERROR_CODES.AUTH_TOKEN_INVALID}`);
    }
  }

  /**
   * Verify refresh token
   * 
   * @param token - JWT refresh token
   * @returns any - Decoded token payload
   */
  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      throw new Error(`Invalid refresh token: ${ERROR_CODES.AUTH_TOKEN_INVALID}`);
    }
  }

  /**
   * Decode token without verification (for debugging)
   * 
   * @param token - JWT token
   * @returns any - Decoded token payload
   */
  decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
