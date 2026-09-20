# LabVault — Laboratory Equipment Lifecycle & Maintenance Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Resend](https://img.shields.io/badge/Resend-Email-black)](https://resend.com/)
[![React Email](https://img.shields.io/badge/React_Email-0.0.25-black)](https://react.email/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-black)](https://www.radix-ui.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-brown)](https://github.com/pmndrs/zustand)
[![Zod](https://img.shields.io/badge/Zod-3.23-blue)](https://zod.dev/)

> **Subtitle:** Modern Laboratory Equipment Lifecycle, Chain of Custody, Metrology & Transactional Notification Platform for Higher Education and Scientific Research Institutions.

---

## 🔬 Project Overview

**LabVault** is an enterprise-grade laboratory equipment management platform specifically architected for academic universities and research departments. It orchestrates the complete lifecycle of mission-critical laboratory assets:

$$\text{Acquisition} \longrightarrow \text{Lab Allocation} \longrightarrow \text{Availability} \longrightarrow \text{Requisition} \longrightarrow \text{Approval} \longrightarrow \text{In Custody} \longrightarrow \text{Return \& Inspection} \longrightarrow \text{Maintenance} \longrightarrow \text{ISO-17025 Calibration} \longrightarrow \text{Return to Service}$$

The platform maintains an **immutable chain-of-custody audit log**, empowering lab managers, deans, and technicians to answer:
- *"Who currently holds physical custody of this asset?"*
- *"When was it checked out and for which academic project?"*
- *"Was any damage or calibration drift detected upon return inspection?"*
- *"Who repaired this instrument and which components were replaced?"*
- *"When is the next NIST-traceable ISO-17025 calibration due?"*

---

## 🏛️ Academic Coursework Context: Assignment 1 + Assignment 2 Integration

This repository houses the complete, unified full-stack implementation spanning both **Assignment 1** and **Assignment 2**:

### Self-Learning Topics Fully Implemented
1. **Topic 1:** Accessible UI Component Primitives with shadcn/ui & Radix UI primitives (`src/components/ui/`, `/ui` sandbox).
2. **Topic 2:** Lightweight Client-Side State Management with Zustand (Granular selectors, localStorage persistence, RSC separation).
3. **Topic 3:** Type-Safe Form Handling & Schema Validation with Zod, React Hook Form, and Server Actions (Double validation on client & server).
4. **Topic 4 (Assignment 2):** Database Seeding & Automated Mock Data with Faker.js & Prisma ORM (`prisma/seed.ts`, `@faker-js/faker`).
5. **Topic 5 (Assignment 2):** Transactional Email Integration with Resend & React Email (`src/emails/`, `src/lib/email.ts`, `/api/webhooks/resend`).

---

## ⚡ Key Features & Capabilities

- **Executive Dashboard (`/dashboard`)**: Real-time KPI cards, urgent safety and calibration alerts, lab capacity distribution, and live audit event stream.
- **Interactive Equipment Discovery (`/equipment`)**: Zustand-powered search, faceted filters (Category, Lab, Status, Condition, Calibration), dense table view vs. visual card grid, and bookmark persistence.
- **Dynamic Asset Detail (`/equipment/[id]`)**: Deep asset specifications, physical custody tracking card, tabbed lifecycle timeline, loan logs, maintenance tickets, and calibration records.
- **Borrowing Requisition Pipeline (`/borrow-requests`)**: Multi-state custody progression (`REQUESTED` $\to$ `APPROVED` $\to$ `BORROWED` $\to$ `INSPECTED`) with role-aware approval and check-in dialogs.
- **Technician Maintenance Service Bay (`/maintenance`)**: Multi-stage work orders (`OPEN` $\to$ `ASSIGNED` $\to$ `IN_REPAIR` $\to$ `TESTING` $\to$ `RESOLVED`), parts replacement tracking, and diagnostic logs.
- **ISO-17025 Metrology Hub (`/calibration`)**: Real-time tracking of NIST calibration currency with visual indicators (`Calibrated`, `Due Soon ≤ 14d`, `Overdue`).
- **Interactive Role Simulator (`/settings` & Header Switcher)**: Switch between **Student**, **Lab Technician**, **Lab Manager**, and **System Admin** with instant cryptographic session synchronization.
- **Component Sandbox (`/ui`)**: Live showcase of all accessible Radix primitives, dialogs, sheets, popovers, tooltips, and contrast compliance.
- **Dynamic OG Image Generator (`/api/og/equipment/[id]`)**: Server-rendered 1200×630 social preview cards generated dynamically with `@vercel/og`.
- **Transactional Notifications (Resend + React Email)**: 7 automated email triggers for approvals, reminders, service orders, and safety hazards.
- **Delivery Webhook (`/api/webhooks/resend`)**: Svix-verified webhook endpoint persisting email delivery events to PostgreSQL.

---

## 🛠️ Full-Stack Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | React Server Components by default, server-side data fetching, native streaming |
| **Database & ORM** | PostgreSQL + Prisma ORM | Normalized multi-entity relational schema with foreign keys and cascade rules |
| **Data Seeding** | `@faker-js/faker` | Deterministic relational seed engine generating realistic academic lab datasets |
| **Email Service** | Resend + React Email | Type-safe JSX email templates with Svix-verified delivery webhook |
| **Security & Auth**| Signed JWT (`jose`) + Middleware | Multi-layer RBAC protecting Edge routes, Server Actions, and REST endpoints |
| **Language** | TypeScript 5.6 (Strict) | End-to-end type safety, strict interface models, zero `any` leaks |
| **Styling** | Tailwind CSS + CVA | High-performance CSS variable design tokens, zero runtime style overhead |
| **Primitives** | Radix UI | WAI-ARIA compliant unstyled accessible primitives with keyboard trapping |
| **Theme** | next-themes | SSR-safe light, dark, and system default switching with zero hydration flash |
| **Client State** | Zustand 4.5 | Granular subscriptions, localStorage persistence, separated from server data |
| **Forms** | React Hook Form + Zod | Type-safe form states with client-side and server-side double validation |
| **Server Actions**| Next.js Server Actions | Server mutations with cache revalidation and optimistic client rollbacks |
| **Feedback** | Sonner | Accessible, customizable rich toast notification system |
| **OG Images** | `@vercel/og` | Edge-rendered SVG/PNG Open Graph generation |

---

## 🚀 Quick Start & Developer Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your variables:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/labvault?schema=public"
AUTH_SECRET="labvault-super-secure-production-auth-secret-change-in-prod"
RESEND_API_KEY="re_123456789_abcdefghijklmnopqrstuvwxyz"
RESEND_FROM_EMAIL="LabVault Notifications <notifications@labvault.edu>"
RESEND_WEBHOOK_SECRET="whsec_abcdefghijklmnopqrstuvwxyz123456"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Lifecycle Commands (Prisma & Faker.js)
```bash
# Generate Prisma Client
npm run db:generate

# Apply Migrations to PostgreSQL
npm run db:migrate

# Seed Database with 300+ Realistic Academic Lab Records
npm run db:seed

# Inspect Data with Prisma Studio Web GUI (http://localhost:5555)
npx prisma studio

# Reset Database (Wipe, Re-migrate & Auto-seed)
npm run db:reset
```

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Architecture & Documentation Sitemap

```
d:/LabVault/
├── prisma/
│   ├── schema.prisma               # Multi-entity relational schema (9 models)
│   └── seed.ts                     # Topic 4: Faker.js academic lab seed generator
├── docs/                           # Academic Deliverables & Architectural Reports
│   ├── Assignment-1-Technical-Report.md   # Assignment 1 Comprehensive Technical Report
│   ├── Assignment-2-Technical-Report.md   # Assignment 2 Comprehensive Technical Report
│   ├── Assignment-2-System-Architecture.md# Complete 2-page system architecture specification
│   ├── database-relationships.md   # Relational ER diagram with Mermaid & foreign keys
│   ├── authorization-flow.md       # Multi-layer RBAC security model & sequence diagram
│   ├── database-seeding.md         # Database seeding & migration reset guide
│   ├── Topic-1-Summary-Sheet.md    # Topic 1: Radix & shadcn accessibility summary
│   ├── Topic-2-Survey-Report.md    # Topic 2: Zustand state management survey (2-3 pages)
│   ├── Topic-3-Quiz.md             # Topic 3: Zod & React Hook Form practice quiz
│   ├── Topic-4-Database-Seeding.md # Topic 4: Faker.js + Prisma technical note
│   ├── Topic-5-Technical-Note.md   # Topic 5: Resend + React Email technical note (2 pages)
│   ├── email-dispatch-log.md       # Transactional email testing procedure & dispatch log
│   ├── architecture.md             # Assignment 1 system architecture & RSC boundaries
│   ├── rsc-client-analysis.md      # Server vs Client Component analysis
│   ├── state-management.md         # Zustand selector architecture & optimization
│   ├── server-actions.md           # Server action validation & optimistic UI guide
│   ├── og-images.md                # Dynamic OG image specification & test instructions
│   ├── lighthouse-report.md        # Core Web Vitals & Lighthouse audit report
│   ├── submission-checklist.md     # Assignment 1 submission checklist
│   └── assignment-2-submission-checklist.md # Assignment 2 evidence capture checklist
├── src/
│   ├── actions/                    # Native Next.js Server Actions (Session + RBAC)
│   │   ├── auth.ts                 # Role switching & session management
│   │   ├── borrow.ts               # Requisition creation, approval, and check-in
│   │   ├── maintenance.ts          # Fault logging, work order updates, and safety alerts
│   │   ├── calibration.ts          # Metrology certification logging
│   │   └── equipment.ts            # Asset commissioning
│   ├── app/                        # App Router Routes & Layouts
│   │   ├── api/                    # RESTful Route Handlers with RBAC
│   │   │   ├── auth/session/route.ts
│   │   │   ├── equipment/route.ts
│   │   │   ├── borrow-requests/route.ts
│   │   │   ├── maintenance/route.ts
│   │   │   ├── calibration/route.ts
│   │   │   ├── audit-logs/route.ts
│   │   │   └── webhooks/resend/route.ts # Resend delivery webhook (Svix signature)
│   │   ├── dashboard/page.tsx      # RSC Dashboard metrics & urgency feed
│   │   ├── equipment/page.tsx      # Equipment catalog with Zustand filters
│   │   ├── equipment/[id]/page.tsx # Dynamic asset detail & custody history
│   │   ├── borrow-requests/page.tsx# Requisition lifecycle management
│   │   ├── maintenance/page.tsx    # Technician service bay queue
│   │   ├── calibration/page.tsx    # ISO-17025 metrology tracker
│   │   ├── labs/page.tsx           # Department facilities directory
│   │   ├── activity/page.tsx       # System-wide chain of custody audit stream
│   │   ├── settings/page.tsx       # Session role switcher & preferences
│   │   ├── ui/page.tsx             # Topic 1: Accessible UI Component Sandbox
│   │   └── api/og/equipment/[id]/route.tsx# Dynamic Open Graph card generation
│   ├── emails/                     # Topic 5: React Email Templates
│   │   ├── BorrowApprovedEmail.tsx
│   │   ├── BorrowRejectedEmail.tsx
│   │   ├── EquipmentDueReminderEmail.tsx
│   │   ├── MaintenanceAssignedEmail.tsx
│   │   ├── MaintenanceResolvedEmail.tsx
│   │   ├── CalibrationDueEmail.tsx
│   │   └── CriticalIssueEmail.tsx
│   ├── lib/
│   │   ├── auth.ts                 # Server-side JWT session & authorization guards
│   │   ├── prisma.ts               # Prisma Client singleton
│   │   └── email.ts                # Resend service abstraction & fallback
│   ├── middleware.ts               # Next.js Route & RBAC protection middleware
│   ├── components/                 # Modular React Components (19 Radix UI primitives)
│   ├── stores/                     # Zustand stores with localStorage persistence
│   └── data/                       # Repository pattern & in-memory transactional fallback
```

---

## 🧪 Verification & Build Status

```bash
# Type Check
npx tsc --noEmit           # 100% Passed (0 errors)

# Lint
npm run lint               # 100% Clean

# Production Build
npm run build              # All 14 routes compiled and optimized
```
