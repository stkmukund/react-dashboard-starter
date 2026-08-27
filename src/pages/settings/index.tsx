import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../lib/storage";
import { Avatar, Button, Icon } from "../../components/ui";
import { cn } from "../../lib/utils";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id?: string;
    "aria-label"?: string;
}

const Switch = ({ checked, onChange, id, "aria-label": ariaLabel }: SwitchProps) => (
    <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        onClick={() => onChange(!checked)}
        className={cn(
            "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-ring",
            checked ? "bg-primary" : "bg-elevated"
        )}
    >
        <span
            className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-(--shadow-card) transition-transform duration-200",
                checked ? "translate-x-[22px]" : "translate-x-0.5"
            )}
        />
    </button>
);

interface SettingsCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const SettingsCard = ({ title, description, children }: SettingsCardProps) => (
    <section className="card rounded-3xl p-6 shadow-(--shadow-card)">
        <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        <div className="mt-5">{children}</div>
    </section>
);

interface MetricProps {
    icon: string;
    label: string;
    value: string | number;
    tint: string;
}

const Metric = ({ icon, label, value, tint }: MetricProps) => (
    <div className="rounded-2xl bg-surface-2/60 p-4">
        <div
            className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: `color-mix(in srgb, ${tint} 12%, transparent)`, color: tint }}
        >
            <Icon name={icon} size={18} />
        </div>
        <p className="font-display text-2xl font-semibold tracking-tight tabular text-foreground">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
);

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
        return storage.local.get<boolean>("pref-reduced-motion", false) ?? false;
    });

    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    useEffect(() => {
        document.documentElement.dataset.reduceMotion = reduceMotion ? "true" : "false";
        storage.local.set("pref-reduced-motion", reduceMotion);
    }, [reduceMotion]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            navigate("/login");
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mx-auto max-w-3xl space-y-5">
                {/* Profile */}
                <SettingsCard title="Profile" description="How you appear across your workspace.">
                    <div className="flex items-center gap-4">
                        <Avatar
                            name={user?.name || "User"}
                            id={user?.id}
                            src={user?.avatar_url || undefined}
                            size="lg"
                            className="h-16 w-16 text-lg"
                        />
                        <div className="min-w-0">
                            <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                                {user?.name || "Anonymous"}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">{user?.email || "No email provided"}</p>
                        </div>
                    </div>
                </SettingsCard>

                {/* Workspace */}
                <SettingsCard title="Workspace" description="Your activity at a glance.">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Metric icon="dashboard" label="Boards" value="12" tint="var(--color-primary)" />
                        <Metric icon="task_alt" label="Tasks" value="48" tint="var(--color-info)" />
                        <Metric icon="group" label="People" value="6" tint="var(--color-success)" />
                    </div>
                </SettingsCard>

                {/* Preferences */}
                <SettingsCard title="Preferences" description="Saved to this browser.">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-foreground">Reduce motion</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Minimize animations and transitions across the app.
                            </p>
                        </div>
                        <Switch
                            checked={reduceMotion}
                            onChange={setReduceMotion}
                            aria-label="Reduce motion toggle"
                        />
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-4 border-t pt-5">
                        <div>
                            <p className="text-sm font-medium text-foreground">Command menu</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Jump anywhere, search pages, or trigger quick actions.
                            </p>
                        </div>
                        <kbd className="flex items-center gap-0.5 rounded-md bg-surface-2 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </SettingsCard>

                {/* About */}
                <SettingsCard title="About">
                    <div className="flex items-center gap-3">
                        <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-2xl shadow-(--shadow-brand)">
                            <Icon
                                name={appConfig.logoIcon}
                                filled={true}
                                size={20}
                                className="text-white"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">{appConfig.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {appConfig.tagline}
                            </p>
                        </div>
                    </div>
                </SettingsCard>

                {/* Account */}
                <SettingsCard title="Account" description="Manage your session.">
                    <Button
                        variant="danger"
                        loading={loggingOut}
                        onClick={handleLogout}
                    >
                        <Icon name="logout" size={16} /> Sign out
                    </Button>
                </SettingsCard>
            </div>
        </div>
    );
}
