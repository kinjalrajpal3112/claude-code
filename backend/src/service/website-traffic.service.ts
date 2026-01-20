import { Injectable, Logger, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WebsiteTraffic } from '../entities/website-traffic.entity';
import { CreateWebsiteTrafficDto } from '../dto/create-website-traffic.dto';
import { ERROR_CODES } from '../constants';

/**
 * Website Traffic Service
 * 
 * @description Handles business logic for website traffic tracking
 */
@Injectable()
export class WebsiteTrafficService implements OnModuleInit {
  private readonly logger = new Logger(WebsiteTrafficService.name);

  constructor(
    @InjectRepository(WebsiteTraffic)
    private readonly websiteTrafficRepository: Repository<WebsiteTraffic>,
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
   * Ensure the website_traffic table exists, create it if it doesn't
   */
  private async ensureTableExists(): Promise<void> {
    try {
      // Check if table exists by querying the information_schema
      const result = await this.dataSource.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'website_traffic'
        );
      `);
      
      const tableExists = result[0]?.exists || false;
      
      if (!tableExists) {
        this.logger.log('Creating website_traffic table...');
        
        await this.dataSource.query(`
          CREATE TABLE website_traffic (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "userUuid" UUID,
            utm_source VARCHAR(255),
            timestamp TIMESTAMP,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create indexes
        await this.dataSource.query(`
          CREATE INDEX idx_website_traffic_userUuid ON website_traffic("userUuid")
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_website_traffic_utm_source ON website_traffic(utm_source)
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_website_traffic_timestamp ON website_traffic(timestamp)
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_website_traffic_createdAt ON website_traffic("createdAt")
        `);

        this.logger.log('✅ website_traffic table created successfully!');
      } else {
        this.logger.log('✅ website_traffic table already exists');
      }
    } catch (error) {
      this.logger.error(`Error ensuring website_traffic table exists: ${error.message}`, error.stack);
      // Don't throw - let the app continue, but log the error
    }
  }

  /**
   * Create a new website traffic record
   * 
   * @param createWebsiteTrafficDto - Website traffic data
   * @returns Promise<WebsiteTraffic> - Created website traffic record
   */
  async create(createWebsiteTrafficDto: CreateWebsiteTrafficDto): Promise<WebsiteTraffic> {
    try {
      this.logger.log(`Creating website traffic record: ${JSON.stringify(createWebsiteTrafficDto)}`);

      const websiteTraffic = this.websiteTrafficRepository.create({
        userUuid: createWebsiteTrafficDto.userUuid || null,
        utm_source: createWebsiteTrafficDto.utm_source || 'organic',
        timestamp: createWebsiteTrafficDto.timestamp  
          ? new Date(createWebsiteTrafficDto.timestamp) 
          : new Date(),
      });

      const savedRecord = await this.websiteTrafficRepository.save(websiteTraffic);

      this.logger.log(`Successfully created website traffic record with id: ${savedRecord.id}`);
      return savedRecord;
    } catch (error) {
      this.logger.error(`Error creating website traffic record: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create website traffic record',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all website traffic records
   * 
   * @returns Promise<WebsiteTraffic[]> - List of website traffic records
   */
  async findAll(): Promise<WebsiteTraffic[]> {
    try {
      this.logger.log('Fetching all website traffic records');

      const records = await this.websiteTrafficRepository.find({
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Successfully fetched ${records.length} website traffic records`);
      return records;
    } catch (error) {
      this.logger.error(`Error fetching website traffic records: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch website traffic records',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

