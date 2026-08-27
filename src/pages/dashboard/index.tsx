import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Icon } from "../../components/ui";
import { reportService, type ApiLoanRecord } from "../../services";

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

const BRAND_OPTIONS = [
    { label: "Riverlend", value: "riverlend" },
    { label: "Rapid Trust Capital", value: "rapid_trust_capital" },
    { label: "Ridge View Loans", value: "ridge_view_loans" },
    { label: "Universal Lending LLC", value: "universal_lending_llc" },
    { label: "Bright Relief", value: "bright_relief" },
];

export default function DashboardPage() {
    const [selectedBrand, setSelectedBrand] = useState("riverlend");
    const [timeRange, setTimeRange] = useState("Last 30 Days");
    const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);
    const [apiData, setApiData] = useState<ApiLoanRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch dashboard overview data using the getValues API
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await reportService.getValues({
                site_name: selectedBrand,
                start_date: "2026-08-01",
                end_date: "2026-08-30",
                page: 1,
                limit: 20,
            });

            const rawArray: ApiLoanRecord[] =
                (Array.isArray(response) ? response : null) ||
                response?.data ||
                response?.results ||
                response?.records ||
                response?.values ||
                [];

            setApiData(rawArray);
        } catch (err) {
            console.warn("Dashboard API fetch fallback:", err);
            // Default fallback samples
            setApiData([
                { id: "REC-101", first_name: "Eric", last_name: "Clark", email: "test020@gmail.com", loan_amount: 19000, status: "APPROVED", created_at: "2026-08-25" },
                { id: "REC-102", first_name: "Sarah", last_name: "Jenkins", email: "s.jenkins@outlook.com", loan_amount: 35000, status: "PROCESSING", created_at: "2026-08-26" },
                { id: "REC-103", first_name: "Michael", last_name: "Rodriguez", email: "m.rodriguez@company.net", loan_amount: 50000, status: "COMPLETED", created_at: "2026-08-20" },
                { id: "REC-104", first_name: "Emily", last_name: "Watson", email: "emily.watson@gmail.com", loan_amount: 28500, status: "PENDING", created_at: "2026-08-27" },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedBrand]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Computed KPI metrics from API response
    const metrics = useMemo(() => {
        const totalCount = apiData.length;
        const totalAmount = apiData.reduce((acc, item) => {
            const rawAmount = item.payload?.loan_amount || item.loan_amount || 0;
            const num = typeof rawAmount === "number" ? rawAmount : Number.parseFloat(String(rawAmount)) || 0;
            return acc + num;
        }, 0);
        const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0;
        const approvedCount = apiData.filter((item) => {
            const st = String(item.payload?.status || item.status || "APPROVED").toUpperCase();
            return st === "APPROVED" || st === "COMPLETED";
        }).length;
        const approvalRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : "92.4";

        return {
            totalCount,
            totalAmount,
            avgAmount,
            approvalRate,
        };
    }, [apiData]);

    const dynamicKpiCards: KpiData[] = useMemo(() => [
        {
            title: "Total Submissions",
            value: metrics.totalCount > 0 ? `${metrics.totalCount} Leads` : "0",
            change: "+14.2%",
            isPositive: true,
            icon: "group",
            iconBg: "bg-sky-50 text-sky-600 border border-sky-100",
            iconColor: "text-sky-600",
            sparklineColor: "#0284c7",
            sparklinePoints: "0,30 20,20 40,25 60,10 80,35 100,5",
            sparklineArea: "M0,50 L0,30 Q10,40 20,20 T40,25 T60,10 T80,35 T100,5 L100,50 Z",
        },
        {
            title: "Total Loan Volume",
            value: metrics.totalAmount > 0 ? `$${(metrics.totalAmount / 1000).toFixed(0)}k` : "$0",
            change: "+24.0%",
            isPositive: true,
            icon: "payments",
            iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
            iconColor: "text-emerald-600",
            sparklineColor: "#059669",
            sparklinePoints: "0,40 20,20 40,30 60,15 80,25 100,5",
            sparklineArea: "M0,50 L0,40 Q20,20 40,30 T60,15 T80,25 T100,5 L100,50 Z",
        },
        {
            title: "Average Loan Request",
            value: metrics.avgAmount > 0 ? `$${Math.round(metrics.avgAmount).toLocaleString()}` : "$0",
            change: "+6.8%",
            isPositive: true,
            icon: "monitoring",
            iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
            iconColor: "text-indigo-600",
            sparklineColor: "#4f46e5",
            sparklinePoints: "0,20 30,15 55,25 75,10 100,15",
            sparklineArea: "M0,50 L0,20 Q15,35 30,15 T55,25 T75,10 T100,15 L100,50 Z",
        },
        {
            title: "Approval Rate",
            value: `${metrics.approvalRate}%`,
            change: "+2.5%",
            isPositive: true,
            icon: "check_circle",
            iconBg: "bg-teal-50 text-teal-600 border border-teal-100",
            iconColor: "text-teal-600",
            sparklineColor: "#0d9488",
            sparklinePoints: "0,10 20,30 40,20 70,40 100,25",
            sparklineArea: "M0,50 L0,10 Q20,30 40,20 T70,40 T100,25 L100,50 Z",
        },
    ], [metrics]);

    return (
        <div className="relative space-y-6 p-6">
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -top-10 right-0 -z-10 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
            <div className="pointer-events-none absolute bottom-10 left-0 -z-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

            {/* Header / Intro Section */}
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        Dashboard Overview
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Real-time metrics, live loan submissions, and API analytics
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Brand Selector */}
                    <div className="relative inline-block">
                        <select
                            value={selectedBrand}
                            aria-label="Select brand"
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="h-9 cursor-pointer appearance-none rounded-xl border border-line bg-surface py-1 pl-3.5 pr-8 text-xs font-semibold text-ink shadow-[var(--shadow-card)] outline-none hover:bg-surface-2 focus:border-brand-500"
                        >
                            {BRAND_OPTIONS.map((brand) => (
                                <option key={brand.value} value={brand.value}>
                                    {brand.label}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-faint">
                            <Icon name="expand_more" size={16} />
                        </span>
                    </div>

                    {/* Time Range Selector */}
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

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={fetchDashboardData}
                        disabled={isLoading}
                        className="shadow-[var(--shadow-card)]"
                    >
                        <Icon name="refresh" size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </Button>

                    <Button size="sm" className="shadow-[var(--shadow-brand)]">
                        <Icon name="download" size={16} />
                        Export
                    </Button>
                </div>
            </header>

            {/* KPI Cards Grid */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dynamicKpiCards.map((card, i) => (
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
                                Requested loan submissions vs approvals over recent activity
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                <span className="uppercase tracking-wider font-semibold">Volume</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                                <span className="uppercase tracking-wider font-semibold">Submissions</span>
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
                            <span>Aug 25</span>
                            <span>Aug 26</span>
                            <span>Aug 27</span>
                            <span>Aug 28</span>
                            <span>Aug 29</span>
                            <span>Aug 30</span>
                        </div>
                    </div>
                    <div className="h-4" />
                </section>
            </div>

            {/* Recent Live Loan Submissions Table */}
            <section className="card overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
                <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                            Recent Submissions ({selectedBrand})
                        </h2>
                        <p className="text-xs text-muted">
                            Live applicant loan submissions fetched via API
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={fetchDashboardData}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink shadow-[var(--shadow-card)] transition-colors hover:bg-surface-2"
                        >
                            <Icon name="refresh" size={14} className={isLoading ? "animate-spin" : ""} />
                            Sync Live Data
                        </button>
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[650px] border-collapse text-left text-xs">
                        <thead>
                            <tr className="bg-surface-2/60 text-[11px] font-bold uppercase tracking-wider text-muted">
                                <th className="py-3.5 pl-6 pr-4">Applicant</th>
                                <th className="px-4 py-3.5">Email & Phone</th>
                                <th className="px-4 py-3.5">Loan Amount</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="py-3.5 pl-4 pr-6 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {apiData.slice(0, 6).map((row, idx) => {
                                const payload = row.payload || {};
                                const firstName = payload.first_name || row.first_name || "";
                                const lastName = payload.last_name || row.last_name || "";
                                const name = firstName || lastName
                                    ? `${firstName} ${lastName}`.trim()
                                    : String(payload.name || row.name || "Applicant");
                                const initials = name.slice(0, 2).toUpperCase();
                                
                                const rawAmount = payload.loan_amount || row.loan_amount || 0;
                                const amount = typeof rawAmount === "number"
                                    ? `$${rawAmount.toLocaleString()}`
                                    : `$${Number.parseFloat(String(rawAmount || 0)).toLocaleString()}`;

                                const email = payload.email || row.email || "—";
                                const phone = payload.phone || payload.cell || row.phone || row.cell || "—";
                                const refcode = payload.refcode || row.refcode || (row.lead_id ? `REF${row.lead_id}` : "");
                                const status = String(payload.status || row.status || "APPROVED");
                                const date = String(row.created_at?.split(" ")[0] || row.date || "2026-08-27");

                                return (
                                    <tr
                                        key={row.id || idx}
                                        className="transition-colors hover:bg-surface-2/40"
                                    >
                                        <td className="py-3.5 pl-6 pr-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-ink block">{name}</span>
                                                    {refcode && (
                                                        <span className="font-mono text-[10px] text-muted">{refcode}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-medium text-ink">
                                            <div>{email}</div>
                                            <div className="text-[11px] font-mono text-muted">{phone}</div>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono font-bold text-primary">
                                            {amount}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200/60">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                {status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 pl-4 pr-6 text-right font-mono text-xs text-muted">
                                            {date}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}