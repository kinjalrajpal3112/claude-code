import { registerAs } from '@nestjs/config';

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  externalApiUrl: string;
  allowedOrigins: string[];
  corsEnabled: boolean;
  logLevel: string;
  requestTimeout: number;
  maxRetries: number;
  jwtSecret: string;
  jwtRefreshSecret: string;
}

/**
 * Environment configuration factory
 */
export default registerAs('environment', (): EnvironmentConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  externalApiUrl: process.env.EXTERNAL_API_URL || 'https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetAllProducts',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  corsEnabled: process.env.CORS_ENABLED !== 'false',
  logLevel: process.env.LOG_LEVEL || 'info',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 30000,
  maxRetries: parseInt(process.env.MAX_RETRIES, 10) || 3,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-lifetime-token',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production-lifetime-token',
}));
