# React + TypeScript Dashboard Starter

A modern, production-ready, and highly reusable **React + TypeScript starter template** for quickly scaffolding dashboard and SaaS web applications.

This repository is **not a finished business product**—it is a modular foundation designed to give you all the foundational infrastructure (Authentication flow, responsive Sidebar, glassmorphic Topbar, cross-platform Command Palette, theme tokens, and primitive UI components) so you can build your own application without reinventing common patterns.

---

## 🎯 Core Philosophy & Architectural Principles

> **"Build reusable components, keep application configuration centralized, and keep domain business logic outside generic UI primitives."**

The codebase follows a strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Centralized Configuration                │
│  src/config/app.ts (Branding) · src/config/navigation.ts     │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│     Application Layer       │ │   Generic & Reusable UI     │
│  • AppLayout / AppTopbar    │ │  • DashboardLayout / Topbar │
│  • AuthContext & Protected  │ │  • Sidebar / CommandMenu    │
│  • Pages (Dashboard/Login)  │ │  • Button, Modal, Avatar    │
│  • API / Data Fetching      │ │  • Input, Badge, Dialogs    │
└─────────────────────────────┘ └─────────────────────────────┘
```

1. **Reusable UI Components (`src/components/ui`, `src/components/sidebar`, `src/components/topbar`)**:
   - Zero hardcoded assumptions about routes, business entities, or branding.
   - Configurable purely via standard React props, callbacks, and generic types.
   - Accessible via convenient barrel exports (`import { Button, Modal, Icon } from "@/components/ui"`).

2. **Application Configuration (`src/config/`)**:
   - Single source of truth for branding metadata (`name`, `tagline`, `logoIcon`, links) and navigation menus.
   - Updating `appConfig.name` automatically updates login screens, register pages, aside banners, and sidebar titles.

3. **Application & Business Layer (`src/pages/`, `src/context/`, `src/components/layout/`)**:
   - Manages routing, authentication context, and binds domain operations to reusable UI components.

---

## 🚀 Features

- **⚡ Fast Modern Tooling**: Built on React 19, TypeScript, Vite, and Tailwind CSS v4.
- **🎨 Design System & Theme Tokens**: Handcrafted light theme with refined HSL palette, soft elevation shadows, subtle border lines, and glassmorphism.
- **🧭 Responsive Dashboard Layout**:
  - Collapsible desktop sidebar with persistent state in `localStorage`.
  - Glassmorphic topbar with search, notifications slot, primary action button, and user dropdown menu.
- **⌨️ Universal Command Palette (`CommandMenu`)**:
  - Open via Topbar search click or cross-platform shortcut (`⌘ + K` on macOS / `Ctrl + K` on Windows/Linux).
  - Search filtering, keyboard navigation (Arrow Up/Down, Enter, ESC), categories, shortcut labels, and auto-scroll into view.
- **🔐 Replaceable Authentication Context**:
  - Token handling, protected route wrappers (`ProtectedRoute`, `PublicOnlyRoute`), session restore, demo account login, and split-screen auth screens.
- **🧩 10+ Reusable UI Primitives**:
  - `Button` (variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `soft` + loading spinner state)
  - `Modal` (smooth animations via Framer Motion, backdrop blur, keyboard ESC dismissal)
  - `ConfirmDialog` & `PromptDialog` (drop-in replacements for browser dialogs)
  - `Avatar` & `AvatarStack` (deterministic background colors, image fallbacks, initials)
  - `Input`, `Textarea`, `Select`, `FilterSelect` (with custom Material Symbol arrows)
  - `Badge`, `PriorityBadge`, `PriorityTag`
  - `Spinner` & `FullScreenSpinner`
  - `Skeleton`, `BoardCardSkeleton`, `ColumnSkeleton`
  - `Icon` (Google Material Symbols wrapper with `name`, `size`, `filled`, `weight` props)

---

## 📁 Folder Structure

```text
src/
├── assets/                  # Static assets and images
├── components/
│   ├── auth/                # Auth-specific UI (AuthAside banner, demo card)
│   ├── layout/              # Composed layouts & layout context
│   │   ├── AppLayout.tsx         # Main app layout combining sidebar, topbar & command menu
│   │   ├── AppTopbar.tsx         # App-specific Topbar wrapper connected to Auth
│   │   ├── DashboardLayout.tsx   # Reusable shell for sidebar + content area
│   │   ├── LayoutContext.tsx     # Context for sidebar collapse & command modal state
│   │   └── index.ts              # Barrel export for layout components
│   ├── sidebar/             # Generic, configurable sidebar
│   │   ├── Sidebar.tsx
│   │   ├── SidebarHeader.tsx
│   │   ├── SidebarSection.tsx
│   │   ├── SidebarItem.tsx
│   │   ├── SidebarFooter.tsx
│   │   ├── SidebarTypes.ts
│   │   └── index.ts
│   ├── topbar/              # Generic, configurable topbar
│   │   ├── Topbar.tsx
│   │   ├── TopbarSearch.tsx
│   │   ├── TopbarNotification.tsx
│   │   ├── TopbarPrimaryAction.tsx
│   │   ├── TopbarUserMenu.tsx
│   │   ├── TopbarUserAvatar.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   └── ui/                  # Pure, domain-agnostic UI primitives
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── CommandMenu.tsx
│       ├── ConfirmDialog.tsx
│       ├── Icon.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── PromptDialog.tsx
│       ├── Skeleton.tsx
│       ├── Spinner.tsx
│       └── index.ts         # Barrel export for all UI primitives
├── config/                  # Centralized application & navigation configuration
│   ├── app.ts               # Brand name, logo, descriptions, external links
│   ├── navigation.ts        # Sidebar routes, shortcuts, labels, sections
│   └── index.ts             # Barrel export
├── context/
│   └── AuthContext.tsx      # Replaceable authentication state & provider
├── lib/
│   ├── api.ts               # Mock API layer / real HTTP client toggle
│   ├── interfaces.ts        # Common data interfaces (User, etc.)
│   ├── mockData.ts          # Sample data for rapid frontend development
│   └── utils.ts             # Classname merger (cn), date formatting, color generators
├── pages/
│   ├── dashboard/           # Default dashboard page
│   ├── login/               # Sign-in page
│   ├── register/            # Sign-up page
│   ├── notFound/            # 404 page
│   └── index.tsx            # Root landing page
├── routes/
│   └── index.tsx            # ProtectedRoute & PublicOnlyRoute route guards
├── App.tsx                  # Root router & application provider setup
├── index.css                # Tailwind CSS v4 & theme variables
└── main.tsx                 # Application entry point
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url> my-dashboard-app
   cd my-dashboard-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

### Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite development server with HMR |
| `npm run build` | Runs TypeScript type checking (`tsc -b`) and builds production bundle |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint across the project |

---

## ⚙️ How to Customize & Reuse

### 1. Change Branding (App Name, Tagline, Logo)
Open [`src/config/app.ts`](file:///d:/Suretek-Builds/react-starter-ts/src/config/app.ts):
```ts
export const appConfig = {
  name: "Acme Analytics",
  tagline: "Insights that drive growth.",
  description: "Monitor metrics, track conversions, and collaborate in real-time.",
  logoIcon: "insights", // Any Google Material Symbol name
  links: {
    documentation: "https://docs.example.com",
    github: "https://github.com/example/repo",
  },
} as const;
```
> **Result**: Sidebar header, Login page, Register page, and Auth Asides automatically update with your new branding.

### 2. Customize Navigation
Open [`src/config/navigation.ts`](file:///d:/Suretek-Builds/react-starter-ts/src/config/navigation.ts):
```ts
export const sidebarNavigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: "dashboard",
        to: "/dashboard",
        shortcut: "G D",
        description: "Main metrics and KPI cards",
      },
      {
        label: "Analytics",
        icon: "trending_up",
        to: "/analytics",
        shortcut: "G A",
        description: "Deep-dive performance graphs",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Team",
        icon: "groups",
        to: "/team",
      },
      {
        label: "Settings",
        icon: "settings",
        to: "/settings",
      },
    ],
  },
];
```
> **Result**: Both the Sidebar and the `CommandMenu` palette automatically reflect the new navigation links and shortcuts.

### 3. Add a New Page
1. Create your page component in `src/pages/analytics/index.tsx`:
   ```tsx
   export default function AnalyticsPage() {
     return <div className="p-6"><h1>Analytics</h1></div>;
   }
   ```
2. Register the route inside [`src/App.tsx`](file:///d:/Suretek-Builds/react-starter-ts/src/App.tsx) inside the `<AppLayout />` parent route:
   ```tsx
   <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
     <Route path="/dashboard" element={<DashboardPage />} />
     <Route path="/analytics" element={<AnalyticsPage />} />
   </Route>
   ```

### 4. Connect a Real Backend API
The starter comes with a mock API in [`src/lib/api.ts`](file:///d:/Suretek-Builds/react-starter-ts/src/lib/api.ts) for rapid development.
To switch to a live REST/GraphQL backend:
1. Open [`src/lib/api.ts`](file:///d:/Suretek-Builds/react-starter-ts/src/lib/api.ts).
2. Set your `VITE_API_URL` in `.env` (e.g. `VITE_API_URL=https://api.yourdomain.com/api`).
3. Uncomment the Axios client block and replace the mock return objects with actual API endpoints.

---

## 🧩 UI Component Usage Examples

### Button
```tsx
import { Button, Icon } from "@/components/ui";

<Button variant="primary" size="md" onClick={() => alert("Saved!")}>
  <Icon name="check" size={16} />
  Save Changes
</Button>

<Button variant="outline" size="sm" loading={isLoading}>
  Export Data
</Button>
```

### Modal & Dialogs
```tsx
import { useState } from "react";
import { Modal, ConfirmDialog, Button } from "@/components/ui";

function MyComponent() {
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Open Modal</Button>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Custom Modal"
        description="A reusable modal powered by Framer Motion."
        size="md"
        footer={<Button onClick={() => setOpenModal(false)}>Close</Button>}
      >
        <p>Modal body content goes here.</p>
      </Modal>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        title="Delete item?"
        description="This action cannot be undone."
        danger
      />
    </>
  );
}
```

### Google Material Symbols Icon
```tsx
import { Icon } from "@/components/ui";

<Icon name="settings" size={20} className="text-muted" />
<Icon name="bolt" filled size={24} className="text-brand-500" />
```

---

## 🔒 Authentication System

The `AuthContext` provides a clean, generic contract:

```ts
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<User>;
  register: (credentials: any) => Promise<User>;
  logout: () => void;
}
```

- **`ProtectedRoute`**: Restricts access to authenticated users. If unauthenticated, redirects to `/login` preserving the intended path in route state.
- **`PublicOnlyRoute`**: Prevents logged-in users from accessing public authentication pages (redirects to `/dashboard`).

---

## 📦 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Google Material Symbols](https://fonts.google.com/icons)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## 📄 License

This starter template is open source and free to use for personal and commercial projects.
