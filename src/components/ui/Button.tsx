
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import Spinner from "./Spinner";

const variants = {
  primary:
    "brand-gradient text-primary-foreground shadow-(--shadow-brand) hover:brightness-[1.07] hover:shadow-[0_14px_34px_rgba(var(--color-primary-rgb),0.45)]",
  secondary:
    "bg-card hover:bg-surface-2 text-foreground border border-border shadow-(--shadow-card) hover:shadow-(--shadow-soft)",
  ghost: "hover:bg-surface-2 text-muted-foreground hover:text-foreground",
  danger:
    "bg-destructive text-destructive-foreground shadow-[0_8px_20px_rgba(225,29,72,0.28)] hover:brightness-[1.06]",
  outline:
    "border border-border bg-card hover:border-primary-border hover:bg-surface-2 text-foreground shadow-(--shadow-card)",
  soft: "bg-primary-subtle text-primary-subtle-foreground hover:bg-primary-subtle/80",
} as const;

const sizes = {
  sm: "h-8 px-3.5 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-[15px] gap-2",
  icon: "h-10 w-10",
  iconSm: "h-8 w-8",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}) => (
  <button
    className={cn(
      "inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all duration-200 ease-spring focus-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
      variants[variant],
      sizes[size],
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {/* {loading && <Icon name="Autorenew" className="h-4 w-4 animate-spin" />} */}
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);

export default Button;