import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { storage } from "../../lib/storage";

interface LayoutContextType {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
    toggleSidebar: () => void;
    commandOpen: boolean;
    setCommandOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    toggleCommand: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export interface LayoutProviderProps {
    children: ReactNode;
    defaultCollapsed?: boolean;
    storageKey?: string;
}

export const LayoutProvider = ({
    children,
    defaultCollapsed = false,
    storageKey = "sidebar-collapsed",
}: LayoutProviderProps) => {
    const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
        return storage.local.get<boolean>(storageKey, defaultCollapsed) ?? defaultCollapsed;
    });

    const [commandOpen, setCommandOpen] = useState(false);

    const setSidebarCollapsed = useCallback(
        (value: boolean | ((prev: boolean) => boolean)) => {
            setSidebarCollapsedState((prev) => {
                const next = typeof value === "function" ? value(prev) : value;
                storage.local.set(storageKey, next);
                return next;
            });
        },
        [storageKey]
    );

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed((prev) => !prev);
    }, [setSidebarCollapsed]);

    const toggleCommand = useCallback(() => {
        setCommandOpen((prev) => !prev);
    }, []);

    return (
        <LayoutContext.Provider
            value={{
                sidebarCollapsed,
                setSidebarCollapsed,
                toggleSidebar,
                commandOpen,
                setCommandOpen,
                toggleCommand,
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = (): LayoutContextType => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
};
