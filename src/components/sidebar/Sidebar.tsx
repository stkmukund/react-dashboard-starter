import SidebarHeader from "./SidebarHeader";
import SidebarSection from "./SidebarSection";
import SidebarFooter from "./SidebarFooter";

import type { SidebarProps } from "./SidebarTypes";

import { cn } from "../../lib/utils";

export default function Sidebar({
    collapsed,
    onToggle,
    header,
    sections,
    footer,
    bottomContent
}: SidebarProps) {

    return (

        <aside
            className={cn("fixed inset-y-3 left-3 z-40 hidden flex-col overflow-hidden rounded-3xl border bg-surface shadow-xl md:flex", collapsed ? "w-18" : "w-63")}
        >
            <SidebarHeader
                collapsed={collapsed}
                onToggle={onToggle}
                config={header}
            />
            <div className="h-full flex flex-col justify-between overflow-y-auto no-scrollbar">
                {
                    sections.map((section, index) => (
                        <SidebarSection
                            key={index}
                            section={section}
                            collapsed={collapsed}
                        />
                    ))
                }

            </div>

            {
                !collapsed &&
                bottomContent
            }

            <SidebarFooter>
                {footer}
            </SidebarFooter>

        </aside>

    )

}