import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { environmentConfig } from '../../config';
import { ERROR_CODES } from '../../constants';

/**
 * JWT Authentication Middleware
 * 
 * @description Middleware to authenticate JWT tokens from headers or cookies
 */
@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = environmentConfig().jwtSecret;
  }

  use(req: Request, res: Response, next: NextFunction): void {
    try {
      // Extract token from Authorization header or cookies
      let token = this.extractTokenFromHeader(req);
      
      if (!token) {
        token = this.extractTokenFromCookies(req);
      }

      if (!token) {
        throw new UnauthorizedException({
          success: false,
          message: 'Access token is required',
          errorCode: ERROR_CODES.AUTH_TOKEN_REQUIRED,
          timestamp: new Date().toISOString(),
        });
      }

      // Verify the token
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      // Add user information to request object
      req['user'] = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'user',
        iat: decoded.iat,
      };

      next();
    } catch (error) {
      console.error('JWT Authentication Error:', error.message);
      
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException({
          success: false,
          message: 'Invalid token',
          errorCode: ERROR_CODES.AUTH_TOKEN_INVALID,
          timestamp: new Date().toISOString(),
        });
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException({
          success: false,
          message: 'Token has expired',
          errorCode: ERROR_CODES.AUTH_TOKEN_EXPIRED,
          timestamp: new Date().toISOString(),
        });
      } else if (error instanceof jwt.NotBeforeError) {
        throw new UnauthorizedException({
          success: false,
          message: 'Token not active',
          errorCode: ERROR_CODES.AUTH_TOKEN_MALFORMED,
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new UnauthorizedException({
          success: false,
          message: 'Authentication failed',
          errorCode: ERROR_CODES.AUTH_ACCESS_DENIED,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Extract token from Authorization header
   */
  private extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * Extract token from cookies
   */
  private extractTokenFromCookies(req: Request): string | null {
    return req.cookies?.authToken || req.cookies?.token || null;
  }
}
