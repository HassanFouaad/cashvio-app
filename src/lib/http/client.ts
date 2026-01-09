/**
 * HTTP Client
 *
 * A centralized, SOLID-compliant HTTP client for API communication.
 * Supports both client-side and server-side usage in Next.js.
 */

import { env } from '@/config/env';
import {
  ApiError,
  ApiResponse,
  HttpMethod,
  RequestConfig,
} from './types';

/**
 * Custom error class for API errors
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Build query string from params object
 */
function buildQueryString(
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Default headers for all requests
 */
function getDefaultHeaders(locale?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Add Accept-Language header if locale is provided
  if (locale) {
    headers['Accept-Language'] = locale;
  }

  return headers;
}

/**
 * HTTP Client class following Single Responsibility Principle
 */
class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = env.api.url) {
    this.baseUrl = baseUrl;
  }

  /**
   * Execute HTTP request
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${buildQueryString(config?.params)}`;

    const headers: Record<string, string> = {
      ...getDefaultHeaders(config?.locale),
      ...config?.headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: config?.signal,
      cache: config?.cache,
    };

    // Add Next.js specific options
    if (config?.next) {
      (fetchOptions as RequestInit & { next: typeof config.next }).next =
        config.next;
    }

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, fetchOptions);
      const responseData = await response.json();

      if (!response.ok) {
        const errorData = responseData as ApiError;
        throw new HttpError(
          response.status,
          errorData.message || 'An error occurred',
          errorData.details
        );
      }

      // Unwrap the response if it follows ApiResponse structure
      if (this.isApiResponse<T>(responseData)) {
        return responseData.data;
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new HttpError(0, 'Network error. Please check your connection.');
      }

      throw new HttpError(500, 'An unexpected error occurred');
    }
  }

  /**
   * Type guard for ApiResponse
   */
  private isApiResponse<T>(data: unknown): data is ApiResponse<T> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      'statusCode' in data
    );
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('POST', endpoint, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

// Export singleton instance
export const httpClient = new HttpClient();

// Export class for custom instances
export { HttpClient };

