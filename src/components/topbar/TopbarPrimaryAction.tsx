import Button from "../ui/Button";
import type { TopbarPrimaryActionProps } from "./types";

export default function TopbarPrimaryAction({
    label,
    icon,
    onClick,
    className = "",
}: TopbarPrimaryActionProps) {
    return (
        <Button
            size="md"
            onClick={onClick}
            className={className}
        >
            {icon}
            {label}
        </Button>

    );
}
