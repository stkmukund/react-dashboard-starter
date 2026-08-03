import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";

type Column = "Todo" | "In progress" | "Done";

interface Card {
    title: string;
    color: string;
}

interface Theme {
    column: string;
    header: string;
    count: string;
}

interface KanbanDemoProps {
    className?: string;
    theme?: "dark" | "light";
}

const CARDS: Record<number, Card> = {
    1: { title: "Design checkout UI", color: "#0ea5e9" },
    2: { title: "Integrate Stripe payments", color: "#d97706" },
    3: { title: "Real-time presence", color: "#e11d48" },
    4: { title: "Ship sprint summary", color: "#2f8159" },
    5: { title: "Write API tests", color: "#8b5cf6" },
    6: { title: "Auth & onboarding", color: "#0ea5e9" },
};

const COLUMNS: Column[] = ["Todo", "In progress", "Done"];

type Board = Record<Column, number[]>;

const initialBoard: Board = {
    Todo: [3, 6],
    "In progress": [1, 2],
    Done: [4, 5],
};

const spring = {
    type: "spring" as const,
    stiffness: 420,
    damping: 34,
};

const themes: Record<"dark" | "light", Theme> = {
    dark: {
        column:
            "bg-white/[0.08] ring-1 ring-inset ring-white/10 backdrop-blur-sm",
        header: "text-white/85",
        count: "bg-white/15 text-white/75",
    },
    light: {
        column: "bg-surface-2 ring-1 ring-inset ring-line",
        header: "text-ink",
        count: "bg-elevated text-muted",
    },
};

const KanbanDemo: React.FC<KanbanDemoProps> = ({
    className = "",
    theme = "dark",
}) => {
    const t = themes[theme];

    const [board, setBoard] = useState<Board>(initialBoard);
    const [movingId, setMovingId] = useState<number | null>(null);

    const boardRef = useRef<Board>(initialBoard);
    const sourceRef = useRef<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const prev = boardRef.current;

            let s = sourceRef.current;
            let guard = 0;

            while (prev[COLUMNS[s]].length === 0 && guard < COLUMNS.length) {
                s = (s + 1) % COLUMNS.length;
                guard += 1;
            }

            const src = COLUMNS[s];

            if (prev[src].length === 0) return;

            const dst = COLUMNS[(s + 1) % COLUMNS.length];
            const moving = prev[src][0];

            sourceRef.current = (s + 1) % COLUMNS.length;

            const next: Board = {
                ...prev,
                [src]: prev[src].slice(1),
                [dst]: [...prev[dst], moving],
            };

            boardRef.current = next;
            setBoard(next);
            setMovingId(moving);
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (movingId === null) return;

        const timeout = setTimeout(() => setMovingId(null), 700);

        return () => clearTimeout(timeout);
    }, [movingId]);

    return (
        <LayoutGroup>
            <div className={`grid grid-cols-3 gap-3.5 ${className}`}>
                {COLUMNS.map((col) => (
                    <div key={col} className={`rounded-2xl p-3 ${t.column}`}>
                        <div className="mb-2.5 flex items-center justify-between px-1.5 pt-0.5">
                            <span className={`text-xs font-semibold ${t.header}`}>
                                {col}
                            </span>

                            <span
                                className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-semibold ${t.count}`}
                            >
                                {board[col].length}
                            </span>
                        </div>

                        <div className="flex h-94 flex-col gap-2.5">
                            {board[col].map((id) => {
                                const card = CARDS[id];
                                const isMoving = id === movingId;

                                return (
                                    <motion.div
                                        key={id}
                                        layout
                                        layoutId={`card-${id}`}
                                        transition={spring}
                                    >
                                        <motion.div
                                            animate={
                                                isMoving
                                                    ? { scale: 1.06, rotate: -3 }
                                                    : { scale: 1, rotate: 0 }
                                            }
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeOut",
                                            }}
                                            className={`rounded-xl border border-line bg-surface p-3 text-left ${isMoving
                                                    ? "relative z-10 shadow-(--shadow-lift) ring-2 ring-brand-300"
                                                    : "shadow-(--shadow-card)"
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <span
                                                    className="mt-1 h-2 w-2 shrink-0 rounded-full"
                                                    style={{ backgroundColor: card.color }}
                                                />

                                                <span className="line-clamp-2 text-[13px] font-medium leading-snug text-ink">
                                                    {card.title}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="h-1.5 w-10 rounded-full bg-surface-2" />
                                                <span className="brand-gradient h-5 w-5 rounded-full ring-2 ring-surface" />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </LayoutGroup>
    );
};

export default KanbanDemo;