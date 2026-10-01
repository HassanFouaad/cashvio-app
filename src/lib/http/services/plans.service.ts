/**
 * Plans API Service
 *
 * Service for fetching public plan information from the API.
 */

import { httpClient } from '../client';
import { PublicPlan, RequestConfig } from '../types';

/**
 * Plans Service - handles all plan-related API calls
 *
 * httpClient unwraps the `{ success, data }` envelope, so each method
 * resolves to the payload itself.
 */
export const plansService = {
  /**
   * Get all active public plans
   */
  async getAll(config?: RequestConfig): Promise<PublicPlan[]> {
    return httpClient.get<PublicPlan[]>('/public/plans', config);
  },

  /**
   * Get a single plan by ID
   */
  async getById(id: string, config?: RequestConfig): Promise<PublicPlan> {
    return httpClient.get<PublicPlan>(`/public/plans/${id}`, config);
  },

  /**
   * Get freemium plan only
   */
  async getFreemium(config?: RequestConfig): Promise<PublicPlan | null> {
    const plans = await httpClient.get<PublicPlan[]>('/public/plans', {
      ...config,
      params: {
        ...config?.params,
        isFreemium: true,
      },
    });

    return plans[0] ?? null;
  },
};
