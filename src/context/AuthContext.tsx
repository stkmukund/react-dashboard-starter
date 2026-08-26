import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getStoredToken, setStoredToken, clearStoredToken } from "../api";
import { authService, type LoginCredentials, type RegisterCredentials } from "../services";
import type { User } from "../lib/interfaces";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => {
    return Boolean(getStoredToken());
  });

  // Restore session on first load if a token is present in storage.
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    let isMounted = true;
    authService
      .me()
      .then((u) => {
        if (isMounted) setUser(u);
      })
      .catch(() => {
        clearStoredToken();
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthSuccess = useCallback(({ user: authUser, token }: { user: User; token: string }) => {
    setStoredToken(token);
    setUser(authUser);
    return authUser;
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const res = await authService.login(credentials);
      return handleAuthSuccess(res);
    },
    [handleAuthSuccess]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const res = await authService.register(credentials);
      return handleAuthSuccess(res);
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearStoredToken();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
