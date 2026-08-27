import React from "react";
import type { StatusBadgeConfig, StatusVariant } from "./types";
import { Icon, Spinner } from "../ui";

interface StatusStyle {
  label: string;
  bg: string;
  dot: string;
  text: string;
}

const STATUS_MAP: Record<string, StatusStyle> = {
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  SUCCESS: {
    label: "Success",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  ACTIVE: {
    label: "Active",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  FAILED: {
    label: "Failed",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
  },
  ERROR: {
    label: "Error",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
  },
  INACTIVE: {
    label: "Inactive",
    bg: "bg-zinc-500/10 dark:bg-zinc-500/20",
    dot: "bg-zinc-400",
    text: "text-zinc-700 dark:text-zinc-400",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  WARNING: {
    label: "Warning",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  PROCESSING: {
    label: "Processing",
    bg: "bg-sky-500/10 dark:bg-sky-500/20",
    dot: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-400",
  },
  INFO: {
    label: "Info",
    bg: "bg-sky-500/10 dark:bg-sky-500/20",
    dot: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-400",
  },
};

export interface StatusBadgeProps {
  status?: StatusVariant | string;
  badge?: StatusBadgeConfig;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status: statusProp,
  badge,
  className = "",
}) => {
  const currentStatus = (badge?.status || statusProp || "INFO").toUpperCase();
  const config = STATUS_MAP[currentStatus] || {
    label: badge?.label || currentStatus,
    bg: "bg-surface-2",
    dot: "bg-muted-foreground",
    text: "text-foreground",
  };

  const label = badge?.label || config.label;
  const isProcessing = currentStatus === "PROCESSING";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {isProcessing && (
        <span className="flex items-center gap-1.5 text-primary">
          <Spinner size="xs" />
          {badge?.percentage !== undefined && (
            <span className="text-xs font-semibold tabular-nums">
              {badge.percentage}%
            </span>
          )}
        </span>
      )}

      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors ${config.bg} ${config.text}`}
      >
        {(badge?.showDot !== false) && (
          <span className={`size-1.5 rounded-full ${config.dot}`} />
        )}
        {label}
      </span>
    </div>
  );
};

export default StatusBadge;
