import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    Icon,
    Table,
    TableFilters,
    type DateRange,
    type TableCell,
    type TableHeader,
} from "../../components/ui";
import { reportService, type ApiLoanRecord } from "../../services";

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
    brand?: string;
    loan_amount: string | number;
    status?: "APPROVED" | "PENDING" | "PROCESSING" | "COMPLETED" | "WARNING" | "FAILED" | string;
    date?: string;
}

const BRAND_OPTIONS = [
    { label: "Riverlend", value: "riverlend" },
    { label: "Rapid Trust Capital", value: "rapidtrust" },
    { label: "Ridge View Loans", value: "ridgeviewloans" },
    { label: "Universal Lending LLC", value: "universallending" },
    { label: "Bright Relief", value: "brightrelief" },
];

const BRAND_NAME_MAP: Record<string, string> = {
    riverlend: "Riverlend",
    rapidtrust: "Rapid Trust Capital",
    ridgeviewloans: "Ridge View Loans",
    universallending: "Universal Lending LLC",
    brightrelief: "Bright Relief",
};

// Normalize backend API loan record into LoanReportItem
function normalizeApiRecord(raw: ApiLoanRecord, index: number, currentBrand: string): LoanReportItem {
    const payload = raw.payload || {};
    const rawName = (payload.name || raw.name || "").trim();
    let firstName = payload.first_name || raw.first_name || "";
    let lastName = payload.last_name || raw.last_name || "";
    if (!firstName && rawName) {
        const parts = rawName.split(" ");
        firstName = parts[0] || "Applicant";
        lastName = parts.slice(1).join(" ") || "";
    }

    const email = payload.email || raw.email || "—";
    const phone = payload.phone || payload.cell || raw.phone || raw.cell || "—";
    const address = payload.address || raw.address || "—";
    const city = payload.city || raw.city || "—";
    const state = payload.state || raw.state || "—";
    const zipcode = payload.zipcode || raw.zipcode || "—";
    const refcode = payload.refcode || raw.refcode || `REF${raw.lead_id || index + 100}`;
    const loanAmount = payload.loan_amount || raw.loan_amount || "0";
    const date = raw.created_at?.split(" ")[0] || raw.date || "2026-08-27";

    return {
        id: String(raw.id || raw.lead_id || `REC-${1000 + index}`),
        first_name: firstName || "Applicant",
        last_name: lastName,
        email,
        phone,
        address,
        city,
        state,
        zipcode,
        refcode,
        brand: raw.brand || raw.site_name || currentBrand,
        loan_amount: loanAmount,
        date,
    };
}

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
    const [selectedBrand, setSelectedBrand] = useState<string | number>("riverlend");
    const [selectedState, setSelectedState] = useState<string | number>("");
    const [selectedStatus, setSelectedStatus] = useState<string | number>("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        startDate: "2026-08-25",
        endDate: "2026-08-30",
        preset: "today",
        label: "Aug 25 - Aug 30, 2026",
    });

    // Remote Data State
    const [dataList, setDataList] = useState<LoanReportItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    console.log(fetchError);

    // Table Control State
    const [sortKey, setSortKey] = useState<string>("first_name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedRecord, setSelectedRecord] = useState<LoanReportItem | null>(null);

    // Fetch API Data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const brandParam = String(selectedBrand || "riverlend");
            const response = await reportService.getValues({
                site_name: brandParam,
                start_date: dateRange?.startDate || "2026-08-25",
                end_date: dateRange?.endDate || "2026-08-30",
                page: currentPage,
                limit: pageSize,
            });

            // Extract records array from various possible backend response formats
            const rawArray: ApiLoanRecord[] =
                (Array.isArray(response) ? response : null) ||
                response?.data ||
                response?.results ||
                response?.records ||
                response?.values ||
                [];

            if (Array.isArray(rawArray) && rawArray.length > 0) {
                const normalized = rawArray.map((r, i) => normalizeApiRecord(r, i, brandParam));
                setDataList(normalized);
            } else {
                setDataList([]);
            }
        } catch (err) {
            console.warn("API call failed or blocked by CORS/network, using local dataset fallback:", err);
            setFetchError("Live API request failed. Displaying local dataset.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedBrand, dateRange, currentPage, pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    // Extract unique brands for filter dropdown
    const uniqueBrands = useMemo(() => {
        return BRAND_OPTIONS;
    }, []);

    // Filter & Sort Logic
    const filteredAndSortedData = useMemo(() => {
        const result = dataList.filter((item) => {
            // Search across all requested fields
            const query = searchValue.toLowerCase().trim();
            const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
            const matchesSearch =
                !query ||
                fullName.includes(query) ||
                item.email.toLowerCase().includes(query) ||
                item.phone.includes(query) ||
                item.refcode.toLowerCase().includes(query) ||
                (item.brand && item.brand.toLowerCase().includes(query)) ||
                item.city.toLowerCase().includes(query) ||
                item.state.toLowerCase().includes(query) ||
                item.zipcode.includes(query) ||
                item.address.toLowerCase().includes(query) ||
                item.loan_amount.toString().includes(query);

            // Brand Filter
            const matchesBrand = !selectedBrand || item.brand === selectedBrand;

            // State Filter
            const matchesState = !selectedState || item.state === selectedState;

            // Status Filter
            const matchesStatus =
                !selectedStatus || item.status?.toUpperCase() === String(selectedStatus).toUpperCase();

            return matchesSearch && matchesBrand && matchesState && matchesStatus;
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
    }, [dataList, searchValue, selectedBrand, selectedState, selectedStatus, sortKey, sortDirection]);

    // CSV Export Handler
    const handleExportCSV = useCallback(() => {
        const dataToExport = filteredAndSortedData;
        if (dataToExport.length === 0) return;

        const headers = [
            "ID",
            "First Name",
            "Last Name",
            "Email",
            "Phone",
            "Address",
            "City",
            "State",
            "Zipcode",
            "Refcode",
            "Brand",
            "Loan Amount",
            "Date",
        ];

        const csvRows: string[] = [
            headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
        ];

        dataToExport.forEach((item) => {
            const brandLabel = (item.brand && BRAND_NAME_MAP[item.brand]) || item.brand || "";
            const row = [
                item.id ?? "",
                item.first_name ?? "",
                item.last_name ?? "",
                item.email ?? "",
                item.phone ?? "",
                item.address ?? "",
                item.city ?? "",
                item.state ?? "",
                item.zipcode ?? "",
                item.refcode ?? "",
                brandLabel,
                item.loan_amount ?? "",
                item.date ?? "",
            ];

            csvRows.push(
                row
                    .map((val) => `"${String(val).replace(/"/g, '""')}"`)
                    .join(",")
            );
        });

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvRows.join("\r\n"));
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        const timestamp = new Date().toISOString().slice(0, 10);
        link.setAttribute("download", `loan_report_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [filteredAndSortedData]);

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
                    value: item.brand
                        ? `${item.refcode} • ${BRAND_NAME_MAP[item.brand] || item.brand}`
                        : item.refcode,
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
            // Col 4: Loan Amount & Date
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
            // Col 5: Actions
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
        { key: "first_name", label: "Applicant / Refcode", sortable: true, width: "28%" },
        { key: "email", label: "Email & Phone", sortable: true, width: "26%" },
        { key: "city", label: "Address & Location", sortable: true, width: "28%" },
        { key: "loan_amount", label: "Loan Amount", sortable: true, align: "right", width: "14%" },
        { label: "Actions", align: "right", width: "4%" },
    ];

    // Reload action
    const handleReload = () => {
        fetchData();
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
                        <Button size="sm" onClick={handleExportCSV} disabled={filteredAndSortedData.length === 0}>
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
                searchPlaceholder="Search by name, email, phone..."
                filters={[
                    {
                        id: "brand",
                        label: "Brand",
                        value: selectedBrand,
                        onChange: (val) => {
                            setSelectedBrand(val);
                            setCurrentPage(1);
                        },
                        options: uniqueBrands,
                    },
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
                    setSelectedBrand("");
                    setSelectedState("");
                    setSelectedStatus("");
                    setDateRange(undefined);
                    setCurrentPage(1);
                }}
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
                                    {selectedRecord.brand && (
                                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-2 text-foreground font-medium border border-border">
                                            {BRAND_NAME_MAP[selectedRecord.brand] || selectedRecord.brand}
                                        </span>
                                    )}
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

