/**
 * Centralized, typed environment configuration.
 *
 * All environment variables are validated and exposed through this module
 * to prevent direct, untyped `import.meta.env` references throughout the app.
 *
 * NOTE: Only variables prefixed with `VITE_` are bundled by Vite into the browser build.
 * Never expose secrets, private keys, or credentials here.
 */

interface EnvConfig {
  /** Base path / URL where the frontend application is hosted */
  readonly appBaseUrl: string;
  /** Base URL for backend API requests */
  readonly apiBaseUrl: string;
  /** Timeout for API requests in milliseconds */
  readonly apiTimeout: number;
  /** Whether the application is running in production mode */
  readonly isProduction: boolean;
  /** Whether the application is running in development mode */
  readonly isDevelopment: boolean;
  /** Current Vite runtime mode (e.g., 'development', 'production', 'test') */
  readonly mode: string;
}

const parseTimeout = (value: unknown, fallback: number): number => {
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return fallback;
};

const rawAppBaseUrl = import.meta.env.VITE_BASE_PATH || import.meta.env.BASE_URL;
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const rawTimeout = import.meta.env.VITE_API_TIMEOUT;

export const env: EnvConfig = {
  appBaseUrl: (typeof rawAppBaseUrl === "string" && rawAppBaseUrl.trim()) || "/",
  apiBaseUrl: (typeof rawBaseUrl === "string" && rawBaseUrl.trim()) || "http://localhost:3000/api",
  apiTimeout: parseTimeout(rawTimeout, 15000),
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  mode: import.meta.env.MODE,
};
