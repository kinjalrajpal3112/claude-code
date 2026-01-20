import { Controller, Get, Post, Put, Delete, Param, Body, Query, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { FooterIconService } from '../service/footer-icon.service';
import { CreateFooterIconDto, UpdateFooterIconDto } from '../dto';
import { ERROR_CODES } from '../constants';

/**
 * Footer Icon Controller
 * 
 * @route /api/footer-icons
 * @description Handles all footer icon-related API endpoints
 */
@Controller('footer-icons')
export class FooterIconController {
  constructor(private readonly footerIconService: FooterIconService) {
    console.log('\n========================================');
    console.log('📋 Footer Icons API Endpoints:');
    console.log('========================================');
    console.log('GET    /api/footer-icons - Get all footer icons');
    console.log('GET    /api/footer-icons?isActive=true - Get active footer icons');
    console.log('GET    /api/footer-icons/:id - Get footer icon by ID');
    console.log('POST   /api/footer-icons - Create new footer icon');
    console.log('PUT    /api/footer-icons/:id - Update footer icon');
    console.log('DELETE /api/footer-icons/:id - Delete footer icon');
    console.log('========================================\n');
  }

  /**
   * Get all footer icons
   * 
   * @route GET /api/footer-icons
   * @description Retrieves all footer icons (optionally filtered by isActive)
   * @param isActive - Optional query parameter to filter by active status
   * @returns Promise<any> - Footer icons data
   * 
   * @example
   * GET /api/footer-icons
   * GET /api/footer-icons?isActive=true
   */
  @Get()
  async findAll(@Query('isActive') isActive?: string) {
    try {
      console.log(`\n📋 [Footer Icons API] GET /api/footer-icons${isActive ? `?isActive=${isActive}` : ''}`);
      const isActiveFilter = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
      const icons = await this.footerIconService.findAll(isActiveFilter);
      
      return {
        success: true,
        data: icons,
        count: icons.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in FooterIconController.findAll:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch footer icons',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a single footer icon by ID
   * 
   * @route GET /api/footer-icons/:id
   * @description Retrieves a specific footer icon by ID
   * @param id - Footer icon ID
   * @returns Promise<any> - Footer icon data
   * 
   * @example
   * GET /api/footer-icons/123e4567-e89b-12d3-a456-426614174000
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const icon = await this.footerIconService.findOne(id);
      
      return {
        success: true,
        data: icon,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in FooterIconController.findOne:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch footer icon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a new footer icon
   * 
   * @route POST /api/footer-icons
   * @description Creates a new footer icon
   * @param createFooterIconDto - Footer icon data
   * @returns Promise<any> - Created footer icon
   * 
   * @example
   * POST /api/footer-icons
   * {
   *   "name": "Home",
   *   "icon": "🏠",
   *   "isActive": true
   * }
   */
  @Post()
  async create(@Body(ValidationPipe) createFooterIconDto: CreateFooterIconDto) {
    try {
      console.log(`\n📋 [Footer Icons API] POST /api/footer-icons`);
      console.log(`   Request body:`, JSON.stringify(createFooterIconDto, null, 2));
      const icon = await this.footerIconService.create(createFooterIconDto);
      
      return {
        success: true,
        message: 'Footer icon created successfully',
        data: icon,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in FooterIconController.create:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create footer icon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update a footer icon
   * 
   * @route PUT /api/footer-icons/:id
   * @description Updates an existing footer icon
   * @param id - Footer icon ID
   * @param updateFooterIconDto - Updated footer icon data
   * @returns Promise<any> - Updated footer icon
   * 
   * @example
   * PUT /api/footer-icons/123e4567-e89b-12d3-a456-426614174000
   * {
   *   "isActive": false
   * }
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateFooterIconDto: UpdateFooterIconDto,
  ) {
    try {
      const icon = await this.footerIconService.update(id, updateFooterIconDto);
      
      return {
        success: true,
        message: 'Footer icon updated successfully',
        data: icon,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in FooterIconController.update:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update footer icon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a footer icon
   * 
   * @route DELETE /api/footer-icons/:id
   * @description Deletes a footer icon
   * @param id - Footer icon ID
   * @returns Promise<any> - Deletion confirmation
   * 
   * @example
   * DELETE /api/footer-icons/123e4567-e89b-12d3-a456-426614174000
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.footerIconService.remove(id);
      
      return {
        success: true,
        message: 'Footer icon deleted successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in FooterIconController.remove:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete footer icon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

