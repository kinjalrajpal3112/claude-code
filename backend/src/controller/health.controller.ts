import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { HealthService } from '../service/health.service';
import { ERROR_CODES } from '../constants';

/**
 * Health Controller
 * 
 * @route /api/health
 * @description Handles application health check endpoints
 */
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Get application health status
   * 
   * @route GET /api/health
   * @description Returns application health information including uptime and environment
   * @returns Object - Health status with timestamp, uptime, and environment
   * 
   * @example
   * GET /api/health
   */
  @Get()
  async getHealthStatus() {
    try {
      return await this.healthService.getHealthStatus();
    } catch (error) {
      console.error('Error in HealthController.getHealthStatus:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve health status',
          error: error.message,
          errorCode: ERROR_CODES.HEALTH_CHECK_FAILED,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
