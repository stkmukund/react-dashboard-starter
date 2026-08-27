import type { ReactNode } from "react";

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "last_6_months"
  | "this_year"
  | "last_year"
  // | "all_time"
  | "custom";

export interface DateRange {
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
  preset: DateRangePreset;
  label: string;
}

export interface LabelProps {
  value: string | ReactNode;
  className?: string;
  badge?: boolean;
  iconName?: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  tilevalue?: string;
}

export type StatusVariant =
  | "COMPLETED"
  | "FAILED"
  | "PENDING"
  | "PROCESSING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "INFO";

export interface StatusBadgeConfig {
  status: StatusVariant | string;
  label?: string;
  showDot?: boolean;
  percentage?: number;
  className?: string;
}

export interface TableCell {
  avatar?: {
    url?: string;
    initials?: boolean | string;
    alt?: string;
  };
  title?: LabelProps;
  desc?: LabelProps;
  statusBadge?: StatusBadgeConfig;
  action?: ReactNode;
  custom?: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export interface TableHeader {
  key?: string;
  label: string | ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  className?: string;
}

export interface TablePaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export interface TableProps {
  heading?: string | ReactNode;
  subheading?: string;
  href?: { to: string; text: string; onClick?: () => void };
  headerAction?: ReactNode;
  headers: (string | TableHeader)[];
  rows: TableCell[][];
  loading?: boolean;
  emptyMessage?: string | ReactNode;
  pagination?: TablePaginationConfig;
  onRowClick?: (rowIndex: number, cells: TableCell[]) => void;
  sortColumn?: string | number;
  sortDirection?: "asc" | "desc";
  onSort?: (columnIndex: number, headerKey?: string) => void;
  className?: string;
  stickyHeader?: boolean;
}

export interface FilterOption {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export interface FilterConfig {
  id: string;
  label: string;
  placeholder?: string;
  options: FilterOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
}

export interface TableFiltersProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: (val: string) => void;
  searchPlaceholder?: string;
  searchLoading?: boolean;
  filters?: FilterConfig[];
  dateRange?: {
    selected?: DateRange;
    onChange: (dateRange: DateRange) => void;
    defaultPreset?: DateRangePreset;
    showCustom?: boolean;
  };
  actions?: ReactNode;
  onReset?: () => void;
  className?: string;
}
