
import Icon from "../ui/Icon";
import type { TopbarNotificationProps } from "./types";

export default function TopbarNotification({
    enabled = true,
    onClick,
    ariaLabel = "Notifications",
}: TopbarNotificationProps) {
    if (!enabled || !onClick) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-(--shadow-card) transition-all duration-200 hover:-translate-y-px hover:text-ink hover:shadow-(--shadow-soft) sm:flex"
        >
            <Icon name="notifications" size={20} className="shrink-0" />
        </button>
    );
}
