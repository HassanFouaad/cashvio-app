/**
 * Order Export API Service
 *
 * Server-side service for fetching order data for digital receipts.
 * Uses the public export endpoint with X-Store-Id header for authentication.
 */

import { env } from "@/config/env";
import { HttpError } from "@/lib/http";
import { cache } from "react";
import type { OrderExportData } from "../types";

/**
 * Fetch order export data from the backend API.
 * This is a server-side cached function.
 *
 * @param orderId - The order UUID
 * @param locale - Language for localized content ('en' | 'ar')
 * @param storeId - Optional store UUID (required for X-Store-Id header if order requires store context)
 * @returns Order export data
 * @throws HttpError if the request fails
 */
export const getOrderExport = cache(
  async (
    orderId: string,
    locale: string = "en",
    storeId?: string
  ): Promise<OrderExportData> => {
    const url = `${env.api.url}/public/export/orders/${orderId}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    };

    // Add X-Store-Id header if provided
    if (storeId) {
      headers["X-Store-Id"] = storeId;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Always fetch fresh data for receipts
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new HttpError(
        response.status,
        responseData.message || "Failed to fetch order",
        responseData.details
      );
    }

    // Unwrap the API response if wrapped
    if (responseData.data) {
      return responseData.data as OrderExportData;
    }

    return responseData as OrderExportData;
  }
);

/**
 * Fetch order export data with error handling.
 * Returns a result object instead of throwing.
 *
 * @param orderId - The order UUID
 * @param locale - Language for localized content ('en' | 'ar')
 * @param storeId - Optional store UUID (required for X-Store-Id header if order requires store context)
 * @returns Object with order data or error information
 */
export const getOrderExportWithErrorHandling = cache(
  async (
    orderId: string,
    locale: string = "en",
    storeId?: string
  ): Promise<{
    order: OrderExportData | null;
    error: string | null;
    errorCode?: string;
  }> => {
    try {
      const order = await getOrderExport(orderId, locale, storeId);
      return { order, error: null };
    } catch (error) {
      if (error instanceof HttpError) {
        return {
          order: null,
          error: error.message,
          errorCode:
            error.statusCode === 404 ? "ORDER_NOT_FOUND" : "FETCH_ERROR",
        };
      }

      return {
        order: null,
        error: "An unexpected error occurred",
        errorCode: "UNKNOWN_ERROR",
      };
    }
  }
);
