import { cn } from "../../lib/utils";

type MaterialSymbolVariant =
    | "outlined"
    | "rounded"
    | "sharp";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    variant?: MaterialSymbolVariant;
    filled?: boolean;
    size?: number | string;
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
    grade?: -25 | 0 | 200;
    opticalSize?: 20 | 24 | 40 | 48;
}

const Icon = ({
    name,
    variant = "outlined",
    filled = false,
    size = 24,
    weight = 400,
    grade = 0,
    opticalSize = 24,
    className,
    style,
    ...props
}: IconProps) => {
    return (
        <span
            {...props}
            className={cn(`material-symbols-${variant}`, className)}
            style={{
                fontSize: size,
                fontVariationSettings: `
          'FILL' ${filled ? 1 : 0},
          'wght' ${weight},
          'GRAD' ${grade},
          'opsz' ${opticalSize}
        `,
                ...style,
            }}
            aria-hidden="true"
        >
            {name}
        </span>
    );
};

export default Icon;
