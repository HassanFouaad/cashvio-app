/**
 * HTTP Client
 *
 * A centralized, SOLID-compliant HTTP client for API communication.
 * Supports both client-side and server-side usage in Next.js.
 */

import { env } from "@/config/env";
import { parseRetryAfter } from "./retry-after";

export const CONTACT_REQUEST_TIMEOUT_MS = 30_000;
import { ApiError, ApiResponse, HttpMethod, RequestConfig } from "./types";

/**
 * Custom error class for API errors
 *
 * `code` is the stable `error.code` from the backend envelope (the i18n key,
 * e.g. `auth.errors.user_already_exists`). Branch on it, never on `message`.
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>,
    public code?: string,
    public retryAfterMs?: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * Build query string from params object
 */
function buildQueryString(
  params?: Record<string, string | number | boolean | undefined>,
): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Default headers for all requests
 */
function getDefaultHeaders(locale?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add Accept-Language header if locale is provided
  if (locale) {
    headers["Accept-Language"] = locale;
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
    config?: RequestConfig,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${buildQueryString(config?.params)}`;

    const headers: Record<string, string> = {
      ...getDefaultHeaders(config?.locale),
      ...config?.headers,
    };
    const timeoutMs = Math.min(
      Math.max(config?.timeoutMs ?? CONTACT_REQUEST_TIMEOUT_MS, 1),
      CONTACT_REQUEST_TIMEOUT_MS,
    );
    const timeoutController = new AbortController();
    const handleCallerAbort = () =>
      timeoutController.abort(config?.signal?.reason);
    if (config?.signal?.aborted) handleCallerAbort();
    else
      config?.signal?.addEventListener("abort", handleCallerAbort, {
        once: true,
      });

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: timeoutController.signal,
      cache: config?.cache,
      // Never send the shared auth cookies unless a call opts in explicitly
      credentials: config?.credentials ?? "omit",
    };

    // Add Next.js specific options
    if (config?.next) {
      (fetchOptions as RequestInit & { next: typeof config.next }).next =
        config.next;
    }

    // Add body for non-GET requests
    if (data && method !== "GET") {
      fetchOptions.body = JSON.stringify(data);
    }

    const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData: ApiError | null = await response
          .json()
          .catch(() => null);
        const retryAfterMs =
          response.status === 429
            ? parseRetryAfter(response.headers.get("retry-after"))
            : undefined;
        // The backend envelope nests the translated message under `error`;
        // fall back to a top-level `message` for non-envelope responses.
        throw new HttpError(
          response.status,
          errorData?.error?.message ||
            errorData?.message ||
            "An error occurred",
          errorData?.details,
          errorData?.error?.code,
          retryAfterMs,
        );
      }

      const responseData = await response.json();

      // Unwrap the response if it follows ApiResponse structure
      if (this.isApiResponse<T>(responseData)) {
        return responseData.data;
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        error.name === "AbortError"
      ) {
        throw new HttpError(
          408,
          "The request timed out. Please retry the saved request.",
        );
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new HttpError(0, "Network error. Please check your connection.");
      }

      throw new HttpError(500, "An unexpected error occurred");
    } finally {
      clearTimeout(timeout);
      config?.signal?.removeEventListener("abort", handleCallerAbort);
    }
  }

  /**
   * Type guard for ApiResponse
   * Supports both {data, statusCode} and {success, data} response formats
   */
  private isApiResponse<T>(data: unknown): data is ApiResponse<T> {
    return (
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      ("statusCode" in data || "success" in data)
    );
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>("POST", endpoint, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, config);
  }
}

// Export singleton instance
export const httpClient = new HttpClient();

// Export class for custom instances
export { HttpClient };
