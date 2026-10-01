/**
 * Auth API Service
 *
 * Service for authentication-related API calls.
 */

import { httpClient } from '../client';
import { RegisterRequest, RegisterResponse, RequestConfig } from '../types';

/**
 * Auth Service - handles all authentication-related API calls
 */
export const authService = {
  /**
   * Register a new user and tenant.
   *
   * The only credentialed call on the marketing site: the backend answers
   * with HttpOnly auth cookies (Set-Cookie), which the browser only stores
   * for a credentialed cross-origin request.
   */
  async register(
    data: RegisterRequest,
    config?: RequestConfig
  ): Promise<RegisterResponse> {
    return httpClient.post<RegisterResponse>('/auth/register', data, {
      ...config,
      credentials: 'include',
    });
  },
};
