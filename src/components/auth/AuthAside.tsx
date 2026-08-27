import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { appConfig } from "../../config";
import Icon from "../ui/Icon";
import { cn } from "../../lib/utils";

/* ─── Public Types ─────────────────────────────────────────────────────────── */

export interface AuthAsideProps {
    title?: string;
    subtitle?: string;
    badgeText?: string;
    badgeIcon?: string;
    showBrandHeader?: boolean;
    brandName?: string;
    brandIcon?: string;
    children?: React.ReactNode;
    className?: string;
    variant?: "energetic" | "calm" | "mesh";
}

/* ─── Animation helpers ────────────────────────────────────────────────────── */

const DOODLE_EASE = [0.4, 0, 0.2, 1] as const; // Used for motion easing

const doodleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.4 + i * 0.12,
            duration: 0.8,
            ease: DOODLE_EASE,
        },
    }),
};

/* ─── Illustrated Asset: The Workflow Hero Character ───────────────────────── */

const WorkflowHero: React.FC<{ reduced: boolean }> = ({ reduced }) => (
    <svg
        viewBox="0 0 400 420"
        className="w-full h-auto max-h-95 drop-shadow-2xl select-none"
        aria-label="Illustration of a triumphant character finding flow"
        fill="none"
    >
        {/* Background Mountain / Peak Doodle */}
        <motion.path
            d="M50 380 Q200 150 350 380 Z"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 8"
            animate={reduced ? undefined : { strokeDashoffset: [0, 50] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Hero Body */}
        <path
            d="M170 340 L230 340 L215 220 Q200 180 185 220 Z"
            fill="#ffffff"
            stroke="#134e4a"
            strokeWidth="4"
        />

        {/* The Cape - Flows dynamically */}
        <motion.path
            d="M175 220 Q110 240 90 320 Q140 300 170 230 Z"
            fill="#6EE7B7"
            stroke="#134e4a"
            strokeWidth="4"
            animate={
                reduced
                    ? undefined
                    : {
                        d: [
                            "M175 220 Q110 240 90 320 Q140 300 170 230 Z",
                            "M175 220 Q100 260 85 330 Q145 310 170 230 Z",
                            "M175 220 Q110 240 90 320 Q140 300 170 230 Z",
                        ],
                    }
            }
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Head and Hair */}
        <circle cx="200" cy="180" r="30" fill="#ffffff" stroke="#134e4a" strokeWidth="4" />
        <motion.path
            d="M180 160 Q200 110 235 155 Q210 160 215 170 Z"
            fill="#FDE047"
            stroke="#134e4a"
            strokeWidth="4"
            animate={reduced ? undefined : { rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "200px 180px" }}
        />

        {/* Triumphant Arm 1 (Holding 'Success Star') */}
        <motion.g
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <path
                d="M215 220 Q270 180 290 140"
                stroke="#134e4a"
                strokeWidth="10"
                strokeLinecap="round"
            />
            {/* Success Star Doodle */}
            <path
                d="M290 140 L295 125 L310 120 L298 110 L300 95 L288 102 L275 95 L278 110 L266 120 L282 125 Z"
                fill="#FDE047"
                stroke="#134e4a"
                strokeWidth="3"
            />
        </motion.g>

        {/* Conquered 'Task Monsters / Hurdles' Doodles */}
        {[
            { d: "M70 370 Q90 350 110 370", color: "#F87171" },
            { d: "M300 375 Q320 355 340 375", color: "#60A5FA" },
            { d: "M180 390 Q200 370 220 390", color: "#A78BFA" },
        ].map((monster, i) => (
            <motion.g
                key={i}
                custom={i + 2}
                variants={doodleVariants}
                initial="hidden"
                animate="visible"
            >
                <path d={monster.d} stroke={monster.color} strokeWidth="6" strokeLinecap="round" />
                <path d={`${monster.d} Z`} fill={monster.color} opacity="0.25" />
                {/* Defeated 'x' eyes */}
                <path
                    d={`M${parseInt(monster.d.split(" ")[0].slice(1)) + 15} ${parseInt(monster.d.split(" ")[1]) - 10} l10 10 m0 -10 l-10 10`}
                    stroke="#134e4a"
                    strokeWidth="3"
                />
            </motion.g>
        ))}
    </svg>
);

/* ─── Doodled Decorative Accents ────────────────────────────────────────── */

const DecorativeDoodles: React.FC = () => (
    <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.2 }}
        aria-hidden="true"
    >
        {/* Floating arrows */}
        <motion.path
            d="M100 100 Q120 120 140 100 L135 115 M140 100 L125 105"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Orbiting squiggles */}
        <motion.path
            d="M400 300 Q430 330 400 360 Q370 390 400 420"
            stroke="#6EE7B7"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            animate={{ strokeDashoffset: [0, 60] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 10"
        />

        {/* Sparkle doodle top right */}
        <path
            d="M450 50 L455 65 L470 70 L458 80 L460 95 L448 88 L435 95 L438 80 L426 70 L442 65 Z"
            fill="#FDE047"
        />
    </svg>
);

/* ─── Background variants ──────────────────────────────────────────────────── */

const BG_VARIANTS: Record<NonNullable<AuthAsideProps["variant"]>, string> = {
    // Dynamic brand gradient from theme
    energetic: "brand-gradient",
    // Soft slate Navy
    calm: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
    // Deep primary mesh
    mesh: "bg-gradient-to-br from-slate-950 via-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)]",
};

/* ─── Main Component ───────────────────────────────────────────────────────── */

const AuthAside: React.FC<AuthAsideProps> = ({
    title = "Build, scale, and thrive globally.",
    subtitle = "Fast, reliable, and secure tools designed to power modern digital experiences anywhere in the world.",
    badgeText = "Trusted by builders across 120+ countries",
    badgeIcon = "public",
    showBrandHeader = true,
    brandName = appConfig.name,
    brandIcon = appConfig.logoIcon,
    children,
    className = "",
    variant = "energetic",
}) => {
    const prefersReducedMotion = useReducedMotion() ?? false;

    return (
        <aside
            className={cn(
                "relative hidden w-1/2 overflow-hidden lg:flex flex-col justify-between p-12 xl:p-16 select-none text-white",
                BG_VARIANTS[variant] || BG_VARIANTS.energetic,
                className
            )}
            aria-label="Visual introduction panel"
        >
            {/* Ambient Animated Doodles */}
            <DecorativeDoodles />

            {/* Brand Header */}
            {showBrandHeader && (
                <div className="relative z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3.5 text-white transition hover:opacity-90 focus-ring rounded-xl"
                        aria-label={`Back to ${brandName} home`}
                    >
                        {/* Playful Doodled container for logo */}
                        <span
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-sm"
                            style={{
                                border: "2.5px solid rgba(255,255,255,0.2)",
                                borderRadius: "18px 8px 18px 18px",
                            }}
                        >
                            <Icon name={brandIcon} className="text-white" size={24} filled />
                        </span>
                        <span className="font-display text-2xl font-extrabold tracking-tight">
                            {brandName}
                        </span>
                    </Link>
                </div>
            )}

            {/* Center Scene: Hero Character Animation */}
            <div className="relative z-10 my-auto flex w-full flex-col items-center justify-center py-4">
                {children ? (
                    children
                ) : (
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: DOODLE_EASE, delay: 0.1 }}
                    >
                        <WorkflowHero reduced={prefersReducedMotion} />
                    </motion.div>
                )}
            </div>

            {/* Bottom Text and Badge */}
            <div className="relative z-10 mx-auto max-w-xl text-center">
                {badgeText && (
                    <motion.div
                        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/25 px-5 py-2 text-xs font-bold text-white shadow-inner backdrop-blur-md"
                    >
                        {badgeIcon && (
                            <Icon name={badgeIcon} size={16} className="text-amber-300" filled />
                        )}
                        <span>{badgeText}</span>
                    </motion.div>
                )}

                <motion.h2
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.75 }}
                    className="font-display text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white"
                >
                    {title}
                </motion.h2>

                <motion.p
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="mt-3.5 text-sm xl:text-base leading-relaxed text-white/85 font-normal"
                >
                    {subtitle}
                </motion.p>
            </div>
        </aside>
    );
};

export default AuthAside;