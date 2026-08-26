import type { TopbarUser } from "./types";

interface TopbarUserAvatarProps {
    user: TopbarUser;
}

export default function TopbarUserAvatar({
    user,
}: TopbarUserAvatarProps) {
    const initials =
        user.name
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "?";

    if (user.avatarUrl) {
        return (
            <img
                src={user.avatarUrl}
                alt={user.name || "User"}
                className="h-8 w-8 rounded-full object-cover"
            />
        );
    }

    return (
        <div
            className="
        flex h-8 w-8 items-center justify-center
        rounded-full bg-brand-100
        text-xs font-semibold text-brand-700
      "
        >
            {initials}
        </div>
    );
}
