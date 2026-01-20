/**
 * API URL constants for external services
 */
export const API_URLS = {
  // BehtarZindagi API endpoints
  BEHTARZINDAGI: {
    BASE_URL: 'https://behtarzindagi.in/BZFarmerApp_Live/api',
    PRODUCTS: '/Home/GetAllProducts',
  },
  
  // Future API endpoints can be added here
  // EXAMPLE_SERVICE: {
  //   BASE_URL: 'https://api.example.com',
  //   USERS: '/users',
  //   ORDERS: '/orders',
  // },
} as const;

/**
 * HTTP headers constants
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE: {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    URL_ENCODED: 'application/x-www-form-urlencoded',
  },
  ACCEPT: {
    JSON: 'application/json, text/plain, */*',
    ALL: '*/*',
  },
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
} as const;

/**
 * Default request headers for external APIs
 */
export const DEFAULT_HEADERS = {
  'accept': HTTP_HEADERS.ACCEPT.JSON,
  'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': HTTP_HEADERS.CONTENT_TYPE.JSON,
  'origin': 'https://behtarzindagi.in',
  'referer': 'https://behtarzindagi.in/',
  'user-agent': HTTP_HEADERS.USER_AGENT,
} as const;
