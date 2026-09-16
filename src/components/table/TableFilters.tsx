import React, { useState, useEffect } from "react";
import type { FilterConfig, TableFiltersProps } from "./types";
import DateRangeDropdown from "./DateRangeDropdown";
import { Icon, Spinner, BrandDropdown } from "../ui";

const DropdownFilter: React.FC<{ filter: FilterConfig }> = ({ filter }) => {
  // If this is a brand filter or custom filter, reuse BrandDropdown for consistent UI
  return (
    <BrandDropdown
      value={String(filter.value ?? "")}
      onChange={(val) => filter.onChange(val)}
      options={filter.options.map((opt) => ({
        label: opt.label,
        value: String(opt.value),
      }))}
      placeholder={filter.placeholder}
      title={`Select ${filter.label}`}
      iconName={filter.id === "brand" ? "business" : "tune"}
      className="min-w-36"
    />
  );
};

export const TableFilters: React.FC<TableFiltersProps> = ({
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search records...",
  searchLoading = false,
  filters = [],
  dateRange,
  actions,
  onReset,
  className = "",
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearchSubmit) {
      onSearchSubmit(localSearch);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    if (onSearchChange) {
      onSearchChange("");
    }
    if (onSearchSubmit) {
      onSearchSubmit("");
    }
  };

  const hasActiveFilters =
    Boolean(localSearch) ||
    filters.some((f) => f.value !== undefined && f.value !== "");

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card shadow-(--shadow-card) ${className}`}
    >
      {/* Left side: Search and Dropdown Filters */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search Bar Input */}
        {(onSearchChange || onSearchSubmit) && (
          <div className="relative flex-1 min-w-55 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              {searchLoading ? (
                <Spinner size="sm" />
              ) : (
                <Icon name="search" size={18} />
              )}
            </div>

            <input
              type="text"
              value={localSearch}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 bg-surface-2 border border-border rounded-xl text-xs sm:text-sm text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />

            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-faint hover:text-foreground"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        )}

        {/* Reset / Clear Button */}
        {hasActiveFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <Icon name="filter_alt_off" size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right side: Date Range Picker & Custom Actions */}
      <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0 flex-wrap">
        {/* Custom Dropdown Filters */}
        {filters.map((filter) => (
          <DropdownFilter key={filter.id} filter={filter} />
        ))}

        {dateRange && (
          <DateRangeDropdown
            onDateRangeChange={dateRange.onChange}
            defaultPreset={dateRange.defaultPreset}
            showCustom={dateRange.showCustom}
          />
        )}

        {actions}
      </div>
    </div>
  );
};

export default TableFilters;
