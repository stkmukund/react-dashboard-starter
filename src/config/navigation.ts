/**
 * Central navigation configuration.
 *
 * Defines sidebar sections, top-level routes, and command menu shortcuts.
 */

export interface NavItem {
    label: string;
    icon: string;
    to?: string;
    end?: boolean;
    badge?: string | number;
    shortcut?: string;
    description?: string;
    disabled?: boolean;


}

export interface NavSection {
    title?: string;
    items: NavItem[];
}

export const sidebarNavigation: NavSection[] = [
    {
        title: "Menu",
        items: [
            {
                label: "Dashboard",
                icon: "dashboard",
                to: "/dashboard",
                description: "Go to your main dashboard overview",


            },
            {
                label: "Report",
                icon: "bar_chart",
                to: "/report",
                description: "View and manage all assigned tasks",


            },
            // {
            //     label: "Calendar",
            //     icon: "calendar_month",
            //     to: "/calendar",
            //     description: "View scheduled dates and milestones",
            // },
            // {
            //     label: "Team",
            //     icon: "groups",
            //     to: "/team",
            //     description: "Manage team members and roles",
            // },
        ],
    },
    {
        title: "General",
        items: [
            {
                label: "Settings",
                icon: "settings",
                to: "/settings",
                description: "Preferences, appearance and account",


            },
        ],
    },
];
