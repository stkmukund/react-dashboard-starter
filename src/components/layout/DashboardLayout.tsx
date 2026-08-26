import { useEffect, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Sidebar, type SidebarProps } from "../sidebar";
import { useLayout } from "./LayoutContext";

export interface DashboardLayoutProps {
    sidebar?: ReactNode | ((props: { collapsed: boolean; toggle: () => void; mobileOpen: boolean; closeMobile: () => void }) => ReactNode);
    sidebarConfig?: Omit<SidebarProps, "collapsed" | "onToggle">;
    children?: ReactNode;
    topbar?: ReactNode;
    enableCommandShortcut?: boolean;
    className?: string;
}

export default function DashboardLayout({
    sidebar,
    sidebarConfig,
    children,
    topbar,
    enableCommandShortcut = true,
    className,
}: DashboardLayoutProps) {
    const {
        sidebarCollapsed,
        toggleSidebar,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        toggleCommand,
    } = useLayout();

    useEffect(() => {
        if (!enableCommandShortcut) return;

        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                toggleCommand();
            }
        };

        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
        };
    }, [enableCommandShortcut, toggleCommand]);

    return (
        <div className={cn("h-screen overflow-hidden", className)}>
            {/* Sidebar Rendering */}
            {typeof sidebar === "function"
                ? sidebar({
                    collapsed: sidebarCollapsed,
                    toggle: toggleSidebar,
                    mobileOpen: mobileSidebarOpen,
                    closeMobile: () => setMobileSidebarOpen(false),
                })
                : sidebar !== undefined
                    ? sidebar
                    : sidebarConfig
                        ? (
                            <Sidebar
                                {...sidebarConfig}
                                collapsed={sidebarCollapsed}
                                onToggle={toggleSidebar}
                                mobileOpen={mobileSidebarOpen}
                                onMobileClose={() => setMobileSidebarOpen(false)}
                            />
                        )
                        : null}

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex h-screen min-w-0 flex-col overflow-hidden transition-[padding] duration-300",
                    sidebar || sidebarConfig
                        ? sidebarCollapsed
                            ? "md:pl-23"
                            : "md:pl-70"
                        : ""
                )}
            >
                {topbar}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
