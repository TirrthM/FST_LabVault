# LabVault — Assignment 2 System Architecture & Technical Specification

## 1. System Overview

**LabVault** is an enterprise-grade Laboratory Equipment Lifecycle, Chain of Custody & Metrology Management Platform built for higher education and academic research institutions.

Following the completion of **Assignment 1** (accessible UI component primitives, Zustand client state, Zod validation, and Next.js App Router foundations), **Assignment 2** extends the system into a complete production stack:
- **PostgreSQL & Prisma ORM** multi-entity normalized schema.
- **Topic 4**: Automated relational database seeding with **Faker.js**.
- **Topic 5**: Transactional email notifications using **Resend** and **React Email**.
- **Cryptographic session authentication & Role-Based Access Control (RBAC)** across Edge Middleware, Server Actions, and Route Handlers.
- **Resend Webhook Event Logging** with Svix signature verification.
- **Immutable Chain-of-Custody Audit Trail** tracking all lifecycle transitions.

---

## 2. Full-Stack Layered Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT / BROWSER LAYER                         │
│  Next.js App Router (React 18) • Tailwind CSS • Radix UI Primitives     │
│  Zustand Persistent Client Stores (Filters, View Mode, Bookmarks)       │
│  React Hook Form + Zod Client-Side Schema Validation                    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EDGE MIDDLEWARE LAYER                           │
│  src/middleware.ts • Cryptographic JWT Verification (jose / HS256)      │
│  Route Protection & Role-Based Redirection (/calibration, /activity)    │
│  Request Header Augmentation (x-user-role, x-user-id)                   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────────────┐   ┌─────────────────────────────────────┐
│       SERVER COMPONENTS (RSC)         │   │       SERVER ACTIONS & API          │
│  src/app/**/page.tsx                  │   │  src/actions/*.ts (Mutations)       │
│  Server-side data fetching via        │   │  src/app/api/**/route.ts (REST)     │
│  Repository Pattern                   │   │  Server-side RBAC & Zod Validation  │
└──────────────────┬────────────────────┘   └──────────────────┬──────────────────┘
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICE & DATA LAYER                            │
│  Repository Abstraction (src/data/repository.ts)                        │
│  Prisma Client Singleton (src/lib/prisma.ts)                            │
│  Resend Email Service (src/lib/email.ts) + React Email Templates        │
└──────────────────┬───────────────────────────────────┬──────────────────┘
                   │                                   │
                   ▼                                   ▼
┌───────────────────────────────────────┐   ┌─────────────────────────────────────┐
│          POSTGRESQL DATABASE          │   │         RESEND EMAIL API            │
│  9 Relational Models + Foreign Keys   │   │  Transactional SMTP / HTTPS         │
│  Automated Seeding via Faker.js       │   │  Webhook Delivery Receipts (Svix)   │
└───────────────────────────────────────┘   └─────────────────────────────────────┘
```

---

## 3. Frontend & Rendering Strategy

### 3.1 React Server Components (RSC) by Default
- Data-heavy catalog pages (`/equipment`, `/dashboard`, `/labs`, `/equipment/[id]`) execute as **Server Components**, querying the database directly on the server without shipping database client code or secrets to the browser.
- Interactive controls (search bars, filter facets, dialog triggers, role switchers) are isolated into lightweight **Client Components (`"use client"`)**.

### 3.2 Dynamic Social Open Graph Engine
- `/api/og/equipment/[id]` dynamically renders high-resolution 1200×630 Open Graph preview cards directly on the Vercel Edge Runtime using `@vercel/og`, pulling real-time equipment status and specifications.

---

## 4. Authentication, Session & RBAC Architecture

### 4.1 Cryptographic Session Tokens
- Sessions are maintained via a signed HTTP-only cookie (`labvault_session`) using JSON Web Tokens (JWT) signed with HMAC-SHA256 (`jose` library).
- The token payload embeds `{ userId, name, email, role, department }` with a 7-day expiration time.

### 4.2 Multi-Tier Role Authorization
Four distinct institutional roles are strictly enforced:

1. **`STUDENT`**: Read equipment catalog, submit requisitions, view personal loan history, report equipment faults.
2. **`TECHNICIAN`**: Manage service work orders, perform check-in return inspections, record ISO-17025 calibrations, view audit trails.
3. **`LAB_MANAGER`**: Approve/reject borrow requisitions, assign facility assets, manage equipment maintenance, access all departmental reports.
4. **`ADMIN`**: Full system permissions, asset commissioning, role management, audit telemetry, and settings.

### 4.3 Defense-in-Depth Verification Flow
Every mutation executes the following 4-step security pipeline:
1. `getServerSession()` verifies the session cookie cryptographically on the server.
2. `authorizeRole(session.role, allowedRoles)` enforces permissions.
3. `schema.safeParse(input)` validates input shape and cross-field constraints.
4. Prisma transaction updates state, logs an `AuditLog` entry, and dispatches email notifications.

---

## 5. Database & Seeding Architecture (Topic 4)

### 5.1 Normalized Relational Data Model
The Prisma schema (`prisma/schema.prisma`) defines 9 interconnected models:
- `User`, `Lab`, `Equipment`, `BorrowRequest`, `MaintenanceTicket`, `MaintenanceWorkLog`, `CalibrationRecord`, `AuditLog`, and `EmailEvent`.

### 5.2 Seeding Engine (`prisma/seed.ts`)
- Utilizes `@faker-js/faker` with deterministic seed `faker.seed(123456)`.
- Generates 32 Users, 6 Labs, 65+ Equipment items, 90 Borrow Requisitions, 35 Maintenance Tickets (with 60+ Work Logs), 35 Calibration Records, and 130 Audit Logs with 100% foreign-key integrity.

---

## 6. Transactional Email & Webhooks (Topic 5)

### 6.1 React Email Templating (`src/emails/`)
- 7 modular JSX email templates compiled to responsive HTML with inline styles.
- Covers approvals, rejections, return reminders, work order assignments, service resolutions, calibration due notices, and safety hazard dispatches.

### 6.2 Resend Dispatch & Webhook Verification
- Server-side email abstraction (`src/lib/email.ts`) dispatches via Resend API with graceful fallback to simulated delivery when unconfigured.
- `/api/webhooks/resend` validates Svix signatures (`svix-id`, `svix-timestamp`, `svix-signature`) against `RESEND_WEBHOOK_SECRET` and logs delivery receipts to the `EmailEvent` table.

---

## 7. Security & Compliance Controls

1. **Zero Secret Leakage**: Database credentials, Resend API keys, and Auth secrets are confined to server runtime environment variables.
2. **CSRF & XSS Prevention**: Next.js Server Actions feature built-in origin verification; React automatically escapes user input.
3. **Audit Trail Immutability**: All equipment lifecycle transitions write permanent event records to `AuditLog` with actor ID and IP addresses.
