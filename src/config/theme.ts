/**
 * Centralized theme and design token metadata for runtime TypeScript consumers.
 *
 * CSS variables defined in `src/index.css` are the single source of truth for styles.
 * This configuration provides typed helpers, priority definitions, and status color mappings
 * for charts, runtime badges, avatars, and toasts.
 */

export const themeConfig = {
    name: "Flowboard Default",
    brand: {
        primary: "var(--color-primary)",
        primaryForeground: "var(--color-primary-foreground)",
        primaryHover: "var(--color-primary-hover)",
        primarySubtle: "var(--color-primary-subtle)",
        primarySubtleForeground: "var(--color-primary-subtle-foreground)",
    },
    status: {
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        destructive: "var(--color-destructive)",
        info: "var(--color-info)",
    },
    priority: {
        low: {
            value: "low",
            label: "Low",
            color: "var(--color-priority-low)",
        },
        medium: {
            value: "medium",
            label: "Medium",
            color: "var(--color-priority-medium)",
        },
        high: {
            value: "high",
            label: "High",
            color: "var(--color-priority-high)",
        },
        urgent: {
            value: "urgent",
            label: "Urgent",
            color: "var(--color-priority-urgent)",
        },
    },
} as const;

export type ThemeConfig = typeof themeConfig;
export type PriorityLevel = keyof typeof themeConfig.priority;
