import { Injectable, Logger, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FooterIcon } from '../entities/footer-icon.entity';
import { CreateFooterIconDto } from '../dto/create-footer-icon.dto';
import { UpdateFooterIconDto } from '../dto/update-footer-icon.dto';
import { ERROR_CODES, APP_CONSTANTS } from '../constants';

/**
 * Footer Icon Service
 * 
 * @description Handles business logic for footer icons
 */
@Injectable()
export class FooterIconService implements OnModuleInit {
  private readonly logger = new Logger(FooterIconService.name);

  constructor(
    @InjectRepository(FooterIcon)
    private readonly footerIconRepository: Repository<FooterIcon>,
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
   * Ensure the footer_icons table exists, create it if it doesn't
   */
  private async ensureTableExists(): Promise<void> {
    try {
      // Check if table exists by querying the information_schema
      const result = await this.dataSource.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'footer_icons'
        );
      `);
      
      const tableExists = result[0]?.exists || false;
      
      if (!tableExists) {
        this.logger.log('Creating footer_icons table...');
        
        await this.dataSource.query(`
          CREATE TABLE footer_icons (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) NOT NULL,
            icon VARCHAR(10) NOT NULL,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create indexes
        await this.dataSource.query(`
          CREATE INDEX idx_footer_icons_isActive ON footer_icons("isActive")
        `);

        await this.dataSource.query(`
          CREATE INDEX idx_footer_icons_createdAt ON footer_icons("createdAt")
        `);

        this.logger.log('✅ footer_icons table created successfully!');
      } else {
        this.logger.log('✅ footer_icons table already exists');
      }
    } catch (error) {
      this.logger.error(`Error ensuring footer_icons table exists: ${error.message}`, error.stack);
      // Don't throw - let the app continue, but log the error
    }
  }

  /**
   * Get all footer icons (optionally filtered by isActive)
   * 
   * @param isActive - Optional filter for active icons only
   * @returns Promise<FooterIcon[]> - List of footer icons
   */
  async findAll(isActive?: boolean): Promise<FooterIcon[]> {
    try {
      this.logger.log(`Fetching footer icons${isActive !== undefined ? ` (isActive: ${isActive})` : ''}`);

      const queryBuilder = this.footerIconRepository.createQueryBuilder('footerIcon');

      if (isActive !== undefined) {
        queryBuilder.where('footerIcon.isActive = :isActive', { isActive });
      }

      queryBuilder.orderBy('footerIcon.createdAt', 'ASC');

      const icons = await queryBuilder.getMany();

      this.logger.log(`Successfully fetched ${icons.length} footer icons`);

      return icons;
    } catch (error) {
      this.logger.error(`Error fetching footer icons: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch footer icons',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a single footer icon by ID
   * 
   * @param id - Footer icon ID
   * @returns Promise<FooterIcon> - Footer icon
   */
  async findOne(id: string): Promise<FooterIcon> {
    try {
      this.logger.log(`Fetching footer icon with id: ${id}`);

      const icon = await this.footerIconRepository.findOne({ where: { id } });

      if (!icon) {
        throw new HttpException(
          {
            success: false,
            message: 'Footer icon not found',
            errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
            timestamp: new Date().toISOString(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(`Successfully fetched footer icon: ${icon.name}`);
      return icon;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error fetching footer icon: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch footer icon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a new footer icon
   * 
   * @param createFooterIconDto - Footer icon data
   * @returns Promise<FooterIcon> - Created footer icon
   */
  async create(createFooterIconDto: CreateFooterIconDto): Promise<FooterIcon> {
    try {
      this.logger.log(`Creating footer icon: ${createFooterIconDto.name}`);

      const footerIcon = this.footerIconRepository.create({
        ...createFooterIconDto,
        isActive: createFooterIconDto.isActive !== undefined ? createFooterIconDto.isActive : true,
      });

      const savedIcon = await this.footerIconRepository.save(footerIcon);

      this.logger.log(`Successfully created footer icon with id: ${savedIcon.id}`);
      return savedIcon;
    } catch (error) {
      this.logger.error(`Error creating footer icon: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create footer icon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update a footer icon
   * 
   * @param id - Footer icon ID
   * @param updateFooterIconDto - Updated footer icon data
   * @returns Promise<FooterIcon> - Updated footer icon
   */
  async update(id: string, updateFooterIconDto: UpdateFooterIconDto): Promise<FooterIcon> {
    try {
      this.logger.log(`Updating footer icon with id: ${id}`);

      const icon = await this.findOne(id);

      Object.assign(icon, updateFooterIconDto);
      const updatedIcon = await this.footerIconRepository.save(icon);

      this.logger.log(`Successfully updated footer icon: ${updatedIcon.name}`);
      return updatedIcon;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error updating footer icon: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update footer icon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a footer icon
   * 
   * @param id - Footer icon ID
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting footer icon with id: ${id}`);

      const icon = await this.findOne(id);
      await this.footerIconRepository.remove(icon);

      this.logger.log(`Successfully deleted footer icon: ${icon.name}`);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error deleting footer icon: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete footer icon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

