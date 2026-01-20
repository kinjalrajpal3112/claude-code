import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';
import * as https from 'https';
import * as http from 'http';
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
 * @description Centralized HTTP client service with connection pooling
 */
@Injectable()
export class AxiosService {
  private readonly logger = new Logger(AxiosService.name);
  private readonly defaultTimeout = 30000;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    // ========== CONNECTION POOLING (CRITICAL!) ==========
    this.axiosInstance = axios.create({
      timeout: this.defaultTimeout,
      headers: DEFAULT_HEADERS,
      // HTTPS Agent with connection pooling
      httpsAgent: new https.Agent({
        maxSockets: 50,           // Max 50 concurrent connections
        maxFreeSockets: 10,       // Keep 10 idle connections
        keepAlive: true,          // Reuse connections
        keepAliveMsecs: 30000,    // Keep alive for 30 seconds
        timeout: 60000,           // Socket timeout 60 seconds
      }),
      // HTTP Agent with connection pooling
      httpAgent: new http.Agent({
        maxSockets: 50,
        maxFreeSockets: 10,
        keepAlive: true,
        keepAliveMsecs: 30000,
        timeout: 60000,
      }),
      // Don't throw on non-2xx responses (we handle manually)
      validateStatus: (status) => status < 500,
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`[${config.method?.toUpperCase()}] ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error(`Request error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response: ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        this.logger.error(`Response error: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make HTTP request with retry logic
   * 
   * @param config - Request configuration
   * @param retries - Number of retries (default 2)
   * @returns Promise<ApiResponse> - Standardized response
   */
  async makeRequest<T = any>(config: RequestConfig, retries: number = 2): Promise<ApiResponse<T>> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
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

        const response: AxiosResponse<T> = await this.axiosInstance(axiosConfig);

        // Check for 4xx errors
        if (response.status >= 400) {
          return {
            success: false,
            message: 'API returned error',
            error: response.data,
            statusCode: response.status,
            errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          data: response.data,
          statusCode: response.status,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        lastError = error;
        
        // Only retry on network errors or 5xx
        if (attempt < retries && this.isRetryable(error)) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          this.logger.warn(`Retry ${attempt + 1}/${retries} after ${delay}ms`);
          await this.sleep(delay);
          continue;
        }
        
        break;
      }
    }

    return this.handleError(lastError);
  }

  /**
   * Check if error is retryable
   */
  private isRetryable(error: any): boolean {
    // Network errors
    if (!error.response) return true;
    // 5xx errors
    if (error.response?.status >= 500) return true;
    // Timeout
    if (error.code === 'ECONNABORTED') return true;
    return false;
  }

  /**
   * Sleep for ms
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make GET request
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
   */
  private handleError(error: any): ApiResponse {
    if (error.response) {
      return {
        success: false,
        message: 'External API error',
        error: error.response.data,
        statusCode: error.response.status,
        errorCode: ERROR_CODES.EXTERNAL_API_ERROR,
        timestamp: new Date().toISOString(),
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'Network error - no response received',
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        errorCode: ERROR_CODES.NETWORK_ERROR,
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        success: false,
        message: error.message || 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: ERROR_CODES.INTERNAL_ERROR,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Create standardized success response
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
