import { useState } from "react";
import { Button, Icon } from "../../components/ui";

interface KpiData {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: string;
    iconBg: string;
    iconColor: string;
    sparklineColor: string;
    sparklinePoints: string;
    sparklineArea: string;
}

const kpiCards: KpiData[] = [
    {
        title: "Total Users",
        value: "124,592",
        change: "+12%",
        isPositive: true,
        icon: "group",
        iconBg: "bg-sky-50 text-sky-600 border border-sky-100",
        iconColor: "text-sky-600",
        sparklineColor: "#0284c7",
        sparklinePoints: "0,30 20,20 40,25 60,10 80,35 100,5",
        sparklineArea: "M0,50 L0,30 Q10,40 20,20 T40,25 T60,10 T80,35 T100,5 L100,50 Z",
    },
    {
        title: "Active Sessions",
        value: "8,431",
        change: "+8.4%",
        isPositive: true,
        icon: "monitoring",
        iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
        iconColor: "text-indigo-600",
        sparklineColor: "#4f46e5",
        sparklinePoints: "0,20 30,15 55,25 75,10 100,15",
        sparklineArea: "M0,50 L0,20 Q15,35 30,15 T55,25 T75,10 T100,15 L100,50 Z",
    },
    {
        title: "MRR",
        value: "$1.2M",
        change: "+24%",
        isPositive: true,
        icon: "payments",
        iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        iconColor: "text-emerald-600",
        sparklineColor: "#059669",
        sparklinePoints: "0,40 20,20 40,30 60,15 80,25 100,5",
        sparklineArea: "M0,50 L0,40 Q20,20 40,30 T60,15 T80,25 T100,5 L100,50 Z",
    },
    {
        title: "Error Rate",
        value: "0.14%",
        change: "-2.1%",
        isPositive: false,
        icon: "warning",
        iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
        iconColor: "text-rose-600",
        sparklineColor: "#e11d48",
        sparklinePoints: "0,10 20,30 40,20 70,40 100,25",
        sparklineArea: "M0,50 L0,10 Q20,30 40,20 T70,40 T100,25 L100,50 Z",
    },
];

// const activityList = [
//     {
//         icon: "person_add",
//         iconBg: "bg-sky-50 text-sky-600",
//         title: "New enterprise account created",
//         time: "Acme Corp · 2 mins ago",
//     },
//     {
//         icon: "sync",
//         iconBg: "bg-indigo-50 text-indigo-600",
//         title: "Database synchronization completed",
//         time: "System · 45 mins ago",
//     },
//     {
//         icon: "api",
//         iconBg: "bg-rose-50 text-rose-600",
//         title: "API rate limit exceeded",
//         time: "Client ID: 9x8f7... · 2 hrs ago",
//     },
// ];

const deployments = [
    {
        id: "#DEP-8942",
        project: "Frontend Core v2.4",
        status: "Active",
        statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dot-emerald",
        user: "Sarah Jenkins",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2JpsvYOSq2IjEOXFFD0zRa4YJiHLZXkxyLfLWrjqxaiKNj31FaBsYubzXYVzrDhV6c8krIGCzcOV7v-2vQFQYKXy_HKG_Y4DJnGgDeJB9QK8k5H5S5ZoCxv-dN2OZ5N9gjSH43MKQcYxKIYIR14hKmwYUbvTHge-LbIknPPeSzzzGCrxP644385YjvIViKesYNQX6CFv8fyVJLCzvg9I9ePYlCJvjot9viNCJpdxemxxdfw4n_ql",
    },
    {
        id: "#DEP-8941",
        project: "Payment Gateway API",
        status: "Pending",
        statusColor: "bg-amber-50 text-amber-700 border-amber-200/60 dot-amber",
        user: "David Chen",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK3xBrYVDcZeFP8ajuiN6NptKRWtQoBhuLuXVVZZInA3JICeHK_yG5ilBbvQFsSZ0MASE1QE_GWa4WUJVOgJ7Sk3sY8gpaH24wGMv-JfVPfX2SwK0KniSwz0B5voyBRk7FSCG7dT_YZpMTbKZyTj2qYZ6a87f8mIA-7r6xm6hbG4zbwlzkgrBBvJF8gOfvz1CwJqB32KVJmAK8h5B14z8mtfIPPUXKq3hmJiu2tD4Vkl9DbJyHEVPW",
    },
    {
        id: "#DEP-8940",
        project: "Legacy DB Migration",
        status: "Suspended",
        statusColor: "bg-rose-50 text-rose-700 border-rose-200/60 dot-rose",
        user: "System Auto",
        avatar: null,
        initials: "MS",
    },
];

export default function DashboardPage() {
    const [timeRange, setTimeRange] = useState("Last 30 Days");
    const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);

    return (
        <div className="relative space-y-6 p-6">
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -top-10 right-0 -z-10 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
            <div className="pointer-events-none absolute bottom-10 left-0 -z-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

            {/* Header / Intro Section */}
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        Overview
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Real-time metrics and system activity
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative inline-block">
                        <select
                            value={timeRange}
                            aria-label="Select time range"
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="h-9 cursor-pointer appearance-none rounded-xl border border-line bg-surface py-1 pl-3.5 pr-8 text-xs font-semibold text-ink shadow-[var(--shadow-card)] outline-none hover:bg-surface-2 focus:border-brand-500"
                        >
                            <option value="Last 7 Days">Last 7 Days</option>
                            <option value="Last 30 Days">Last 30 Days</option>
                            <option value="Last 90 Days">Last 90 Days</option>
                            <option value="This Year">This Year</option>
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-faint">
                            <Icon name="expand_more" size={16} />
                        </span>
                    </div>

                    <Button size="sm" className="shadow-[var(--shadow-brand)]">
                        <Icon name="download" size={16} />
                        Export Report
                    </Button>
                </div>
            </header>

            {/* KPI Cards Grid */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((card, i) => (
                    <div
                        key={i}
                        onMouseEnter={() => setHoveredKpi(i)}
                        onMouseLeave={() => setHoveredKpi(null)}
                        className="card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                    >
                        {/* Top subtle highlight reflection */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-70" />

                        {/* Card Header: Icon + Badge */}
                        <div className="relative z-10 flex items-start justify-between">
                            <div
                                className={`grid h-10 w-10 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${card.iconBg}`}
                            >
                                <Icon name={card.icon} filled size={20} />
                            </div>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${card.isPositive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                                    }`}
                            >
                                <Icon
                                    name={card.isPositive ? "trending_up" : "trending_down"}
                                    size={14}
                                    className={card.isPositive ? "text-emerald-600" : "text-rose-600"}
                                />
                                {card.change}
                            </span>
                        </div>

                        {/* Card Metric Body */}
                        <div className="relative z-10 mt-5">
                            <h3 className="text-xs font-medium text-muted">
                                {card.title}
                            </h3>
                            <p className="tabular mt-1 font-display text-2xl font-bold tracking-tight text-ink">
                                {card.value}
                            </p>
                        </div>

                        {/* Mini Decorative Sparkline SVG Chart */}
                        <div
                            className={`pointer-events-none absolute bottom-0 right-0 h-14 w-28 transition-opacity duration-300 ${hoveredKpi === i ? "opacity-40" : "opacity-20"
                                }`}
                        >
                            <svg
                                className="h-full w-full"
                                preserveAspectRatio="none"
                                viewBox="0 0 100 50"
                            >
                                <path
                                    d={card.sparklineArea}
                                    fill={card.sparklineColor}
                                />
                            </svg>
                        </div>
                    </div>
                ))}
            </section>

            {/* Bento Grid: Performance Metrics & Contextual Side Panel */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                {/* Performance Metrics Chart Section (2 Columns) */}
                <section className="card relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-[var(--shadow-card)] lg:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
                        <div>
                            <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                                Performance Metrics
                            </h2>
                            <p className="text-xs text-muted">
                                Usage vs Revenue over last 6 months
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                <span className="uppercase tracking-wider font-semibold">Revenue</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                                <span className="uppercase tracking-wider font-semibold">Usage</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Canvas Area */}
                    <div className="relative mt-4 min-h-[280px] w-full flex-1">
                        {/* Grid lines */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                            <div className="h-px w-full bg-line/60" />
                            <div className="h-px w-full bg-line/60" />
                            <div className="h-px w-full bg-line/60" />
                            <div className="h-px w-full bg-line/60" />
                            <div className="h-px w-full bg-line/60" />
                        </div>

                        {/* Interactive Styled SVG Graph Lines */}
                        <svg
                            className="absolute inset-0 h-full w-full overflow-visible"
                            preserveAspectRatio="none"
                            viewBox="0 0 1000 300"
                        >
                            <defs>
                                <linearGradient id="perfRevGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="perfUsageGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Revenue Shaded Area */}
                            <path
                                d="M0,280 C150,270 250,220 350,210 C450,200 550,150 650,130 C750,110 850,40 1000,20 L1000,300 L0,300 Z"
                                fill="url(#perfRevGrad)"
                            />

                            {/* Usage Line (Sky Blue) */}
                            <path
                                d="M0,250 C100,240 200,180 300,190 C400,200 500,120 600,140 C700,160 800,80 900,90 C950,95 1000,50 1000,50"
                                fill="none"
                                stroke="#0284c7"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                            />

                            {/* Revenue Line (Indigo) with slight glow/shadow */}
                            <path
                                d="M0,280 C150,270 250,220 350,210 C450,200 550,150 650,130 C750,110 850,40 1000,20"
                                fill="none"
                                stroke="#4f46e5"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="drop-shadow-[0_4px_8px_rgba(79,70,229,0.3)]"
                            />

                            {/* Target points on high peak */}
                            <circle cx="850" cy="40" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                            <circle cx="1000" cy="20" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                            <circle cx="800" cy="80" r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                        </svg>

                        {/* X-Axis Labels */}
                        <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1 text-[11px] font-semibold uppercase text-faint">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                        </div>
                    </div>
                    <div className="h-4" />
                </section>

                {/* Right Context Panel (Status Card + Activity List) */}
                {/* <section className="flex flex-col gap-5">
                    Brand Status Card
                    <div className="relative overflow-hidden rounded-3xl bg-brand-600 p-6 text-white shadow-[var(--shadow-brand)]">
                        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-xl" />
                        <div className="relative z-10 flex flex-col justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-100">
                                System Status
                            </span>
                            <h3 className="mt-2 font-display text-xl font-bold tracking-tight">
                                All Services Operational
                            </h3>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                </span>
                                <span className="text-xs font-medium text-white/90">
                                    99.98% uptime this month
                                </span>
                            </div>
                        </div>
                    </div>

                    Recent Activity
                    <div className="card flex-1 rounded-3xl p-6 shadow-[var(--shadow-card)]">
                        <div className="flex items-center justify-between pb-3">
                            <h3 className="font-display text-base font-bold text-ink">
                                Recent Activity
                            </h3>
                            <button className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4 pt-1">
                            {activityList.map((act, idx) => (
                                <div key={idx} className="group flex items-start gap-3">
                                    <div
                                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${act.iconBg}`}
                                    >
                                        <Icon name={act.icon} size={16} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-ink">
                                            {act.title}
                                        </p>
                                        <p className="text-[11px] text-faint">
                                            {act.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}
            </div>

            {/* Recent Deployments Table */}
            <section className="card overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
                <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                            Recent Deployments
                        </h2>
                        <p className="text-xs text-muted">
                            Manage and track latest environment changes
                        </p>
                    </div>
                    <div>
                        <button className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink shadow-[var(--shadow-card)] transition-colors hover:bg-surface-2">
                            <Icon name="filter_list" size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[650px] border-collapse text-left text-xs">
                        <thead>
                            <tr className="bg-surface-2/60 text-[11px] font-bold uppercase tracking-wider text-muted">
                                <th className="py-3.5 pl-6 pr-4">Deployment ID</th>
                                <th className="px-4 py-3.5">Project</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5">Initiated By</th>
                                <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {deployments.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="transition-colors hover:bg-surface-2/40"
                                >
                                    <td className="py-3.5 pl-6 pr-4 font-mono font-medium text-ink">
                                        {row.id}
                                    </td>
                                    <td className="px-4 py-3.5 font-medium text-ink">
                                        {row.project}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${row.statusColor}`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            {row.avatar ? (
                                                <img
                                                    src={row.avatar}
                                                    alt={row.user}
                                                    className="h-6 w-6 rounded-full object-cover shadow-xs"
                                                />
                                            ) : (
                                                <div className="grid h-6 w-6 place-items-center rounded-full bg-surface-2 text-[10px] font-bold text-muted">
                                                    {row.initials}
                                                </div>
                                            )}
                                            <span className="text-ink font-medium">{row.user}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 pl-4 pr-6 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                type="button"
                                                aria-label="View deployment"
                                                className="rounded-lg p-1 text-faint transition-colors hover:bg-surface-2 hover:text-ink"
                                            >
                                                <Icon name="visibility" size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="More options"
                                                className="rounded-lg p-1 text-faint transition-colors hover:bg-surface-2 hover:text-ink"
                                            >
                                                <Icon name="more_vert" size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}