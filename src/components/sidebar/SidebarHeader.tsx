import Icon from "../ui/Icon";
import type { SidebarHeaderConfig } from "./SidebarTypes";

interface Props {
    collapsed: boolean;
    onToggle: () => void;
    config: SidebarHeaderConfig;
}

export default function SidebarHeader({
    collapsed,
    onToggle,
    config,
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
                            onClick={onToggle}
                            className="grid h-7 w-7 place-items-center rounded-lg text-faint hover:bg-surface-2"
                        >
                            <Icon
                                name="chevron_left"
                                size={16}
                            />

                        </button>
                    </>
                )}

            </div>

            {collapsed && (
                <button
                    onClick={onToggle}
                    className="
          mx-auto mb-2 grid h-7 w-7 place-items-center
          rounded-lg text-faint hover:bg-surface-2"
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