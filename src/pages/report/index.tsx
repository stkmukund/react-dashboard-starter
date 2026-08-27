import { useMemo, useState } from "react";
import {
    Button,
    Icon,
    Table,
    TableFilters,
    type DateRange,
    type TableCell,
    type TableHeader,
} from "../../components/ui";

export interface LoanReportItem {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    refcode: string;
    loan_amount: string | number;
    status?: "APPROVED" | "PENDING" | "PROCESSING" | "COMPLETED" | "WARNING" | "FAILED";
    date?: string;
}

const MOCK_LOAN_DATA: LoanReportItem[] = [
    {
        id: "REP-1001",
        first_name: "Eric",
        last_name: "Clark",
        email: "test020@gmail.com",
        phone: "3125551020",
        address: "120 Roosevelt St.",
        city: "Chicago",
        state: "IL",
        zipcode: "60631",
        refcode: "RLM1020",
        loan_amount: "19000",
        status: "APPROVED",
        date: "2026-08-25",
    },
    {
        id: "REP-1002",
        first_name: "Sarah",
        last_name: "Jenkins",
        email: "s.jenkins@outlook.com",
        phone: "2125553891",
        address: "742 Evergreen Terrace",
        city: "New York",
        state: "NY",
        zipcode: "10001",
        refcode: "RLM1021",
        loan_amount: "35000",
        status: "PROCESSING",
        date: "2026-08-26",
    },
    {
        id: "REP-1003",
        first_name: "Michael",
        last_name: "Rodriguez",
        email: "m.rodriguez@company.net",
        phone: "3055557821",
        address: "450 Ocean Drive, Suite 4B",
        city: "Miami",
        state: "FL",
        zipcode: "33139",
        refcode: "RLM1022",
        loan_amount: "50000",
        status: "COMPLETED",
        date: "2026-08-20",
    },
    {
        id: "REP-1004",
        first_name: "Emily",
        last_name: "Watson",
        email: "emily.watson@gmail.com",
        phone: "4155559012",
        address: "88 Market Street",
        city: "San Francisco",
        state: "CA",
        zipcode: "94105",
        refcode: "RLM1023",
        loan_amount: "28500",
        status: "PENDING",
        date: "2026-08-27",
    },
    {
        id: "REP-1005",
        first_name: "David",
        last_name: "Miller",
        email: "dmiller99@yahoo.com",
        phone: "5125556734",
        address: "1024 Congress Ave",
        city: "Austin",
        state: "TX",
        zipcode: "78701",
        refcode: "RLM1024",
        loan_amount: "15000",
        status: "APPROVED",
        date: "2026-08-14",
    },
    {
        id: "REP-1006",
        first_name: "Jessica",
        last_name: "Taylor",
        email: "jtaylor@fintech.io",
        phone: "2065554319",
        address: "310 Pike Street",
        city: "Seattle",
        state: "WA",
        zipcode: "98101",
        refcode: "RLM1025",
        loan_amount: "42000",
        status: "COMPLETED",
        date: "2026-08-18",
    },
    {
        id: "REP-1007",
        first_name: "Robert",
        last_name: "Johnson",
        email: "rjohnson@apexcorp.com",
        phone: "7025558190",
        address: "550 Las Vegas Blvd",
        city: "Las Vegas",
        state: "NV",
        zipcode: "89109",
        refcode: "RLM1026",
        loan_amount: "22000",
        status: "PROCESSING",
        date: "2026-08-27",
    },
    {
        id: "REP-1008",
        first_name: "Amanda",
        last_name: "Martinez",
        email: "amanda.m@brightwave.org",
        phone: "6025552387",
        address: "920 Camelback Rd",
        city: "Phoenix",
        state: "AZ",
        zipcode: "85013",
        refcode: "RLM1027",
        loan_amount: "18500",
        status: "APPROVED",
        date: "2026-08-10",
    },
    {
        id: "REP-1009",
        first_name: "Brian",
        last_name: "Anderson",
        email: "banderson@cloudnet.com",
        phone: "3035559401",
        address: "1600 17th St",
        city: "Denver",
        state: "CO",
        zipcode: "80202",
        refcode: "RLM1028",
        loan_amount: "62000",
        status: "COMPLETED",
        date: "2026-08-05",
    },
    {
        id: "REP-1010",
        first_name: "Olivia",
        last_name: "Brown",
        email: "olivia.brown@modernlaw.com",
        phone: "6175557123",
        address: "200 Boylston St",
        city: "Boston",
        state: "MA",
        zipcode: "02116",
        refcode: "RLM1029",
        loan_amount: "31000",
        status: "WARNING",
        date: "2026-08-12",
    },
    {
        id: "REP-1011",
        first_name: "James",
        last_name: "Wilson",
        email: "j.wilson@nexus.org",
        phone: "4045558902",
        address: "3300 Peachtree Rd",
        city: "Atlanta",
        state: "GA",
        zipcode: "30326",
        refcode: "RLM1030",
        loan_amount: "9500",
        status: "FAILED",
        date: "2026-07-28",
    },
    {
        id: "REP-1012",
        first_name: "Rachel",
        last_name: "Davis",
        email: "rachel.d@vertex.ai",
        phone: "3125556781",
        address: "500 Michigan Ave",
        city: "Chicago",
        state: "IL",
        zipcode: "60611",
        refcode: "RLM1031",
        loan_amount: "48000",
        status: "COMPLETED",
        date: "2026-08-24",
    },
];

// Helper to format phone number nicely e.g. 3125551020 -> (312) 555-1020
function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
}

// Helper to format currency
function formatCurrency(amount: string | number): string {
    const num = typeof amount === "number" ? amount : Number.parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(num);
}

export default function Report() {
    // Filters State
    const [searchValue, setSearchValue] = useState("");
    const [selectedState, setSelectedState] = useState<string | number>("");
    const [selectedStatus, setSelectedStatus] = useState<string | number>("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    // Table Control State
    const [isLoading, setIsLoading] = useState(false);
    const [sortKey, setSortKey] = useState<string>("first_name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedRecord, setSelectedRecord] = useState<LoanReportItem | null>(null);

    // Sorting Handler
    const handleSort = (_colIndex: number, headerKey?: string) => {
        if (!headerKey) return;
        if (sortKey === headerKey) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(headerKey);
            setSortDirection("asc");
        }
    };

    // Extract unique states for filter dropdown
    // const uniqueStates = useMemo(() => {
    //     const states = Array.from(new Set(MOCK_LOAN_DATA.map((item) => item.state))).sort();
    //     return states.map((state) => ({ label: state, value: state }));
    // }, []);

    // Filter & Sort Logic
    const filteredAndSortedData = useMemo(() => {
        const result = MOCK_LOAN_DATA.filter((item) => {
            // Search across all requested fields
            const query = searchValue.toLowerCase().trim();
            const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
            const matchesSearch =
                !query ||
                fullName.includes(query) ||
                item.email.toLowerCase().includes(query) ||
                item.phone.includes(query) ||
                item.refcode.toLowerCase().includes(query) ||
                item.city.toLowerCase().includes(query) ||
                item.state.toLowerCase().includes(query) ||
                item.zipcode.includes(query) ||
                item.address.toLowerCase().includes(query) ||
                item.loan_amount.toString().includes(query);

            // State Filter
            const matchesState = !selectedState || item.state === selectedState;

            // Status Filter
            const matchesStatus =
                !selectedStatus || item.status?.toUpperCase() === String(selectedStatus).toUpperCase();

            // Date Range Filter
            let matchesDate = true;
            if (dateRange?.startDate && dateRange?.endDate && item.date) {
                matchesDate = item.date >= dateRange.startDate && item.date <= dateRange.endDate;
            }

            return matchesSearch && matchesState && matchesStatus && matchesDate;
        });

        // Sort
        result.sort((a, b) => {
            let valA: string | number = (a as unknown as Record<string, string | number>)[sortKey] ?? "";
            let valB: string | number = (b as unknown as Record<string, string | number>)[sortKey] ?? "";

            if (sortKey === "loan_amount") {
                const numA = typeof valA === "number" ? valA : Number.parseFloat(valA) || 0;
                const numB = typeof valB === "number" ? valB : Number.parseFloat(valB) || 0;
                return sortDirection === "asc" ? numA - numB : numB - numA;
            }

            if (typeof valA === "string") {
                valA = valA.toLowerCase();
                valB = String(valB).toLowerCase();
            }

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [searchValue, selectedState, selectedStatus, dateRange, sortKey, sortDirection]);

    // Paginated Rows
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredAndSortedData.slice(start, start + pageSize);
    }, [filteredAndSortedData, currentPage, pageSize]);

    // Total Loan Calculation for filtered data
    const totalLoanAmount = useMemo(() => {
        return filteredAndSortedData.reduce((acc, item) => {
            const num = typeof item.loan_amount === "number" ? item.loan_amount : Number.parseFloat(item.loan_amount) || 0;
            return acc + num;
        }, 0);
    }, [filteredAndSortedData]);

    // Transform into TableCells
    const tableRows: TableCell[][] = useMemo(() => {
        return paginatedData.map((item) => [
            // Col 1: Applicant Name + Ref Code
            {
                avatar: { initials: `${item.first_name[0]}${item.last_name[0]}` },
                title: {
                    value: `${item.first_name} ${item.last_name}`,
                    className: "font-semibold text-foreground hover:text-primary transition-colors cursor-pointer",
                    onClick: () => setSelectedRecord(item),
                },
                desc: {
                    value: item.refcode,
                    className: "font-mono text-xs font-medium text-primary",
                },
            },
            // Col 2: Contact Info (Email & Phone)
            {
                title: {
                    value: item.email,
                    className: "text-foreground font-medium",
                },
                desc: {
                    value: formatPhoneNumber(item.phone),
                    className: "text-xs font-mono text-muted-foreground",
                },
            },
            // Col 3: Address & Location (Address, City, State, Zipcode)
            {
                title: {
                    value: item.address,
                    className: "font-medium text-foreground",
                },
                desc: {
                    value: `${item.city}, ${item.state} ${item.zipcode}`,
                    className: "text-xs text-muted-foreground",
                },
            },
            // Col 4: Status
            {
                statusBadge: {
                    status: item.status || "APPROVED",
                },
            },
            // Col 5: Loan Amount & Date
            {
                align: "right",
                title: {
                    value: formatCurrency(item.loan_amount),
                    className: "font-bold font-mono text-foreground text-sm",
                },
                desc: {
                    value: item.date || "—",
                    className: "text-xs",
                },
            },
            // Col 6: Actions
            {
                align: "right",
                action: (
                    <div className="flex items-center justify-end gap-1">
                        <button
                            type="button"
                            onClick={() => setSelectedRecord(item)}
                            aria-label="View Details"
                            className="grid size-8 place-items-center rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Icon name="visibility" size={16} />
                        </button>
                        <button
                            type="button"
                            aria-label="More options"
                            className="grid size-8 place-items-center rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Icon name="more_vert" size={16} />
                        </button>
                    </div>
                ),
            },
        ]);
    }, [paginatedData]);

    // Headers definition
    const tableHeaders: TableHeader[] = [
        { key: "first_name", label: "Applicant / Refcode", sortable: true, width: "24%" },
        { key: "email", label: "Email & Phone", sortable: true, width: "22%" },
        { key: "city", label: "Address & Location", sortable: true, width: "26%" },
        { key: "status", label: "Status", sortable: true, width: "12%" },
        { key: "loan_amount", label: "Loan Amount", sortable: true, align: "right", width: "12%" },
        { label: "Actions", align: "right", width: "4%" },
    ];

    // Simulating reload action
    const handleReload = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 600);
    };

    return (
        <div className="space-y-6 p-6">
            {/* Page Header */}
            <div className="card rounded-3xl p-6 sm:p-8 bg-card border border-border shadow-(--shadow-soft)">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                            <Icon name="analytics" size={14} />
                            Loan & Application Analytics
                        </div>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Submission Data
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                            Comprehensive report of applicant profiles, contact information, residential location, and requested loan amounts.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReload}
                            disabled={isLoading}
                        >
                            <Icon name="refresh" size={16} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button size="sm">
                            <Icon name="file_download" size={16} />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Quick KPI Stat Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="p-4 rounded-2xl bg-surface-2/40 border border-border/50">
                        <div className="text-xs font-medium text-muted-foreground">Total Filtered Volume</div>
                        <div className="text-xl font-bold font-mono text-foreground mt-1">
                            {formatCurrency(totalLoanAmount)}
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-2/40 border border-border/50">
                        <div className="text-xs font-medium text-muted-foreground">Total Applicants</div>
                        <div className="text-xl font-bold font-mono text-foreground mt-1">
                            {filteredAndSortedData.length} records
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-2/40 border border-border/50">
                        <div className="text-xs font-medium text-muted-foreground">Average Loan Amount</div>
                        <div className="text-xl font-bold font-mono text-foreground mt-1">
                            {filteredAndSortedData.length > 0
                                ? formatCurrency(totalLoanAmount / filteredAndSortedData.length)
                                : "$0"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Filters Bar */}
            <TableFilters
                searchValue={searchValue}
                onSearchChange={(val) => {
                    setSearchValue(val);
                    setCurrentPage(1);
                }}
                searchPlaceholder="Search by name, email, phone, city, state, refcode..."
                filters={[
                    // {
                    //     id: "state",
                    //     label: "State",
                    //     value: selectedState,
                    //     onChange: (val) => {
                    //         setSelectedState(val);
                    //         setCurrentPage(1);
                    //     },
                    //     options: uniqueStates,
                    // },
                    // {
                    //     id: "status",
                    //     label: "Status",
                    //     value: selectedStatus,
                    //     onChange: (val) => {
                    //         setSelectedStatus(val);
                    //         setCurrentPage(1);
                    //     },
                    //     options: [
                    //         { label: "Approved", value: "APPROVED" },
                    //         { label: "Pending", value: "PENDING" },
                    //         { label: "Processing", value: "PROCESSING" },
                    //         { label: "Completed", value: "COMPLETED" },
                    //         { label: "Warning", value: "WARNING" },
                    //         { label: "Failed", value: "FAILED" },
                    //     ],
                    // },
                ]}
                dateRange={{
                    selected: dateRange,
                    onChange: (range) => {
                        setDateRange(range);
                        setCurrentPage(1);
                    },
                    defaultPreset: "today",
                    showCustom: true,
                }}
                onReset={() => {
                    setSearchValue("");
                    setSelectedState("");
                    setSelectedStatus("");
                    setDateRange(undefined);
                    setCurrentPage(1);
                }}
                actions={
                    <Button variant="outline" size="sm">
                        <Icon name="download" size={16} />
                        Export CSV
                    </Button>
                }
            />

            {/* Main Loan Report Table */}
            <Table
                heading="Applicant Loan Records"
                subheading={`Displaying ${filteredAndSortedData.length} records matching your filter parameters`}
                headers={tableHeaders}
                rows={tableRows}
                loading={isLoading}
                sortColumn={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                pagination={{
                    page: currentPage,
                    pageSize: pageSize,
                    total: filteredAndSortedData.length,
                    onPageChange: (p) => setCurrentPage(p),
                    pageSizeOptions: [4, 6, 10, 20],
                    onPageSizeChange: (size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                    },
                }}
            />

            {/* Selected Applicant Details Drawer / Card */}
            {selectedRecord && (
                <div className="card p-6 rounded-3xl bg-surface-2/40 border border-border shadow-(--shadow-card)">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
                        <div className="flex items-center gap-3.5">
                            <div className="size-12 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center text-lg">
                                {selectedRecord.first_name[0]}
                                {selectedRecord.last_name[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-foreground text-lg">
                                        {selectedRecord.first_name} {selectedRecord.last_name}
                                    </h3>
                                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                        {selectedRecord.refcode}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Applicant ID: {selectedRecord.id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRecord(null)}
                            >
                                <Icon name="close" size={16} />
                                Close Details
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="p-3.5 rounded-xl bg-card border border-border/60">
                            <span className="text-xs text-muted-foreground block">Email Address</span>
                            <span className="text-sm font-medium text-foreground">{selectedRecord.email}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-card border border-border/60">
                            <span className="text-xs text-muted-foreground block">Phone</span>
                            <span className="text-sm font-mono font-medium text-foreground">
                                {formatPhoneNumber(selectedRecord.phone)}
                            </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-card border border-border/60">
                            <span className="text-xs text-muted-foreground block">Address</span>
                            <span className="text-sm font-medium text-foreground">
                                {selectedRecord.address}, {selectedRecord.city}, {selectedRecord.state} {selectedRecord.zipcode}
                            </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-card border border-border/60">
                            <span className="text-xs text-muted-foreground block">Loan Requested</span>
                            <span className="text-base font-bold font-mono text-primary">
                                {formatCurrency(selectedRecord.loan_amount)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
