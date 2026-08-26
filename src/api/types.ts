import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

/**
 * Standard configuration options for API requests.
 */
export interface RequestOptions<TData = unknown, TParams = Record<string, unknown>>
  extends Omit<AxiosRequestConfig, "url" | "method" | "data" | "params"> {
  /** Request body payload */
  data?: TData;
  /** URL query parameters */
  params?: TParams;
}

/**
 * Normalized API error payload from backend responses.
 */
export interface ApiErrorData {
  message?: string;
  error?: string;
  code?: string;
  errors?: Record<string, string[] | string>;
  [key: string]: unknown;
}

/**
 * Token provider function signature. Supports sync or async token retrieval.
 */
export type TokenProvider = () => string | null | undefined | Promise<string | null | undefined>;

/**
 * Configuration options for initializing an ApiClient instance.
 */
export interface ApiClientConfig {
  /** Base URL for all requests */
  baseURL: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Default request headers */
  headers?: Record<string, string>;
  /** Pluggable token provider for bearer authentication */
  tokenProvider?: TokenProvider;
  /** Custom request interceptor callback */
  onRequest?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  /** Custom response interceptor callback */
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  /** Custom error handler callback */
  onError?: (error: AxiosError) => unknown;
}
