import Icon from "../ui/Icon";
import type { SidebarHeaderConfig } from "./SidebarTypes";

interface Props {
    collapsed: boolean;
    onToggle: () => void;
    config: SidebarHeaderConfig;
    isMobile?: boolean;
}

export default function SidebarHeader({
    collapsed,
    onToggle,
    config,
    isMobile = false,
}: Props) {
    return (
        <>
            <div className="flex h-16 items-center gap-3 px-3.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl brand-gradient shadow">
                    {config.logo}
                </div>
                {!collapsed && (
                    <>
                        <span className="flex-1 truncate font-bold text-ink">
                            {config.title}
                        </span>

                        <button
                            type="button"
                            onClick={onToggle}
                            aria-label={isMobile ? "Close menu" : "Collapse sidebar"}
                            className="grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-surface-2 hover:text-ink transition-colors"
                        >
                            <Icon
                                name={isMobile ? "close" : "chevron_left"}
                                size={18}
                            />
                        </button>
                    </>
                )}
            </div>

            {collapsed && !isMobile && (
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label="Expand sidebar"
                    className="
          mx-auto mb-2 grid h-7 w-7 place-items-center
          rounded-lg text-faint hover:bg-surface-2 transition-colors"
                >
                    <Icon
                        name="chevron_right"
                        size={16}
                    />
                </button>
            )}
        </>
    );
}