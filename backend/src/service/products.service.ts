import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetProductsDto } from '../dto/get-products.dto';
import { GetProductsByCategoryDto } from '../dto/get-products-by-category.dto';
import { VideosQueryDto } from '../dto/videos-query.dto';
import { ProductDetailsDto } from '../dto/product-details.dto';
import { RelatedProductsDto } from '../dto/related-products.dto';
import { PriceRangeSearchDto } from '../dto/price-range-search.dto';
import { VerifyCouponDto } from '../dto/verify-coupon.dto';
import { GetTopSellingDto } from '../dto/get-top-selling.dto';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { MapPartnerOrderDto } from '../dto/map-partner-order.dto';
import { AcceptPaymentDto } from '../dto/accept-payment.dto';
import { UpdateFarmerDataDto } from '../dto/update-farmer-data.dto';
import { CompletePaymentDto } from '../dto/complete-payment.dto';
import { CancelReasonDto } from '../dto/cancel-reason.dto';
import { APP_CONSTANTS, ERROR_CODES, URL_CONFIG } from '../constants';
import { EnvironmentConfig } from '../config';
import { AxiosService } from './axios.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly requestTimeout: number;

  constructor(
    private configService: ConfigService<EnvironmentConfig>,
    private readonly axiosService: AxiosService,
  ) {
    this.requestTimeout = this.configService.get('requestTimeout', 30000);
  }

  async fetchProductsWithPagination(query: GetProductsDto): Promise<any> {
    try {
      this.logger.log(`Fetching products with query: ${JSON.stringify(query)}`);

      const requestBody = {
        PageIndex: query.pageIndex || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_INDEX,
        PageSize: query.pageSize || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
      };

      const response = await this.axiosService.post(
        URL_CONFIG.PRODUCTS_URL,
        requestBody,
        undefined,
        this.requestTimeout,
      );

      this.logger.log(`Successfully fetched products. Status: ${response.statusCode}`);

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch products',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        pagination: {
          pageIndex: query.pageIndex || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_INDEX,
          pageSize: query.pageSize || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.fetchProductsWithPagination:', error);
      this.logger.error(`Error fetching products: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch products',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get main categories
   * 
   * @returns Promise<any> - Categories data
   */
  async getMainCategories(): Promise<any> {
    try {
      this.logger.log('Fetching main categories');
      
      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${URL_CONFIG.CATEGORIES_URL}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log('  -H "referer: https://behtarzindagi.in/"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.CATEGORIES_URL,
        undefined,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch categories',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched categories. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getMainCategories:', error);
      this.logger.error(`Error fetching categories: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch categories',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get products by category
   * 
   * @param query - Products by category query parameters
   * @returns Promise<any> - Products data filtered by category
   */
  async getProductsByCategory(query: GetProductsByCategoryDto): Promise<any> {
    try {
      this.logger.log(`Fetching products by category with query: ${JSON.stringify(query)}`);

      const requestBody = {
        PageIndex: query.PageIndex || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_INDEX,
        PageSize: query.PageSize || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
        CategoryId: query.CategoryId,
      };

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${URL_CONFIG.PRODUCTS_BY_CATEGORY_URL}" \\`);
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log(`  --data-raw '${JSON.stringify(requestBody)}'`);
      console.log('======================================================\n');

      const response = await this.axiosService.post(
        URL_CONFIG.PRODUCTS_BY_CATEGORY_URL,
        requestBody,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch products by category',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched products by category. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        pagination: {
          PageIndex: query.PageIndex || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_INDEX,
          PageSize: query.PageSize || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
          CategoryId: query.CategoryId,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getProductsByCategory:', error);
      this.logger.error(`Error fetching products by category: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch products by category',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get short videos URLs
   * 
   * @param query - Videos query parameters
   * @returns Promise<any> - Videos data
   */
  async getShortVideosUrls(query: VideosQueryDto): Promise<any> {
    try {
      this.logger.log(`Fetching short videos with query: ${JSON.stringify(query)}`);

      const requestBody = {
        page: query.page || 1,
        PageSize: query.PageSize || 4,
        HashTagId: query.HashTagId || 0,
      };

      const response = await this.axiosService.post(
        URL_CONFIG.VIDEOS_URL,
        requestBody,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch videos',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched videos. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        pagination: {
          page: query.page || 1,
          PageSize: query.PageSize || 4,
          HashTagId: query.HashTagId || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getShortVideosUrls:', error);
      this.logger.error(`Error fetching videos: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch videos',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductDetails(query: ProductDetailsDto): Promise<any> {
    try {
      this.logger.log(`Fetching product details with query: ${JSON.stringify(query)}`);

      const requestBody = {
        deviceId: query.deviceId || '',
        gcmId: query.gcmId || '',
        ProductId: query.ProductId,
        DistrictId: query.DistrictId,
        slug: query.slug,
        lat: query.lat || '0.0',
        lon: query.lon || '0.0',
      };

      const response = await this.axiosService.post(
        URL_CONFIG.PRODUCT_DETAILS_URL,
        requestBody,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch product details',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched product details. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        productInfo: {
          ProductId: query.ProductId,
          DistrictId: query.DistrictId,
          slug: query.slug,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getProductDetails:', error);
      this.logger.error(`Error fetching product details: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch product details',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRelatedProducts(query: RelatedProductsDto): Promise<any> {
    try {
      this.logger.log(`Fetching related products with query: ${JSON.stringify(query)}`);
      console.log(URL_CONFIG.RELATED_PRODUCTS_URL);
      const response = await this.axiosService.get(
        URL_CONFIG.RELATED_PRODUCTS_URL,
        { ProductName: `'${query.ProductName}'` },
        {},
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch related products',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched related products. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        productInfo: {
          ProductName: query.ProductName,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getRelatedProducts:', error);
      this.logger.error(`Error fetching related products: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch related products',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get products by price range
   * 
   * @param query - Price range search query parameters
   * @returns Promise<any> - Products data filtered by price range
   */
  async getProductsByPriceRange(query: PriceRangeSearchDto): Promise<any> {
    try {
      this.logger.log(`Fetching products by price range with query: ${JSON.stringify(query)}`);

      const params: any = {};
      
      if (query.SearchText) {
        params.SearchText = query.SearchText;
      }
      
      // Allow 0 as valid value
      if (query.MinPrice !== undefined && query.MinPrice !== null) {
        params.MinPrice = query.MinPrice;
      }
      
      if (query.MaxPrice !== undefined && query.MaxPrice !== null) {
        params.MaxPrice = query.MaxPrice;
      }

      // Add MobNo and DeviceId if provided
      if (query.MobNo) {
        params.MobNo = query.MobNo;
      }

      if (query.DeviceId) {
        params.DeviceId = query.DeviceId;
      }

      // Build query string for curl
      const queryString = new URLSearchParams(params as any).toString();
      const fullUrl = `${URL_CONFIG.PRICE_RANGE_SEARCH_URL}${queryString ? `?${queryString}` : ''}`;

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log('  -H "referer: https://behtarzindagi.in/"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.PRICE_RANGE_SEARCH_URL,
        params,
        {},
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch products by price range',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched products by price range. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        searchParams: {
          SearchText: query.SearchText,
          MinPrice: query.MinPrice,
          MaxPrice: query.MaxPrice,
          MobNo: query.MobNo,
          DeviceId: query.DeviceId,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getProductsByPriceRange:', error);
      this.logger.error(`Error fetching products by price range: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch products by price range',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get cart items for a user
   * 
   * @param mobileNo - User mobile number
   * @returns Promise<any> - Cart items data with item details
   */
  async getCartItems(mobileNo: string): Promise<any> {
    try {
      this.logger.log(`Fetching cart items for mobile number: ${mobileNo}`);

      const response = await this.axiosService.get(
        URL_CONFIG.CART_ITEMS_URL,
        { MobileNo: mobileNo },
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch cart items',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched cart items. Status: ${response.statusCode}`);

      // Return the cart data with items details
      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        queryParams: {
          MobileNo: mobileNo,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getCartItems:', error);
      this.logger.error(`Error fetching cart items: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch cart items',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Add or remove item to/from cart
   * 
   * @param dto - Add/Remove to cart DTO
   * @returns Promise<any> - Cart operation response
   */
  async addToCart(dto: AddToCartDto): Promise<any> {
    try {
      const action = dto.InType === 'Add' ? 'adding' : 'removing';
      this.logger.log(`${action.charAt(0).toUpperCase() + action.slice(1)} item to/from cart with data: ${JSON.stringify(dto)}`);

      const requestBody: any = {
        InType: dto.InType,
        MobileNo: dto.MobileNo,
        BzProductId: dto.BzProductId,
      };

      // Quantity is only needed for Add operations
      if (dto.Quantity !== undefined) {
        requestBody.Quantity = dto.Quantity;
      }

      const response = await this.axiosService.post(
        URL_CONFIG.ADD_TO_CART_URL,
        requestBody,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            `Failed to ${dto.InType.toLowerCase()} item to cart`,
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully ${action} item to/from cart. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        requestData: requestBody,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.addToCart:', error);
      this.logger.error(`Error ${dto.InType === 'Add' ? 'adding' : 'removing'} item to cart: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          `Failed to ${dto.InType === 'Add' ? 'add' : 'remove'} item to cart`,
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get farmer address by FarmerID
   * 
   * @param params - Version and FarmerID
   * @returns Promise<any> - Farmer address data
   */
  async getFarmerAddress(params: { Version?: string; FarmerID: string | number }): Promise<any> {
    try {
      this.logger.log(`Fetching farmer address with params: ${JSON.stringify(params)}`);

      const queryParams: Record<string, any> = {};
      if (params.Version) queryParams.Version = params.Version;
      queryParams.FarmerID = params.FarmerID;

      // Build query string for curl
      const queryString = new URLSearchParams(queryParams as any).toString();
      const fullUrl = `${URL_CONFIG.FARMER_ADDRESS_URL}?${queryString}`;

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.FARMER_ADDRESS_URL,
        queryParams,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch farmer address',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched farmer address. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.getFarmerAddress:', error);
      this.logger.error(`Error fetching farmer address: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch farmer address',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all active coupons by PackageId
   * 
   * @param params - PackageId
   * @returns Promise<any> - Active coupons list
   */
  async getAllActiveCoupons(params: { PackageId: string | number }): Promise<any> {
    try {
      this.logger.log(`Fetching active coupons with params: ${JSON.stringify(params)}`);

      const response = await this.axiosService.get(
        URL_CONFIG.ACTIVE_COUPONS_URL,
        { PackageId: params.PackageId },
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch active coupons',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        queryParams: { PackageId: params.PackageId },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getAllActiveCoupons:', error);
      this.logger.error(`Error fetching active coupons: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch active coupons',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify coupon availability
   *
   * @param dto - Coupon verification parameters
   * @returns Promise<any> - Coupon validity response
   */
  async verifyCoupon(dto: VerifyCouponDto): Promise<any> {
    try {
      this.logger.log(`Verifying coupon with params: ${JSON.stringify(dto)}`);

      const params: Record<string, any> = {
        AgentId: dto.AgentId,
        PackageId: dto.PackageId,
        CouponCode: dto.CouponCode,
        quantity: dto.quantity,
        TxnValue: dto.TxnValue,
      };

      const queryString = new URLSearchParams(params as any).toString();
      const fullUrl = `${URL_CONFIG.COUPON_VALIDITY_URL}?${queryString}`;

      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log('  -H "referer: https://behtarzindagi.in/cart/payment/pay/"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.COUPON_VALIDITY_URL,
        params,
        {},
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to verify coupon',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully verified coupon. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        queryParams: params,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.verifyCoupon:', error);
      this.logger.error(`Error verifying coupon: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to verify coupon',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get top selling products
   *
   * @param dto - Top selling query parameters
   * @returns Promise<any> - Top selling products response
   */
  async getTopSellingProducts(dto: GetTopSellingDto): Promise<any> {
    try {
      this.logger.log(`Fetching top selling products with params: ${JSON.stringify(dto)}`);

      const params: Record<string, any> = {};
      if (dto.Category !== undefined) {
        params.Category = dto.Category;
      }

      const queryString = new URLSearchParams(params as any).toString();
      const fullUrl = `${URL_CONFIG.TOP_SELLING_PRODUCTS_URL}${queryString ? `?${queryString}` : ''}`;

      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log('  -H "referer: https://behtarzindagi.in/"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.TOP_SELLING_PRODUCTS_URL,
        params,
        {},
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch top selling products',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched top selling products. Status: ${response.statusCode}`);

      return {
        success: APP_CONSTANTS.RESPONSE.SUCCESS,
        data: response.data,
        queryParams: params,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in ProductsService.getTopSellingProducts:', error);
      this.logger.error(`Error fetching top selling products: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch top selling products',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create order with cart checkout
   * 
   * @param dto - Order creation data (flexible, allows additional fields)
   * @returns Promise<any> - Order creation response
   */
  async createOrder(dto: CreateOrderDto): Promise<any> {
    try {
      // Ensure FatherName and OtherVillageName are set to "" if not coming
      if (dto.Farmer) {
        if (!dto.Farmer.FatherName) {
          dto.Farmer.FatherName = "";
        }
        if (!dto.Farmer.OtherVillageName) {
          dto.Farmer.OtherVillageName = "";
        }
      }

      this.logger.log(`Creating order with data: ${JSON.stringify(dto)}`);

      // Print curl command before making the request
      const jsonBody = JSON.stringify(dto).replace(/"/g, '\\"');
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${URL_CONFIG.ORDER_CREATE_URL}" \\`);
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log(`  --data-raw '${JSON.stringify(dto)}'`);
      console.log('======================================================\n');

      // Forward the entire DTO body as-is to the external API
      const response = await this.axiosService.post(
        URL_CONFIG.ORDER_CREATE_URL,
        dto,  
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to create order',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully created order. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.createOrder:', error);
      this.logger.error(`Error creating order: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to create order',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Map partner order details with third party user ID
   * 
   * @param dto - Partner order mapping data (flexible, allows additional fields)
   * @returns Promise<any> - Partner order mapping response
   */
  async mapPartnerOrder(dto: MapPartnerOrderDto): Promise<any> {
    try {
      this.logger.log(`Mapping partner order with data: ${JSON.stringify(dto)}`);

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${URL_CONFIG.MAP_PARTNER_ORDER_URL}" \\`);
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log(`  --data-raw '${JSON.stringify(dto)}'`);
      console.log('======================================================\n');

      // Forward the entire DTO body as-is to the external API
      const response = await this.axiosService.post(
        URL_CONFIG.MAP_PARTNER_ORDER_URL,
        dto,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to map partner order',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully mapped partner order. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.mapPartnerOrder:', error);
      this.logger.error(`Error mapping partner order: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to map partner order',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Accept customer payment request
   * 
   * @param dto - Payment request data (flexible, allows additional fields)
   * @returns Promise<any> - Payment acceptance response
   */
  async acceptPayment(dto: AcceptPaymentDto): Promise<any> {
    try {
      this.logger.log(`Accepting customer payment with data: ${JSON.stringify(dto)}`);

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${URL_CONFIG.ACCEPT_PAYMENT_URL}" \\`);
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log(`  --data-raw '${JSON.stringify(dto)}'`);
      console.log('======================================================\n');

      // Forward the entire DTO body as-is to the external API
      const response = await this.axiosService.post(
        URL_CONFIG.ACCEPT_PAYMENT_URL,
        dto,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to accept payment',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully accepted payment. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.acceptPayment:', error);
      this.logger.error(`Error accepting payment: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to accept payment',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update farmer data
   * 
   * @param dto - Farmer data update (flexible, allows additional fields)
   * @returns Promise<any> - Farmer update response
   */
  async updateFarmerData(dto: UpdateFarmerDataDto): Promise<any> {
    try {
      this.logger.log(`Updating farmer data with: ${JSON.stringify(dto)}`);

      // Log the raw DTO to see what we're receiving
      console.log('Received DTO:', JSON.stringify(dto, null, 2));

      // Expect Mobile from frontend
      if (!dto.Mobile) {
        this.logger.warn('Mobile is missing; expecting frontend to send it.');
      }

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${URL_CONFIG.UPDATE_FARMER_DATA_URL}" \\`);
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log(`  --data-raw '${JSON.stringify(dto)}'`);
      console.log('======================================================\n');

      // Forward the entire DTO body as-is to the external API
      const response = await this.axiosService.post(
        URL_CONFIG.UPDATE_FARMER_DATA_URL,
        dto,
        undefined,
        this.requestTimeout,
      );

      // Log the response to see what we're getting back
      console.log('API Response:', JSON.stringify(response.data, null, 2));

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to update farmer data',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully updated farmer data. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.updateFarmerData:', error);
      this.logger.error(`Error updating farmer data: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to update farmer data',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get State, District, Block, or Village data
   * 
   * @param params - Query parameters (apiKey, Id/id, type)
   * @returns Promise<any> - State/District/Block/Village data
   */
  async getStateDistrictBlockVillage(params: { apiKey: string; Id?: string | number; id?: string | number; type: string }): Promise<any> {
    try {
      this.logger.log(`Fetching state/district/block/village with params: ${JSON.stringify(params)}`);

      // Support both 'Id' and 'id' (case-insensitive)
      const idValue = params.Id || params.id || 0;

      const queryParams: Record<string, any> = {
        apiKey: params.apiKey,
        id: idValue, // Use lowercase 'id' to match the API
        type: params.type,
      };

      // Build query string for curl
      const queryString = new URLSearchParams(queryParams as any).toString();
      const fullUrl = `${URL_CONFIG.GET_STATE_DISTRICT_BLOCK_VILLAGE_URL}?${queryString}`;

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "Accept: application/json, text/plain, */*"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.GET_STATE_DISTRICT_BLOCK_VILLAGE_URL,
        queryParams,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch state/district/block/village data',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched state/district/block/village data. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.getStateDistrictBlockVillage:', error);
      this.logger.error(`Error fetching state/district/block/village data: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch state/district/block/village data',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update order status after payment gateway
   * 
   * @param params - Query parameters (AllOrderids, PaymentStatus)
   * @returns Promise<any> - Raw response
   */
  async updateOrderStatusAfterPaymentGateway(params: { AllOrderids: string; PaymentStatus: string }): Promise<any> {
    try {
      this.logger.log(`Updating order status with params: ${JSON.stringify(params)}`);

      const queryParams = {
        AllOrderids: params.AllOrderids,
        PaymentStatus: params.PaymentStatus,
      };

      const queryString = new URLSearchParams(queryParams as any).toString();
      const fullUrl = `${URL_CONFIG.UPDATE_ORDER_STATUS_URL}?${queryString}`;

      // Print curl
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.UPDATE_ORDER_STATUS_URL,
        queryParams,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to update order status',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully updated order status. Status: ${response.statusCode}`);
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.updateOrderStatusAfterPaymentGateway:', error);
      this.logger.error(`Error updating order status: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to update order status',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Complete payment request
   * 
   * @param dto - Payment completion data (flexible, allows additional fields)
   * @returns Promise<any> - Payment completion response
   */
  async completePayment(dto: CompletePaymentDto): Promise<any> {
    try {
      this.logger.log(`Completing payment with data: ${JSON.stringify(dto)}`);

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${URL_CONFIG.COMPLETE_PAYMENT_URL}" \\`);
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log(`  --data-raw '${JSON.stringify(dto)}'`);
      console.log('======================================================\n');

      // Forward the entire DTO body as-is to the external API
      const response = await this.axiosService.post(
        URL_CONFIG.COMPLETE_PAYMENT_URL,
        dto,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to complete payment',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully completed payment. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.completePayment:', error);
      this.logger.error(`Error completing payment: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to complete payment',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get order history for a farmer
   * 
   * @param params - Query parameters (Farmerid)
   * @returns Promise<any> - Order history data
   */
  async getOrderHistory(params: { Farmerid: string | number }): Promise<any> {
    try {
      this.logger.log(`Fetching order history with params: ${JSON.stringify(params)}`);

      const queryParams: Record<string, any> = {
        Farmerid: params.Farmerid,
      };

      // Build query string for curl
      const queryString = new URLSearchParams(queryParams as any).toString();
      const fullUrl = `${URL_CONFIG.ORDER_HISTORY_URL}?${queryString}`;

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.ORDER_HISTORY_URL,
        queryParams,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch order history',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched order history. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.getOrderHistory:', error);
      this.logger.error(`Error fetching order history: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch order history',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get product cancel status reasons
   * 
   * @param params - Query parameters (typeid)
   * @returns Promise<any> - Cancel reason data
   */
  async getProductCancelStatus(params: { typeid: string | number }): Promise<any> {
    try {
      this.logger.log(`Fetching product cancel status with params: ${JSON.stringify(params)}`);

      const queryParams: Record<string, any> = {
        typeid: params.typeid,
      };

      const queryString = new URLSearchParams(queryParams as any).toString();
      const fullUrl = `${URL_CONFIG.PRODUCT_CANCEL_STATUS_URL}?${queryString}`;

      // Print curl
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.PRODUCT_CANCEL_STATUS_URL,
        queryParams,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch product cancel status',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched product cancel status. Status: ${response.statusCode}`);
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.getProductCancelStatus:', error);
      this.logger.error(`Error fetching product cancel status: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch product cancel status',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get order status
   * 
   * @param params - Query parameters (recordid, orderid)
   * @returns Promise<any> - Order status data
   */
  async getOrderStatus(params: { recordid: string | number; orderid: string | number }): Promise<any> {
    try {
      this.logger.log(`Fetching order status with params: ${JSON.stringify(params)}`);

      const queryParams: Record<string, any> = {
        recordid: params.recordid,
        orderid: params.orderid,
      };

      // Build query string for curl
      const queryString = new URLSearchParams(queryParams as any).toString();
      const fullUrl = `${URL_CONFIG.ORDER_STATUS_URL}?${queryString}`;

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${fullUrl}" \\`);
      console.log('  -H "accept: application/json, text/plain, */*"');
      console.log('======================================================\n');

      const response = await this.axiosService.get(
        URL_CONFIG.ORDER_STATUS_URL,
        queryParams,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to fetch order status',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully fetched order status. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.getOrderStatus:', error);
      this.logger.error(`Error fetching order status: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to fetch order status',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Cancel order with reason
   * 
   * @param dto - Cancel reason data (flexible, allows additional fields)
   * @returns Promise<any> - Cancel order response
   */
  async cancelOrderWithReason(dto: CancelReasonDto): Promise<any> {
    try {
      this.logger.log(`Canceling order with reason: ${JSON.stringify(dto)}`);

      // Print curl command before making the request
      console.log('\n==================== CURL COMMAND ====================');
      console.log(`curl -L "${URL_CONFIG.CANCEL_REASON_URL}" \\`);
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -H "accept: application/json, text/plain, */*" \\');
      console.log(`  --data-raw '${JSON.stringify(dto)}'`);
      console.log('======================================================\n');

      // Forward the entire DTO body as-is to the external API
      const response = await this.axiosService.post(
        URL_CONFIG.CANCEL_REASON_URL,
        dto,
        undefined,
        this.requestTimeout,
      );

      if (!response.success) {
        throw new HttpException(
          this.axiosService.createErrorResponse(
            'Failed to cancel order',
            ERROR_CODES.EXTERNAL_API_ERROR,
            response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            response.error,
          ),
          response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`Successfully canceled order. Status: ${response.statusCode}`);

      // Return the raw response from the API without modification
      return response.data;
    } catch (error) {
      console.error('Error in ProductsService.cancelOrderWithReason:', error);
      this.logger.error(`Error canceling order: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        this.axiosService.createErrorResponse(
          'Failed to cancel order',
          ERROR_CODES.EXTERNAL_API_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
