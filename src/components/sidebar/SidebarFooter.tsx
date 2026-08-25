import type { ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

export default function SidebarFooter({
    children
}: Props) {

    return (
        <>
            {children}
        </>

    )

}