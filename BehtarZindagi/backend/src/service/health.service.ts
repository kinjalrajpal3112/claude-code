import { Injectable } from '@nestjs/common';
import { APP_CONSTANTS, ERROR_CODES } from '../constants';

/**
 * Health Service
 * 
 * @description Contains business logic for health check operations
 */
@Injectable()
export class HealthService {
  /**
   * Get application health status
   * 
   * @description Returns application health information including uptime and environment
   * @returns Promise<Object> - Health status with timestamp, uptime, and environment
   */
  async getHealthStatus(): Promise<any> {
    try {
      const healthData = {
        status: APP_CONSTANTS.MESSAGES.SUCCESS,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || APP_CONSTANTS.ENVIRONMENT.DEVELOPMENT,
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
      };
      
      return healthData;
    } catch (error) {
      console.error('Error in HealthService.getHealthStatus:', error);
      throw error;
    }
  }
}
