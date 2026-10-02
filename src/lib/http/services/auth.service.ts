/**
 * Auth API Service
 *
 * Service for authentication-related API calls.
 */

import { httpClient } from '../client';
import {
  GoogleSignInRequest,
  GoogleSignInResponse,
  GoogleSignUpRequest,
  GoogleSignUpResponse,
  RegisterRequest,
  RegisterResponse,
  RequestConfig,
} from '../types';

/**
 * Auth Service - handles all authentication-related API calls
 *
 * These are the only credentialed calls on the marketing site: the backend
 * answers with HttpOnly auth cookies (Set-Cookie), which the browser only
 * stores for a credentialed cross-origin request. The API also accepts them
 * only from a first-party Origin, which this site is.
 */
export const authService = {
  /**
   * Register a new user and tenant with email and password.
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

  /**
   * Exchange a Google ID token (the GIS `credential`) for a session.
   *
   * SIGNED_IN sets the auth cookies (the account already existed).
   * SIGNUP_REQUIRED sets none; finish with `googleSignUp` and the same token.
   */
  async googleSignIn(
    idToken: string,
    config?: RequestConfig
  ): Promise<GoogleSignInResponse> {
    const body: GoogleSignInRequest = { idToken };

    return httpClient.post<GoogleSignInResponse>('/auth/google/sign-in', body, {
      ...config,
      credentials: 'include',
    });
  },

  /**
   * Create a business with a Google account. Answers with the register body
   * and sets the auth cookies. The account has no password.
   */
  async googleSignUp(
    data: GoogleSignUpRequest,
    config?: RequestConfig
  ): Promise<GoogleSignUpResponse> {
    return httpClient.post<GoogleSignUpResponse>('/auth/google/sign-up', data, {
      ...config,
      credentials: 'include',
    });
  },
};
