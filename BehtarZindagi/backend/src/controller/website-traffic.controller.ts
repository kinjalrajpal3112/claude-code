import { Controller, Get, Post, Body, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { WebsiteTrafficService } from '../service/website-traffic.service';
import { CreateWebsiteTrafficDto } from '../dto';
import { ERROR_CODES } from '../constants';

/**
 * Website Traffic Controller
 * 
 * @route /api/website-traffic
 * @description Handles website traffic tracking API endpoints
 */
@Controller('website-traffic')
export class WebsiteTrafficController {
  constructor(private readonly websiteTrafficService: WebsiteTrafficService) {
    console.log('\n========================================');
    console.log('📊 Website Traffic API Endpoints:');
    console.log('========================================');
    console.log('POST   /api/website-traffic - Create website traffic record');
    console.log('GET    /api/website-traffic - Get all website traffic records');
    console.log('========================================\n');
  }

  /**
   * Create a new website traffic record
   * 
   * @route POST /api/website-traffic
   * @description Creates a new website traffic tracking record
   * @param createWebsiteTrafficDto - Website traffic data
   * @returns Promise<any> - Created website traffic record
   * 
   * @example
   * POST /api/website-traffic
   * {
   *   "userUuid": "123e4567-e89b-12d3-a456-426614174000",
   *   "utm_source": "google",
   *   "timestamp": "2025-11-04T07:00:00.000Z"
   * }
   */
  @Post()
  async create(@Body(ValidationPipe) createWebsiteTrafficDto: CreateWebsiteTrafficDto) {
    try {
      console.log(`\n📊 [Website Traffic API] POST /api/website-traffic`);
      console.log(`   Request body:`, JSON.stringify(createWebsiteTrafficDto, null, 2));
      
      const record = await this.websiteTrafficService.create(createWebsiteTrafficDto);
      
      return {
        success: true,
        message: 'Website traffic record created successfully',
        data: record,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in WebsiteTrafficController.create:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create website traffic record',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all website traffic records
   * 
   * @route GET /api/website-traffic
   * @description Retrieves all website traffic records
   * @returns Promise<any> - Website traffic records data
   * 
   * @example
   * GET /api/website-traffic
   */
  @Get()
  async findAll() {
    try {
      console.log(`\n📊 [Website Traffic API] GET /api/website-traffic`);
      const records = await this.websiteTrafficService.findAll();
      
      return {
        success: true,
        data: records,
        count: records.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in WebsiteTrafficController.findAll:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch website traffic records',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

