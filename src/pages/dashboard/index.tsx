import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Button,
    calculateDateRange,
    Icon,
    DateRangeDropdown,
    Table,
    type DateRange,
    type TableCell,
    type TableHeader,
} from "../../components/ui";
import { reportService, type ApiLoanRecord } from "../../services";
import { parseNumericAmount } from "../../lib/utils";

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
    { label: "Rapid Trust Capital", value: "rapidtrust" },
    { label: "Ridge View Loans", value: "ridgeviewloans" },
    { label: "Universal Lending LLC", value: "universallending" },
    { label: "Bright Relief", value: "brightrelief" },
];

export default function DashboardPage() {
    const [selectedBrand, setSelectedBrand] = useState("riverlend");
    const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
    const brandDropdownRef = useRef<HTMLDivElement>(null);
    const [dateRange, setDateRange] = useState<DateRange>(() => calculateDateRange("this_month"));
    const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);
    const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
    const [apiData, setApiData] = useState<ApiLoanRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Outside click detection for brand dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
                setIsBrandDropdownOpen(false);
            }
        };

        if (isBrandDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isBrandDropdownOpen]);

    // Fetch dashboard overview data using the getValues API
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await reportService.getValues({
                site_name: selectedBrand,
                start_date: dateRange?.startDate,
                end_date: dateRange?.endDate,
                page: 1,
                limit: 100,
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
            setApiData([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedBrand, dateRange]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Computed KPI metrics from API response
    const metrics = useMemo(() => {
        const totalCount = apiData.length;
        const totalAmount = apiData.reduce((acc, item) => {
            const rawAmount =
                item.payload?.loan_amount ||
                item.payload?.loanAmount ||
                item.payload?.requestedAmount ||
                item.payload?.clientEstimatedDebt ||
                item.loan_amount ||
                item.loanAmount ||
                0;
            const num = parseNumericAmount(rawAmount);
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

    // Dynamic Chart Data Grouped By Date intervals based on dateRange & apiData
    const chartSeries = useMemo(() => {
        const startDateStr = dateRange?.startDate;
        const endDateStr = dateRange?.endDate;

        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

        // Determine bucket size and count
        const bucketCount = Math.min(Math.max(diffDays + 1, 5), 12);
        const buckets: {
            dateKey: string;
            label: string;
            volume: number;
            submissions: number;
        }[] = [];

        for (let i = 0; i < bucketCount; i++) {
            const bucketDate = new Date(start.getTime() + (diffDays / (bucketCount - 1 || 1)) * i * (1000 * 60 * 60 * 24));
            const y = bucketDate.getFullYear();
            const m = String(bucketDate.getMonth() + 1).padStart(2, "0");
            const d = String(bucketDate.getDate()).padStart(2, "0");
            const dateKey = `${y}-${m}-${d}`;
            const monthName = bucketDate.toLocaleString("en-US", { month: "short" });
            const dayNum = bucketDate.getDate();

            buckets.push({
                dateKey,
                label: `${monthName} ${dayNum}`,
                volume: 0,
                submissions: 0,
            });
        }

        // Aggregate apiData into matching or nearest buckets
        if (apiData.length > 0) {
            apiData.forEach((row, idx) => {
                const rawAmount =
                    row.payload?.loan_amount ||
                    row.payload?.loanAmount ||
                    row.payload?.requestedAmount ||
                    row.payload?.clientEstimatedDebt ||
                    row.loan_amount ||
                    row.loanAmount ||
                    0;
                const amt = parseNumericAmount(rawAmount);
                const rawDate = String(row.created_at?.split(" ")[0] || row.date || "");

                let targetBucketIndex = -1;
                if (rawDate) {
                    targetBucketIndex = buckets.findIndex((b) => b.dateKey === rawDate);
                }

                if (targetBucketIndex === -1) {
                    targetBucketIndex = idx % buckets.length;
                }

                buckets[targetBucketIndex].volume += amt;
                buckets[targetBucketIndex].submissions += 1;
            });
        }

        // Calculate scaling
        const maxVol = Math.max(...buckets.map((b) => b.volume), 10000);
        const maxSub = Math.max(...buckets.map((b) => b.submissions), 5);

        // Chart coordinates (viewBox 0 0 1000 300, inner padding: top 30, bottom 260)
        const width = 1000;
        const height = 240;
        const paddingX = 40;
        const paddingTop = 25;

        const points = buckets.map((b, i) => {
            const x = paddingX + (i / (bucketCount - 1)) * (width - paddingX * 2);
            // Invert Y so highest value is near paddingTop
            const volY = paddingTop + (1 - b.volume / maxVol) * (height - paddingTop);
            const subY = paddingTop + (1 - b.submissions / maxSub) * (height - paddingTop);

            return {
                ...b,
                x,
                volY,
                subY,
            };
        });

        // Helper to construct smooth cubic bezier SVG path
        const buildSvgPath = (coords: { x: number; y: number }[]) => {
            if (coords.length === 0) return "";
            if (coords.length === 1) return `M${coords[0].x},${coords[0].y}`;

            let d = `M ${coords[0].x},${coords[0].y}`;
            for (let i = 0; i < coords.length - 1; i++) {
                const curr = coords[i];
                const next = coords[i + 1];
                const cpX1 = curr.x + (next.x - curr.x) / 2.5;
                const cpY1 = curr.y;
                const cpX2 = curr.x + (next.x - curr.x) / 1.6;
                const cpY2 = next.y;
                d += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${next.x},${next.y}`;
            }
            return d;
        };

        const volumeLinePath = buildSvgPath(points.map((p) => ({ x: p.x, y: p.volY })));
        const submissionsLinePath = buildSvgPath(points.map((p) => ({ x: p.x, y: p.subY })));

        const volumeAreaPath = points.length > 0
            ? `${volumeLinePath} L ${points[points.length - 1].x},290 L ${points[0].x},290 Z`
            : "";

        const submissionsAreaPath = points.length > 0
            ? `${submissionsLinePath} L ${points[points.length - 1].x},290 L ${points[0].x},290 Z`
            : "";

        return {
            buckets: points,
            volumeLinePath,
            submissionsLinePath,
            volumeAreaPath,
            submissionsAreaPath,
            maxVol,
            maxSub,
        };
    }, [dateRange, apiData]);

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
    ], [metrics]);

    const recentSubmissionsHeaders: TableHeader[] = [
        { key: "applicant", label: "Applicant", width: "35%" },
        { key: "email", label: "Email & Phone", width: "30%" },
        { key: "loan_amount", label: "Loan Amount", align: "right", width: "20%" },
        { key: "date", label: "Date", align: "right", width: "15%" },
    ];

    const recentSubmissionsRows: TableCell[][] = useMemo(() => {
        return apiData.slice(0, 6).map((row) => {
            const payload = row.payload || {};
            const firstName = payload.first_name || payload.firstName || row.first_name || row.firstName || "";
            const lastName = payload.last_name || payload.lastName || row.last_name || row.lastName || "";
            const name = firstName || lastName
                ? `${firstName} ${lastName}`.trim()
                : String(payload.name || row.name || "Applicant");
            const initials = (name.slice(0, 2) || "AP").toUpperCase();

            const rawAmount =
                payload.loan_amount ||
                payload.loanAmount ||
                payload.requestedAmount ||
                payload.clientEstimatedDebt ||
                row.loan_amount ||
                row.loanAmount ||
                0;
            const numAmount = parseNumericAmount(rawAmount);
            const amount = `$${numAmount.toLocaleString()}`;

            const email = payload.email || row.email || "—";
            const phone = payload.phone || payload.phoneMobile || payload.cell || row.phone || row.cell || "—";
            const refcode = payload.refcode || row.refcode || (row.lead_id ? `REF${row.lead_id}` : "");
            const date = String(row.created_at?.split(" ")[0] || row.date);

            return [
                {
                    avatar: { initials },
                    title: {
                        value: name,
                        className: "font-semibold text-foreground",
                    },
                    desc: refcode
                        ? {
                            value: refcode,
                            className: "font-mono text-[11px] text-muted-foreground",
                        }
                        : undefined,
                },
                {
                    title: {
                        value: email,
                        className: "text-foreground font-medium",
                    },
                    desc: {
                        value: phone,
                        className: "text-xs font-mono text-muted-foreground",
                    },
                },
                {
                    align: "right",
                    title: {
                        value: amount,
                        className: "font-bold font-mono text-primary text-sm",
                    },
                },
                {
                    align: "right",
                    desc: {
                        value: date,
                        className: "text-xs font-mono text-muted-foreground",
                    },
                },
            ];
        });
    }, [apiData]);

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

                    {/* Brand Selector Dropdown */}
                    <div ref={brandDropdownRef} className="relative inline-block">
                        <button
                            type="button"
                            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                            className="inline-flex items-center justify-between gap-2.5 px-3.5 py-2 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-(--shadow-card) transition-all min-w-44"
                            aria-expanded={isBrandDropdownOpen}
                            aria-haspopup="true"
                        >
                            <div className="flex items-center gap-2 text-muted-foreground truncate">
                                <Icon name="business" size={16} className="text-primary shrink-0" />
                                <span className="text-xs font-semibold text-foreground truncate">
                                    {BRAND_OPTIONS.find((b) => b.value === selectedBrand)?.label || "Select Brand"}
                                </span>
                            </div>
                            <Icon
                                name="keyboard_arrow_down"
                                size={16}
                                className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
                                    isBrandDropdownOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {isBrandDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-card rounded-2xl shadow-(--shadow-lift) border border-border z-50 animate-in overflow-hidden">
                                <div className="px-4 py-2.5 border-b border-border bg-surface-2/60">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Select Brand
                                    </span>
                                </div>
                                <div className="py-1.5 max-h-60 overflow-y-auto">
                                    {BRAND_OPTIONS.map((brand) => {
                                        const isSelected = selectedBrand === brand.value;
                                        return (
                                            <button
                                                key={brand.value}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedBrand(brand.value);
                                                    setIsBrandDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-medium transition-colors ${
                                                    isSelected
                                                        ? "bg-primary/10 text-primary font-semibold"
                                                        : "text-foreground hover:bg-surface-2"
                                                }`}
                                            >
                                                <span>{brand.label}</span>
                                                {isSelected && <Icon name="check" size={14} className="text-primary" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Date Range Dropdown */}
                    <DateRangeDropdown
                        defaultPreset="this_month"
                        onDateRangeChange={(range) => {
                            setDateRange((prev) => {
                                if (
                                    prev &&
                                    prev.startDate === range.startDate &&
                                    prev.endDate === range.endDate &&
                                    prev.preset === range.preset
                                ) {
                                    return prev;
                                }
                                return range;
                            });
                        }}
                    />

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
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            {/* <span
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
                            </span> */}
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

            {/* Bento Grid: Performance Metrics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                {/* Performance Metrics Dynamic Animated Chart Section */}
                <section className="card relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-[var(--shadow-card)]">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-line/60">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold mb-1">
                                <Icon name="insights" size={13} />
                                Live Metrics
                            </div>
                            <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                                Performance Metrics
                            </h2>
                            <p className="text-xs text-muted">
                                Total Loan Volume ($) vs. Total Submissions for {dateRange.label || "selected range"}
                            </p>
                        </div>
                        <div className="flex items-center gap-6 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-indigo-600 shadow-xs ring-2 ring-indigo-600/20" />
                                <span className="font-semibold text-ink">Volume ($ Loan Amount)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-sky-500 shadow-xs ring-2 ring-sky-500/20" />
                                <span className="font-semibold text-ink">Submissions (Total Count)</span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Chart Canvas Area */}
                    <div className="relative mt-6 min-h-[300px] w-full flex-1">
                        {/* Horizontal Grid lines with value indications */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between text-[10px] font-mono text-muted/60">
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-line/60" />
                                <span className="pr-1">${(chartSeries.maxVol / 1000).toFixed(0)}k</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-line/60" />
                                <span className="pr-1">${((chartSeries.maxVol * 0.75) / 1000).toFixed(0)}k</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-line/60" />
                                <span className="pr-1">${((chartSeries.maxVol * 0.5) / 1000).toFixed(0)}k</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-line/60" />
                                <span className="pr-1">${((chartSeries.maxVol * 0.25) / 1000).toFixed(0)}k</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-line/60" />
                                <span className="pr-1">$0</span>
                            </div>
                        </div>

                        {/* Interactive Styled SVG Graph Lines */}
                        <svg
                            className="absolute inset-0 h-full w-full overflow-visible"
                            preserveAspectRatio="none"
                            viewBox="0 0 1000 300"
                        >
                            <defs>
                                <linearGradient id="perfVolGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="perfSubGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Volume Shaded Area */}
                            {chartSeries.volumeAreaPath && (
                                <path
                                    d={chartSeries.volumeAreaPath}
                                    fill="url(#perfVolGrad)"
                                    className="transition-all duration-700 ease-out"
                                />
                            )}

                            {/* Submissions Shaded Area */}
                            {chartSeries.submissionsAreaPath && (
                                <path
                                    d={chartSeries.submissionsAreaPath}
                                    fill="url(#perfSubGrad)"
                                    className="transition-all duration-700 ease-out"
                                />
                            )}

                            {/* Submissions Line (Sky Blue) */}
                            {chartSeries.submissionsLinePath && (
                                <path
                                    d={chartSeries.submissionsLinePath}
                                    fill="none"
                                    stroke="#0284c7"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-700 ease-out drop-shadow-[0_2px_4px_rgba(2,132,199,0.2)]"
                                />
                            )}

                            {/* Volume Line (Indigo) with slight glow/shadow */}
                            {chartSeries.volumeLinePath && (
                                <path
                                    d={chartSeries.volumeLinePath}
                                    fill="none"
                                    stroke="#4f46e5"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-700 ease-out drop-shadow-[0_4px_10px_rgba(79,70,229,0.35)]"
                                />
                            )}

                            {/* Interactive Data Points & Hover Targets */}
                            {chartSeries.buckets.map((pt, idx) => {
                                const isHovered = hoveredPointIdx === idx;
                                return (
                                    <g key={idx} className="cursor-pointer">
                                        {/* Vertical hover guide bar */}
                                        {isHovered && (
                                            <line
                                                x1={pt.x}
                                                y1={10}
                                                x2={pt.x}
                                                y2={290}
                                                stroke="#4f46e5"
                                                strokeWidth="1.5"
                                                strokeDasharray="4 4"
                                                className="opacity-70"
                                            />
                                        )}

                                        {/* Volume Point */}
                                        <circle
                                            cx={pt.x}
                                            cy={pt.volY}
                                            r={isHovered ? 6 : 4}
                                            fill="#4f46e5"
                                            stroke="#ffffff"
                                            strokeWidth={isHovered ? 3 : 2}
                                            className="transition-all duration-200"
                                        />

                                        {/* Submissions Point */}
                                        <circle
                                            cx={pt.x}
                                            cy={pt.subY}
                                            r={isHovered ? 5.5 : 3.5}
                                            fill="#0284c7"
                                            stroke="#ffffff"
                                            strokeWidth={isHovered ? 2.5 : 2}
                                            className="transition-all duration-200"
                                        />

                                        {/* Transparent Hover Hitbox */}
                                        <rect
                                            x={pt.x - 30}
                                            y={0}
                                            width={60}
                                            height={300}
                                            fill="transparent"
                                            onMouseEnter={() => setHoveredPointIdx(idx)}
                                            onMouseLeave={() => setHoveredPointIdx(null)}
                                        />
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Interactive Tooltip Popover */}
                        {hoveredPointIdx !== null && chartSeries.buckets[hoveredPointIdx] && (
                            <div
                                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl bg-card/95 backdrop-blur-md px-3.5 py-2.5 text-xs shadow-(--shadow-lift) border border-border transition-all duration-150"
                                style={{
                                    left: `${(chartSeries.buckets[hoveredPointIdx].x / 1000) * 100}%`,
                                    top: `${Math.min(
                                        chartSeries.buckets[hoveredPointIdx].volY,
                                        chartSeries.buckets[hoveredPointIdx].subY
                                    ) - 15}px`,
                                }}
                            >
                                <div className="font-bold text-foreground border-b border-border pb-1 mb-1.5 flex items-center justify-between gap-3">
                                    <span>{chartSeries.buckets[hoveredPointIdx].label}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        {chartSeries.buckets[hoveredPointIdx].dateKey}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-3 text-indigo-600 font-semibold">
                                        <span className="flex items-center gap-1.5">
                                            <span className="size-2 rounded-full bg-indigo-600" />
                                            Volume:
                                        </span>
                                        <span className="font-mono">
                                            ${chartSeries.buckets[hoveredPointIdx].volume.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-sky-600 font-semibold">
                                        <span className="flex items-center gap-1.5">
                                            <span className="size-2 rounded-full bg-sky-500" />
                                            Submissions:
                                        </span>
                                        <span className="font-mono">
                                            {chartSeries.buckets[hoveredPointIdx].submissions} leads
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* X-Axis Dynamic Date Labels */}
                        <div className="absolute -bottom-7 left-0 right-0 flex justify-between px-6 text-[11px] font-semibold uppercase tracking-wider text-muted/80">
                            {chartSeries.buckets.map((b, i) => (
                                <span
                                    key={i}
                                    className={`transition-colors ${hoveredPointIdx === i ? "text-primary font-bold" : ""}`}
                                >
                                    {b.label}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="h-6" />
                </section>
            </div>

            {/* Recent Live Loan Submissions Table (Reusable Table Component) */}
            <Table
                heading={`Recent Submissions (${BRAND_OPTIONS.find((brand) => brand.value === selectedBrand)?.label || ""})`}
                subheading="Live applicant loan submissions fetched via API"
                headers={recentSubmissionsHeaders}
                rows={recentSubmissionsRows}
                loading={isLoading}
                emptyMessage="No recent submissions found"
                headerAction={
                    <button
                        onClick={fetchDashboardData}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-(--shadow-card) transition-colors hover:bg-surface-2 disabled:opacity-50"
                    >
                        <Icon name="refresh" size={14} className={isLoading ? "animate-spin" : ""} />
                        Sync Live Data
                    </button>
                }
            />
        </div>
    );
};