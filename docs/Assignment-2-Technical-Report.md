# Assignment 2 Technical Report — LabVault: Enterprise Laboratory Equipment Lifecycle & Maintenance Platform

## 1. Introduction

**LabVault** is a full-stack, enterprise-grade laboratory equipment management platform engineered specifically for educational institutions and scientific research departments.

While **Assignment 1** established the user experience foundations—implementing accessible UI component primitives with Radix UI and shadcn/ui (Topic 1), lightweight client state management with Zustand (Topic 2), and type-safe form validation with Zod and React Hook Form (Topic 3)—**Assignment 2** delivers the complete backend, database, security, and notification infrastructure required for production deployment:

- **Relational PostgreSQL Persistence**: 9 normalized relational models managed via **Prisma ORM**.
- **Topic 4 (Database Seeding & Automated Mock Data)**: Realistic, relationally sound academic lab datasets generated using **Faker.js (`@faker-js/faker`)**.
- **Topic 5 (Transactional Email Integration)**: 7 modular, responsive email templates built with **React Email** and dispatched via **Resend**, with webhook delivery logging.
- **Server-Side Authentication & Role-Based Access Control (RBAC)**: Multi-layer authorization spanning Next.js Edge Middleware, Server Actions, and protected Route Handlers across 4 institutional roles (`STUDENT`, `TECHNICIAN`, `LAB_MANAGER`, `ADMIN`).
- **Chain-of-Custody Audit Trail**: System-wide immutable logging of all lifecycle, requisition, maintenance, and calibration transitions.

---

## 2. Problem Definition & Domain Scope

Academic laboratories in higher education manage millions of dollars in sensitive, shared instrumentation (electron microscopes, liquid chromatographs, spectrometers, high-speed centrifuges). Traditional spreadsheet or paper-based workflows suffer from critical vulnerabilities:
1. **Broken Chain of Custody**: Lack of accountability regarding physical custody when instruments are damaged or missing accessories upon return.
2. **Maintenance Backlogs**: Diagnostic work orders lost in communication without parts replacement history or technician accountability.
3. **Accreditation Risks**: Missed ISO/IEC 17025 calibration deadlines leading to uncalibrated data and compliance violations.
4. **Security & Permission Gaps**: Untrusted client-side roles allowing unauthorized users to approve requisitions or modify compliance records.

LabVault solves these operational challenges through a structured, auditable lifecycle pipeline.

---

## 3. Database Architecture & Prisma Schema

### 3.1 Normalized Relational Data Model
The database is structured in `prisma/schema.prisma` with 9 interconnected entities:

- **`User`**: Academic users categorized by `UserRole` (`STUDENT`, `TECHNICIAN`, `LAB_MANAGER`, `ADMIN`).
- **`Lab`**: Physical facilities (Robotics, Advanced Microscopy, VLSI, Materials, Chemical Synthesis, Bioengineering) managed by faculty.
- **`Equipment`**: Scientific assets with unique asset IDs (`LV-LAB-####`), serial numbers, status, condition, and optional custodian linkage.
- **`BorrowRequest`**: Requisitions tracking purpose, start/end dates, approval notes, handover status, return condition, and check-in inspection notes.
- **`MaintenanceTicket` & `MaintenanceWorkLog`**: Service orders with priority tiers, technician assignments, diagnostic logs, and replaced components.
- **`CalibrationRecord`**: Metrology certifications recording NIST standards, tolerance errors, certificate numbers, and next due dates.
- **`AuditLog`**: Append-only event store capturing entity actions, actors, IP addresses, and JSON payloads.
- **`EmailEvent`**: Transactional email tracking recording provider message IDs, delivery statuses, and webhook receipts.

### 3.2 Relational Integrity & Cascades
- Foreign-key constraints enforce referential integrity (e.g. deleting an equipment item cascades to its work logs and requisition history, while deleting a lab is restricted if equipment resides within it).
- Strategic database indexes (`@@index`) are applied on frequently queried fields: `assetId`, `status`, `category`, `userId`, and `timestamp`.

---

## 4. Topic 4: Automated Relational Seeding with Faker.js

To validate real-world performance without empty states, `prisma/seed.ts` generates a relationally consistent academic dataset:

1. **Volume**: 32 Users, 6 Labs, 65+ Equipment items, 90 Borrow Requisitions, 35 Maintenance Tickets (with 60+ Work Logs), 35 Calibration Records, and 130 Audit Logs.
2. **Deterministic PRNG**: `faker.seed(123456)` ensures 100% reproducible results across development machines and automated testing suites.
3. **Believable Relational Logic**: Equipment items belong to realistic departmental facilities; technicians are assigned to work orders within their domain; loan dates follow strict chronological causality.
4. **Database Lifecycle Scripts**: Fully automated via `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, and `npm run db:reset`.

---

## 5. Topic 5: Transactional Email Integration with Resend & React Email

### 5.1 React Email Templating (`src/emails/`)
LabVault creates 7 distinct JSX email templates using `@react-email/components`:
- `BorrowApprovedEmail.tsx`
- `BorrowRejectedEmail.tsx`
- `EquipmentDueReminderEmail.tsx`
- `MaintenanceAssignedEmail.tsx`
- `MaintenanceResolvedEmail.tsx`
- `CalibrationDueEmail.tsx`
- `CriticalIssueEmail.tsx`

Each template compiles to standards-compliant, responsive HTML with inline styles, dark-theme header banners, and clear calls-to-action linking back to the platform.

### 5.2 Resend Service Abstraction (`src/lib/email.ts`)
- Server-side email dispatcher dispatches live messages via the Resend API when `RESEND_API_KEY` is provided.
- In local development without credentials, the service automatically falls back to **simulated delivery**, printing structured event payloads to the console and persisting to `EmailEvent` without blocking transactions.

### 5.3 Webhook Ingestion & Svix Verification (`/api/webhooks/resend`)
- Receives delivery events (`email.delivered`, `email.bounced`, `email.failed`, `email.opened`) from Resend.
- Validates cryptographic Svix signatures against `RESEND_WEBHOOK_SECRET` before logging events to the database.

---

## 6. Authentication, Session & Multi-Tier Authorization

### 6.1 Cryptographic JWT Sessions
- Sessions are stored in a signed HTTP-only cookie (`labvault_session`) using HMAC-SHA256 (`jose`).
- The payload securely encapsulates `{ userId, name, email, role, department }` with a 7-day expiration.

### 6.2 Next.js Edge Middleware (`src/middleware.ts`)
- Intercepts incoming requests at the Edge.
- Decodes session tokens and injects `x-user-role` and `x-user-id` into downstream request headers.
- Enforces route-level access control (e.g. blocking students from accessing `/calibration` or `/activity` and issuing instant 307 redirects).

### 6.3 Server-Side Authorization in Server Actions
- Server Actions (`src/actions/borrow.ts`, `maintenance.ts`, `calibration.ts`, `equipment.ts`) invoke `getServerSession()` and `authorizeRole()` before executing business logic.
- Client-supplied role parameters are discarded; permissions are verified exclusively against the server session.

---

## 7. Protected Route Handlers (`src/app/api/`)

The platform exposes RESTful endpoints with server-side RBAC enforcement:
- `/api/auth/session`: Returns the active authenticated user session.
- `/api/equipment`: Public read catalog; `POST` restricted to Lab Managers and Admins.
- `/api/borrow-requests`: Filtered by role (students see only own requisitions; managers see all).
- `/api/maintenance`: Technical work orders queryable by priority and status.
- `/api/calibration`: Restricted to Technicians, Managers, and Admins (`403 Forbidden` for Students).
- `/api/audit-logs`: System-wide audit stream restricted to authorized technical staff.
- `/api/webhooks/resend`: Resend webhook receiver with Svix signature verification.

---

## 8. Verification, Build Status & Zero Regression

| Test Suite / Verification Step | Result | Notes |
| :--- | :---: | :--- |
| **Prisma Schema Validation** | ✅ Passed | `npx prisma validate` confirms 9 models and relations are valid |
| **Prisma Client Generation** | ✅ Passed | `npx prisma generate` generated typed client without warnings |
| **TypeScript Compilation** | ✅ Passed | `npx tsc --noEmit` exited with 0 errors across 100+ source files |
| **ESLint Quality Audit** | ✅ Passed | `npm run lint` clean (no unescaped entities or hook dependency errors) |
| **Next.js Production Build** | ✅ Passed | `npm run build` compiled all 14 static and dynamic routes |
| **Assignment 1 Preservation** | ✅ Verified | Radix primitives, Zustand filters, dark mode, forms, and OG images intact |

---

## 9. Conclusion

The completion of **Assignment 2** elevates LabVault into a complete, full-stack laboratory equipment lifecycle management platform. By integrating **Prisma ORM**, **Faker.js relational seeding (Topic 4)**, **Resend & React Email notifications (Topic 5)**, and a **multi-layer RBAC security architecture**, LabVault provides higher education institutions with an auditable, secure, and intuitive platform for scientific equipment operations.
