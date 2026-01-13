/**
 * Auth API Service
 *
 * Service for authentication-related API calls.
 */

import { httpClient } from '../client';
import { ApiResponse, RegisterRequest, RegisterResponse, RequestConfig } from '../types';

/**
 * Auth Service - handles all authentication-related API calls
 */
export const authService = {
  /**
   * Register a new user and tenant
   */
  async register(
    data: RegisterRequest,
    config?: RequestConfig
  ): Promise<RegisterResponse> {
    return httpClient.post<RegisterResponse>('/auth/register', data, config);
  },
};

