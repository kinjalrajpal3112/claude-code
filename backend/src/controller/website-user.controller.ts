import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ValidationPipe,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { WebsiteUserService } from '../service/website-user.service';
import { JwtService } from '../service/jwt.service';
import { OtpService } from '../service/otp.service';
import { CreateWebsiteUserDto, UpdateWebsiteUserDto, PaginationQueryDto, SearchQueryDto, SendOtpDto, VerifyOtpDto } from '../dto';
import { ERROR_CODES } from '../constants';

/**
 * Website User Controller
 * 
 * @route /api/website-users
 * @description Handles all website user-related API endpoints
 */
@Controller('website-users')
export class WebsiteUserController {
  constructor(
    private readonly websiteUserService: WebsiteUserService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  /**
   * Create a new website user
   * 
   * @route POST /api/website-users
   * @description Creates a new website user
   * @param createWebsiteUserDto - User data to create
   * @returns Promise<WebsiteUser> - Created user
   * 
   * @example
   * POST /api/website-users
   * {
   *   "email": "user@example.com",
   *   "firstName": "John",
   *   "lastName": "Doe",
   *   "phone": "+1234567890",
   *   "password": "password123"
   * }
   */
  @Post()
  @UseGuards(AuthGuard)
  async createWebsiteUser(@Body(ValidationPipe) createWebsiteUserDto: CreateWebsiteUserDto) {
    try {
      return await this.websiteUserService.createWebsiteUser(createWebsiteUserDto);
    } catch (error) {
      console.error('Error in WebsiteUserController.createWebsiteUser:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create website user',
          error: error.message,
          errorCode: ERROR_CODES.DATABASE_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Login website user and generate JWT token
   * 
   * @route POST /api/website-users/login
   * @description Authenticates user and returns JWT token (lifetime)
   * @param loginDto - Login credentials (email and password)
   * @returns Promise<any> - JWT tokens and user data
   * 
   * @example
   * POST /api/website-users/login
   * {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   */
  @Post('login')
  async loginWebsiteUser(@Body(ValidationPipe) loginDto: { email: string; password: string }) {
    try {
      const user = await this.websiteUserService.authenticateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        throw new HttpException(
          {
            success: false,
            message: 'Invalid email or password',
            errorCode: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
            timestamp: new Date().toISOString(),
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Generate lifetime JWT tokens
      const accessToken = this.jwtService.generateAccessToken(user);
      const refreshToken = this.jwtService.generateRefreshToken(user);

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || 'user',
          },
          tokens: {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: 'lifetime', // No expiration
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in WebsiteUserController.loginWebsiteUser:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Login failed',
          error: error.message,
          errorCode: ERROR_CODES.AUTH_LOGIN_FAILED,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Send OTP to phone number
   * 
   * @route POST /api/website-users/send-otp
   * @description Sends OTP to the provided Indian phone number
   * @param sendOtpDto - OTP data (name and phone number)
   * @returns Promise<any> - OTP send response
   * 
   * @example
   * POST /api/website-users/send-otp
   * {
   *   "name": "Vishal",
   *   "number": "9871560356"
   * }
   */
  @Post('send-otp')
  async sendOtp(@Body(ValidationPipe) sendOtpDto: SendOtpDto) {
    try {
      return await this.otpService.sendOtp(sendOtpDto);
    } catch (error) {
      console.error('Error in WebsiteUserController.sendOtp:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send OTP',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify OTP and generate JWT token
   * 
   * @route POST /api/website-users/verify-otp
   * @description Verifies OTP and generates lifetime JWT token
   * @param verifyOtpDto - OTP verification data (name, phone number, and OTP)
   * @returns Promise<any> - JWT tokens and user data
   * 
   * @example
   * POST /api/website-users/verify-otp
   * {
   *   "name": "Vishal",
   *   "number": "9871560356",
   *   "otp": "51761"
   * }
   */
  @Post('verify-otp')
  async verifyOtp(@Body(ValidationPipe) verifyOtpDto: VerifyOtpDto) {
    try {
      // Verify OTP with third-party API
      const otpResponse = await this.otpService.verifyOtp(verifyOtpDto);
      
      if (!otpResponse.success) {
        throw new HttpException(
          {
            success: false,
            message: 'OTP verification failed',
            errorCode: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
            timestamp: new Date().toISOString(),
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Create or find user by phone number
      const user = await this.websiteUserService.findOrCreateUserByPhone(
        verifyOtpDto.number,
        verifyOtpDto.name
      );

      // Generate lifetime JWT tokens
      const accessToken = this.jwtService.generateAccessToken({
        id: user.id,
        email: user.email || `${verifyOtpDto.number}@phone.local`,
        firstName: user.firstName || verifyOtpDto.name,
        lastName: user.lastName || '',
        phone: verifyOtpDto.number,
        role: user.role || 'user',
      });

      const refreshToken = this.jwtService.generateRefreshToken({
        id: user.id,
        email: user.email || `${verifyOtpDto.number}@phone.local`,
        phone: verifyOtpDto.number,
      });

      return {
        success: true,
        message: 'OTP verified successfully and user authenticated',
        data: {
          user: {
            id: user.id,
            phone: verifyOtpDto.number,
            firstName: user.firstName || verifyOtpDto.name,
            lastName: user.lastName || '',
            email: user.email || `${verifyOtpDto.number}@phone.local`,
            role: user.role || 'user',
          },
          tokens: {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: 'lifetime', // No expiration
          },
          otpVerification: otpResponse.data,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in WebsiteUserController.verifyOtp:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to verify OTP',
          error: error.message,
          errorCode: ERROR_CODES.AUTH_LOGIN_FAILED,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all website users with pagination
   * 
   * @route GET /api/website-users
   * @description Retrieves all website users with pagination support
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise<any> - Users list with pagination info
   * 
   * @example
   * GET /api/website-users?page=1&limit=10
   */
  @Get()
  @UseGuards(AuthGuard)
  async fetchAllWebsiteUsers(
    @Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto,
  ) {
    try {
      return await this.websiteUserService.fetchAllWebsiteUsers(query.page, query.limit);
    } catch (error) {
      console.error('Error in WebsiteUserController.fetchAllWebsiteUsers:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch website users',
          error: error.message,
          errorCode: ERROR_CODES.DATABASE_QUERY_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Search website users
   * 
   * @route GET /api/website-users/search
   * @description Searches users by name or email
   * @param q - Search query
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise<any> - Search results
   * 
   * @example
   * GET /api/website-users/search?q=john&page=1&limit=10
   */
  @Get('search')
  async searchWebsiteUsers(
    @Query(new ValidationPipe({ transform: true })) query: SearchQueryDto,
  ) {
    try {
      return await this.websiteUserService.searchWebsiteUsers(query.q, query.page, query.limit);
    } catch (error) {
      console.error('Error in WebsiteUserController.searchWebsiteUsers:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to search website users',
          error: error.message,
          errorCode: ERROR_CODES.DATABASE_QUERY_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Get active users count
   * 
   * @route GET /api/website-users/stats/active
   * @description Gets the count of active website users
   * @returns Promise<any> - Active users count
   * 
   * @example
   * GET /api/website-users/stats/active
   */
  @Get('stats/active')
  async fetchActiveUsersCount() {
    try {
      const count = await this.websiteUserService.fetchActiveUsersCount();
      return { activeUsers: count };
    } catch (error) {
      console.error('Error in WebsiteUserController.fetchActiveUsersCount:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch active users count',
          error: error.message,
          errorCode: ERROR_CODES.DATABASE_QUERY_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Send OTP to phone number (GET method with query params)
   * 
   * @route GET /api/website-users/send-otp-get
   * @description Sends OTP to the provided phone number using GET method
   * @param name - User name
   * @param number - Phone number
   * @param fromSource - From source (default: 1)
   * @param toSource - To source (default: 0)
   * @returns Promise<any> - OTP send response
   * 
   * @example
   * GET /api/website-users/send-otp-get?Name=Vishal&Number=9871560356&FromSource=1&ToSource=0
   */
  @Get('send-otp-get')
  async sendOtpGet(
    @Query('Name') name: string,
    @Query('Number') number: string,
    @Query('FromSource') fromSource: string = '1',
    @Query('ToSource') toSource: string = '0',
  ) {
    try {
      const sendOtpDto = {
        name,
        number,
      };
      
      const response = await this.otpService.sendOtp(sendOtpDto);
      
      // Add the user details from response if available
      return response;
    } catch (error) {
      console.error('Error in WebsiteUserController.sendOtpGet:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send OTP',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify OTP and generate JWT token (GET method with query params)
   * 
   * @route GET /api/website-users/verify-otp-get
   * @description Verifies OTP and generates lifetime JWT token using GET method
   * @param name - User name
   * @param number - Phone number
   * @param otp - OTP code
   * @returns Promise<any> - JWT tokens and user data
   * 
   * @example
   * GET /api/website-users/verify-otp-get?Name=Vishal&Number=9871560356&OTP=572499
   */
  @Get('verify-otp-get')
  async verifyOtpGet(
    @Query('Name') name: string,
    @Query('Number') number: string,
    @Query('OTP') otp: string,
  ) {
    try {
      const otpResponse = await this.otpService.verifyOtp({ name, number, otp });
      
      if (!otpResponse.success) {
        return { UserDetails: '', LoginStatus: 'error', Status: false };
      }

      const userDetails = otpResponse.userDetails?.[0] || otpResponse.data?.userDetails?.[0];
      const accessToken = this.jwtService.generateAccessToken({ 
        id: userDetails?.UserId || 0, 
        email: `${number}@phone.local`, 
        firstName: userDetails?.FirstName || name, 
        lastName: userDetails?.LastName || '', 
        phone: number, 
        role: 'user' 
      });
      const refreshToken = this.jwtService.generateRefreshToken({ 
        id: userDetails?.UserId || 0, 
        email: `${number}@phone.local`, 
        phone: number 
      });

      return {
        success: true,
        LoginStatus: 'success',
        Status: 'true',
        message: 'OTP verified successfully',
        ds: otpResponse.rawResponse?.ds || { UserDetails: [] },
        userDetails: otpResponse.userDetails,
        data: {
          tokens: { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 'lifetime' },
          otpVerification: otpResponse.data
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in verifyOtpGet:', error);
      return { UserDetails: '', LoginStatus: 'error', Status: false };
    }
  }

  /**
   * Get website user by ID
   * 
   * @route GET /api/website-users/:id
   * @description Retrieves a specific website user by ID
   * @param id - User ID
   * @returns Promise<WebsiteUser> - User data
   * 
   * @example
   * GET /api/website-users/123e4567-e89b-12d3-a456-426614174000
   */
  @Get(':id')
  async fetchWebsiteUserById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.websiteUserService.fetchWebsiteUserById(id);
    } catch (error) {
      console.error('Error in WebsiteUserController.fetchWebsiteUserById:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch website user',
          error: error.message,
          errorCode: ERROR_CODES.USER_NOT_FOUND,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update website user by ID
   * 
   * @route PATCH /api/website-users/:id
   * @description Updates a specific website user by ID
   * @param id - User ID
   * @param updateWebsiteUserDto - Data to update
   * @returns Promise<WebsiteUser> - Updated user
   * 
   * @example
   * PATCH /api/website-users/123e4567-e89b-12d3-a456-426614174000
   * {
   *   "firstName": "Jane",
   *   "lastName": "Smith"
   * }
   */
  @Patch(':id')
  async updateWebsiteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateWebsiteUserDto: UpdateWebsiteUserDto,
  ) {
    try {
      return await this.websiteUserService.updateWebsiteUser(id, updateWebsiteUserDto);
    } catch (error) {
      console.error('Error in WebsiteUserController.updateWebsiteUser:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update website user',
          error: error.message,
          errorCode: ERROR_CODES.DATABASE_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete website user by ID
   * 
   * @route DELETE /api/website-users/:id
   * @description Deletes a specific website user by ID
   * @param id - User ID
   * @returns Promise<any> - Deletion status
   * 
   * @example
   * DELETE /api/website-users/123e4567-e89b-12d3-a456-426614174000
   */
  @Delete(':id')
  async deleteWebsiteUser(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const result = await this.websiteUserService.deleteWebsiteUser(id);
      return { success: result, message: result ? 'User deleted successfully' : 'User not found' };
    } catch (error) {
      console.error('Error in WebsiteUserController.deleteWebsiteUser:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete website user',
          error: error.message,
          errorCode: ERROR_CODES.DATABASE_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
