# React + TypeScript Dashboard Starter

A modern, production-ready, and highly reusable **React + TypeScript starter template** for quickly scaffolding dashboard and SaaS web applications.

This repository is **not a finished business product**—it is a modular foundation designed to give you all the foundational infrastructure (Authentication flow, centralized API layer, typed environment handling, responsive Sidebar, glassmorphic Topbar, cross-platform Command Palette, theme tokens, and primitive UI components) so you can build your own application without reinventing common patterns.

---

## 🎯 Core Philosophy & Architectural Principles

> **"Build reusable components, keep application configuration and API communication centralized, and keep domain business logic outside generic UI primitives and API foundations."**

The codebase follows a strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Centralized Configuration                │
│  src/config/app.ts (Branding) · src/config/env.ts (Env)     │
│  src/config/navigation.ts (Navigation Menu Items)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│     Centralized API Layer   │ │   Generic & Reusable UI     │
│  • src/api/client.ts (Axios)│ │  • DashboardLayout / Topbar │
│  • src/api/endpoints.ts     │ │  • Sidebar / CommandMenu    │
│  • src/api/errors.ts (Norm) │ │  • Button, Modal, Avatar    │
│  • src/api/types.ts         │ │  • Input, Badge, Dialogs    │
└──────────────┬──────────────┘ └─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│   Feature / Service Layer   │
│  • src/services/auth.ts     │
│  • src/context/AuthContext  │
│  • src/pages/ (Dashboard)   │
└─────────────────────────────┘
```

1. **Centralized API Infrastructure (`src/api/`)**:
   - Single Axios client instance for the entire application.
   - Centralized endpoint registry with dynamic route generators.
   - Pluggable Bearer token injection and error normalization into `ApiError`.
   - Independent of business domain logic, ready to copy into any React + TypeScript project.

2. **Environment Configuration (`src/config/env.ts`)**:
   - Single typed source of truth for runtime variables (`apiBaseUrl`, `apiTimeout`, `isProduction`, `isDevelopment`, `mode`).
   - Prevents scattered, untyped `import.meta.env` access across components.

3. **Reusable UI Components (`src/components/ui`, `src/components/sidebar`, `src/components/topbar`)**:
   - Zero hardcoded assumptions about routes, business entities, or branding.
   - Configurable purely via standard React props, callbacks, and generic types.

---

## 🚀 Features

- **⚡ Fast Modern Tooling**: Built on React 19, TypeScript, Vite, and Tailwind CSS v4.
- **🌐 Centralized API Layer**: Reusable Axios client with typed `GET`, `POST`, `PUT`, `PATCH`, `DELETE` methods, centralized endpoints, request/response interceptors, and error normalization.
- **🌱 Typed Environment Config**: Centralized `env` configuration reading `VITE_` variables with defaults and validation.
- **🎨 Design System & Theme Tokens**: Handcrafted light theme with refined HSL palette, soft elevation shadows, subtle border lines, and glassmorphism.
- **🧭 Responsive Dashboard Layout**: Collapsible desktop sidebar with persistent state in `localStorage`, glassmorphic topbar with search, notifications slot, and user dropdown menu.
- **⌨️ Universal Command Palette (`CommandMenu`)**: Open via Topbar search click or `⌘ + K` / `Ctrl + K`.
- **🔐 Replaceable Authentication Context**: Integrated with the centralized API layer, token helpers (`setStoredToken`, `getStoredToken`, `clearStoredToken`), and route guards (`ProtectedRoute`, `PublicOnlyRoute`).
- **🧩 10+ Reusable UI Primitives**: `Button`, `Modal`, `ConfirmDialog`, `PromptDialog`, `Avatar`, `AvatarStack`, `Input`, `Badge`, `Spinner`, `Skeleton`, `Icon`.

---

## 📁 Folder Structure

```text
src/
├── api/                     # Generic, production-ready API infrastructure
│   ├── client.ts            # Centralized Axios client & typed HTTP methods
│   ├── endpoints.ts         # Centralized endpoint paths & dynamic route generators
│   ├── errors.ts            # ApiError class & error normalization
│   ├── types.ts             # TypeScript definitions for requests, errors & config
│   └── index.ts             # Barrel export
├── assets/                  # Static assets and images
├── components/
│   ├── auth/                # Auth-specific UI (AuthAside banner)
│   ├── layout/              # Composed layouts & layout context
│   │   ├── AppLayout.tsx         # Main app layout combining sidebar, topbar & command menu
│   │   ├── AppTopbar.tsx         # App-specific Topbar wrapper connected to Auth
│   │   ├── DashboardLayout.tsx   # Reusable shell for sidebar + content area
│   │   └── LayoutContext.tsx     # Context for sidebar collapse & command modal state
│   ├── sidebar/             # Generic, configurable sidebar
│   ├── topbar/              # Generic, configurable topbar
│   └── ui/                  # Pure, domain-agnostic UI primitives
├── config/                  # Centralized application & environment configuration
│   ├── app.ts               # Brand name, logo, descriptions, external links
│   ├── env.ts               # Typed environment variables (API base URL, timeout, mode)
│   ├── navigation.ts        # Sidebar routes, shortcuts, labels, sections
│   └── index.ts             # Barrel export
├── context/
│   └── AuthContext.tsx      # Authentication state & provider connected to API
├── lib/
│   ├── interfaces.ts        # Common data interfaces (User, etc.)
│   └── utils.ts             # Classname merger (cn), date formatting, color generators
├── pages/
│   ├── dashboard/           # Default dashboard page
│   ├── login/               # Sign-in page
│   ├── register/            # Sign-up page
│   └── notFound/            # 404 page
├── routes/
│   └── index.tsx            # ProtectedRoute & PublicOnlyRoute route guards
├── services/                # Feature-specific API services built on top of src/api
│   ├── auth.ts              # Authentication service (login, register, me, logout)
│   └── index.ts             # Barrel export
├── App.tsx                  # Root router (/ -> /login redirect) & providers
├── index.css                # Tailwind CSS v4 & theme variables
└── main.tsx                 # Application entry point
```

---

## 🌐 API Layer & Data Fetching

The API layer is completely decoupled from business domain logic and lives in `src/api/`.

### Architecture Overview

```text
                    ┌──────────────────┐
                    │  config/env.ts   │
                    │   API base URL   │
                    └────────┬─────────┘
                             │
                             ▼
┌──────────────┐      ┌──────────────┐
│ endpoints.ts │ ───► │  api/client  │
│              │      │              │
│ /users       │      │ GET          │
│ /users/:id   │      │ POST         │
│ /auth/login  │      │ PUT          │
└──────────────┘      │ PATCH        │
                      │ DELETE       │
                      └──────┬───────┘
                             │
                             ▼
                     Feature Services
                     (e.g., services/auth.ts)
                             │
                             ▼
                       Hooks / Pages
```

### 1. Making API Requests

Import `api` from `src/api`:

```ts
import { api, endpoints } from "@/api";

// GET request with query params
interface User {
  id: string;
  name: string;
  email: string;
}

const users = await api.get<User[]>(endpoints.users.list, {
  params: { search: "alex", page: 1 },
});

// POST request with payload
const newUser = await api.post<User, { name: string; email: string }>(
  endpoints.users.list,
  {
    data: { name: "Ada Lovelace", email: "ada@example.com" },
  }
);

// PUT / PATCH request
const updatedUser = await api.patch<User>(endpoints.users.detail("123"), {
  data: { name: "Ada L." },
});

// DELETE request
await api.delete(endpoints.users.detail("123"));
```

### 2. Centralized Endpoints (`src/api/endpoints.ts`)

Endpoints support static strings and type-safe dynamic path generators:

```ts
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  users: {
    list: "/users",
    detail: (id: string | number) => `/users/${id}`,
  },
  projects: {
    list: "/projects",
    detail: (id: string | number) => `/projects/${id}`,
    tasks: (projectId: string | number) => `/projects/${projectId}/tasks`,
  },
} as const;
```

### 3. Authentication & Token Injection

- By default, the request interceptor automatically pulls tokens stored via `getStoredToken()` (default `localStorage` key `auth_token`) and injects the `Authorization: Bearer <token>` header on every outgoing request.
- To connect custom token providers (such as Supabase, Firebase, or in-memory stores), use `setTokenProvider`:

```ts
import { setTokenProvider } from "@/api";

setTokenProvider(async () => {
  return await customAuthSdk.getAccessToken();
});
```

### 4. Error Handling (`src/api/errors.ts`)

All errors are normalized into `ApiError`:

```ts
import { ApiError } from "@/api";

try {
  await api.post(endpoints.auth.login, { data: credentials });
} catch (err) {
  if (err instanceof ApiError) {
    console.error("HTTP Status:", err.status); // e.g. 422 or 401
    console.error("Message:", err.message);
    console.error("Validation Errors:", err.validationErrors);
  }
}
```

### 5. Adding Feature-Specific API Services

Create domain services under `src/services/` by consuming the generic `api` and `endpoints`:

```ts
// src/services/projects.ts
import { api, endpoints } from "../api";

export interface Project {
  id: string;
  name: string;
  description: string;
}

export const projectService = {
  getAll: () => api.get<Project[]>(endpoints.projects.list),
  getById: (id: string) => api.get<Project>(endpoints.projects.detail(id)),
  create: (data: Omit<Project, "id">) => api.post<Project>(endpoints.projects.list, { data }),
};
```

---

## 🛠️ Environment Configuration

Environment access is centralized in [`src/config/env.ts`](file:///d:/Suretek-Builds/react-starter-ts/src/config/env.ts).

### Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_API_TIMEOUT=15000
   ```

### Safe Frontend Exposure

Only variables prefixed with `VITE_` are exposed to the browser build. **Never place backend database credentials, private API secret keys, or passwords in frontend `.env` files.**

Access variables via:

```ts
import { env } from "@/config";

console.log(env.apiBaseUrl);
console.log(env.isDevelopment);
```

---

## 🧭 Routing & Navigation

- **`/` → `/login`**: Visiting the root path redirects directly to `/login`. The dashboard starter is designed with authentication-first workflows, so users land on the sign-in screen when launching the app.
- **`/login` & `/register`**: Wrapped in `PublicOnlyRoute`. If a user is already authenticated, they are automatically forwarded to `/dashboard`.
- **`/dashboard`**: Wrapped in `ProtectedRoute` and `AppLayout`. Requires active session/token.

---

## ♻️ Reusability: How to Copy into Other Projects

The `src/api` and `src/config/env.ts` modules are **100% domain-agnostic**. To use them in another React + TypeScript project:

1. Copy `src/api/` and `src/config/env.ts` into your target project.
2. Install `axios`: `npm install axios`.
3. Configure `VITE_API_BASE_URL` in `.env`.
4. Define your backend routes in `src/api/endpoints.ts`.

---

## 🛠️ Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite development server with HMR |
| `npm run build` | Runs TypeScript type checking (`tsc -b`) and builds production bundle |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint across the project |

---

## 📄 License

This starter template is open source and free to use for personal and commercial projects.
