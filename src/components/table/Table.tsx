import React from "react";
import { Link } from "react-router-dom";
import type { TableProps, TableHeader } from "./types";
import Row from "./Row";
import Pagination from "./Pagination";
import TableSkeleton from "./TableSkeleton";
import { Icon } from "../ui";

export const Table: React.FC<TableProps> = ({
  heading,
  subheading,
  href,
  headerAction,
  headers,
  rows,
  loading = false,
  emptyMessage = "No records found",
  pagination,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  className = "",
  stickyHeader = true,
}) => {
  // Normalize headers into TableHeader objects
  const normalizedHeaders: TableHeader[] = headers.map((header) => {
    if (typeof header === "string") {
      return { label: header, align: "left" };
    }
    return header;
  });

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-card) transition-all ${className}`}
    >
      {/* Table Header / Title Bar */}
      {(heading || href || headerAction || subheading) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border/80 bg-surface-2/30">
          <div>
            {heading && (
              <h3 className="text-lg font-bold font-display text-foreground tracking-tight">
                {heading}
              </h3>
            )}
            {subheading && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {subheading}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {href && (
              <Link
                to={href.to}
                onClick={href.onClick}
                className="text-sm font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
              >
                {href.text}
              </Link>
            )}
            {headerAction}
          </div>
        </div>
      )}

      {/* Table Content & Scroll Wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full w-full text-sm border-collapse">
          {/* Column Header */}
          <thead
            className={`border-b border-border bg-surface-2/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
              stickyHeader ? "sticky top-0 z-10 backdrop-blur-md" : ""
            }`}
          >
            <tr>
              {normalizedHeaders.map((header, index) => {
                const isSortable = header.sortable || (onSort && (header.key || typeof header.label === "string"));
                const isActiveSort =
                  sortColumn === header.key || sortColumn === index;

                return (
                  <th
                    key={header.key || index}
                    style={{ width: header.width }}
                    onClick={() => {
                      if (isSortable && onSort) {
                        onSort(index, header.key);
                      }
                    }}
                    className={`px-5 py-3.5 whitespace-nowrap select-none transition-colors ${
                      header.align === "center"
                        ? "text-center"
                        : header.align === "right"
                        ? "text-right"
                        : "text-left"
                    } ${
                      isSortable
                        ? "cursor-pointer hover:text-foreground hover:bg-surface-2"
                        : ""
                    } ${header.className || ""}`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        header.align === "center"
                          ? "justify-center"
                          : header.align === "right"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <span>{header.label}</span>
                      {isSortable && (
                        <span className="text-faint">
                          {isActiveSort ? (
                            sortDirection === "asc" ? (
                              <Icon name="arrow_upward" size={14} className="text-primary" />
                            ) : (
                              <Icon name="arrow_downward" size={14} className="text-primary" />
                            )
                          ) : (
                            <Icon name="unfold_more" size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          {!loading && (
            <tbody className="divide-y divide-border/60">
              {Array.isArray(rows) && rows.length > 0 ? (
                rows.map((rowCells, rowIndex) => (
                  <Row
                    key={rowIndex}
                    cells={rowCells}
                    rowIndex={rowIndex}
                    onRowClick={onRowClick}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={headers.length || 1}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="grid size-12 place-items-center rounded-2xl bg-surface-2 text-faint">
                        <Icon name="inbox" size={24} />
                      </div>
                      <span className="text-sm font-medium">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>

        {/* Loading Skeleton */}
        {loading && (
          <TableSkeleton
            columns={headers.length || 4}
            rows={pagination?.pageSize || 5}
          />
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};

export default Table;
