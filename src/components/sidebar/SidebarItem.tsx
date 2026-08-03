import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import Icon from "../ui/Icon";
import type { SidebarItem as Item } from "./SidebarTypes";

interface Props {
    item: Item;
    collapsed: boolean;
}

export default function SidebarItem({
    item,
    collapsed
}: Props) {

    const content = (
        <>
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
                        <span className="
        rounded-full bg-ink px-2 py-0.5
        text-[10px] text-white">
                            {item.badge}
                        </span>
                    )}
                </>
            )}

        </>
    );

    const className = ({ isActive }: {
        isActive: boolean
    }) =>
        cn(
            "group flex h-11 items-center rounded-2xl text-sm transition",
            collapsed
                ? "mx-auto w-11 justify-center"
                : "gap-3 px-3",

            isActive
                ? "bg-brand-50 text-brand-700"
                : "text-muted hover:bg-surface-2"
        );

    if (item.to) {

        return (
            <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={className}
            >
                {content}
            </NavLink>
        )

    }

    return (
        <button
            disabled={item.disabled}
            onClick={item.onClick}
            title={collapsed ? item.label : undefined}
            className={cn(
                className({ isActive: false }),
                "w-full"
            )}
        >
            {content}
        </button>
    )

}