import { cn } from "../../lib/utils";

interface SpinnerProps {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-10 w-10 border-4",
};

const Spinner = ({
  className,
  label,
  size = "md",
}: SpinnerProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-muted/30 border-t-brand-500",
          sizeClasses[size],
          className
        )}
        aria-hidden="true"
      />
      {label && <span className="text-sm">{label}</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
};

interface FullScreenSpinnerProps {
  label?: string;
}

export const FullScreenSpinner = ({
  label = "Loading...",
}: FullScreenSpinnerProps) => (
  <div className="flex min-h-screen items-center justify-center">
    <Spinner label={label} size="lg" />
  </div>
);

export default Spinner;
