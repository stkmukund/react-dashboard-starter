import { AnimatePresence, motion } from "framer-motion";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import Icon from "./Icon";

export interface CommandItem {
    id: string;
    label: string;
    description?: string;
    category?: string;
    icon?: ReactNode | string;
    color?: string;
    shortcut?: string;
    disabled?: boolean;
    onSelect?: () => void;
}

export interface CommandMenuProps {
    open: boolean;
    onClose: () => void;
    items?: CommandItem[];
    placeholder?: string;
    emptyText?: string;
    onSearchChange?: (query: string) => void;
    /** Custom search filter logic. Defaults to case-insensitive match on label, description, and category */
    filterItem?: (item: CommandItem, query: string) => boolean;
}

export default function CommandMenu({
    open,
    onClose,
    items = [],
    placeholder = "Type a command or search…",
    emptyText = "No results found.",
    onSearchChange,
    filterItem,
}: CommandMenuProps) {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setQuery("");
        setActive(0);
        onClose();
    };

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => inputRef.current?.focus(), 40);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const filteredItems = useMemo(() => {
        if (!query.trim()) return items;
        const q = query.toLowerCase().trim();

        if (filterItem) {
            return items.filter((item) => filterItem(item, q));
        }

        return items.filter((item) => {
            const matchLabel = item.label.toLowerCase().includes(q);
            const matchDesc = item.description?.toLowerCase().includes(q) ?? false;
            const matchCat = item.category?.toLowerCase().includes(q) ?? false;
            return matchLabel || matchDesc || matchCat;
        });
    }, [items, query, filterItem]);

    const activeIndex = active >= filteredItems.length ? 0 : active;

    const run = (item?: CommandItem) => {
        if (!item || item.disabled) return;
        handleClose();
        item.onSelect?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (filteredItems.length === 0) {
            if (e.key === "Escape") handleClose();
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            run(filteredItems[activeIndex]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleClose();
        }
    };

    // Scroll active item into view
    useEffect(() => {
        if (!listRef.current) return;
        const activeElement = listRef.current.querySelector<HTMLElement>(`[data-index="${active}"]`);
        if (activeElement) {
            activeElement.scrollIntoView({ block: "nearest" });
        }
    }, [active]);

    // Group items if any have category defined
    const groupedItems = useMemo(() => {
        const hasCategories = filteredItems.some((i) => Boolean(i.category));
        if (!hasCategories) {
            return [{ category: undefined, items: filteredItems }];
        }

        const groups: { category?: string; items: CommandItem[] }[] = [];
        const groupMap = new Map<string | undefined, CommandItem[]>();

        filteredItems.forEach((item) => {
            const cat = item.category;
            if (!groupMap.has(cat)) {
                const arr: CommandItem[] = [];
                groupMap.set(cat, arr);
                groups.push({ category: cat, items: arr });
            }
            groupMap.get(cat)!.push(item);
        });

        return groups;
    }, [filteredItems]);

    let currentIndex = 0;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="fixed inset-0 bg-ink/35 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        className="card relative z-10 w-full max-w-xl overflow-hidden rounded-3xl shadow-(--shadow-lift)"
                        initial={{ opacity: 0, scale: 0.98, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -4 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 border-b px-4">
                            <Icon name="search" size={18} className="text-faint shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    onSearchChange?.(e.target.value);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="h-13 w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
                            />
                            <kbd className="hidden sm:inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold text-muted">
                                ESC
                            </kbd>
                        </div>

                        {/* Results List */}
                        <div
                            ref={listRef}
                            className="max-h-80 overflow-y-auto p-2 no-scrollbar"
                            role="listbox"
                        >
                            {filteredItems.length === 0 ? (
                                <p className="px-3 py-8 text-center text-sm text-faint">
                                    {emptyText}
                                </p>
                            ) : (
                                groupedItems.map((group, gIdx) => (
                                    <div key={group.category || `group-${gIdx}`} className="mb-1 last:mb-0">
                                        {group.category && (
                                            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-faint">
                                                {group.category}
                                            </p>
                                        )}

                                        {group.items.map((item) => {
                                            const itemIndex = currentIndex++;
                                            const isActive = active === itemIndex;

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isActive}
                                                    data-index={itemIndex}
                                                    disabled={item.disabled}
                                                    onMouseEnter={() => setActive(itemIndex)}
                                                    onClick={() => run(item)}
                                                    className={cn(
                                                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-all duration-150",
                                                        isActive
                                                            ? "bg-brand-50 text-brand-700 font-medium"
                                                            : "text-muted hover:bg-surface-2 hover:text-ink",
                                                        item.disabled && "cursor-not-allowed opacity-50"
                                                    )}
                                                >
                                                    {/* Icon or Color Dot */}
                                                    {item.color ? (
                                                        <span
                                                            className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-surface"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                    ) : typeof item.icon === "string" ? (
                                                        <Icon
                                                            name={item.icon}
                                                            size={18}
                                                            className="shrink-0"
                                                        />
                                                    ) : item.icon ? (
                                                        <span className="shrink-0 flex items-center justify-center">
                                                            {item.icon}
                                                        </span>
                                                    ) : null}

                                                    {/* Label & Description */}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm">{item.label}</p>
                                                        {item.description && (
                                                            <p className="truncate text-xs text-faint">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Shortcut key */}
                                                    {item.shortcut && (
                                                        <kbd className="hidden sm:inline-flex items-center rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                                                            {item.shortcut}
                                                        </kbd>
                                                    )}

                                                    {/* Return icon indicator */}
                                                    {isActive && (
                                                        <Icon
                                                            name="keyboard_return"
                                                            size={14}
                                                            className="text-brand-500 shrink-0"
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
