import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { env } from "../config/env";
import { normalizeApiError } from "./errors";
import type { ApiClientConfig, RequestOptions, TokenProvider } from "./types";

// Token storage key default
const DEFAULT_TOKEN_STORAGE_KEY = "auth_token";

let tokenProvider: TokenProvider = () => {
  return localStorage.getItem(DEFAULT_TOKEN_STORAGE_KEY);
};

/**
 * Configure or override the active authentication token provider.
 * Useful for plugging in custom token stores, cookies, or auth clients (e.g. Supabase, Firebase, Keycloak).
 */
export function setTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider;
}

/**
 * Helper to persist token using standard storage.
 */
export function setStoredToken(token: string, key = DEFAULT_TOKEN_STORAGE_KEY): void {
  localStorage.setItem(key, token);
}

/**
 * Helper to retrieve token from standard storage.
 */
export function getStoredToken(key = DEFAULT_TOKEN_STORAGE_KEY): string | null {
  return localStorage.getItem(key);
}

/**
 * Helper to remove token from standard storage.
 */
export function clearStoredToken(key = DEFAULT_TOKEN_STORAGE_KEY): void {
  localStorage.removeItem(key);
}

/**
 * Production-ready API Client wrapper around Axios.
 */
export class ApiClient {
  private readonly instance: AxiosInstance;

  constructor(config?: Partial<ApiClientConfig>) {
    this.instance = axios.create({
      baseURL: config?.baseURL || env.apiBaseUrl,
      timeout: config?.timeout ?? env.apiTimeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config?.headers,
      },
    });

    if (config?.tokenProvider) {
      setTokenProvider(config.tokenProvider);
    }

    this.setupInterceptors(config);
  }

  private setupInterceptors(config?: Partial<ApiClientConfig>): void {
    // Request Interceptor: Attach bearer token & custom headers
    this.instance.interceptors.request.use(
      async (requestConfig: InternalAxiosRequestConfig) => {
        try {
          const token = await Promise.resolve(tokenProvider());
          if (token && requestConfig.headers && !requestConfig.headers.Authorization) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // Ignore token resolution errors to allow unauthenticated fallback
        }

        if (config?.onRequest) {
          return config.onRequest(requestConfig);
        }
        return requestConfig;
      },
      (error) => Promise.reject(normalizeApiError(error))
    );

    // Response Interceptor: Normalize data and errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (config?.onResponse) {
          return config.onResponse(response);
        }
        return response;
      },
      (error) => {
        if (config?.onError) {
          config.onError(error);
        }
        return Promise.reject(normalizeApiError(error));
      }
    );
  }

  /**
   * Perform a typed HTTP GET request.
   */
  public async get<TResponse = unknown, TParams = Record<string, unknown>>(
    url: string,
    options?: RequestOptions<never, TParams>
  ): Promise<TResponse> {
    const response = await this.instance.get<TResponse>(url, {
      ...options,
      params: options?.params,
    });
    return response.data;
  }

  /**
   * Perform a typed HTTP POST request.
   */
  public async post<TResponse = unknown, TBody = unknown, TParams = Record<string, unknown>>(
    url: string,
    options?: RequestOptions<TBody, TParams> | TBody
  ): Promise<TResponse> {
    const isOptionsObject =
      options !== null &&
      typeof options === "object" &&
      ("data" in (options as Record<string, unknown>) ||
        "params" in (options as Record<string, unknown>) ||
        "headers" in (options as Record<string, unknown>));

    const payload = isOptionsObject
      ? (options as RequestOptions<TBody, TParams>).data
      : (options as TBody);

    const config = isOptionsObject
      ? (options as RequestOptions<TBody, TParams>)
      : undefined;

    const response = await this.instance.post<TResponse>(url, payload, config);
    return response.data;
  }

  /**
   * Perform a typed HTTP PUT request.
   */
  public async put<TResponse = unknown, TBody = unknown, TParams = Record<string, unknown>>(
    url: string,
    options?: RequestOptions<TBody, TParams> | TBody
  ): Promise<TResponse> {
    const isOptionsObject =
      options !== null &&
      typeof options === "object" &&
      ("data" in (options as Record<string, unknown>) ||
        "params" in (options as Record<string, unknown>) ||
        "headers" in (options as Record<string, unknown>));

    const payload = isOptionsObject
      ? (options as RequestOptions<TBody, TParams>).data
      : (options as TBody);

    const config = isOptionsObject
      ? (options as RequestOptions<TBody, TParams>)
      : undefined;

    const response = await this.instance.put<TResponse>(url, payload, config);
    return response.data;
  }

  /**
   * Perform a typed HTTP PATCH request.
   */
  public async patch<TResponse = unknown, TBody = unknown, TParams = Record<string, unknown>>(
    url: string,
    options?: RequestOptions<TBody, TParams> | TBody
  ): Promise<TResponse> {
    const isOptionsObject =
      options !== null &&
      typeof options === "object" &&
      ("data" in (options as Record<string, unknown>) ||
        "params" in (options as Record<string, unknown>) ||
        "headers" in (options as Record<string, unknown>));

    const payload = isOptionsObject
      ? (options as RequestOptions<TBody, TParams>).data
      : (options as TBody);

    const config = isOptionsObject
      ? (options as RequestOptions<TBody, TParams>)
      : undefined;

    const response = await this.instance.patch<TResponse>(url, payload, config);
    return response.data;
  }

  /**
   * Perform a typed HTTP DELETE request.
   */
  public async delete<TResponse = unknown, TParams = Record<string, unknown>>(
    url: string,
    options?: RequestOptions<never, TParams>
  ): Promise<TResponse> {
    const response = await this.instance.delete<TResponse>(url, {
      ...options,
      params: options?.params,
    });
    return response.data;
  }

  /**
   * Access the underlying Axios instance if needed for advanced usage.
   */
  public get rawInstance(): AxiosInstance {
    return this.instance;
  }
}

/**
 * Singleton API Client instance for the entire application.
 */
export const api = new ApiClient();
