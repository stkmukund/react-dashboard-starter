import Icon from "../ui/Icon";

import type { TopbarSearchProps } from "./types";

export default function TopbarSearch({
    enabled = true,
    placeholder = "Search…",
    shortcut,
    onClick,
}: TopbarSearchProps) {
    if (!enabled || !onClick) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Search"
            className="hidden h-10 w-56 items-center gap-2.5 rounded-full border border-border bg-card px-4 text-sm text-faint shadow-(--shadow-card) transition-all duration-200 hover:border-primary-border hover:text-muted-foreground hover:shadow-(--shadow-soft) md:flex lg:w-64"
        >
            <Icon name="search" size={16} className="shrink-0" />

            <span className="flex-1 truncate text-left">
                {placeholder}
            </span>

            {shortcut && (
                <kbd
                    className="flex items-center gap-0.5 rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
                >
                    <Icon name="keyboard_command_key" size={12} className="shrink-0" />
                    {shortcut}
                </kbd>
            )}
        </button>
    );
}
