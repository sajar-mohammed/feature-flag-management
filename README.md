# Multi-Tenant Feature Flag System

A full-stack, multi-tenant feature flag management platform built with **Node.js / TypeScript**, **MongoDB**, and **React (Vite)**. It lets a super-admin onboard organisations, organisation admins manage feature flags, and end-users check whether a feature is enabled — all from dedicated UIs.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [API Reference](#api-reference)
7. [Apps](#apps)
   - [Super Admin](#super-admin-app-port-5173)
   - [Organisation Admin](#organisation-admin-app-port-5174)
   - [User / Feature Checker](#user--feature-checker-app-port-5175)
8. [Global Middleware](#global-middleware)
9. [What's Done](#whats-done)
10. [Future Improvements](#future-improvements)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Clients                           │
│  ┌───────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  Super Admin  │  │   Org Admin App  │  │  User Checker   │  │
│  │  (port 5173)  │  │   (port 5174)    │  │  (port 5175)    │  │
│  └───────┬───────┘  └────────┬─────────┘  └────────┬────────┘  │
└──────────┼───────────────────┼─────────────────────┼───────────┘
           │ REST / JSON       │                      │
           ▼                   ▼                      ▼
┌───────────────────────────────────────────────────────────────┐
│              Express Backend  (port 5001)                      │
│  ┌──────────┐ ┌──────────────┐ ┌───────────┐ ┌────────────┐  │
│  │   Auth   │ │ Organisation │ │  Feature  │ │  Feature   │  │
│  │  Router  │ │    Router    │ │  Flags    │ │  Check     │  │
│  └──────────┘ └──────────────┘ └───────────┘ └────────────┘  │
│  Global: asyncHandler ─ errorHandler ─ authenticate ─ authorize│
└───────────────────────────────────┬───────────────────────────┘
                                    │ Mongoose ODM
                                    ▼
                            ┌──────────────┐
                            │   MongoDB    │
                            └──────────────┘
```

---

## Project Structure

```
multi-tenant-feature-flag-system/
├── backend/                          # Express + TypeScript API
│   ├── src/
│   │   ├── app.ts                    # Express app setup + global error handler
│   │   ├── server.ts                 # Entry point, DB connect
│   │   ├── config/
│   │   │   └── database.ts           # Mongoose connection
│   │   ├── constants/
│   │   │   └── roles.ts              # SUPER_ADMIN, ORG_ADMIN role enums
│   │   ├── controllers/              # Request handlers (wrapped in asyncHandler)
│   │   │   ├── auth.controller.ts
│   │   │   ├── featureCheck.controller.ts
│   │   │   ├── featureFlag.controller.ts
│   │   │   └── organization.controller.ts
│   │   ├── middleware/
│   │   │   ├── asyncHandler.middleware.ts   # Wraps async controllers
│   │   │   ├── auth.middleware.ts           # JWT verification
│   │   │   ├── error.middleware.ts          # Global error handler
│   │   │   └── role.middleware.ts           # Role-based authorization
│   │   ├── models/
│   │   │   ├── FeatureFlag.ts
│   │   │   ├── Organization.ts
│   │   │   └── User.ts
│   │   ├── repositories/             # Data-access layer
│   │   ├── routes/
│   │   │   ├── auth.route.ts
│   │   │   ├── featureCheck.route.ts
│   │   │   ├── featureFlag.route.ts
│   │   │   └── organization.route.ts
│   │   ├── services/                 # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── featureCheck.service.ts
│   │   │   ├── featureFlag.service.ts
│   │   │   └── organization.service.ts
│   │   ├── types/                    # Shared TypeScript types
│   │   ├── utils/
│   │   │   └── jwt.ts                # Sign / verify helpers
│   │   └── validators/               # Request validation
│   ├── .env.example                  # Template — copy to .env
│   ├── package.json
│   └── tsconfig.json
│
└── apps/
    ├── superadmin/                   # Vite + React (port 5173)
    ├── admin/                        # Vite + React (port 5174)
    └── user/                         # Vite + React (port 5175)
```

---

## Tech Stack

| Layer      | Technology                                 |
|------------|--------------------------------------------|
| Backend    | Node.js 20, Express 5, TypeScript          |
| Database   | MongoDB + Mongoose                         |
| Auth       | JWT (jsonwebtoken)                         |
| Frontend   | React 19, Vite, Tailwind CSS v4            |
| Icons      | Lucide React                               |
| Fonts      | Plus Jakarta Sans (Google Fonts)           |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- `npm` or `pnpm`

### 1 — Clone & install

```bash
git clone <repo-url>
cd multi-tenant-feature-flag-system

# Backend
cd backend
npm install

# Super Admin UI
cd ../apps/superadmin
npm install

# Org Admin UI
cd ../admin
npm install

# User UI
cd ../user
npm install
```

### 2 — Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and super-admin credentials
```

### 3 — Start services

Open **four terminals**:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Super Admin UI
cd apps/superadmin && npm run dev -- --port 5173

# Terminal 3 — Org Admin UI
cd apps/admin && npm run dev -- --port 5174

# Terminal 4 — User Checker UI
cd apps/user && npm run dev -- --port 5175
```

---

## Environment Variables

See [`backend/.env.example`](./backend/.env.example) for a documented template.

| Variable               | Description                                        | Default (dev)                              |
|------------------------|----------------------------------------------------|--------------------------------------------|
| `PORT`                 | Express server port                                | `5001`                                     |
| `MONGO_URI`            | MongoDB connection string                          | `mongodb://localhost:27017/feature-flags`  |
| `JWT_SECRET`           | Secret for signing/verifying JWTs                  | —                                          |
| `SUPER_ADMIN_EMAIL`    | Hardcoded super-admin login email                  | `superadmin@example.com`                   |
| `SUPER_ADMIN_PASSWORD` | Hardcoded super-admin login password               | `superadmin123`                            |

---

## API Reference

Base URL: `http://localhost:5001/api`

### Auth

| Method | Endpoint              | Body                                       | Auth | Description                    |
|--------|-----------------------|--------------------------------------------|------|--------------------------------|
| POST   | `/auth/super-login`   | `{ email, password }`                      | —    | Super-admin login → JWT token  |
| POST   | `/auth/signup`        | `{ name, email, password, organizationCode }` | — | Register an org admin         |
| POST   | `/auth/login`         | `{ email, password }`                      | —    | Org admin login → JWT token    |

### Organisations (Super Admin only)

| Method | Endpoint              | Body               | Auth         | Description              |
|--------|-----------------------|--------------------|--------------|--------------------------|
| POST   | `/organization`       | `{ name, code }`   | Bearer token | Create organisation      |
| GET    | `/organization`       | —                  | Bearer token | List all organisations   |

### Feature Flags (Org Admin only)

| Method | Endpoint                  | Body                      | Auth         | Description            |
|--------|---------------------------|---------------------------|--------------|------------------------|
| POST   | `/feature-flags`          | `{ featureKey, enabled }` | Bearer token | Create a feature flag  |
| GET    | `/feature-flags`          | —                         | Bearer token | Get org's flags        |
| PATCH  | `/feature-flags/:id`      | `{ enabled }`             | Bearer token | Toggle flag status     |

### Feature Check (Public)

| Method | Endpoint           | Body                          | Auth | Description                        |
|--------|--------------------|-------------------------------|------|------------------------------------|
| POST   | `/feature-check`   | `{ organizationCode, featureKey }` | — | Returns `{ enabled: boolean }` |

---

## Apps

### Super Admin App (port 5173)

- **Login** using the hardcoded credentials from `.env`
- **Dashboard** — total organisations count + quick actions
- **Organisations tab** — paginated table; create new organisations (name + unique code)

### Organisation Admin App (port 5174)

- **Sign Up** — requires an organisation code issued by the super-admin
- **Login** — on success, JWT + org details stored in `localStorage`
- **Dashboard** — org name heading, flag stats (total / enabled / disabled), recent flags preview
- **Feature Flags tab** — search by key, filter by status (all / enabled / disabled), toggle on/off with optimistic UI updates, create new flags

### User / Feature Checker App (port 5175)

- **No authentication required**
- Enter an **organisation code** and a **feature key**
- Instantly see whether the feature is **enabled** (green card) or **disabled** (red card) for that organisation

---

## Global Middleware

Three middleware layers applied across all routes:

| Middleware           | File                              | Purpose                                                        |
|----------------------|-----------------------------------|----------------------------------------------------------------|
| `asyncHandler`       | `middleware/asyncHandler.middleware.ts` | Wraps every async controller so unhandled Promise rejections propagate to the global error handler automatically |
| `authenticate`       | `middleware/auth.middleware.ts`   | Verifies `Authorization: Bearer <token>` on protected routes   |
| `authorize(role)`    | `middleware/role.middleware.ts`   | Guards routes by role (`SUPER_ADMIN` or `ORG_ADMIN`)           |
| `errorHandler`       | `middleware/error.middleware.ts`  | Catches all thrown errors and returns a consistent JSON error response — no more uncaught rejections crashing the server |

---

## What's Done

- ✅ **Multi-tenant data isolation** — feature flags are scoped to an `organizationId` extracted from the JWT; one org can never read another's flags
- ✅ **Role-based access control** — `SUPER_ADMIN` and `ORG_ADMIN` roles enforced on every protected route
- ✅ **JWT authentication** — sign-in issues a signed token; all protected endpoints verify it
- ✅ **Super Admin UI** — login, create/list organisations, pagination
- ✅ **Org Admin UI** — sign-up (with org code), login, create/toggle feature flags, search + filter
- ✅ **User / Feature Checker UI** — public endpoint, instant feature status lookup
- ✅ **Global `asyncHandler` middleware** — no boilerplate try/catch in controllers
- ✅ **Global `errorHandler` middleware** — consistent `{ success, message }` error envelope
- ✅ **Empty state UI** — every list view shows a friendly "No data found" state instead of breaking
- ✅ **Optimistic UI updates** — flag toggles update the UI instantly and revert on failure
- ✅ **Toast notifications** — success/error feedback across all apps

---

## Future Improvements

The following features are natural next steps for this system:

### Feature Flag Enhancements
- **Percentage rollouts** — enable a flag for a configurable % of users (e.g. 20 % A/B test)
- **User-level targeting** — enable flags for specific user IDs or segments
- **Scheduled flags** — automatically enable/disable flags at a specific date/time
- **Flag archiving / soft delete** — retire flags without losing history
- **Flag descriptions & tags** — add metadata so team members understand what each flag controls
- **Flag change history / audit log** — track who toggled what and when

### Organisation & User Management
- **Invite-based admin onboarding** — super-admin sends invite links instead of sharing org codes manually
- **Multiple admins per org** — allow several org admins with different permission levels
- **Admin password reset flow** — email-based reset via a transactional email provider (e.g. Resend, SendGrid)
- **Org settings page** — rename an org, rotate org code, view usage stats

### API & Integrations
- **SDK clients** — publish `npm` packages (JS/TS, Python, etc.) so applications can query flags with a single function call
- **Webhooks** — notify external services when a flag is toggled
- **REST API key auth** — issue API keys so server-side apps can query the feature-check endpoint without a user JWT
- **GraphQL API** — optional GraphQL layer for richer querying

### Observability
- **Flag usage analytics** — track how many times each flag is checked per day
- **Dashboard charts** — visualise flag check trends over time
- **Error monitoring** — integrate Sentry or similar for backend exception tracking

### Infrastructure
- **Docker Compose** — single-command local setup for all services
- **CI/CD pipeline** — GitHub Actions to run type-checks, lint, and tests on every push
- **Production deployment guide** — Railway / Render / Vercel deployment instructions
- **Rate limiting** — protect public endpoints (feature-check) from abuse
- **Redis caching** — cache frequent feature-check lookups to reduce DB load
