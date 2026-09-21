import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Icon } from "../ui";
import type { DateRange, DateRangePreset } from "./types";

export interface DateRangeDropdownProps {
  onDateRangeChange: (dateRange: DateRange) => void;
  defaultPreset?: DateRangePreset;
  className?: string;
  showCustom?: boolean;
  align?: "left" | "right";
}

export interface DateRangeDropdownRef {
  reset: () => void;
  setDateRange: (preset: DateRangePreset, start?: string, end?: string) => void;
}

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const calculateDateRange = (
  preset: DateRangePreset,
  customStart?: string,
  customEnd?: string
): DateRange => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let start = new Date(today);
  let end = new Date(today);
  let label = "Select Range";

  switch (preset) {
    case "today":
      label = "Today";
      break;

    case "yesterday": {
      start.setDate(today.getDate() - 1);
      end.setDate(today.getDate() - 1);
      label = "Yesterday";
      break;
    }

    case "last_7_days": {
      start.setDate(today.getDate() - 6);
      label = "Last 7 Days";
      break;
    }

    case "last_30_days": {
      start.setDate(today.getDate() - 29);
      label = "Last 30 Days";
      break;
    }

    case "this_month": {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      label = "This Month";
      break;
    }

    case "last_month": {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      label = "Last Month";
      break;
    }

    case "last_3_months": {
      start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      label = "Last 3 Months";
      break;
    }

    case "last_6_months": {
      start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      label = "Last 6 Months";
      break;
    }

    case "this_year": {
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
      label = "This Year";
      break;
    }

    case "last_year": {
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = new Date(today.getFullYear() - 1, 11, 31);
      label = "Last Year";
      break;
    }

    // case "all_time": {
    //   start = new Date(2020, 0, 1);
    //   label = "All Time";
    //   break;
    // }

    case "custom": {
      if (customStart && customEnd) {
        return {
          startDate: customStart,
          endDate: customEnd,
          preset: "custom",
          label: `${customStart} to ${customEnd}`,
        };
      }
      label = "Custom Range";
      break;
    }
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    preset,
    label,
  };
};

const PRESET_OPTIONS: { label: string; value: DateRangePreset }[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Last 3 Months", value: "last_3_months" },
  { label: "This Year", value: "this_year" },
  // { label: "All Time", value: "all_time" },
  { label: "Custom Range", value: "custom" },
];

export const DateRangeDropdown = forwardRef<DateRangeDropdownRef, DateRangeDropdownProps>(
  (
    {
      onDateRangeChange,
      defaultPreset = "last_30_days",
      className = "",
      showCustom = true,
      align = "right",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(defaultPreset);
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync initial state on mount
    useEffect(() => {
      const initial = calculateDateRange(defaultPreset, customStartDate, customEndDate);
      onDateRangeChange(initial);
    }, []);

    // Outside click detection
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setShowCustomPicker(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useImperativeHandle(ref, () => ({
      reset() {
        setSelectedPreset(defaultPreset);
        setCustomStartDate("");
        setCustomEndDate("");
        setIsOpen(false);
        setShowCustomPicker(false);
        const range = calculateDateRange(defaultPreset);
        onDateRangeChange(range);
      },
      setDateRange(preset, start, end) {
        setSelectedPreset(preset);
        if (start) setCustomStartDate(start);
        if (end) setCustomEndDate(end);
        const range = calculateDateRange(preset, start, end);
        onDateRangeChange(range);
      },
    }));

    const handlePresetSelect = (preset: DateRangePreset) => {
      if (preset === "custom") {
        setShowCustomPicker(true);
        return;
      }

      setSelectedPreset(preset);
      setIsOpen(false);
      setShowCustomPicker(false);

      const range = calculateDateRange(preset);
      onDateRangeChange(range);
    };

    const handleCustomApply = () => {
      if (!customStartDate || !customEndDate) return;

      const range = calculateDateRange("custom", customStartDate, customEndDate);
      setSelectedPreset("custom");
      setIsOpen(false);
      setShowCustomPicker(false);
      onDateRangeChange(range);
    };

    const currentRange = calculateDateRange(
      selectedPreset,
      customStartDate,
      customEndDate
    );

    const availablePresets = showCustom
      ? PRESET_OPTIONS
      : PRESET_OPTIONS.filter((o) => o.value !== "custom");

    return (
      <div ref={dropdownRef} className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between gap-2.5 px-3.5 py-2 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-(--shadow-card) transition-all min-w-40"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2 text-muted-foreground truncate">
            <Icon name="calendar_today" size={16} className="text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground truncate">
              {currentRange.label}
            </span>
          </div>
          <Icon
            name="keyboard_arrow_down"
            size={16}
            className={`text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute mt-2 w-72 bg-card rounded-2xl shadow-(--shadow-lift) border border-border z-50 animate-in overflow-hidden ${align === "right" ? "" : "left-0"
              }`}
          >
            {!showCustomPicker ? (
              <>
                {/* Active Range Preview */}
                <div className="px-4 py-3 border-b border-border bg-surface-2/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Selected Range
                  </span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {currentRange.startDate} → {currentRange.endDate}
                  </p>
                </div>

                {/* Preset List */}
                <div className="py-1.5 max-h-72 overflow-y-auto">
                  {availablePresets.map((opt) => {
                    const isSelected = selectedPreset === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handlePresetSelect(opt.value)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-xs font-medium transition-colors ${isSelected
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-surface-2"
                          }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Icon name="check" size={14} className="text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Custom Range Date Pickers */
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-bold text-foreground">Custom Date Range</span>
                  <button
                    type="button"
                    onClick={() => setShowCustomPicker(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface-2 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface-2 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowCustomPicker(false)}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-surface-2 rounded-lg hover:bg-surface-2/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCustomApply}
                    disabled={!customStartDate || !customEndDate}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

DateRangeDropdown.displayName = "DateRangeDropdown";

export default DateRangeDropdown;
