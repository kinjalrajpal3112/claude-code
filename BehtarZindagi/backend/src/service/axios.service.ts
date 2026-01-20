import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { DEFAULT_HEADERS, ERROR_CODES } from '../constants';

/**
 * HTTP Request Methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * Request Configuration Interface
 */
export interface RequestConfig {
  url: string;
  method: HttpMethod;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
  statusCode?: number;
  errorCode?: string;
  timestamp: string;
}

/**
 * Common Axios Service
 * 
 * @description Centralized HTTP client service for all API calls
 */
@Injectable()
export class AxiosService {
  private readonly logger = new Logger(AxiosService.name);
  private readonly defaultTimeout = 30000;

  /**
   * Make HTTP request
   * 
   * @param config - Request configuration
   * @returns Promise<ApiResponse> - Standardized response
   */
  async makeRequest<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      this.logger.log(`Making ${config.method} request to: ${config.url}`);

      const axiosConfig: AxiosRequestConfig = {
        url: config.url,
        method: config.method.toLowerCase() as any,
        data: config.data,
        params: config.params,
        headers: {
          ...DEFAULT_HEADERS,
          ...config.headers,
        },
        timeout: config.timeout || this.defaultTimeout,
      };

      const response: AxiosResponse<T> = await axios(axiosConfig);

      this.logger.log(`Request successful. Status: ${response.status}`);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error in AxiosService.makeRequest:`, error);
      this.logger.error(`Request failed: ${error.message}`, error.stack);

      return this.handleError(error);
    }
  }

  /**
   * Make GET request
   * 
   * @param url - Request URL
   * @param params - Query parameters
   * @param headers - Additional headers
   * @param timeout - Request timeout
   * @returns Promise<ApiResponse> - Standardized response
   */
  async get<T = any>(
    url: string,
    params?: any,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: HttpMethod.GET,
      params,
      headers,
      timeout,
    });
  }

  /**
   * Make POST request
   * 
   * @param url - Request URL
   * @param data - Request body
   * @param headers - Additional headers
   * @param timeout - Request timeout
   * @returns Promise<ApiResponse> - Standardized response
   */
  async post<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: HttpMethod.POST,
      data,
      headers,
      timeout,
    });
  }

  /**
   * Make PUT request
   * 
   * @param url - Request URL
   * @param data - Request body
   * @param headers - Additional headers
   * @param timeout - Request timeout
   * @returns Promise<ApiResponse> - Standardized response
   */
  async put<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: HttpMethod.PUT,
      data,
      headers,
      timeout,
    });
  }

  /**
   * Make PATCH request
   * 
   * @param url - Request URL
   * @param data - Request body
   * @param headers - Additional headers
   * @param timeout - Request timeout
   * @returns Promise<ApiResponse> - Standardized response
   */
  async patch<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: HttpMethod.PATCH,
      data,
      headers,
      timeout,
    });
  }

  /**
   * Make DELETE request
   * 
   * @param url - Request URL
   * @param headers - Additional headers
   * @param timeout - Request timeout
   * @returns Promise<ApiResponse> - Standardized response
   */
  async delete<T = any>(
    url: string,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: HttpMethod.DELETE,
      headers,
      timeout,
    });
  }

  /**
   * Handle errors and return standardized error response
   * 
   * @param error - Error object
   * @returns ApiResponse - Error response
   */
  private handleError(error: any): ApiResponse {
    if (error.response) {
      // External API error
      return {
        success: false,
        message: 'External API error',
        error: error.response.data,
        statusCode: error.response.status,
        errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
        timestamp: new Date().toISOString(),
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        message: 'Network error',
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        errorCode: ERROR_CODES.NETWORK_ERROR,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Other error
      return {
        success: false,
        message: 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: ERROR_CODES.INTERNAL_ERROR,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Create standardized success response
   * 
   * @param data - Response data
   * @param message - Success message
   * @param statusCode - HTTP status code
   * @returns ApiResponse - Success response
   */
  createSuccessResponse<T = any>(
    data: T,
    message: string = 'Request successful',
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create standardized error response
   * 
   * @param message - Error message
   * @param errorCode - Error code
   * @param statusCode - HTTP status code
   * @param error - Error details
   * @returns ApiResponse - Error response
   */
  createErrorResponse(
    message: string,
    errorCode: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: any,
  ): ApiResponse {
    return {
      success: false,
      message,
      errorCode,
      statusCode,
      error,
      timestamp: new Date().toISOString(),
    };
  }
}
