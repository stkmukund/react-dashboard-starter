import React, { useState } from "react";
import Icon from "./Icon";
import { cn } from "../../lib/utils";
import type { EyeActionButtonProps } from "../../lib/interfaces";

export default function EyeActionButton({
    isSelected,
    onClick,
    className,
    tooltipText = "See User Details",
    selectedTooltipText = "Hide User Details",
    ariaLabel,
}: EyeActionButtonProps) {
    const [isBlinking, setIsBlinking] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        (e.currentTarget as HTMLButtonElement)?.blur();
        setShowTooltip(false);
        setIsBlinking(true);
        setTimeout(() => {
            setIsBlinking(false);
        }, 320);
        onClick();
    };

    const currentTooltip = isSelected ? selectedTooltipText : tooltipText;

    return (
        <div
            className={cn("relative inline-flex items-center justify-center", className)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <button
                type="button"
                onClick={handleClick}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                aria-label={ariaLabel || currentTooltip}
                className={cn(
                    "relative grid size-8 place-items-center rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected
                        ? "bg-primary/15 text-primary hover:bg-primary/25 ring-1 ring-primary/30 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                )}
            >
                <span
                    className={cn(
                        "inline-flex items-center justify-center transition-transform",
                        isBlinking && "animate-eye-blink"
                    )}
                >
                    <Icon
                        name={isSelected ? "visibility_off" : "visibility"}
                        size={16}
                        className={cn(
                            "transition-colors duration-200",
                            isSelected ? "text-primary" : "text-muted-foreground"
                        )}
                    />
                </span>
            </button>

            {/* Tooltip */}
            <div
                role="tooltip"
                className={cn(
                    "pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg transition-all duration-150 ease-out z-30 dark:bg-neutral-800 dark:text-neutral-100 border border-neutral-700/60",
                    showTooltip
                        ? "opacity-100 visible -translate-y-0.5"
                        : "opacity-0 invisible translate-y-0"
                )}
            >
                {currentTooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-800" />
            </div>
        </div>
    );
}

export { EyeActionButton };
