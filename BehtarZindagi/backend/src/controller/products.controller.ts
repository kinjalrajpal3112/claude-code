import { Controller, Get, Query, ValidationPipe, HttpException, HttpStatus, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { ProductsService } from '../service/products.service';
import { GetProductsDto, GetProductsByCategoryDto, VideosQueryDto, ProductDetailsDto, RelatedProductsDto, PriceRangeSearchDto, AddToCartDto, CreateOrderDto, MapPartnerOrderDto, AcceptPaymentDto, UpdateFarmerDataDto, CompletePaymentDto, CancelReasonDto, VerifyCouponDto, GetTopSellingDto } from '../dto';
import { ERROR_CODES, URL_CONFIG } from '../constants';

/**
 * Products Controller
 * 
 * @route /api/products
 * @description Handles all product-related API endpoints
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Get main categories
   * 
   * @route GET /api/products/categories
   * @description Retrieves main product categories from external API
   * @returns Promise<any> - Categories data
   * 
   * @example
   * GET /api/products/categories
   * 
   * External API: https://behtarzindagi.in/BZFarmerApp_Live/api/Category/Get_MainCategory
   */
  @Get('categories')
  async getMainCategories() {
    try {
      console.log(`\n📋 [Products API] GET /api/products/categories`);
      console.log(`   External API: ${URL_CONFIG.CATEGORIES_URL}`);
      return await this.productsService.getMainCategories();
    } catch (error) {
      console.error('Error in ProductsController.getMainCategories:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch categories',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get related products
   * 
   * @route GET /api/products/related
   * @description Retrieves related products based on product name
   * @param query - Related products query parameters
   * @returns Promise<any> - Related products data
   * 
   * @example
   * GET /api/products/related?ProductName=Automat-Harit-Raingun-Sprinkler-PELICAN-1-point-5-Inch-Female
   */
  @Get('related')
  async getRelatedProducts(
    @Query(new ValidationPipe({ transform: true })) query: RelatedProductsDto,
  ) {
    try {
      return await this.productsService.getRelatedProducts(query);
    } catch (error) {
      console.error('Error in ProductsController.getRelatedProducts:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch related products',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get products by category
   * 
   * @route POST /api/products/by-category
   * @description Retrieves products filtered by category ID with pagination
   * @param dto - Products by category query parameters
   * @returns Promise<any> - Products data filtered by category
   * 
   * @example
   * POST /api/products/by-category
   * {
   *   "PageIndex": 1,
   *   "PageSize": 12,
   *   "CategoryId": "26"
   * }
   * 
   * External API: https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetAllProductsByCatogory
   */
  @Post('by-category')
  async getProductsByCategory(@Body(ValidationPipe) dto: GetProductsByCategoryDto) {
    try {
      console.log(`\n📋 [Products API] POST /api/products/by-category`);
      console.log(`   External API: ${URL_CONFIG.PRODUCTS_BY_CATEGORY_URL}`);
      console.log(`   Request body:`, JSON.stringify(dto, null, 2));
      return await this.productsService.getProductsByCategory(dto);
    } catch (error) {
      console.error('Error in ProductsController.getProductsByCategory:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch products by category',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all products with pagination
   * 
   * @route GET /api/products
   * @description Fetches products from external API with pagination support
   * @param query - Pagination parameters (pageIndex, pageSize)
   * @returns Promise<any> - Products data with pagination info
   * 
   * @example
   * GET /api/products?pageIndex=1&pageSize=8
   */
  @Get()
  async fetchProductsWithPagination(
    @Query(new ValidationPipe({ transform: true })) query: GetProductsDto,
  ) {
    try {
      return await this.productsService.fetchProductsWithPagination(query);
    } catch (error) {
      console.error('Error in ProductsController.fetchProductsWithPagination:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch products',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get product details
   * 
   * @route POST /api/products/details
   * @description Retrieves detailed information about a specific product
   * @param query - Product details query parameters
   * @returns Promise<any> - Product details data
   * 
   * @example
   * POST /api/products/details
   * {
   *   "deviceId": "",
   *   "gcmId": "",
   *   "ProductId": 55555,
   *   "DistrictId": 555,
   *   "slug": "Automat-Harit-Raingun-Sprinkler-PELICAN-1-point-5-Inch-Female",
   *   "lat": "0.0",
   *   "lon": "0.0"
   * }
   */
  @Post('details')
  async getProductDetails(@Body(ValidationPipe) query: ProductDetailsDto) {
    try {
      return await this.productsService.getProductDetails(query);
    } catch (error) {
      console.error('Error in ProductsController.getProductDetails:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch product details',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get short videos URLs
   * 
   * @route POST /api/products/videos
   * @description Retrieves short videos URLs with pagination
   * @param query - Videos query parameters
   * @returns Promise<any> - Videos data with pagination
   * 
   * @example
   * POST /api/products/videos
   * {
   *   "page": 1,
   *   "PageSize": 4,
   *   "HashTagId": 0
   * }
   */
  @Post('videos')
  async getShortVideosUrls(@Body(ValidationPipe) query: VideosQueryDto) {
    try {
      return await this.productsService.getShortVideosUrls(query);
    } catch (error) {
      console.error('Error in ProductsController.getShortVideosUrls:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch videos',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get products by price range
   * 
   * @route GET /api/products/search-by-price
   * @description Retrieves products filtered by price range and optional search text
   * @param query - Price range search query parameters
   * @returns Promise<any> - Products data filtered by price range
   * 
   * @example
   * GET /api/products/search-by-price?SearchText=milking&MinPrice=7000&MaxPrice=10000
   */
  @Get('search-by-price')
  async getProductsByPriceRange(
    @Query(new ValidationPipe({ 
      transform: true, 
      transformOptions: { 
        enableImplicitConversion: true 
      },
      skipMissingProperties: true
    })) query: PriceRangeSearchDto,
  ) {
    try {
      console.log('Received query params:', JSON.stringify(query));
      return await this.productsService.getProductsByPriceRange(query);
    } catch (error) {
      console.error('Error in ProductsController.getProductsByPriceRange:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch products by price range',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get cart items for a user
   * 
   * @route GET /api/products/cart-items
   * @description Retrieves cart items for a user by mobile number
   * @param mobileNo - User mobile number
   * @returns Promise<any> - Cart items data
   * 
   * @example
   * GET /api/products/cart-items?MobileNo=9871560356
   */
  @Get('cart-items')
  async getCartItems(@Query('MobileNo') mobileNo: string) {
    try {
      return await this.productsService.getCartItems(mobileNo);
    } catch (error) {
      console.error('Error in ProductsController.getCartItems:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch cart items',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Add or remove item to/from cart
   * 
   * @route POST /api/products/cart
   * @description Adds or removes an item from the user's cart
   * @param dto - Add/Remove to cart data transfer object
   * @returns Promise<any> - Cart operation response
   * 
   * @example Add item to cart:
   * POST /api/products/cart
   * {
   *   "InType": "Add",
   *   "MobileNo": 9871560356,
   *   "BzProductId": 17876,
   *   "Quantity": 1
   * }
   * 
   * @example Remove item from cart:
   * POST /api/products/cart
   * {
   *   "InType": "Remove",
   *   "MobileNo": 9871560356,
   *   "BzProductId": 9840
   * }
   */
  @Post('cart')
  async addToCart(@Body(ValidationPipe) dto: AddToCartDto) {
    try {
      return await this.productsService.addToCart(dto);
    } catch (error) {
      const action = dto.InType === 'Add' ? 'add' : 'remove';
      console.error(`Error in ProductsController.addToCart:`, error);
      throw new HttpException(
        {
          success: false,
          message: `Failed to ${action} item to cart`,
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get farmer address
   * 
   * @route GET /api/products/farmer-address
   * @description Retrieves farmer address by FarmerID (and optional Version)
   * @param Version - API version (optional)
   * @param FarmerID - Farmer ID (required)
   */
  @Get('farmer-address')
  async getFarmerAddress(
    @Query('Version') Version: string,
    @Query('FarmerID') FarmerID: string,
  ) {
    try {
      return await this.productsService.getFarmerAddress({ Version, FarmerID });
    } catch (error) {
      console.error('Error in ProductsController.getFarmerAddress:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch farmer address',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all active coupons
   * 
   * @route GET /api/products/active-coupons
   * @description Retrieves all active coupons by PackageId
   * @param PackageId - Package Id (required)
   */
  @Get('active-coupons')
  async getAllActiveCoupons(
    @Query('PackageId') PackageId: string,
  ) {
    try {
      return await this.productsService.getAllActiveCoupons({ PackageId });
    } catch (error) {
      console.error('Error in ProductsController.getAllActiveCoupons:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch active coupons',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify coupon availability
   *
   * @route GET /api/products/verify-coupon
   * @description Verifies coupon validity for a given package and user
   * @param query - Coupon verification query parameters
   * @returns Promise<any> - Coupon verification response
   *
   * @example
   * GET /api/products/verify-coupon?AgentId=962637&PackageId=16561&CouponCode=BZ3&quantity=1&TxnValue=650
   */
  @Get('verify-coupon')
  async verifyCoupon(
    @Query(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    })) query: VerifyCouponDto,
  ) {
    try {
      console.log(`\n📋 [Products API] GET /api/products/verify-coupon`);
      console.log(`   Query params:`, JSON.stringify(query));
      return await this.productsService.verifyCoupon(query);
    } catch (error) {
      console.error('Error in ProductsController.verifyCoupon:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to verify coupon',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get top selling products
   *
   * @route GET /api/products/top-selling
   * @description Retrieves top selling products, optionally filtered by category
   * @param query - Top selling query parameters
   * @returns Promise<any> - Top selling products data
   *
   * @example
   * GET /api/products/top-selling?Category=1
   */
  @Get('top-selling')
  async getTopSellingProducts(
    @Query(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      skipMissingProperties: true,
    })) query: GetTopSellingDto,
  ) {
    try {
      console.log(`\n📋 [Products API] GET /api/products/top-selling`);
      console.log(`   Query params:`, JSON.stringify(query));
      return await this.productsService.getTopSellingProducts(query);
    } catch (error) {
      console.error('Error in ProductsController.getTopSellingProducts:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch top selling products',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create order with cart checkout
   * 
   * @route POST /api/products/create-order
   * @description Creates an order with cart checkout (flexible DTO - accepts all fields)
   * @param dto - Order creation data (accepts any fields from the request body)
   * @returns Promise<any> - Order creation response
   * 
   * @example
   * POST /api/products/create-order
   * {
   *   "Farmer": {
   *     "FarmerId": 962637,
   *     "FarmerName": "eee",
   *     "Mobile": 9871560356,
   *     "Address": "Gangtok",
   *     "VillageId": 779618,
   *     "BlockId": 155377,
   *     "DistrictId": 1167,
   *     "StateId": 37,
   *     "PinCode": "110083"
   *   },
   *   "userid": 0,
   *   "farmerId": 962637,
   *   "apiKey": "123",
   *   "AdvancePayment": 0,
   *   "RemainingPayment": 0,
   *   "Amount": 1400,
   *   "ModeOfPayment": "online_payment",
   *   "Product": [{
   *     "PackageId": 21717,
   *     "Quantity": 1,
   *     "RecordId": 13256,
   *     "COD": 1400,
   *     "onlinePrice": 1400,
   *     "SellerId": 0
   *   }]
   * }
   */
  @Post('create-order')
  async createOrder(@Body() dto: CreateOrderDto) {
    try {
      return await this.productsService.createOrder(dto);
    } catch (error) {
      console.error('Error in ProductsController.createOrder:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create order',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Map partner order details with third party user ID
   * 
   * @route POST /api/products/map-partner-order
   * @description Maps partner order details (flexible DTO - accepts all fields)
   * @param dto - Partner order mapping data (accepts any fields from the request body)
   * @returns Promise<any> - Partner order mapping response
   * 
   * @example
   * POST /api/products/map-partner-order
   * {
   *   "FarmerId": 962637,
   *   "OrderID": 859438,
   *   "PartnershipAdminID": "",
   *   "PartnershipID": ""
   * }
   */
  @Post('map-partner-order')
  async mapPartnerOrder(@Body() dto: MapPartnerOrderDto) {
    try {
      return await this.productsService.mapPartnerOrder(dto);
    } catch (error) {
      console.error('Error in ProductsController.mapPartnerOrder:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to map partner order',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Accept customer payment request
   * 
   * @route POST /api/products/accept-payment
   * @description Accepts customer payment request (flexible DTO - accepts all fields)
   * @param dto - Payment request data (accepts any fields from the request body)
   * @returns Promise<any> - Payment acceptance response
   * 
   * @example
   * POST /api/products/accept-payment
   * {
   *   "address": "Gangtok",
   *   "amount": 450,
   *   "contactNumber": 9871560356,
   *   "email": null,
   *   "name": "eee"
   * }
   */
  @Post('accept-payment')
  async acceptPayment(@Body() dto: AcceptPaymentDto) {
    try {
      return await this.productsService.acceptPayment(dto);
    } catch (error) {
      console.error('Error in ProductsController.acceptPayment:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to accept payment',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update farmer data
   * 
   * @route POST /api/products/update-farmer-data
   * @description Updates farmer details (flexible DTO - accepts all fields)
   * @param dto - Farmer data update (accepts any fields from the request body)
   * @returns Promise<any> - Farmer update response
   * 
   * @example
   * POST /api/products/update-farmer-data
   * {
   *   "Fname": "Test",
   *   "Lname": "Test",
   *   "Mobile": 9871560356,
   *   "StateId": 20,
   *   "DistrictId": 555,
   *   "BlockId": 156452,
   *   "VillageId": 787161,
   *   "Address": "405, 4th Floor, Ansal Bhawan, 16, KG Marg, opposite British Council, Barakhamba, New Delhi, Delhi 110001",
   *   "FarmerId": 962637,
   *   "PinCode": "110001",
   *   "RefSource": "",
   *   "apiKey": "123",
   *   "userid": 962637
   * }
   */
  @Post('update-farmer-data')
  async updateFarmerData(@Body() dto: UpdateFarmerDataDto) {
    try {
      return await this.productsService.updateFarmerData(dto);
    } catch (error) {
      console.error('Error in ProductsController.updateFarmerData:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update farmer data',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get State, District, Block, or Village data
   * 
   * @route GET /api/products/state-district-block-village
   * @description Retrieves State/District/Block/Village data based on type
   * @param apiKey - API key (required)
   * @param id - ID of the entity (optional, defaults to 0 for States)
   * @param type - Type: 'S' for States, 'D' for District, 'B' for Block, 'V' for Village (required)
   * @returns Promise<any> - State/District/Block/Village data
   * 
   * @example Get States:
   * GET /api/products/state-district-block-village?apiKey=123&id=0&type=S
   * 
   * @example Get District:
   * GET /api/products/state-district-block-village?apiKey=123&id=20&type=D
   * 
   * @example Get Block:
   * GET /api/products/state-district-block-village?apiKey=123&id=555&type=B
   * 
   * @example Get Village:
   * GET /api/products/state-district-block-village?apiKey=123&id=156240&type=V
   */
  @Get('state-district-block-village')
  async getStateDistrictBlockVillage(
    @Query('apiKey') apiKey: string,
    @Query('Id') Id: number = 0,
    @Query('type') type: string,
  ) {
    try {
      return await this.productsService.getStateDistrictBlockVillage({ apiKey, Id, type });
    } catch (error) {
      console.error('Error in ProductsController.getStateDistrictBlockVillage:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch state/district/block/village data',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update order status after payment gateway
   * 
   * @route GET /api/products/update-order-status
   * @description Updates order status with AllOrderids and PaymentStatus
   * @example
   * GET /api/products/update-order-status?AllOrderids=859646&PaymentStatus=CANCEL
   */
  @Get('update-order-status')
  async updateOrderStatusAfterPaymentGateway(
    @Query('AllOrderids') AllOrderids: string,
    @Query('PaymentStatus') PaymentStatus: string,
  ) {
    try {
      return await this.productsService.updateOrderStatusAfterPaymentGateway({ AllOrderids, PaymentStatus });
    } catch (error) {
      console.error('Error in ProductsController.updateOrderStatusAfterPaymentGateway:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update order status',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Complete payment request
   * 
   * @route POST /api/products/complete-payment
   * @description Completes payment request with Razorpay payment details (flexible DTO - accepts all fields)
   * @param dto - Payment completion data (accepts any fields from the request body)
   * @returns Promise<any> - Payment completion response
   * 
   * @example
   * POST /api/products/complete-payment
   * {
   *   "rzp_paymentid": "pay_Ra2fajLsV42Yh8",
   *   "rzp_orderid": "order_Ra2fR5a550o3By",
   *   "rzp_Signature": "59993b39ec0275cc11034b66044ca9dc8e904499f4f2e78a02b5b65a6c56ee18",
   *   "farmerId": 962637,
   *   "bz_orderid": 859655,
   *   "amount": 34200
   * }
   */
  @Post('complete-payment')
  async completePayment(@Body() dto: CompletePaymentDto) {
    try {
      return await this.productsService.completePayment(dto);
    } catch (error) {
      console.error('Error in ProductsController.completePayment:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to complete payment',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get order history for a farmer
   * 
   * @route GET /api/products/order-history
   * @description Retrieves order history for a farmer by Farmerid
   * @param Farmerid - Farmer ID (required)
   * @returns Promise<any> - Order history data
   * 
   * @example
   * GET /api/products/order-history?Farmerid=962637
   */
  @Get('order-history')
  async getOrderHistory(
    @Query('Farmerid') Farmerid: string,
  ) {
    try {
      return await this.productsService.getOrderHistory({ Farmerid });
    } catch (error) {
      console.error('Error in ProductsController.getOrderHistory:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch order history',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get product cancel status reasons
   * 
   * @route GET /api/products/product-cancel-status
   * @description Retrieves cancel reasons for a product by typeid
   * @param typeid - Type ID (required)
   * @returns Promise<any> - Cancel reason data
   * 
   * @example
   * GET /api/products/product-cancel-status?typeid=1
   */
  @Get('product-cancel-status')
  async getProductCancelStatus(
    @Query('typeid') typeid: string,
  ) {
    try {
      return await this.productsService.getProductCancelStatus({ typeid });
    } catch (error) {
      console.error('Error in ProductsController.getProductCancelStatus:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch product cancel status',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get order status
   * 
   * @route GET /api/products/order-status
   * @description Retrieves order status by recordid and orderid
   * @param recordid - Record ID (required)
   * @param orderid - Order ID (required)
   * @returns Promise<any> - Order status data
   * 
   * @example
   * GET /api/products/order-status?recordid=998537&orderid=859813
   */
  @Get('order-status')
  async getOrderStatus(
    @Query('recordid') recordid: string,
    @Query('orderid') orderid: string,
  ) {
    try {
      return await this.productsService.getOrderStatus({ recordid, orderid });
    } catch (error) {
      console.error('Error in ProductsController.getOrderStatus:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch order status',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // bezai

  /**
   * Cancel order with reason
   * 
   * @route POST /api/products/cancel-order
   * @description Cancels an order with a reason (flexible DTO - accepts all fields)
   * @param dto - Cancel reason data (accepts any fields from the request body)
   * @returns Promise<any> - Cancel order response
   * 
   * @example
   * POST /api/products/cancel-order
   * {
   *   "CancelReason": "Rate Issue",
   *   "CancelReasonId": 67,
   *   "FarmerId": 962637,
   *   "RecordId": 998548,
   *   "TypeId": 1
   * }
   */
  @Post('cancel-order')
  async cancelOrderWithReason(@Body() dto: CancelReasonDto) {
    try {
      return await this.productsService.cancelOrderWithReason(dto);
    } catch (error) {
      console.error('Error in ProductsController.cancelOrderWithReason:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to cancel order',
          error: error.message,
          errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
          timestamp: new Date().toISOString(),
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
