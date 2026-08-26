import { useMemo, type JSX } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { appConfig, sidebarNavigation } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import type { SidebarSection } from "../sidebar";
import { Avatar, CommandMenu, type CommandItem, Icon } from "../ui";
import AppTopbar from "./AppTopbar";
import DashboardLayout from "./DashboardLayout";
import { LayoutProvider, useLayout } from "./LayoutContext";

const AppLayoutContent = (): JSX.Element => {
    const { logout, user } = useAuth();
    const { commandOpen, setCommandOpen, toggleCommand } = useLayout();
    const navigate = useNavigate();
    const location = useLocation();
    const currentItem = useMemo(() => {
        for (const sec of sidebarNavigation) {
            const match = sec.items.find(i => i.to === location.pathname);
            if (match) return match;
        }
        return null;
    }, [location.pathname]);
    const topbarTitle = currentItem?.label ?? "Dashboard";
const topbarSubtitle = currentItem?.description ?? "";

    // Map config sections to SidebarSection format with bound actions
    const sidebarSections: SidebarSection[] = useMemo(() => {
        const sections: SidebarSection[] = sidebarNavigation.map((sec) => ({
            title: sec.title,
            items: sec.items.map((item) => ({
                label: item.label,
                icon: item.icon,
                to: item.to,
                end: item.end,
                badge: item.badge,
                disabled: item.disabled,
            })),
        }));

        // Append standard utility actions (Help & Search, Logout) to the last section
        const generalIndex = sections.findIndex((s) => s.title === "General");
        const appendTarget = generalIndex >= 0 ? sections[generalIndex] : sections[sections.length - 1];

        if (appendTarget && appendTarget.items) {
            appendTarget.items = [
                ...appendTarget.items,
                {
                    label: "Help & Search",
                    icon: "help",
                    onClick: toggleCommand,
                },
                {
                    label: "Logout",
                    icon: "logout",
                    onClick: logout,
                },
            ];
        }

        return sections;
    }, [logout, toggleCommand]);

    // Build command menu items dynamically from navigation config + common actions
    const commandItems: CommandItem[] = useMemo(() => {
        const navItems: CommandItem[] = sidebarNavigation.flatMap((sec) =>
            sec.items
                .filter((item) => Boolean(item.to))
                .map((item) => ({
                    id: `nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`,
                    label: item.label,
                    description: item.description,
                    category: sec.title || "Navigation",
                    icon: item.icon,
                    shortcut: item.shortcut,
                    onSelect: () => item.to && navigate(item.to),
                }))
        );

        const utilityItems: CommandItem[] = [
            {
                id: "action-logout",
                label: "Log out",
                description: "End your current session",
                category: "Account",
                icon: "logout",
                onSelect: async () => {
                    await logout();
                    navigate("/login");
                },
            },
        ];

        return [...navItems, ...utilityItems];
    }, [navigate, logout]);

    const renderFooterUserData = ({ collapsed }: { collapsed: boolean; isMobile: boolean }) => (
        <>
            <div className="mx-3 mt-3 border-t" />
            <div
                className={cn(
                    "flex h-16 items-center",
                    collapsed ? "justify-center px-2" : "gap-3 px-3.5"
                )}
            >
                <Avatar
                    name={user?.name || ""}
                    id={user?.id}
                    src={user?.avatar_url || undefined}
                    size="sm"
                    className="shrink-0"
                />
                {!collapsed && (
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                            {user?.name}
                        </p>
                        <p className="truncate text-xs text-faint">
                            {user?.email}
                        </p>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <>
            <DashboardLayout
                topbar={
                    <AppTopbar
                        title={topbarTitle}
                        subtitle={topbarSubtitle}
                    />
                }
                sidebarConfig={{
                    header: {
                        title: appConfig.name,
                        logo: (
                            <Icon
                                name={appConfig.logoIcon}
                                filled={true}
                                size={20}
                                className="h-5 w-5 fill-white text-white"
                            />
                        ),
                    },
                    sections: sidebarSections,
                    footer: renderFooterUserData,
                }}
            >
                <Outlet />
            </DashboardLayout>

            {/* Global Command & Search Menu */}
            <CommandMenu
                open={commandOpen}
                onClose={() => setCommandOpen(false)}
                items={commandItems}
                placeholder="Search commands, pages, or actions…"
            />
        </>
    );
};

export default function AppLayout(): JSX.Element {
    return (
        <LayoutProvider>
            <AppLayoutContent />
        </LayoutProvider>
    );
}