/**
 * Central application configuration.
 *
 * Update these values to customize the brand name, description,
 * links, and default metadata for the entire starter template.
 */
export const appConfig = {
    name: "Flowboard",
    tagline: "Plan smarter, ship faster.",
    description: "Turn a one-line goal into a prioritized backlog and keep your whole team moving in real time.",
    logoIcon: "bolt",
    links: {
        github: "https://github.com/vitejs/vite",
        discord: "https://chat.vite.dev",
        x: "https://x.com/vite_js",
        bluesky: "https://bsky.app/profile/vite.dev",
        documentation: "https://vite.dev",
    },
} as const;

export type AppConfig = typeof appConfig;
