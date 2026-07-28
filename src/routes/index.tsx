import { Navigate, useLocation } from "react-router-dom";
import { FullScreenSpinner } from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <FullScreenSpinner label="Restoring your session…" />;
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    return children;
};

export const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <FullScreenSpinner />;
    if (user) return <Navigate to="/dashboard" replace />;
    return children;
};
