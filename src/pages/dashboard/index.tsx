import { useState, useMemo } from "react";
import {
    Button,
    Icon,
    Table,
    TableFilters,
    type TableCell,
    type DateRange,
    type StatusVariant,
} from "../../components/ui";

interface LeadItem {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    role: string;
    department: string;
    status: StatusVariant;
    amount: string;
    createdAt: string;
}

const SAMPLE_LEADS: LeadItem[] = [
    {
        id: "1",
        name: "Alex Morgan",
        email: "alex.morgan@example.com",
        phone: "+1 (555) 234-5678",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        role: "Financial Advisor",
        department: "Sales",
        status: "COMPLETED",
        amount: "$12,450.00",
        createdAt: "2026-08-20",
    },
    {
        id: "2",
        name: "Devon Lane",
        email: "devon.lane@example.com",
        phone: "+1 (555) 876-5432",
        role: "Lead Strategist",
        department: "Marketing",
        status: "PROCESSING",
        amount: "$8,920.00",
        createdAt: "2026-08-22",
    },
    {
        id: "3",
        name: "Courtney Henry",
        email: "courtney.henry@example.com",
        phone: "+1 (555) 345-6789",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        role: "Account Executive",
        department: "Sales",
        status: "ACTIVE",
        amount: "$15,200.00",
        createdAt: "2026-08-24",
    },
    {
        id: "4",
        name: "Eleanor Pena",
        email: "eleanor.pena@example.com",
        phone: "+1 (555) 987-6543",
        role: "Data Analyst",
        department: "Analytics",
        status: "PENDING",
        amount: "$6,740.00",
        createdAt: "2026-08-25",
    },
    {
        id: "5",
        name: "Floyd Miles",
        email: "floyd.miles@example.com",
        phone: "+1 (555) 456-7890",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        role: "Product Consultant",
        department: "Consulting",
        status: "FAILED",
        amount: "$3,100.00",
        createdAt: "2026-08-26",
    },
    {
        id: "6",
        name: "Jane Cooper",
        email: "jane.cooper@example.com",
        phone: "+1 (555) 654-3210",
        role: "Customer Success",
        department: "Support",
        status: "COMPLETED",
        amount: "$9,430.00",
        createdAt: "2026-08-27",
    },
];

export default function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | number>("");
    const [departmentFilter, setDepartmentFilter] = useState<string | number>("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Filter leads based on state
    const filteredLeads = useMemo(() => {
        return SAMPLE_LEADS.filter((item) => {
            const matchesSearch =
                !searchQuery ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.phone.includes(searchQuery);

            const matchesStatus =
                !statusFilter || item.status.toUpperCase() === String(statusFilter).toUpperCase();

            const matchesDepartment =
                !departmentFilter || item.department === departmentFilter;

            return matchesSearch && matchesStatus && matchesDepartment;
        });
    }, [searchQuery, statusFilter, departmentFilter]);

    // Paginate rows
    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredLeads.slice(start, start + pageSize);
    }, [filteredLeads, currentPage, pageSize]);

    // Map lead items into dynamic TableCell matrix
    const tableRows: TableCell[][] = useMemo(() => {
        return paginatedLeads.map((lead) => [
            // Column 1: Avatar + Name + Email
            {
                avatar: lead.avatarUrl
                    ? { url: lead.avatarUrl, alt: lead.name }
                    : { initials: true },
                title: {
                    value: lead.name,
                    className: "font-semibold",
                },
                desc: {
                    value: lead.email,
                },
            },
            // Column 2: Phone Number
            {
                title: {
                    value: lead.phone,
                    className: "text-muted-foreground font-mono text-xs",
                },
            },
            // Column 3: Role & Department
            {
                title: {
                    value: lead.role,
                    className: "font-medium",
                },
                desc: {
                    value: lead.department,
                },
            },
            // Column 4: Status Badge
            {
                statusBadge: {
                    status: lead.status,
                    percentage: lead.status === "PROCESSING" ? 68 : undefined,
                },
            },
            // Column 5: Deal Amount
            {
                align: "right",
                title: {
                    value: lead.amount,
                    className: "font-semibold text-foreground",
                },
                desc: {
                    value: lead.createdAt,
                    className: "text-[11px]",
                },
            },
            // Column 6: Action button
            {
                align: "right",
                action: (
                    <button
                        type="button"
                        aria-label={`Actions for ${lead.name}`}
                        className="grid size-8 place-items-center rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Icon name="more_vert" size={18} />
                    </button>
                ),
            },
        ]);
    }, [paginatedLeads]);

    return (
        <div className="space-y-6 p-6">
            {/* Welcome banner */}
            <div className="card rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                            Welcome to your dashboard
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
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
                            <span className="text-xs font-medium text-muted-foreground">{stat.title}</span>
                            <div className="grid h-8 w-8 place-items-center rounded-xl bg-surface-2 text-faint">
                                <Icon name={stat.icon} size={18} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                            <span
                                className={`text-xs font-semibold ${
                                    stat.change.startsWith("+") ? "text-success" : "text-destructive"
                                }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dynamic Table & Filters Section */}
            <div className="space-y-4">
                {/* Reusable Filters Bar */}
                <TableFilters
                    searchValue={searchQuery}
                    onSearchChange={(val) => {
                        setSearchQuery(val);
                        setCurrentPage(1);
                    }}
                    searchPlaceholder="Search leads by name, email, or phone..."
                    filters={[
                        {
                            id: "status",
                            label: "Status",
                            value: statusFilter,
                            onChange: (val) => {
                                setStatusFilter(val);
                                setCurrentPage(1);
                            },
                            options: [
                                { label: "Completed", value: "COMPLETED" },
                                { label: "Processing", value: "PROCESSING" },
                                { label: "Active", value: "ACTIVE" },
                                { label: "Pending", value: "PENDING" },
                                { label: "Failed", value: "FAILED" },
                            ],
                        },
                        {
                            id: "department",
                            label: "Department",
                            value: departmentFilter,
                            onChange: (val) => {
                                setDepartmentFilter(val);
                                setCurrentPage(1);
                            },
                            options: [
                                { label: "Sales", value: "Sales" },
                                { label: "Marketing", value: "Marketing" },
                                { label: "Analytics", value: "Analytics" },
                                { label: "Consulting", value: "Consulting" },
                                { label: "Support", value: "Support" },
                            ],
                        },
                    ]}
                    dateRange={{
                        selected: dateRange,
                        onChange: (range) => setDateRange(range),
                        defaultPreset: "last_30_days",
                    }}
                    onReset={() => {
                        setSearchQuery("");
                        setStatusFilter("");
                        setDepartmentFilter("");
                        setCurrentPage(1);
                    }}
                    actions={
                        <Button variant="outline" size="sm">
                            <Icon name="file_download" size={16} />
                            Export
                        </Button>
                    }
                />

                {/* Reusable Dynamic Table */}
                <Table
                    heading="Lead Records & Activities"
                    subheading="Manage and monitor client leads, financial summaries, and verification states"
                    href={{ to: "/dashboard", text: "View All Reports" }}
                    headers={[
                        { label: "Customer / Contact", sortable: true },
                        { label: "Phone" },
                        { label: "Role & Dept", sortable: true },
                        { label: "Status", align: "left" },
                        { label: "Amount / Date", align: "right", sortable: true },
                        { label: "Action", align: "right" },
                    ]}
                    rows={tableRows}
                    pagination={{
                        page: currentPage,
                        pageSize: pageSize,
                        total: filteredLeads.length,
                        onPageChange: (p) => setCurrentPage(p),
                        pageSizeOptions: [5, 10, 20],
                        onPageSizeChange: (size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        },
                    }}
                />
            </div>
        </div>
    );
}