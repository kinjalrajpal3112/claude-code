# URL Configuration System

This document explains how to use the URL configuration system for managing different environments with base URLs and dynamic path building.

## Overview

The URL configuration system provides centralized management of API endpoints using base URLs and dynamic path building for different environments (development, production, test).

## Files

- `src/config/urls.config.ts` - Main URL configuration file
- `src/config/index.ts` - Exports URL configuration
- `src/constants/index.ts` - Re-exports URL_CONFIG for easy access

## Structure

### Base URLs
The system defines base URLs for different environments:

```typescript
const BASE_URLS = {
  development: {
    BASE_URL: "http://localhost:43997/api",
    BASE_URL_NEW: "http://localhost:43997/api",
    BASE_URL_ORDER: "http://localhost:43997",
    BASE_URL_LOGIN: "https://behtarzindagi.in",
    BASE_URL_NEW1: "https://behtarzindagi.in/BZFarmerApp_Live/api",
  },
  production: {
    BASE_URL: "https://behtarzindagi.in/BZFarmerApp_Live/api",
    BASE_URL_NEW: "https://behtarzindagi.in/BZFarmerApp_Live/api",
    BASE_URL_ORDER: "https://behtarzindagi.in/Tractor_Api_Test",
    BASE_URL_LOGIN: "https://behtarzindagi.in",
    BASE_URL_NEW1: "https://behtarzindagi.in/BZFarmerApp_Live/api",
  }
};
```

### URL Paths
Common paths that are appended to base URLs:

```typescript
const URL_PATHS = {
  OTP_SEND: "/Tractor_Api_Test/api/Home/CentraliseLogin",
  OTP_VERIFY: "/Tractor_Api_Test/api/Home/CentraliseVerifyLogin",
  PRODUCTS: "/Home/GetAllProducts",
};
```

### Dynamic URL Building
Full URLs are built by combining base URLs with paths:

```typescript
// OTP_SEND_URL = BASE_URL_LOGIN + URL_PATHS.OTP_SEND
// Production: "https://behtarzindagi.in" + "/Tractor_Api_Test/api/Home/CentraliseLogin"
// Development: "https://behtarzindagi.in" + "/Tractor_Api_Test/api/Home/CentraliseLogin"
```

## Usage

### Basic Usage

```typescript
import { URL_CONFIG } from '../config';

// Use current environment URLs
const apiUrl = URL_CONFIG.BASE_URL;
const otpUrl = URL_CONFIG.OTP_SEND_URL;
```

### Environment-Specific URLs

```typescript
import { URLS } from '../config';

// Development URLs
const devUrls = URLS.DEV;
const devBaseUrl = devUrls.BASE_URL;

// Production URLs  
const prodUrls = URLS.PROD;
const prodBaseUrl = prodUrls.BASE_URL;
```

### Dynamic Environment Selection

```typescript
import { getUrlConfig, getBaseUrls } from '../config';

// Get URLs for specific environment
const devConfig = getUrlConfig('development');
const prodConfig = getUrlConfig('production');

// Get base URLs only
const devBaseUrls = getBaseUrls('development');
const prodBaseUrls = getBaseUrls('production');
```

### Helper Functions

```typescript
import { 
  getUrl, 
  getBaseUrl, 
  buildUrl, 
  isDevelopment, 
  isProduction 
} from '../config';

// Get specific URL by key
const otpUrl = getUrl('OTP_SEND_URL');

// Get base URL only
const loginBase = getBaseUrl('BASE_URL_LOGIN');

// Build URL with custom path
const customUrl = buildUrl('BASE_URL_LOGIN', '/custom/path');

// Environment checks
if (isDevelopment()) {
  console.log('Running in development');
}
```

## URL Configuration Examples

### Development Environment
```typescript
{
  BASE_URL: "http://localhost:43997/api",
  BASE_URL_NEW: "http://localhost:43997/api", 
  BASE_URL_ORDER: "http://localhost:43997",
  BASE_URL_LOGIN: "https://behtarzindagi.in",
  BASE_URL_NEW1: "https://behtarzindagi.in/BZFarmerApp_Live/api",
  OTP_SEND_URL: "https://behtarzindagi.in/Tractor_Api_Test/api/Home/CentraliseLogin",
  OTP_VERIFY_URL: "https://behtarzindagi.in/Tractor_Api_Test/api/Home/CentraliseVerifyLogin",
  PRODUCTS_URL: "https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetAllProducts"
}
```

### Production Environment
```typescript
{
  BASE_URL: "https://behtarzindagi.in/BZFarmerApp_Live/api",
  BASE_URL_NEW: "https://behtarzindagi.in/BZFarmerApp_Live/api",
  BASE_URL_ORDER: "https://behtarzindagi.in/Tractor_Api_Test", 
  BASE_URL_LOGIN: "https://behtarzindagi.in",
  BASE_URL_NEW1: "https://behtarzindagi.in/BZFarmerApp_Live/api",
  OTP_SEND_URL: "https://behtarzindagi.in/Tractor_Api_Test/api/Home/CentraliseLogin",
  OTP_VERIFY_URL: "https://behtarzindagi.in/Tractor_Api_Test/api/Home/CentraliseVerifyLogin",
  PRODUCTS_URL: "https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetAllProducts"
}
```

## Environment Detection

The system automatically detects the environment based on `NODE_ENV`:

- `development` or `dev` → Development URLs
- `production` or `prod` → Production URLs  
- `test` or `testing` → Test URLs (same as development)
- Default → Development URLs

## Services Using URL Configuration

- **OTP Service** - Uses `OTP_SEND_URL` and `OTP_VERIFY_URL`
- **Products Service** - Uses `PRODUCTS_URL`

## Adding New URLs

To add new URLs:

1. Add the base URL to `BASE_URLS` for each environment
2. Add the path to `URL_PATHS` if it's a common path
3. Add the full URL to the `UrlConfig` interface
4. Update the `getUrlConfig` function to build the new URL

Example:
```typescript
// 1. Add to BASE_URLS
const BASE_URLS = {
  development: {
    // ... existing URLs
    NEW_SERVICE_BASE: "http://localhost:3000",
  },
  production: {
    // ... existing URLs
    NEW_SERVICE_BASE: "https://api.example.com",
  }
};

// 2. Add to URL_PATHS
const URL_PATHS = {
  // ... existing paths
  NEW_SERVICE_API: "/api/new-service",
};

// 3. Add to interface
export interface UrlConfig extends BaseUrlConfig {
  // ... existing URLs
  NEW_SERVICE_URL: string;
}

// 4. Update getUrlConfig function
export function getUrlConfig(environment?: string): UrlConfig {
  const baseUrls = getBaseUrls(environment);
  
  return {
    ...baseUrls,
    // ... existing URLs
    NEW_SERVICE_URL: baseUrls.NEW_SERVICE_BASE + URL_PATHS.NEW_SERVICE_API,
  };
}
```

## Benefits

1. **Centralized Management**: All URLs in one place
2. **Environment Flexibility**: Easy switching between environments
3. **Dynamic Building**: URLs built from base + path components
4. **Type Safety**: TypeScript interfaces ensure correct usage
5. **Maintainability**: Easy to update base URLs or paths
6. **Debugging**: Built-in logging for URL configuration
