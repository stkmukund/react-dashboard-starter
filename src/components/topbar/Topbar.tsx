import type { TopbarProps } from "./types";

import { cn } from "../../lib/utils";
import Icon from "../ui/Icon";

import TopbarNotification from "./TopbarNotification";
import TopbarPrimaryAction from "./TopbarPrimaryAction";
import TopbarSearch from "./TopbarSearch";
import TopbarUserMenu from "./TopbarUserMenu";

export default function Topbar({
    title,
    subtitle,
    search,
    actions,
    notification,
    primaryAction,
    user,
    userMenu,
    renderAvatar,
    leftContent,
    rightContent,
    onMenuClick,
    sticky = true,
    className = "",
}: TopbarProps) {
    return (
        <header
            className={cn(
                "glass",
                sticky && "sticky top-0",
                "z-20 flex h-18 items-center gap-3 border-b px-4 md:gap-4 md:px-6",
                className,
            )}
        >
            {onMenuClick && (
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink shadow-(--shadow-card) transition-colors hover:bg-surface-2 md:hidden"
                >
                    <Icon name="menu" size={20} />
                </button>
            )}

            <TopbarHeader
                title={title}
                subtitle={subtitle}
                leftContent={leftContent}
            />

            <div className="ml-auto flex items-center gap-2 md:gap-2.5">
                <TopbarSearch {...(search ?? {})} />

                {actions}

                <TopbarNotification {...(notification ?? {})} />

                {primaryAction && (
                    <TopbarPrimaryAction {...primaryAction} />
                )}

                {rightContent}

                {user && (
                    <TopbarUserMenu
                        user={user}
                        items={userMenu}
                        renderAvatar={renderAvatar}
                    />
                )}
            </div>
        </header>
    );
}

interface TopbarHeaderProps {
    title?: TopbarProps["title"];
    subtitle?: TopbarProps["subtitle"];
    leftContent?: TopbarProps["leftContent"];
}

function TopbarHeader({
    title,
    subtitle,
    leftContent,
}: TopbarHeaderProps) {
    if (leftContent) {
        return (
            <div className="min-w-0 shrink">
                {leftContent}
            </div>
        );
    }

    return (
        <div className="min-w-0 shrink">
            {title && (
                <h1
                    className="
            truncate font-display
            text-lg font-bold
            leading-tight tracking-tight
            text-ink
          "
                >
                    {title}
                </h1>
            )}

            {subtitle && (
                <p className="truncate text-xs text-muted">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
