import React, { useState, useEffect, useRef } from "react";
import Icon from "./Icon";

export interface BrandOption {
  label: string;
  value: string;
}

export const BRAND_OPTIONS: BrandOption[] = [
  { label: "Riverlend", value: "riverlend" },
  { label: "Rapid Trust Capital", value: "rapidtrust" },
  { label: "Ridge View Loans", value: "ridgeviewloans" },
  { label: "Universal Lending LLC", value: "universallending" },
  { label: "Bright Relief", value: "brightrelief" },
];

export const BRAND_NAME_MAP: Record<string, string> = {
  riverlend: "Riverlend",
  rapidtrust: "Rapid Trust Capital",
  ridgeviewloans: "Ridge View Loans",
  universallending: "Universal Lending LLC",
  brightrelief: "Bright Relief",
};

export interface BrandDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: BrandOption[];
  placeholder?: string;
  showAllOption?: boolean;
  title?: string;
  className?: string;
  align?: "left" | "right";
  iconName?: string;
}

export const BrandDropdown: React.FC<BrandDropdownProps> = ({
  value,
  onChange,
  options = BRAND_OPTIONS,
  placeholder,
  showAllOption = false,
  title,
  className = "",
  align = "right",
  iconName = "business",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((b) => b.value === value);
  const displayLabel = selectedOption?.label || placeholder || "Select Brand";

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full inline-flex items-center justify-between gap-2.5 px-3.5 py-2 bg-card border border-border rounded-xl text-xs font-medium text-foreground hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-(--shadow-card) transition-all min-w-44"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2 text-muted-foreground truncate">
          <Icon name={iconName} size={16} className="text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground truncate">
            {displayLabel}
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
          className={`absolute mt-2 w-56 bg-card rounded-2xl shadow-(--shadow-lift) border border-border z-50 animate-in overflow-hidden ${align === "right" ? "right-0" : "left-0"
            }`}
        >
          <div className="px-4 py-2.5 border-b border-border bg-surface-2/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {title || "Select Brand"}
            </span>
          </div>
          <div className="py-1.5 max-h-60 overflow-y-auto">
            {showAllOption && placeholder && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-medium transition-colors ${!value
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-surface-2"
                  }`}
              >
                <span>{placeholder}</span>
                {!value && <Icon name="check" size={14} className="text-primary" />}
              </button>
            )}
            {options.map((brand) => {
              const isSelected = value === brand.value;
              return (
                <button
                  key={brand.value}
                  type="button"
                  onClick={() => {
                    onChange(brand.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs font-medium transition-colors ${isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-surface-2"
                    }`}
                >
                  <span className="truncate">{brand.label}</span>
                  {isSelected && <Icon name="check" size={14} className="text-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandDropdown;
