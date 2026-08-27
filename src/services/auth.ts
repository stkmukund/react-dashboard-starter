import { api, endpoints, ApiError } from "../api";
import { storage } from "../lib/storage";
import type { User } from "../lib/interfaces";

const USER_STORAGE_KEY = "auth_user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VerifyCredentialsPayload {
  username: string;
  password: string;
}

export interface VerifyCredentialsUser {
  id: number | string;
  username: string;
}

export interface VerifyCredentialsResponse {
  status: "success" | "error" | string;
  message: string;
  user?: VerifyCredentialsUser;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Service for handling authentication-related API requests.
 * Uses the centralized API client and endpoints.
 */
export const authService = {
  /**
   * Log in user with credentials via verifyCredentials API.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const payload: VerifyCredentialsPayload = {
      username: credentials.email.trim(),
      password: credentials.password,
    };

    const response = await api.post<VerifyCredentialsResponse, VerifyCredentialsPayload>(
      endpoints.auth.verifyCredentials,
      {
        data: payload,
      }
    );

    if (response.status !== "success") {
      throw new ApiError({
        message: response.message || "Invalid username or password.",
        status: 401,
        data: response,
      });
    }

    // Set user name as requested: "Admin"
    const user: User = {
      id: response.user?.id ? String(response.user.id) : "1",
      name: "Admin",
      email: response.user?.username || credentials.email,
      avatar_url: null,
    };

    // Generate or use session token to persist authenticated state
    const token = `session_${response.user?.id || 1}_${Date.now()}`;

    // Persist active user profile in local storage
    storage.local.set(USER_STORAGE_KEY, user);

    return {
      user,
      token,
    };
  },

  /**
   * Register a new user.
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const user: User = {
      id: `usr_${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      avatar_url: null,
    };
    const token = `token_${Date.now()}`;

    storage.local.set(USER_STORAGE_KEY, user);

    return {
      user,
      token,
    };
  },

  /**
   * Fetch currently authenticated user profile from persistent storage or fallback.
   */
  me: async (): Promise<User> => {
    const storedUser = storage.local.get<User>(USER_STORAGE_KEY);
    if (storedUser) {
      return storedUser;
    }

    // Fallback default admin user
    return {
      id: "1",
      name: "Admin",
      email: "admin@gmail.com",
      avatar_url: null,
    };
  },

  /**
   * Logout user session and clear storage.
   */
  logout: async (): Promise<void> => {
    storage.local.remove(USER_STORAGE_KEY);
  },
};

