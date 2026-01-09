/**
 * Server-side HTTP utilities
 *
 * These functions are meant to be used in Server Components only.
 * They provide server-side wrappers around the existing services
 * with Next.js caching and revalidation support.
 */

import { plansService } from './services';
import type { PublicPlan, RequestConfig } from './types';

/**
 * Create server-side request config with Next.js caching and locale
 */
function createServerConfig(revalidate?: number, locale?: string): RequestConfig {
  return {
    next: {
      revalidate: revalidate ?? undefined,
    },
    locale,
  };
}

/**
 * Server-side Plans Service
 * Wraps the client plans service with server-side caching
 */
export const serverPlansService = {
  /**
   * Fetch all public plans (server-side with caching)
   */
  async getAll(revalidate?: number, locale?: string): Promise<PublicPlan[]> {
    try {
      const config = createServerConfig(revalidate, locale);
      const response = await plansService.getAll(config);
      return response?.data ?? [];
    } catch (error) {
      console.error('[Server] Failed to fetch plans:', error);
      return [];
    }
  },

  /**
   * Fetch a single public plan by ID (server-side with caching)
   */
  async getById(id: string, revalidate?: number, locale?: string): Promise<PublicPlan | null> {
    try {
      const config = createServerConfig(revalidate, locale);
      const plan = await plansService.getById(id, config);
      return plan ?? null;
    } catch (error) {
      console.error('[Server] Failed to fetch plan:', error);
      return null;
    }
  },

  /**
   * Fetch freemium plan only (server-side with caching)
   */
  async getFreemium(revalidate?: number, locale?: string): Promise<PublicPlan | null> {
    try {
      const config = createServerConfig(revalidate, locale);
      const plan = await plansService.getFreemium(config);
      return plan;
    } catch (error) {
      console.error('[Server] Failed to fetch freemium plan:', error);
      return null;
    }
  },
};

// Legacy exports for backward compatibility
export const getPublicPlans = serverPlansService.getAll.bind(serverPlansService);
export const getPublicPlanById = serverPlansService.getById.bind(serverPlansService);
