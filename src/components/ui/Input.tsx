import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import Icon from "./Icon";

const labelCls = "block text-xs font-medium tracking-tight text-muted";

interface BaseFieldProps {
  label?: string;
  error?: string;
  className?: string;
  id?: string;
}

export interface InputProps
  extends BaseFieldProps,
  InputHTMLAttributes<HTMLInputElement> { }

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
    )}
    <input
      id={id}
      className={cn(
        "input-base rounded-full",
        error && "border-priority-urgent!",
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-priority-urgent">{error}</p>}
  </div>
);

export interface TextareaProps
  extends BaseFieldProps,
  TextareaHTMLAttributes<HTMLTextAreaElement> { }

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className,
  id,
  rows = 4,
  ...props
}) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
    )}
    <textarea
      id={id}
      rows={rows}
      className={cn(
        "input-base resize-none rounded-2xl",
        error && "border-priority-urgent!",
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-priority-urgent">{error}</p>}
  </div>
);

export interface SelectProps
  extends BaseFieldProps,
  SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

// Form select — appearance reset + custom chevron so it matches our inputs.
export const Select: React.FC<SelectProps> = ({
  label,
  className,
  id,
  children,
  ...props
}) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
    )}
    <div className="relative">
      <select
        id={id}
        className={cn(
          "input-base cursor-pointer appearance-none rounded-full pr-10",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <Icon name="KeyboardArrowDown" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
    </div>
  </div>
);

export interface FilterSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: ReactNode;
}

// Compact pill select used in filter bars.
export const FilterSelect: React.FC<FilterSelectProps> = ({
  className,
  children,
  ...props
}) => (
  <div className="relative">
    <select
      className={cn(
        "h-9 cursor-pointer appearance-none rounded-full border border-line bg-surface pl-4 pr-9 text-xs font-medium text-ink shadow-(--shadow-card) outline-none transition-all duration-200 hover:border-brand-300 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <Icon name="KeyboardArrowDown" className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
  </div>
);