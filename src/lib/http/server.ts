/**
 * Server-side HTTP utilities
 *
 * These functions are meant to be used in Server Components only.
 * They use fetch with Next.js caching and revalidation.
 */

import { env } from '@/config/env';
  import type { ApiResponse, PublicPlan } from './types';

const API_BASE_URL = env.api.url;

/**
 * Server-side fetch wrapper with error handling
 */
async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number | false }
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'en',
      ...options?.headers,
    },
    // Next.js caching options
    next: {
      revalidate: options?.revalidate ?? undefined, // Default 1 hour cache
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch all public plans (server-side)
 */
export async function getPublicPlans(): Promise<PublicPlan[]> {
  try {
    const response = await serverFetch<ApiResponse<PublicPlan[]>>(
      '/public/plans',
    //  { revalidate: 300 } // Cache for 5 minutes
    );

    console.log(response);

    return response?.data ?? [];
  } catch (error) {
    console.error('[Server] Failed to fetch plans:', error);
    return []
  }
}

/**
 * Fetch a single public plan by ID (server-side)
 */
export async function getPublicPlanById(id: string): Promise<PublicPlan | null> {
  try {
    const response = await serverFetch<ApiResponse<PublicPlan>>(
      `/public/plans/${id}`,
      { revalidate: 300 }
    );

    return response.data ?? null;
  } catch (error) {
    console.error('[Server] Failed to fetch plan:', error);
    return null;
  }
}



