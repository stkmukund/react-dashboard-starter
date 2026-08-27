import React from "react";
import { Link } from "react-router-dom";
import type { TableCell } from "./types";
import StatusBadge from "./StatusBadge";
import { getInitials } from "../../lib/utils";

interface RowProps {
  cells: TableCell[];
  rowIndex?: number;
  onRowClick?: (rowIndex: number, cells: TableCell[]) => void;
  className?: string;
}

export const Row: React.FC<RowProps> = ({
  cells,
  rowIndex = 0,
  onRowClick,
  className = "",
}) => {
  const isRowClickable = !!onRowClick;

  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(rowIndex, cells);
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className={`border-b border-border/60 bg-card transition-colors duration-150 ${
        isRowClickable ? "cursor-pointer hover:bg-surface-2/60" : "hover:bg-surface-2/40"
      } ${className}`}
    >
      {cells.map((cell, index) => {
        // Custom cell renderer has priority
        if (cell.custom) {
          return (
            <td
              key={index}
              className={`px-5 py-3.5 text-sm text-foreground align-middle ${
                cell.align === "center"
                  ? "text-center"
                  : cell.align === "right"
                  ? "text-right"
                  : "text-left"
              } ${cell.className || ""}`}
            >
              {cell.custom}
            </td>
          );
        }

        const titleText =
          typeof cell.title?.value === "string" ? cell.title.value : "";
        const initials =
          typeof cell.avatar?.initials === "string"
            ? cell.avatar.initials
            : cell.avatar?.initials && titleText
            ? getInitials(titleText)
            : null;

        return (
          <td
            key={index}
            className={`px-5 py-3.5 text-sm text-foreground align-middle ${
              cell.align === "center"
                ? "text-center"
                : cell.align === "right"
                ? "text-right"
                : "text-left"
            } ${cell.className || ""}`}
          >
            <div
              className={`flex items-center gap-3 ${
                cell.align === "center"
                  ? "justify-center"
                  : cell.align === "right"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {/* Avatar image */}
              {cell.avatar?.url && (
                <img
                  src={cell.avatar.url}
                  className="size-9 rounded-full object-cover border border-border/70 shrink-0"
                  alt={cell.avatar.alt || titleText || "Avatar"}
                />
              )}

              {/* Avatar initials fallback */}
              {!cell.avatar?.url && initials && (
                <div className="size-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {initials}
                </div>
              )}

              {/* Text content (Title & Description) */}
              {(cell.title || cell.desc) && (
                <div className="min-w-0 flex flex-col justify-center">
                  {cell.title && (
                    <div>
                      {cell.title.href ? (
                        <Link
                          to={cell.title.href}
                          onClick={(e) => {
                            if (cell.title?.onClick) {
                              cell.title.onClick(e);
                            }
                          }}
                          className={`font-medium text-foreground hover:text-primary transition-colors truncate block ${
                            cell.title.className || ""
                          }`}
                          title={cell.title.tilevalue || titleText}
                        >
                          {cell.title.value}
                        </Link>
                      ) : (
                        <span
                          onClick={cell.title.onClick}
                          className={`font-medium text-foreground truncate block ${
                            cell.title.onClick ? "cursor-pointer hover:text-primary" : ""
                          } ${cell.title.className || ""}`}
                          title={cell.title.tilevalue || titleText}
                        >
                          {cell.title.value}
                        </span>
                      )}
                    </div>
                  )}

                  {cell.desc && (
                    <div>
                      {cell.desc.href ? (
                        <Link
                          to={cell.desc.href}
                          onClick={(e) => {
                            if (cell.desc?.onClick) {
                              cell.desc.onClick(e);
                            }
                          }}
                          className={`text-xs text-muted-foreground hover:text-foreground transition-colors truncate block ${
                            cell.desc.className || ""
                          }`}
                        >
                          {cell.desc.value}
                        </Link>
                      ) : (
                        <div
                          onClick={cell.desc.onClick}
                          className={`text-xs text-muted-foreground truncate ${
                            cell.desc.onClick ? "cursor-pointer hover:text-foreground" : ""
                          } ${cell.desc.className || ""}`}
                        >
                          {cell.desc.value}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Status Badge */}
              {cell.statusBadge && (
                <StatusBadge badge={cell.statusBadge} />
              )}

              {/* Action Button/Menu */}
              {cell.action && (
                <div className="text-muted-foreground ml-auto">
                  {cell.action}
                </div>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default Row;
