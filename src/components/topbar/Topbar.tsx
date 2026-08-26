import type { TopbarProps } from "./types";

import { cn } from "../../lib/utils";

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
    sticky = true,
    className = "",
}: TopbarProps) {
    return (
        <header
            className={cn(
                "glass",
                sticky && "sticky top-0",
                "z-20 flex h-18 items-center gap-4 border-b px-6",
                className,
            )}
        >
            <TopbarHeader
                title={title}
                subtitle={subtitle}
                leftContent={leftContent}
            />

            <div className="ml-auto flex items-center gap-2.5">
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
