import SidebarHeader from "./SidebarHeader";
import SidebarSection from "./SidebarSection";
import SidebarFooter from "./SidebarFooter";

import type { SidebarProps } from "./SidebarTypes";

import { cn } from "../../lib/utils";

export default function Sidebar({
    collapsed,
    onToggle,
    mobileOpen = false,
    onMobileClose,
    header,
    sections,
    footer,
    bottomContent,
    className,
}: SidebarProps) {
    const content = (isMobileView: boolean) => (
        <>
            <SidebarHeader
                collapsed={isMobileView ? false : collapsed}
                onToggle={isMobileView && onMobileClose ? onMobileClose : onToggle}
                config={header}
                isMobile={isMobileView}
            />
            <div className="h-full flex flex-col justify-between overflow-y-auto no-scrollbar">
                {sections.map((section, index) => (
                    <SidebarSection
                        key={index}
                        section={section}
                        collapsed={isMobileView ? false : collapsed}
                        onItemClick={isMobileView ? onMobileClose : undefined}
                    />
                ))}
            </div>

            {(!collapsed || isMobileView) && bottomContent}

            <SidebarFooter>
                {typeof footer === "function"
                    ? footer({ collapsed: isMobileView ? false : collapsed, isMobile: isMobileView })
                    : footer}
            </SidebarFooter>
        </>
    );

    return (
        <>
            {/* Desktop / Tablet Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-3 left-3 z-40 hidden flex-col overflow-hidden rounded-3xl border bg-surface shadow-xl transition-all duration-300 md:flex",
                    collapsed ? "w-18" : "w-63",
                    className
                )}
            >
                {content(false)}
            </aside>

            {/* Mobile Drawer Backdrop */}
            {mobileOpen && (
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Close sidebar"
                    onClick={onMobileClose}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            onMobileClose?.();
                        }
                    }}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
                />
            )}

            {/* Mobile Drawer Sidebar */}
            <aside
                aria-label="Mobile Navigation"
                className={cn(
                    "fixed inset-y-2 left-2 z-50 flex w-72 flex-col overflow-hidden rounded-3xl border bg-surface shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
                    className
                )}
            >
                {content(true)}
            </aside>
        </>
    );
}