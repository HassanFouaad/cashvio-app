/**
 * Contact API Service
 *
 * Service for contact form submissions.
 */

import { httpClient } from '../client';
import { ContactRequest, ContactResponse, RequestConfig } from '../types';

/**
 * Contact Service - handles all contact-related API calls
 */
export const contactService = {
  /**
   * Submit a contact inquiry
   */
  async submit(
    data: ContactRequest,
    config?: RequestConfig,
    idempotencyKey?: string
  ): Promise<ContactResponse> {
    // httpClient unwraps the `{ success, data }` envelope
    return httpClient.post<ContactResponse>('/public/contact', data, {
      ...config,
      headers: {
        ...config?.headers,
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
    });
  },
};

