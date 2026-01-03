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
    config?: RequestConfig
  ): Promise<ContactResponse> {
    return httpClient.post<ContactResponse>('/public/contact', data, config);
  },
};

