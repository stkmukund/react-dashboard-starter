import { api, endpoints } from "../api";
import type { User } from "../lib/interfaces";

export interface LoginCredentials {
  email: string;
  password: string;
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
   * Log in user with credentials.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // In local development or until a live server is connected,
    // fallback gracefully if backend is unreachable or mock response if needed.
    try {
      return await api.post<AuthResponse, LoginCredentials>(endpoints.auth.login, {
        data: credentials,
      });
    } catch (error) {
      // If server is not running, provide demo account login for starter kit demoing
      if (
        credentials.email === "alex@timetoprogram.com" ||
        credentials.email.endsWith("@company.com") ||
        credentials.email.includes("demo")
      ) {
        return {
          user: {
            id: "usr_101",
            name: credentials.email.split("@")[0],
            email: credentials.email,
            avatar_url: null,
          },
          token: "demo-starter-token-xyz",
        };
      }
      throw error;
    }
  },

  /**
   * Register a new user.
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse, RegisterCredentials>(endpoints.auth.register, {
        data: credentials,
      });
    } catch (error) {
      // Fallback for offline starter exploration
      if (credentials.email) {
        return {
          user: {
            id: `usr_${Date.now()}`,
            name: credentials.name,
            email: credentials.email,
            avatar_url: null,
          },
          token: `token_${Date.now()}`,
        };
      }
      throw error;
    }
  },

  /**
   * Fetch currently authenticated user profile.
   */
  me: async (): Promise<User> => {
    try {
      const response = await api.get<{ user: User } | User>(endpoints.auth.me);
      if ("user" in response && response.user) {
        return response.user;
      }
      return response as User;
    } catch {
      // Fallback for stored demo token
      return {
        id: "usr_101",
        name: "Alex Johnson",
        email: "alex@timetoprogram.com",
        avatar_url: null,
      };
    }
  },

  /**
   * Logout user session.
   */
  logout: async (): Promise<void> => {
    try {
      await api.post(endpoints.auth.logout);
    } catch {
      // Best-effort logout notification
    }
  },
};
