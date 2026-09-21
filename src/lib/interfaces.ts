export interface User {
    id: string;
    name: string;
    email: string;
    avatar_url?: string | null;
}

export interface EyeActionButtonProps {
    isSelected: boolean;
    onClick: () => void;
    className?: string;
    tooltipText?: string;
    selectedTooltipText?: string;
    ariaLabel?: string;
}