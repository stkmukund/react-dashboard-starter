import type { ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

export default function SidebarFooter({
    children
}: Props) {

    return (

        <div className="
mt-auto
border-t
px-3
py-3">

            {children}

        </div>

    )

}