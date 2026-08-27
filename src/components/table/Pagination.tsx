import React from "react";
import { Icon } from "../ui";
import type { TablePaginationConfig } from "./types";

export const Pagination: React.FC<TablePaginationConfig> = ({
  page,
  pageSize,
  total,
  onPageChange,
  siblingCount = 1,
  pageSizeOptions,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Generate pagination range array with ellipses
  const getPaginationRange = () => {
    const totalPageNumbers = siblingCount + 5; // siblingCount + first + last + current + 2*dots

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, idx) => idx + 1);
      return [...leftRange, "dots", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, idx) => totalPages - rightItemCount + idx + 1
      );
      return [firstPageIndex, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, idx) => leftSiblingIndex + idx
      );
      return [firstPageIndex, "dots", ...middleRange, "dots", lastPageIndex];
    }

    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  };

  const paginationRange = getPaginationRange();
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-border/80 bg-card text-sm text-muted-foreground">
      {/* Left: Range Counter & Page Size Selector */}
      <div className="flex items-center gap-4">
        <span>
          Showing <strong className="font-semibold text-foreground">{startItem}</strong> to{" "}
          <strong className="font-semibold text-foreground">{endItem}</strong> of{" "}
          <strong className="font-semibold text-foreground">{total}</strong> items
        </span>

        {pageSizeOptions && pageSizeOptions.length > 0 && onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-surface-2 border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Controls */}
      {totalPages > 1 && (
        <nav aria-label="Pagination Navigation" className="flex items-center gap-1">
          {/* Previous Page */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous Page"
            className="flex items-center justify-center size-8 rounded-lg border border-border bg-card text-foreground hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="chevron_left" size={18} />
          </button>

          {/* Page numbers */}
          {paginationRange.map((pageNumber, idx) => {
            if (pageNumber === "dots") {
              return (
                <span
                  key={`dots-${idx}`}
                  className="flex items-center justify-center size-8 text-faint"
                >
                  …
                </span>
              );
            }

            const isCurrent = pageNumber === page;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber as number)}
                aria-current={isCurrent ? "page" : undefined}
                className={`flex items-center justify-center size-8 rounded-lg text-xs font-semibold transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "border border-border bg-card text-foreground hover:bg-surface-2"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next Page"
            className="flex items-center justify-center size-8 rounded-lg border border-border bg-card text-foreground hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="chevron_right" size={18} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
