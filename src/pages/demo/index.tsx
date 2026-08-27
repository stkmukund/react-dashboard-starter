import React, { useState, useMemo } from "react";
import {
  Table,
  TableFilters,
  Button,
  Icon,
  type TableCell,
  type TableHeader,
  type DateRange,
  type StatusVariant,
} from "../../components/ui";

interface DemoItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: string;
  department: string;
  category: "Enterprise" | "SMB" | "Startup";
  status: StatusVariant;
  progress: number;
  dealValue: number;
  date: string;
}

const MOCK_DATA: DemoItem[] = [
  {
    id: "REC-1001",
    name: "Alex Morgan",
    email: "alex.morgan@apexsystems.com",
    phone: "+1 (555) 234-5678",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    role: "Senior Consultant",
    department: "Sales",
    category: "Enterprise",
    status: "COMPLETED",
    progress: 100,
    dealValue: 48500,
    date: "2026-08-25",
  },
  {
    id: "REC-1002",
    name: "Devon Lane",
    email: "devon.lane@vanguardtech.io",
    phone: "+1 (555) 876-5432",
    role: "Growth Strategist",
    department: "Marketing",
    category: "SMB",
    status: "PROCESSING",
    progress: 74,
    dealValue: 18200,
    date: "2026-08-26",
  },
  {
    id: "REC-1003",
    name: "Courtney Henry",
    email: "courtney.henry@novaglobal.co",
    phone: "+1 (555) 345-6789",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    role: "VP of Product",
    department: "Product",
    category: "Enterprise",
    status: "ACTIVE",
    progress: 90,
    dealValue: 86400,
    date: "2026-08-20",
  },
  {
    id: "REC-1004",
    name: "Eleanor Pena",
    email: "eleanor.pena@zenithanalytics.com",
    phone: "+1 (555) 987-6543",
    role: "Data Scientist",
    department: "Engineering",
    category: "Startup",
    status: "PENDING",
    progress: 30,
    dealValue: 12500,
    date: "2026-08-27",
  },
  {
    id: "REC-1005",
    name: "Floyd Miles",
    email: "floyd.miles@cloudsync.org",
    phone: "+1 (555) 456-7890",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    role: "Infrastructure Lead",
    department: "Engineering",
    category: "Enterprise",
    status: "FAILED",
    progress: 15,
    dealValue: 34000,
    date: "2026-08-14",
  },
  {
    id: "REC-1006",
    name: "Jane Cooper",
    email: "jane.cooper@lumina.design",
    phone: "+1 (555) 654-3210",
    role: "UX Director",
    department: "Design",
    category: "SMB",
    status: "SUCCESS",
    progress: 100,
    dealValue: 27800,
    date: "2026-08-18",
  },
  {
    id: "REC-1007",
    name: "Guy Hawkins",
    email: "guy.hawkins@hyperion.net",
    phone: "+1 (555) 123-9876",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    role: "DevOps Engineer",
    department: "Engineering",
    category: "Startup",
    status: "PROCESSING",
    progress: 45,
    dealValue: 16900,
    date: "2026-08-27",
  },
  {
    id: "REC-1008",
    name: "Kathryn Murphy",
    email: "kathryn.m@solaris.co",
    phone: "+1 (555) 789-0123",
    role: "Account Manager",
    department: "Sales",
    category: "SMB",
    status: "ACTIVE",
    progress: 85,
    dealValue: 22100,
    date: "2026-08-10",
  },
  {
    id: "REC-1009",
    name: "Robert Fox",
    email: "robert.fox@pulsemedia.io",
    phone: "+1 (555) 890-1234",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    role: "Brand Director",
    department: "Marketing",
    category: "Enterprise",
    status: "COMPLETED",
    progress: 100,
    dealValue: 53200,
    date: "2026-08-05",
  },
  {
    id: "REC-1010",
    name: "Theresa Webb",
    email: "theresa.webb@finverse.com",
    phone: "+1 (555) 321-7654",
    role: "Compliance Officer",
    department: "Legal",
    category: "Enterprise",
    status: "WARNING",
    progress: 55,
    dealValue: 41000,
    date: "2026-08-12",
  },
  {
    id: "REC-1011",
    name: "Jacob Jones",
    email: "jacob.jones@acmewave.org",
    phone: "+1 (555) 432-8765",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    role: "Security Engineer",
    department: "Engineering",
    category: "Startup",
    status: "INACTIVE",
    progress: 0,
    dealValue: 9800,
    date: "2026-07-28",
  },
  {
    id: "REC-1012",
    name: "Leslie Alexander",
    email: "leslie.a@catalyst.ai",
    phone: "+1 (555) 543-9876",
    role: "AI Researcher",
    department: "Engineering",
    category: "Startup",
    status: "COMPLETED",
    progress: 100,
    dealValue: 64000,
    date: "2026-08-24",
  },
];

export default function TableDemoPage() {
  // Filters State
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | number>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | number>("");
  const [selectedCategory, setSelectedCategory] = useState<string | number>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Table Control State
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedLead, setSelectedLead] = useState<DemoItem | null>(null);

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

  // Filter & Sort Logic
  const filteredAndSortedData = useMemo(() => {
    const result = MOCK_DATA.filter((item) => {
      // Search
      const query = searchValue.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.phone.includes(query) ||
        item.id.toLowerCase().includes(query);

      // Status
      const matchesStatus =
        !selectedStatus || item.status.toUpperCase() === String(selectedStatus).toUpperCase();

      // Department
      const matchesDepartment =
        !selectedDepartment || item.department === selectedDepartment;

      // Category
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      // Date Range
      let matchesDate = true;
      if (dateRange && dateRange.startDate && dateRange.endDate) {
        matchesDate =
          item.date >= dateRange.startDate && item.date <= dateRange.endDate;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment &&
        matchesCategory &&
        matchesDate
      );
    });

    // Sort
    result.sort((a, b) => {
      let valA: string | number = (a as unknown as Record<string, string | number>)[sortKey] ?? "";
      let valB: string | number = (b as unknown as Record<string, string | number>)[sortKey] ?? "";

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    searchValue,
    selectedStatus,
    selectedDepartment,
    selectedCategory,
    dateRange,
    sortKey,
    sortDirection,
  ]);

  // Paginated Rows
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Transform into TableCells
  const tableRows: TableCell[][] = useMemo(() => {
    return paginatedData.map((item) => [
      // Col 1: Avatar + Name + Subtitle (Email)
      {
        avatar: item.avatarUrl
          ? { url: item.avatarUrl, alt: item.name }
          : { initials: true },
        title: {
          value: item.name,
          className: "font-semibold text-foreground hover:text-primary transition-colors cursor-pointer",
          onClick: () => setSelectedLead(item),
        },
        desc: {
          value: item.email,
        },
      },
      // Col 2: ID & Phone
      {
        title: {
          value: item.id,
          className: "font-mono text-xs font-semibold text-primary",
        },
        desc: {
          value: item.phone,
          className: "text-xs font-mono",
        },
      },
      // Col 3: Role & Department
      {
        title: {
          value: item.role,
          className: "font-medium text-foreground",
        },
        desc: {
          value: `${item.department} • ${item.category}`,
        },
      },
      // Col 4: Status Badge
      {
        statusBadge: {
          status: item.status,
          percentage: item.status === "PROCESSING" ? item.progress : undefined,
        },
      },
      // Col 5: Deal Value & Date
      {
        align: "right",
        title: {
          value: `$${item.dealValue.toLocaleString()}`,
          className: "font-bold font-mono text-foreground",
        },
        desc: {
          value: item.date,
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
              onClick={() => setSelectedLead(item)}
              aria-label="View Details"
              className="grid size-8 place-items-center rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="visibility" size={16} />
            </button>
            <button
              type="button"
              aria-label="More actions"
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
    { key: "name", label: "Contact / Customer", sortable: true, width: "28%" },
    { key: "id", label: "Reference & Phone", sortable: true, width: "18%" },
    { key: "department", label: "Role & Segment", sortable: true, width: "22%" },
    { key: "status", label: "Status", sortable: true, width: "14%" },
    { key: "dealValue", label: "Deal Value", sortable: true, align: "right", width: "12%" },
    { label: "Actions", align: "right", width: "6%" },
  ];

  // Simulating loading state for demonstration
  const handleTriggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 900);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="card rounded-3xl p-6 sm:p-8 bg-card border border-border shadow-(--shadow-soft)">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Icon name="table_chart" size={14} />
              Component Suite Showcase
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Dynamic Table & Filters Demo
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              A comprehensive demonstration of the reusable dynamic table, multi-parameter filter toolbar,
              date range presets, responsive pagination, and status badge system.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTriggerLoading}
              disabled={isLoading}
            >
              <Icon name="refresh" size={16} className={isLoading ? "animate-spin" : ""} />
              Simulate Reload
            </Button>
            <Button size="sm">
              <Icon name="add" size={16} />
              New Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <TableFilters
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search by name, email, phone, or ID..."
        filters={[
          {
            id: "status",
            label: "Status",
            value: selectedStatus,
            onChange: (val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            },
            options: [
              { label: "Completed", value: "COMPLETED" },
              { label: "Processing", value: "PROCESSING" },
              { label: "Active", value: "ACTIVE" },
              { label: "Success", value: "SUCCESS" },
              { label: "Pending", value: "PENDING" },
              { label: "Warning", value: "WARNING" },
              { label: "Failed", value: "FAILED" },
              { label: "Inactive", value: "INACTIVE" },
            ],
          },
          {
            id: "department",
            label: "Department",
            value: selectedDepartment,
            onChange: (val) => {
              setSelectedDepartment(val);
              setCurrentPage(1);
            },
            options: [
              { label: "Sales", value: "Sales" },
              { label: "Marketing", value: "Marketing" },
              { label: "Product", value: "Product" },
              { label: "Engineering", value: "Engineering" },
              { label: "Design", value: "Design" },
              { label: "Legal", value: "Legal" },
            ],
          },
          {
            id: "category",
            label: "Segment",
            value: selectedCategory,
            onChange: (val) => {
              setSelectedCategory(val);
              setCurrentPage(1);
            },
            options: [
              { label: "Enterprise", value: "Enterprise" },
              { label: "SMB", value: "SMB" },
              { label: "Startup", value: "Startup" },
            ],
          },
        ]}
        dateRange={{
          selected: dateRange,
          onChange: (range) => {
            setDateRange(range);
            setCurrentPage(1);
          },
          defaultPreset: "all_time",
          showCustom: true,
        }}
        onReset={() => {
          setSearchValue("");
          setSelectedStatus("");
          setSelectedDepartment("");
          setSelectedCategory("");
          setCurrentPage(1);
        }}
        actions={
          <Button variant="outline" size="sm">
            <Icon name="file_download" size={16} />
            Export CSV
          </Button>
        }
      />

      {/* Dynamic Table with Sorting and Pagination */}
      <Table
        heading="Client & Pipeline Records"
        subheading={`Showing ${filteredAndSortedData.length} records matching current filter criteria`}
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

      {/* Selected Item Modal / Details Card */}
      {selectedLead && (
        <div className="card p-5 rounded-2xl bg-surface-2/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {selectedLead.avatarUrl ? (
              <img
                src={selectedLead.avatarUrl}
                alt={selectedLead.name}
                className="size-12 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="size-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                {selectedLead.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground text-base">
                  {selectedLead.name}
                </h4>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  {selectedLead.id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedLead.role} • {selectedLead.department} • {selectedLead.email} • Deal:{" "}
                <strong className="text-foreground">${selectedLead.dealValue.toLocaleString()}</strong>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedLead(null)}
          >
            <Icon name="close" size={16} />
            Close Preview
          </Button>
        </div>
      )}
    </div>
  );
}
