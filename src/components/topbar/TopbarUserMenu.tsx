import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

import { cn } from "../../lib/utils";
import Icon from "../ui/Icon";

import type {
    TopbarMenuItem,
    TopbarUser,
} from "./types";

import TopbarUserAvatar from "./TopbarUserAvatar";

interface TopbarUserMenuProps {
    user: TopbarUser;
    items?: TopbarMenuItem[];
    renderAvatar?: (user: TopbarUser) => ReactNode;
}

export default function TopbarUserMenu({
    user,
    items = [],
    renderAvatar,
}: TopbarUserMenuProps) {
    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );
        };
    }, [open]);

    const firstName = user.name?.split(" ")[0];

    const avatar = renderAvatar ? (
        renderAvatar(user)
    ) : (
        <TopbarUserAvatar user={user} />
    );

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 shadow-(--shadow-card) transition-all duration-200 hover:border-brand-300 hover:shadow-(--shadow-soft)"
            >
                {avatar}

                <span
                    className="hidden max-w-28 truncate text-sm font-medium text-ink lg:block"
                >
                    {firstName}
                </span>

                <Icon
                    name="keyboard_arrow_down"
                    size={16}
                    className={cn(
                        "text-faint transition-transform",
                        open && "rotate-180",
                    )}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    role="menu"
                    className="card animate-in absolute right-0 mt-2 w-56 rounded-2xl p-1.5 shadow-(--shadow-lift)"
                >
                    <UserInfo user={user} />

                    {items.length > 0 && (
                        <div className="my-1 border-t" />
                    )}

                    {items.map((item, index) => (
                        <UserMenuItem
                            key={`${item.label}-${index}`}
                            item={item}
                            onClose={() => setOpen(false)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface UserInfoProps {
    user: TopbarUser;
}

function UserInfo({ user }: UserInfoProps) {
    return (
        <div className="px-3 py-2">
            {user.name && (
                <p className="truncate text-sm font-semibold text-ink">
                    {user.name}
                </p>
            )}

            {user.email && (
                <p className="truncate text-xs text-faint">
                    {user.email}
                </p>
            )}
        </div>
    );
}

interface UserMenuItemProps {
    item: TopbarMenuItem;
    onClose: () => void;
}

function UserMenuItem({
    item,
    onClose,
}: UserMenuItemProps) {
    return (
        <button
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
                onClose();
                item.onClick();
            }}
            className={cn(
                "flex w-full items-center gap-2",
                "rounded-xl px-3 py-2",
                "text-sm transition-colors",
                item.danger
                    ? "text-priority-urgent hover:bg-surface-2"
                    : "text-ink hover:bg-surface-2",
                item.disabled &&
                "cursor-not-allowed opacity-50",
            )}
        >
            {item.icon}
            {item.label}
        </button>
    );
}
