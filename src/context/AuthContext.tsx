import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { type ReactNode } from "react"
import { authApi, setToken, clearToken, getToken } from "../lib/api";
import type { User } from "../lib/interfaces";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<User>;
    register: (data: any) => Promise<User>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session on first load if a token is present.
    useEffect(() => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        authApi
            .me()
            .then((u) => {
                setUser(u);
            })
            .catch(() => clearToken())
            .finally(() => setLoading(false));
    }, []);

    const handleAuth = useCallback(({ user, token }: { user: User, token: string }) => {
        setToken(token);
        setUser(user);
        return user;
    }, []);

    const login = useCallback(
        async (data: any) => handleAuth(await authApi.login(data)),
        [handleAuth]
    );

    const register = useCallback(
        async (data: any) => handleAuth(await authApi.register(data)),
        [handleAuth]
    );

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
