import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteUser } from '../entities/website-user.entity';
import { CreateWebsiteUserDto, UpdateWebsiteUserDto } from '../dto';
import { ERROR_CODES } from '../constants';

/**
 * Website User Service
 * 
 * @description Handles all website user-related business logic
 */
@Injectable()
export class WebsiteUserService {
  private readonly logger = new Logger(WebsiteUserService.name);

  constructor(
    @InjectRepository(WebsiteUser)
    private websiteUserRepository: Repository<WebsiteUser>,
  ) {}

  /**
   * Create a new website user
   * 
   * @param createWebsiteUserDto - User data to create
   * @returns Promise<WebsiteUser> - Created user
   */
  async createWebsiteUser(createWebsiteUserDto: CreateWebsiteUserDto): Promise<WebsiteUser> {
    try {
      this.logger.log(`Creating website user with email: ${createWebsiteUserDto.email}`);

      const user = this.websiteUserRepository.create(createWebsiteUserDto);
      return await this.websiteUserRepository.save(user);
    } catch (error) {
      console.error('Error in WebsiteUserService.createWebsiteUser:', error);
      this.logger.error(`Error creating website user: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Find all website users with pagination
   * 
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise<{ users: WebsiteUser[]; total: number }> - Users and total count
   */
  async fetchAllWebsiteUsers(page: number = 1, limit: number = 10): Promise<{ users: WebsiteUser[]; total: number }> {
    try {
      this.logger.log(`Getting website users - page: ${page}, limit: ${limit}`);

      const skip = (page - 1) * limit;
      
      const [users, total] = await this.websiteUserRepository.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return { users, total };
    } catch (error) {
      console.error('Error in WebsiteUserService.fetchAllWebsiteUsers:', error);
      this.logger.error(`Error getting website users: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Find website user by ID
   * 
   * @param id - User ID
   * @returns Promise<WebsiteUser> - Found user
   */
  async fetchWebsiteUserById(id: string): Promise<WebsiteUser> {
    try {
      this.logger.log(`Finding website user by ID: ${id}`);

      const user = await this.websiteUserRepository.findOne({ where: { id } });
      
      if (!user) {
        throw new NotFoundException({
          success: false,
          message: `Website user with ID ${id} not found`,
          errorCode: ERROR_CODES.USER_NOT_FOUND,
          timestamp: new Date().toISOString(),
        });
      }

      return user;
    } catch (error) {
      console.error('Error in WebsiteUserService.fetchWebsiteUserById:', error);
      this.logger.error(`Error finding website user by ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Find website user by email
   * 
   * @param email - User email
   * @returns Promise<WebsiteUser | null> - Found user or null
   */
  async fetchWebsiteUserByEmail(email: string): Promise<WebsiteUser | null> {
    try {
      this.logger.log(`Finding website user by email: ${email}`);

      return await this.websiteUserRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error in WebsiteUserService.fetchWebsiteUserByEmail:', error);
      this.logger.error(`Error finding website user by email: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Update website user by ID
   * 
   * @param id - User ID
   * @param updateWebsiteUserDto - Data to update
   * @returns Promise<WebsiteUser> - Updated user
   */
  async updateWebsiteUser(id: string, updateWebsiteUserDto: UpdateWebsiteUserDto): Promise<WebsiteUser> {
    try {
      this.logger.log(`Updating website user with ID: ${id}`);

      const user = await this.fetchWebsiteUserById(id);
      Object.assign(user, updateWebsiteUserDto);
      
      return await this.websiteUserRepository.save(user);
    } catch (error) {
      console.error('Error in WebsiteUserService.updateWebsiteUser:', error);
      this.logger.error(`Error updating website user: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete website user by ID
   * 
   * @param id - User ID
   * @returns Promise<boolean> - Success status
   */
  async deleteWebsiteUser(id: string): Promise<boolean> {
    try {
      this.logger.log(`Deleting website user with ID: ${id}`);

      const result = await this.websiteUserRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      console.error('Error in WebsiteUserService.deleteWebsiteUser:', error);
      this.logger.error(`Error deleting website user: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get active users count
   * 
   * @returns Promise<number> - Count of active users
   */
  async fetchActiveUsersCount(): Promise<number> {
    try {
      this.logger.log('Getting active website users count');

      return await this.websiteUserRepository.count({ where: { isActive: true } });
    } catch (error) {
      console.error('Error in WebsiteUserService.fetchActiveUsersCount:', error);
      this.logger.error(`Error getting active website users count: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Search users by name or email
   * 
   * @param searchTerm - Search term
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise<{ users: WebsiteUser[]; total: number }> - Search results
   */
  async searchWebsiteUsers(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: WebsiteUser[]; total: number }> {
    try {
      this.logger.log(`Searching website users with term: ${searchTerm}`);

      const skip = (page - 1) * limit;
      
      const queryBuilder = this.websiteUserRepository.createQueryBuilder('user');
      
      queryBuilder
        .where('user.firstName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
        .orWhere('user.lastName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
        .orWhere('user.email ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
        .orderBy('user.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [users, total] = await queryBuilder.getManyAndCount();

      return { users, total };
    } catch (error) {
      console.error('Error in WebsiteUserService.searchWebsiteUsers:', error);
      this.logger.error(`Error searching website users: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Authenticate user with email and password
   * 
   * @param email - User email
   * @param password - User password
   * @returns Promise<WebsiteUser | null> - Authenticated user or null
   */
  async authenticateUser(email: string, password: string): Promise<WebsiteUser | null> {
    try {
      this.logger.log(`Authenticating user with email: ${email}`);

      const user = await this.websiteUserRepository.findOne({ 
        where: { email, isActive: true } 
      });

      if (!user) {
        this.logger.warn(`User not found or inactive: ${email}`);
        return null;
      }

      // Simple password comparison (in production, use bcrypt)
      if (user.password !== password) {
        this.logger.warn(`Invalid password for user: ${email}`);
        return null;
      }

      this.logger.log(`User authenticated successfully: ${email}`);
      return user;
    } catch (error) {
      console.error('Error in WebsiteUserService.authenticateUser:', error);
      this.logger.error(`Error authenticating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Find or create user by phone number
   * 
   * @param phoneNumber - User phone number
   * @param name - User name
   * @returns Promise<WebsiteUser> - Found or created user
   */
  async findOrCreateUserByPhone(phoneNumber: string, name: string): Promise<WebsiteUser> {
    try {
      this.logger.log(`Finding or creating user by phone: ${phoneNumber}`);

      // First try to find existing user by phone
      let user = await this.websiteUserRepository.findOne({ 
        where: { phone: phoneNumber } 
      });

      if (user) {
        this.logger.log(`Found existing user by phone: ${phoneNumber}`);
        return user;
      }

      // If user doesn't exist, create a new one
      this.logger.log(`Creating new user for phone: ${phoneNumber}`);
      
      const newUser = this.websiteUserRepository.create({
        firstName: name,
        phone: phoneNumber,
        email: `${phoneNumber}@phone.local`, // Generate email from phone
        isActive: true,
        isPhoneVerified: true, // Phone is verified through OTP
        role: 'user',
      });

      const savedUser = await this.websiteUserRepository.save(newUser);
      this.logger.log(`Created new user with ID: ${savedUser.id}`);
      
      return savedUser;
    } catch (error) {
      console.error('Error in WebsiteUserService.findOrCreateUserByPhone:', error);
      this.logger.error(`Error finding or creating user by phone: ${error.message}`, error.stack);
      throw error;
    }
  }
}
