/**
 * URL Configuration - BEHTARZINDAGI.IN SERVER
 * Fixed with correct working API endpoints
 */

export interface UrlConfig {
  BASE_URL: string;
  BASE_URL_NEW: string;
  BASE_URL_NEW1: string;
  BASE_URL_ORDER: string;
  BASE_URL_LOGIN: string;
  BASE_URL_FARMER_APP: string;
  OTP_SEND_URL: string;
  OTP_VERIFY_URL: string;
  PRODUCTS_URL: string;
  CATEGORIES_URL: string;
  VIDEOS_URL: string;
  PRODUCT_DETAILS_URL: string;
  RELATED_PRODUCTS_URL: string;
  PRICE_RANGE_SEARCH_URL: string;
  PRODUCTS_BY_CATEGORY_URL: string;
  CART_ITEMS_URL: string;
  ADD_TO_CART_URL: string;
  FARMER_ADDRESS_URL: string;
  ACTIVE_COUPONS_URL: string;
  COUPON_VALIDITY_URL: string;
  TOP_SELLING_PRODUCTS_URL: string;
  ORDER_CREATE_URL: string;
  MAP_PARTNER_ORDER_URL: string;
  ACCEPT_PAYMENT_URL: string;
  UPDATE_FARMER_DATA_URL: string;
  GET_STATE_DISTRICT_BLOCK_VILLAGE_URL: string;
  UPDATE_ORDER_STATUS_URL: string;
  COMPLETE_PAYMENT_URL: string;
  ORDER_HISTORY_URL: string;
  PRODUCT_CANCEL_STATUS_URL: string;
  ORDER_STATUS_URL: string;
  CANCEL_REASON_URL: string;
}

// ========== BEHTARZINDAGI.IN SERVER - WORKING URLs ==========
const BZ_API_BASE = "https://behtarzindagi.in/BZFarmerApp_Live/api";
const BZ_LOGIN_BASE = "https://behtarzindagi.in";
const BZ_TRACTOR_BASE = "https://behtarzindagi.in/Tractor_Api_Test";
const BZ_FARMER_APP = "https://behtarzindagi.in/bz_FarmerApp/ProductDetail.svc";

export const URL_CONFIG: UrlConfig = {
  BASE_URL: BZ_API_BASE,
  BASE_URL_NEW: BZ_API_BASE,
  BASE_URL_NEW1: BZ_API_BASE,
  BASE_URL_ORDER: BZ_TRACTOR_BASE,
  BASE_URL_LOGIN: BZ_LOGIN_BASE,
  BASE_URL_FARMER_APP: BZ_FARMER_APP,

  // OTP - Login
  OTP_SEND_URL: BZ_LOGIN_BASE + "/Tractor_Api_Test/api/Home/CentraliseLogin",
  OTP_VERIFY_URL: BZ_LOGIN_BASE + "/Tractor_Api_Test/api/Home/CentraliseVerifyLogin",

  // Products - WORKING URLs
  PRODUCTS_URL: BZ_API_BASE + "/Home/GetAllProducts",
  CATEGORIES_URL: BZ_API_BASE + "/Category/Get_MainCategory",
  VIDEOS_URL: BZ_API_BASE + "/BzCommonApi/GetBzShortVideosURLs",
  PRODUCT_DETAILS_URL: BZ_API_BASE + "/home/GetBZProductDetails",
  RELATED_PRODUCTS_URL: BZ_API_BASE + "/Home/GetRelatedProducts",
  PRICE_RANGE_SEARCH_URL: BZ_API_BASE + "/Livestock/GetProductsByPriceRange",
  PRODUCTS_BY_CATEGORY_URL: BZ_API_BASE + "/Home/GetAllProductsByCatogory",
  TOP_SELLING_PRODUCTS_URL: BZ_API_BASE + "/LiveStock/GetTopSellingProductsWeb",

  // Cart
  CART_ITEMS_URL: BZ_API_BASE + "/BzWebsite/GetCartItems",
  ADD_TO_CART_URL: BZ_API_BASE + "/BzWebsite/AddToCartItems",

  // Address & Coupons
  FARMER_ADDRESS_URL: BZ_API_BASE + "/Home/GetFarmerAddress",
  ACTIVE_COUPONS_URL: BZ_API_BASE + "/Home/GetAllActiveCoupons",
  COUPON_VALIDITY_URL: BZ_API_BASE + "/Home/GetCouponValidity",

  // Orders
  ORDER_CREATE_URL: BZ_API_BASE + "/LiveStock/OrderCreateWebAddToCart",
  ORDER_HISTORY_URL: BZ_API_BASE + "/Home/Get_OrderHistory",
  ORDER_STATUS_URL: BZ_API_BASE + "/Home/OrderStatus",
  PRODUCT_CANCEL_STATUS_URL: BZ_API_BASE + "/Home/ProductCancelStatus",
  CANCEL_REASON_URL: BZ_API_BASE + "/Home/CancelReason",

  // Payment - Tractor API
  MAP_PARTNER_ORDER_URL: BZ_TRACTOR_BASE + "/api/Partnership/ToMapPartnerOrderDetailsThirdPartyUserId",
  ACCEPT_PAYMENT_URL: BZ_TRACTOR_BASE + "/api/Payments/ToAcceptCustomerPaymentRequest",
  COMPLETE_PAYMENT_URL: BZ_TRACTOR_BASE + "/api/Payments/ToCompletePaymentRequest",
  UPDATE_ORDER_STATUS_URL: BZ_API_BASE + "/Home/UpdateOrderStatusAfterPaymentGetway",

  // Farmer Data
  UPDATE_FARMER_DATA_URL: BZ_FARMER_APP + "/api/UpdateFarmerData",
  GET_STATE_DISTRICT_BLOCK_VILLAGE_URL: BZ_FARMER_APP + "/api/GetStateDistrictBlockVilage",
};

export function getUrlConfig(): UrlConfig {
  return URL_CONFIG;
}

export function getUrl(key: keyof UrlConfig): string {
  return URL_CONFIG[key];
}

export function logUrlConfig(): void {
  console.log('🌐 URL Configuration:');
  console.log('Base URL:', BZ_API_BASE);
  console.log('Top Selling:', URL_CONFIG.TOP_SELLING_PRODUCTS_URL);
  console.log('Categories:', URL_CONFIG.CATEGORIES_URL);
}
