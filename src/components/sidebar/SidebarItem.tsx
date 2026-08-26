import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import Icon from "../ui/Icon";
import type { SidebarItem as Item } from "./SidebarTypes";

interface Props {
    item: Item;
    collapsed: boolean;
    onItemClick?: () => void;
}

export default function SidebarItem({
    item,
    collapsed,
    onItemClick,
}: Props) {
    const location = useLocation();

    const getIsActive = (navLinkIsActive?: boolean): boolean => {
        if (typeof item.isActive === "boolean") {
            return item.isActive;
        }
        if (typeof item.isActive === "function") {
            return item.isActive(location.pathname);
        }
        if (navLinkIsActive !== undefined) {
            return navLinkIsActive;
        }
        if (item.to) {
            return location.pathname === item.to || location.pathname.startsWith(item.to + "/");
        }
        return false;
    };

    const getItemClassName = (isActive: boolean) =>
        cn(
            "relative group flex h-11 items-center rounded-2xl text-sm transition",
            collapsed
                ? "mx-auto w-11 justify-center"
                : "gap-3 px-3",

            isActive
                ? "bg-brand-50 text-brand-700 font-medium"
                : "text-muted hover:bg-surface-2"
        );

    const renderContent = (isActive: boolean) => (
        <>
            {isActive && !collapsed && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-500" />
            )}

            <Icon
                name={item.icon}
                className="text-[22px] shrink-0"
            />

            {!collapsed && (
                <>
                    <span className="flex-1 truncate">
                        {item.label}
                    </span>

                    {item.badge !== undefined && (
                        <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] text-white">
                            {item.badge}
                        </span>
                    )}
                </>
            )}
        </>
    );

    if (item.to) {
        return (
            <NavLink
                to={item.to}
                end={item.end}
                title={collapsed ? item.label : undefined}
                onClick={() => {
                    if (onItemClick) onItemClick();
                }}
                className={({ isActive }) => getItemClassName(getIsActive(isActive))}
            >
                {({ isActive }) => renderContent(getIsActive(isActive))}
            </NavLink>
        );
    }

    const buttonIsActive = getIsActive();

    return (
        <button
            type="button"
            disabled={item.disabled}
            onClick={() => {
                item.onClick?.();
                if (onItemClick) onItemClick();
            }}
            title={collapsed ? item.label : undefined}
            className={cn(
                getItemClassName(buttonIsActive),
                "w-full text-left"
            )}
        >
            {renderContent(buttonIsActive)}
        </button>
    );
}