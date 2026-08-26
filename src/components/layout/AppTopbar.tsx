import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Topbar } from "../topbar";
import { Avatar, Icon } from "../ui";
import { useLayout } from "./LayoutContext";

export interface AppTopbarProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    primaryAction?: {
        label: string;
        icon?: React.ReactNode;
        onClick: () => void;
    };
    onSearchClick?: () => void;
    searchPlaceholder?: string;
}

export default function AppTopbar({
    title,
    subtitle,
    actions,
    primaryAction,
    onSearchClick,
    searchPlaceholder = "Search…",
}: AppTopbarProps) {
    const { user, logout } = useAuth();
    const { toggleCommand } = useLayout();
    const navigate = useNavigate();

    const handleSearch = onSearchClick ?? toggleCommand;

    return (
        <Topbar
            title={title}
            subtitle={subtitle}
            actions={actions}
            search={{
                placeholder: searchPlaceholder,
                shortcut: "K",
                onClick: handleSearch,
            }}
            notification={{
                onClick: () => {
                    // Open notifications
                },
            }}
            primaryAction={primaryAction}
            user={
                user
                    ? {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatarUrl: user.avatar_url,
                    }
                    : undefined
            }
            renderAvatar={(u) => (
                <Avatar
                    name={u.name || ""}
                    id={u.id}
                    src={u.avatarUrl || undefined}
                    size="sm"
                />
            )}
            userMenu={[
                {
                    label: "Profile",
                    onClick: () => navigate("/profile"),
                },
                {
                    label: "Settings",
                    onClick: () => navigate("/settings"),
                },
                {
                    label: "Log out",
                    icon: <Icon name="logout" size={16} />,
                    danger: true,
                    onClick: async () => {
                        await logout();
                        navigate("/login");
                    },
                },
            ]}
        />
    );
}
