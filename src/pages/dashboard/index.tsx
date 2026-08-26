import { Button, Icon } from "../../components/ui";

export default function DashboardPage() {
    return (
        <div className="space-y-6 p-6">
            {/* Welcome banner */}
            <div className="card rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                            Welcome to your dashboard
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            This is a clean, reusable starter template built with React and TypeScript.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Icon name="tune" size={16} />
                            Customize
                        </Button>
                        <Button size="sm">
                            <Icon name="add" size={16} />
                            New Item
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Active Users", value: "1,248", change: "+12%", icon: "group" },
                    { title: "Total Revenue", value: "$48,200", change: "+8.4%", icon: "payments" },
                    { title: "Conversion Rate", value: "3.42%", change: "+1.2%", icon: "trending_up" },
                    { title: "Avg. Session", value: "4m 32s", change: "-0.4%", icon: "schedule" },
                ].map((stat, i) => (
                    <div key={i} className="card rounded-3xl p-5 shadow-(--shadow-card)">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted">{stat.title}</span>
                            <div className="grid h-8 w-8 place-items-center rounded-xl bg-surface-2 text-faint">
                                <Icon name={stat.icon} size={18} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-ink">{stat.value}</span>
                            <span className={`text-xs font-semibold ${stat.change.startsWith("+") ? "text-brand-600" : "text-priority-urgent"}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}