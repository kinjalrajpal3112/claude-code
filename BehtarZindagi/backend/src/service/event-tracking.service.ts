import { Injectable, Logger, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventTracking } from '../entities/event-tracking.entity';
import { CreateEventTrackingDto } from '../dto/create-event-tracking.dto';
import { ERROR_CODES } from '../constants';

/**
 * Event Tracking Service
 * 
 * @description Handles business logic for event tracking
 */
@Injectable()
export class EventTrackingService implements OnModuleInit {
  private readonly logger = new Logger(EventTrackingService.name);

  constructor(
    @InjectRepository(EventTracking)
    private readonly eventTrackingRepository: Repository<EventTracking>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Initialize module - create table if it doesn't exist
   */
  async onModuleInit() {
    await this.ensureTableExists();
  }

  /**
   * Ensure the event_tracking table exists, create it if it doesn't
   */
  private async ensureTableExists(): Promise<void> {
    try {
      // Check if table exists by querying the information_schema
      const result = await this.dataSource.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'event_tracking'
        );
      `);
      
      const tableExists = result[0]?.exists || false;
      
      if (!tableExists) {
        this.logger.log('Creating event_tracking table...');
        
        await this.dataSource.query(`
          CREATE TABLE event_tracking (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "userUuid" UUID,
            "phoneNumber" VARCHAR(20),
            "pageUrl" VARCHAR(500) NOT NULL,
            "buttonClicked" VARCHAR(255) NOT NULL,
            event VARCHAR(255),
            timestamp TIMESTAMP,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create indexes
        await this.dataSource.query(`
          CREATE INDEX idx_event_tracking_userUuid ON event_tracking("userUuid")
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_event_tracking_phoneNumber ON event_tracking("phoneNumber")
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_event_tracking_pageUrl ON event_tracking("pageUrl")
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_event_tracking_buttonClicked ON event_tracking("buttonClicked")
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_event_tracking_event ON event_tracking(event)
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_event_tracking_timestamp ON event_tracking(timestamp)
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_event_tracking_createdAt ON event_tracking("createdAt")
        `);

        this.logger.log('✅ event_tracking table created successfully!');
      } else {
        this.logger.log('✅ event_tracking table already exists');
      }
    } catch (error) {
      this.logger.error(`Error ensuring event_tracking table exists: ${error.message}`, error.stack);
      // Don't throw - let the app continue, but log the error
    }
  }

  /**
   * Create a new event tracking record
   * 
   * @param createEventTrackingDto - Event tracking data
   * @returns Promise<EventTracking> - Created event tracking record
   */
  async create(createEventTrackingDto: CreateEventTrackingDto): Promise<EventTracking> {
    try {
      this.logger.log(`Creating event tracking record: ${JSON.stringify(createEventTrackingDto)}`);

      const eventTracking = this.eventTrackingRepository.create({
        userUuid: createEventTrackingDto.userUuid || null,
        phoneNumber: createEventTrackingDto.phoneNumber || null,
        pageUrl: createEventTrackingDto.pageUrl,
        buttonClicked: createEventTrackingDto.buttonClicked,
        event: createEventTrackingDto.event || null,
        timestamp: createEventTrackingDto.timestamp 
          ? new Date(createEventTrackingDto.timestamp) 
          : new Date(),
      });

      const savedRecord = await this.eventTrackingRepository.save(eventTracking);

      this.logger.log(`Successfully created event tracking record with id: ${savedRecord.id}`);
      return savedRecord;
    } catch (error) {
      this.logger.error(`Error creating event tracking record: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create event tracking record',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all event tracking records
   * 
   * @returns Promise<EventTracking[]> - List of event tracking records
   */
  async findAll(): Promise<EventTracking[]> {
    try {
      this.logger.log('Fetching all event tracking records');

      const records = await this.eventTrackingRepository.find({
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Successfully fetched ${records.length} event tracking records`);
      return records;
    } catch (error) {
      this.logger.error(`Error fetching event tracking records: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch event tracking records',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

