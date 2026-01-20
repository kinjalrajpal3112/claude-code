# Common Axios Service

## Overview
Created a centralized axios service that can be used across the entire application. This eliminates code duplication and provides consistent error handling.

## Files Created

### `src/service/axios.service.ts`
- **Purpose**: Centralized HTTP client service
- **Features**: 
  - Standardized request/response handling
  - Consistent error handling
  - Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
  - Configurable timeouts and headers
  - TypeScript interfaces for type safety

## How to Use

### Basic Usage

```typescript
import { AxiosService } from '../service/axios.service';

@Injectable()
export class YourService {
  constructor(private readonly axiosService: AxiosService) {}

  async fetchData() {
    // GET request
    const response = await this.axiosService.get('https://api.example.com/data');
    
    if (!response.success) {
      throw new HttpException(response, response.statusCode);
    }
    
    return response.data;
  }
}
```

### Available Methods

#### 1. GET Request
```typescript
const response = await this.axiosService.get(
  'https://api.example.com/data',
  { page: 1, limit: 10 }, // query parameters
  { 'Custom-Header': 'value' }, // additional headers
  30000 // timeout
);
```

#### 2. POST Request
```typescript
const response = await this.axiosService.post(
  'https://api.example.com/data',
  { name: 'John', email: 'john@example.com' }, // request body
  { 'Content-Type': 'application/json' }, // additional headers
  30000 // timeout
);
```

#### 3. PUT Request
```typescript
const response = await this.axiosService.put(
  'https://api.example.com/data/1',
  { name: 'John Updated' }, // request body
  undefined, // headers
  30000 // timeout
);
```

#### 4. PATCH Request
```typescript
const response = await this.axiosService.patch(
  'https://api.example.com/data/1',
  { name: 'John Updated' }, // request body
  undefined, // headers
  30000 // timeout
);
```

#### 5. DELETE Request
```typescript
const response = await this.axiosService.delete(
  'https://api.example.com/data/1',
  undefined, // headers
  30000 // timeout
);
```

### Response Format

All methods return a standardized response:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
  statusCode?: number;
  errorCode?: string;
  timestamp: string;
}
```

### Error Handling

The service automatically handles errors and returns standardized error responses:

```typescript
// Success response
{
  success: true,
  data: { /* your data */ },
  statusCode: 200,
  timestamp: "2024-01-15T10:30:00.000Z"
}

// Error response
{
  success: false,
  message: "External API error",
  error: { /* error details */ },
  statusCode: 500,
  errorCode: "EXTERNAL_API_ERROR",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

### Helper Methods

#### Create Success Response
```typescript
const successResponse = this.axiosService.createSuccessResponse(
  { id: 1, name: 'John' },
  'User created successfully',
  201
);
```

#### Create Error Response
```typescript
const errorResponse = this.axiosService.createErrorResponse(
  'User not found',
  'USER_NOT_FOUND',
  404,
  { userId: 123 }
);
```

## Updated Services

### OTP Service
- **Before**: Direct axios calls with manual error handling
- **After**: Uses `axiosService.get()` with standardized error handling

### Products Service
- **Before**: Direct axios calls with manual error handling
- **After**: Uses `axiosService.get()` and `axiosService.post()` with standardized error handling

## Benefits

✅ **Consistent Error Handling**: All services use the same error handling logic
✅ **Reduced Code Duplication**: No more repeated axios configuration
✅ **Type Safety**: TypeScript interfaces ensure correct usage
✅ **Centralized Configuration**: Default headers and timeouts in one place
✅ **Easy Maintenance**: Update axios configuration in one place
✅ **Standardized Responses**: All APIs return consistent response format
✅ **Better Logging**: Centralized logging for all HTTP requests

## Example Usage in Services

```typescript
// OTP Service
const response = await this.axiosService.get(
  URL_CONFIG.OTP_SEND_URL,
  { Name: 'Vishal', Number: '9871560356' }
);

// Products Service
const response = await this.axiosService.post(
  URL_CONFIG.PRODUCTS_URL,
  { PageIndex: 1, PageSize: 10 }
);

// Categories Service
const response = await this.axiosService.get(
  URL_CONFIG.CATEGORIES_URL
);
```

The axios service is now globally available and can be injected into any service! 🎉
