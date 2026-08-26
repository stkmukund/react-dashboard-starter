import type { ReactNode } from "react";

export interface TopbarUser {
    id?: string | number;
    name?: string;
    email?: string;
    avatarUrl?: string | null;
}

export interface TopbarMenuItem {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
}

export interface TopbarSearchProps {
    enabled?: boolean;
    placeholder?: string;
    shortcut?: string;
    onClick?: () => void;
}

export interface TopbarNotificationProps {
    enabled?: boolean;
    onClick?: () => void;
    ariaLabel?: string;
}

export interface TopbarPrimaryActionProps {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    className?: string;
}

export interface TopbarUserMenuProps {
    user: TopbarUser;
    items?: TopbarMenuItem[];
    renderAvatar?: (user: TopbarUser) => ReactNode;
}

export interface TopbarProps {
    title?: ReactNode;
    subtitle?: ReactNode;
    search?: TopbarSearchProps;
    actions?: ReactNode;
    notification?: TopbarNotificationProps;
    primaryAction?: TopbarPrimaryActionProps;
    user?: TopbarUser;
    userMenu?: TopbarMenuItem[];
    renderAvatar?: (user: TopbarUser) => ReactNode;
    leftContent?: ReactNode;
    rightContent?: ReactNode;
    sticky?: boolean;
    className?: string;
}
