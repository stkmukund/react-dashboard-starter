import axios, { type AxiosError } from "axios";
import type { ApiErrorData } from "./types";

/**
 * Normalized application-level API error.
 * Provides easy access to status code, friendly message, validation errors, and raw response.
 */
export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly data?: unknown;
  readonly validationErrors?: Record<string, string[] | string>;
  readonly originalError: unknown;

  constructor({
    message,
    status,
    code,
    data,
    validationErrors,
    originalError,
  }: {
    message: string;
    status?: number;
    code?: string;
    data?: unknown;
    validationErrors?: Record<string, string[] | string>;
    originalError?: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
    this.validationErrors = validationErrors;
    this.originalError = originalError;

    // Maintains proper stack trace for where error was thrown (V8 only)
    const ErrorWithCapture = Error as unknown as {
      captureStackTrace?: (targetObject: object, constructorOpt?: unknown) => void;
    };
    if (typeof ErrorWithCapture.captureStackTrace === "function") {
      ErrorWithCapture.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Normalizes any error (AxiosError, Network Error, DOMException, or native Error)
 * into a predictable ApiError instance.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorData | string>;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;

    let message = "An unexpected network or server error occurred.";
    let validationErrors: Record<string, string[] | string> | undefined;

    if (responseData) {
      if (typeof responseData === "string" && responseData.trim().length > 0) {
        message = responseData;
      } else if (typeof responseData === "object" && responseData !== null) {
        if (typeof responseData.message === "string") {
          message = responseData.message;
        } else if (typeof responseData.error === "string") {
          message = responseData.error;
        }
        if (responseData.errors && typeof responseData.errors === "object") {
          validationErrors = responseData.errors;
        }
      }
    } else if (axiosError.code === "ECONNABORTED") {
      message = "Request timed out. Please check your connection and try again.";
    } else if (axiosError.message) {
      message = axiosError.message;
    }

    return new ApiError({
      message,
      status,
      code: axiosError.code,
      data: responseData,
      validationErrors,
      originalError: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message || "An unexpected error occurred.",
      originalError: error,
    });
  }

  return new ApiError({
    message: typeof error === "string" ? error : "An unknown error occurred.",
    originalError: error,
  });
}
