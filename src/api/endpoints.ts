/**
 * Centralized API endpoints definitions.
 *
 * Avoid hardcoding URL strings in components or services.
 * Supports static endpoints and type-safe dynamic path generators.
 *
 * Example usage:
 *   endpoints.auth.login
 *   endpoints.users.detail("user-123")
 */
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
    refresh: "/auth/refresh",
  },
  users: {
    list: "/users",
    search: "/users/search",
    detail: (id: string | number) => `/users/${id}`,
    profile: "/users/profile",
  },
  reports: {
    getValues: "/api/getValues.php",
  },
} as const;

export type ApiEndpoints = typeof endpoints;
