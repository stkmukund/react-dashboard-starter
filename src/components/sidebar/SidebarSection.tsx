import SidebarItem from "./SidebarItem";
import type { SidebarSection as Section } from "./SidebarTypes";

interface Props {
    section: Section;
    collapsed: boolean;
}

export default function SidebarSection({
    section,
    collapsed
}: Props) {

    return (
        <div className="mb-3">

            {section.title && !collapsed && (
                <p className="px-4 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-widest text-faint">
                    {section.title}
                </p>
            )}

            {section.render
                ?
                section.render()
                :
                <div className="space-y-1 px-3">

                    {
                        section.items?.map(item => (
                            <SidebarItem
                                key={item.label}
                                item={item}
                                collapsed={collapsed}
                            />
                        ))
                    }

                </div>
            }

        </div>
    )

}