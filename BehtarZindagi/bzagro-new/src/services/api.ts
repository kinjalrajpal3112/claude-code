// API Service - Uses Next.js API Routes
// All routes proxy to behtarzindagi.in

export interface Product {
  ProductID?: number;
  ProductId?: number;
  PackageID: number;
  ProductName?: string;
  ProductName_English?: string;
  ProductName_Hindi?: string;
  ProductHindiName?: string;
  UnitName: string;
  OurPrice: number;
  OnlinePrice: string | number;
  MRP: number;
  COD?: number;
  CODPrice?: number;
  OfferDiscount: string;
  ImagePath: string;
  OutOfStock?: boolean;
  RatingStar?: number | null;
  CategoryName?: string;
  CategoryID?: number;
  BrandName?: string;
  BrandID?: number;
  Description?: string;
  SlugUrl?: string | null;
  RowNumber: number;
}

export interface Category {
  CategoryId: number;
  Categoryname: string;
  CategoryHindi: string;
  isKGP_Category: number;
  ImageUrl: string;
  App_Image: string;
  DisplayOrdering: number;
  slug: string;
}

// ============ API SERVICE ============
export const api = {
  
  // ============ PRODUCTS ============
  
  async getTopSelling(pageSize: number = 12) {
    try {
      const response = await fetch(`/api/products/top-selling?PageSize=${pageSize}`);
      const data = await response.json();
      console.log('Top Selling Response:', data);
      return data;
    } catch (error) {
      console.error('getTopSelling error:', error);
      return null;
    }
  },

  async getProducts(pageIndex: number = 1, pageSize: number = 20) {
    try {
      const response = await fetch(`/api/products?PageIndex=${pageIndex}&PageSize=${pageSize}`);
      const data = await response.json();
      console.log('Products Response:', data);
      return data;
    } catch (error) {
      console.error('getProducts error:', error);
      return null;
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`/api/products/categories`);
      const data = await response.json();
      console.log('Categories Response:', data);
      return data;
    } catch (error) {
      console.error('getCategories error:', error);
      return null;
    }
  },

  async getProductDetails(packageId: number) {
    try {
      const response = await fetch(`/api/products/details?PackageId=${packageId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Product Details API Error:', errorData);
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`,
          message: errorData.message || 'Failed to fetch product details',
          data: null
        };
      }
      
      const data = await response.json();
      console.log('Product Details Response:', data);
      return data;
    } catch (error) {
      console.error('getProductDetails error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product details',
        data: null
      };
    }
  },

  async searchProducts(query: string, minPrice: number = 0, maxPrice: number = 0, mobNo?: string, deviceId?: string) {
    try {
      const params = new URLSearchParams();
      params.append('SearchText', query);
      params.append('MinPrice', minPrice.toString());
      params.append('MaxPrice', maxPrice.toString());
      params.append('MobNo', mobNo || 'null');
      params.append('DeviceId', deviceId || 'null');
      
      const response = await fetch(`/api/products/search?${params.toString()}`);
      const data = await response.json();
      console.log('Search Response:', data);
      return data;
    } catch (error) {
      console.error('searchProducts error:', error);
      return null;
    }
  },

  async getProductsByCategory(categoryId: number, pageIndex: number = 1, pageSize: number = 12) {
    try {
      const response = await fetch(`/api/products/by-category?CategoryId=${categoryId}&PageIndex=${pageIndex}&PageSize=${pageSize}`);
      const data = await response.json();
      console.log('Products by Category Response:', data);
      return data;
    } catch (error) {
      console.error('getProductsByCategory error:', error);
      return null;
    }
  },

  // ============ VIDEOS ============

  async getVideos(pageIndex: number = 1, pageSize: number = 20) {
    try {
      const response = await fetch(`/api/videos?PageIndex=${pageIndex}&PageSize=${pageSize}`);
      const data = await response.json();
      console.log('Videos Response:', data);
      return data;
    } catch (error) {
      console.error('getVideos error:', error);
      return null;
    }
  },

  // ============ CART ============

  async getCartItems(mobileNo: string | number) {
    try {
      const cleanMobileNo = String(mobileNo).replace(/\D/g, '');
      const response = await fetch(`/api/bzwebsite/GetCartItems?MobileNo=${cleanMobileNo}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Get Cart Items API Error:', errorData);
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`,
          message: errorData.message || 'Failed to fetch cart items',
          CartItems: []
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('getCartItems error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cart items',
        CartItems: [] 
      };
    }
  },

  async addToCart(data: { MobileNo: number | string; BzProductId: number; Quantity?: number }) {
    try {
      const cleanMobileNo = String(data.MobileNo).replace(/\D/g, '');
      const requestBody = {
        InType: 'Add',
        MobileNo: parseInt(cleanMobileNo), // API expects integer
        BzProductId: data.BzProductId,
        ...(data.Quantity && { Quantity: data.Quantity }),
      };

      console.log('Add to cart request:', requestBody);

      const response = await fetch(`/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const responseData = await response.json();
      console.log('=== Add to Cart Service Response ===');
      console.log('Full response:', JSON.stringify(responseData, null, 2));
      console.log('Response OK:', response.ok);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Add to Cart API Error:', responseData);
        return {
          success: false,
          error: responseData.error || `HTTP ${response.status}`,
          message: responseData.message || 'Failed to add to cart',
        };
      }
      
      // Check if the API actually succeeded (some APIs return 200 but with error in body)
      const isSuccess = responseData?.success !== false 
                     && responseData?.Status !== false
                     && responseData?.Status !== 'false'
                     && !responseData?.error
                     && (responseData?.Status === true || responseData?.Status === 'true' || responseData?.success === true || responseData?._normalized);
      
      console.log('Operation success:', isSuccess);
      
      return {
        ...responseData,
        success: isSuccess,
      };
    } catch (error) {
      console.error('addToCart error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add to cart',
        message: 'Failed to add to cart. Please try again.',
      };
    }
  },

  async removeFromCart(data: { MobileNo: number | string; BzProductId: number }) {
    try {
      const cleanMobileNo = String(data.MobileNo).replace(/\D/g, '');
      const requestBody = {
        InType: 'Remove',
        MobileNo: parseInt(cleanMobileNo),
        BzProductId: data.BzProductId,
      };

      const response = await fetch(`/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Remove from Cart API Error:', errorData);
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`,
          message: errorData.message || 'Failed to remove from cart',
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('removeFromCart error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove from cart',
        message: 'Failed to remove from cart. Please try again.',
      };
    }
  },

  // ============ AUTH ============

  async sendOTP(mobile: string, name: string = 'User') {
    try {
      const cleanMobile = mobile.replace(/\D/g, ''); // Remove non-digits
      const response = await fetch(`/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Mobile: cleanMobile,
          Number: cleanMobile,
          Name: name,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Send OTP API Error:', errorData);
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`,
          message: errorData.message || 'Failed to send OTP',
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('sendOTP error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send OTP',
        message: 'Failed to send OTP. Please try again.',
      };
    }
  },

  async verifyOTP(mobile: string, otp: string, name: string = 'User') {
    try {
      const cleanMobile = mobile.replace(/\D/g, ''); // Remove non-digits
      const cleanOtp = otp.replace(/\D/g, ''); // Remove non-digits
      
      const response = await fetch(`/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Mobile: cleanMobile,
          Number: cleanMobile,
          OTP: cleanOtp,
          Otp: cleanOtp,
          Name: name,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Verify OTP API Error:', errorData);
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`,
          message: errorData.message || 'Failed to verify OTP',
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('verifyOTP error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
        message: 'Failed to verify OTP. Please try again.',
      };
    }
  },

  // ============ RELATED PRODUCTS ============

  async getRelatedProducts(packageId?: number, categoryId?: number) {
    try {
      const params = new URLSearchParams();
      if (packageId) params.append('PackageId', packageId.toString());
      if (categoryId) params.append('CategoryId', categoryId.toString());
      
      const response = await fetch(`/api/products/related?${params.toString()}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('getRelatedProducts error:', error);
      return { success: false, error: 'Failed to fetch related products', data: [] };
    }
  },

  // ============ ORDERS ============

  async createOrder(orderData: any) {
    try {
      const response = await fetch(`/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('createOrder error:', error);
      return { success: false, error: 'Failed to create order' };
    }
  },

  async getOrderHistory(mobileNo: string | number) {
    try {
      const cleanMobileNo = String(mobileNo).replace(/\D/g, '');
      const response = await fetch(`/api/orders/history?MobileNo=${cleanMobileNo}`);
      return await response.json();
    } catch (error) {
      console.error('getOrderHistory error:', error);
      return { success: false, error: 'Failed to fetch order history', data: [] };
    }
  },

  async getOrderStatus(orderId: string | number) {
    try {
      const response = await fetch(`/api/orders/status?OrderId=${orderId}`);
      return await response.json();
    } catch (error) {
      console.error('getOrderStatus error:', error);
      return { success: false, error: 'Failed to fetch order status', data: null };
    }
  },

  async updateOrderStatusAfterPayment(paymentData: any) {
    try {
      const response = await fetch(`/api/orders/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      return await response.json();
    } catch (error) {
      console.error('updateOrderStatusAfterPayment error:', error);
      return { success: false, error: 'Failed to update order status' };
    }
  },

  async getCancelReasons() {
    try {
      const response = await fetch(`/api/orders/cancel-reason`);
      return await response.json();
    } catch (error) {
      console.error('getCancelReasons error:', error);
      return { success: false, error: 'Failed to fetch cancel reasons', data: [] };
    }
  },

  // ============ PAYMENTS ============

  async acceptPayment(paymentData: any) {
    try {
      const response = await fetch(`/api/payments/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      return await response.json();
    } catch (error) {
      console.error('acceptPayment error:', error);
      return { success: false, error: 'Failed to accept payment' };
    }
  },

  async completePayment(paymentData: any) {
    try {
      const response = await fetch(`/api/payments/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      return await response.json();
    } catch (error) {
      console.error('completePayment error:', error);
      return { success: false, error: 'Failed to complete payment' };
    }
  },

  // ============ FARMER & LOCATION ============

  async getFarmerAddress(mobileNo: string | number) {
    try {
      const cleanMobileNo = String(mobileNo).replace(/\D/g, '');
      const response = await fetch(`/api/farmer/address?MobileNo=${cleanMobileNo}`);
      return await response.json();
    } catch (error) {
      console.error('getFarmerAddress error:', error);
      return { success: false, error: 'Failed to fetch farmer address', data: null };
    }
  },

  async updateFarmerData(farmerData: any) {
    try {
      const response = await fetch(`/api/farmer/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmerData)
      });
      return await response.json();
    } catch (error) {
      console.error('updateFarmerData error:', error);
      return { success: false, error: 'Failed to update farmer data' };
    }
  },

  async getLocationData(stateId?: number, districtId?: number, blockId?: number) {
    try {
      const params = new URLSearchParams();
      if (stateId) params.append('StateId', stateId.toString());
      if (districtId) params.append('DistrictId', districtId.toString());
      if (blockId) params.append('BlockId', blockId.toString());
      
      const response = await fetch(`/api/farmer/location?${params.toString()}`);
      return await response.json();
    } catch (error) {
      console.error('getLocationData error:', error);
      return { success: false, error: 'Failed to fetch location data', data: [] };
    }
  },

  // ============ COUPONS ============

  async getActiveCoupons() {
    try {
      const response = await fetch(`/api/coupons/active`);
      return await response.json();
    } catch (error) {
      console.error('getActiveCoupons error:', error);
      return { success: false, error: 'Failed to fetch active coupons', data: [] };
    }
  },

  async getProductCancelStatus(orderId: string | number) {
    try {
      const response = await fetch(`/api/products/cancel-status?OrderId=${orderId}`);
      return await response.json();
    } catch (error) {
      console.error('getProductCancelStatus error:', error);
      return { success: false, error: 'Failed to fetch product cancel status', data: null };
    }
  },

  // ============ PARTNER ORDERS ============

  async mapPartnerOrder(orderData: any) {
    try {
      const response = await fetch(`/api/partner/order-map`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('mapPartnerOrder error:', error);
      return { success: false, error: 'Failed to map partner order' };
    }
  },
};

export default api;
