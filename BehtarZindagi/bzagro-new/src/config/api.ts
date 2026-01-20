// API Configuration - Uses Next.js API Routes (built-in proxy)
export const API_CONFIG = {
  // Local Next.js API routes that proxy to behtarzindagi.in
  BASE_URL: '/api',
  
  ENDPOINTS: {
    // Products
    GET_ALL_PRODUCTS: '/products',
    GET_CATEGORIES: '/products/categories',
    GET_PRODUCT_DETAILS: '/products/details',
    TOP_SELLING: '/products/top-selling',
    
    // Cart & Orders (to be added)
    GET_CART_ITEMS: '/cart',
    CART: '/cart',
    CREATE_ORDER: '/orders/create',
    ORDER_HISTORY: '/orders/history',
    ORDER_STATUS: '/orders/status',
    
    // User
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    GET_FARMER_ADDRESS: '/user/address',
    
    // Coupons
    GET_ACTIVE_COUPONS: '/coupons',
    VERIFY_COUPON: '/coupons/verify',
  },
  
  DEFAULT_HEADERS: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
};

// Razorpay Config
export const RAZORPAY_CONFIG = {
  KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  THEME_COLOR: '#059669',
  COMPANY_NAME: 'बेहतर ज़िंदगी',
  LOGO: '/logo.png',
};

// App Config
export const APP_CONFIG = {
  PHONE: '7876400500',
  WHATSAPP: '917876400500',
  BOT_URL: 'https://behtarbot.behtarzindagi.in',
  TRACTOR_BOT_URL: '/tractor-valuation',
};
