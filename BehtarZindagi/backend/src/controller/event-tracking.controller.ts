import { Controller, Get, Post, Body, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { EventTrackingService } from '../service/event-tracking.service';
import { CreateEventTrackingDto } from '../dto';
import { ERROR_CODES } from '../constants';

/**
 * Event Tracking Controller
 * 
 * @route /api/event-tracking
 * @description Handles event tracking API endpoints
 */
@Controller('event-tracking')
export class EventTrackingController {
  constructor(private readonly eventTrackingService: EventTrackingService) {
    console.log('\n========================================');
    console.log('📊 Event Tracking API Endpoints:');
    console.log('========================================');
    console.log('POST   /api/event-tracking - Create event tracking record');
    console.log('GET    /api/event-tracking - Get all event tracking records');
    console.log('========================================\n');
  }

  /**
   * Create a new event tracking record
   * 
   * @route POST /api/event-tracking
   * @description Creates a new event tracking record with page URL and button clicked
   * @param createEventTrackingDto - Event tracking data
   * @returns Promise<any> - Created event tracking record
   * 
   * @example
   * POST /api/event-tracking
   * {
   *   "userUuid": "123e4567-e89b-12d3-a456-426614174000",
   *   "phoneNumber": "9871560356",
   *   "pageUrl": "https://behtarzindagi.in/products",
   *   "buttonClicked": "Add to Cart",
   *   "event": "button_click",
   *   "timestamp": "2025-11-04T07:00:00.000Z"
   * }
   */
  @Post()
  async create(@Body(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: false,
    skipMissingProperties: false,
    transformOptions: { enableImplicitConversion: true }
  })) createEventTrackingDto: CreateEventTrackingDto) {
    try {
      console.log(`\n📊 [Event Tracking API] POST /api/event-tracking`);
      console.log(`   Request body:`, JSON.stringify(createEventTrackingDto, null, 2));
      
      const record = await this.eventTrackingService.create(createEventTrackingDto);
      
      return {
        success: true,
        message: 'Event tracking record created successfully',
        data: record,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in EventTrackingController.create:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create event tracking record',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all event tracking records
   * 
   * @route GET /api/event-tracking
   * @description Retrieves all event tracking records
   * @returns Promise<any> - Event tracking records data
   * 
   * @example
   * GET /api/event-tracking
   */
  @Get()
  async findAll() {
    try {
      console.log(`\n📊 [Event Tracking API] GET /api/event-tracking`);
      const records = await this.eventTrackingService.findAll();
      
      return {
        success: true,
        data: records,
        count: records.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in EventTrackingController.findAll:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch event tracking records',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

