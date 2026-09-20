# LabVault 🔬
### Laboratory Equipment Lifecycle & Maintenance Platform

> **Advanced Full-Stack Web Application (Assignments 1 & 2 Combined)**  
> Built with **Next.js 14 App Router**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, **Faker.js**, **Resend & React Email**, **Zustand**, and **shadcn/ui**.

---

## 📖 Overview

**LabVault** is an enterprise-grade laboratory equipment management platform developed for higher education and scientific research institutions. 

In many universities, laboratory assets (such as scanning electron microscopes, high-speed centrifuges, spectrometers, and oscilloscopes) are managed through paper logbooks or scattered spreadsheets. This results in misplaced equipment, unreturned loans, unrecorded hardware faults, and missed calibration deadlines.

**LabVault solves this by providing a unified digital platform that manages the entire lifecycle of laboratory equipment:**
- **Acquisition & Cataloging:** Asset tracking with serial numbers, warranty dates, specs, and dynamic QR/social cards.
- **Digital Requisitions & Checkouts:** Multi-step loan pipeline with student requests, manager approvals, and technician checkouts.
- **Maintenance & Work Orders:** Diagnostic ticketing system, part replacement logs, and repair cost tracking.
- **Metrology & Calibrations:** ISO/IEC 17025:2017 compliant calibration schedules with NIST standards tracking.
- **Automated Communication:** Transactional email alerts for approvals, overdue returns, assignments, and critical failures.
- **Immutable Audit Trail:** Comprehensive chain-of-custody logging for complete institutional accountability.

---

## 🚀 Key Features

### 🌟 Assignment 1 (Frontend & Architecture)
- **Next.js 14 App Router & RSC:** Hybrid architecture with React Server Components (RSC) and Client Components for sub-second page loads.
- **Accessible UI Design System:** 18+ accessible Radix UI primitives, dark/light theme switching, and custom laboratory telemetry status cards.
- **Zustand Client Store:** Instant institutional role switching and shopping-cart-style equipment loan queue.
- **Server Actions & Zod Validation:** Secure, non-blocking mutations with optimistic UI feedback and runtime schema enforcement.
- **Dynamic OpenGraph Previews:** Server-generated preview cards via `@vercel/og` at `/api/og/equipment/[id]`.

### ⚡ Assignment 2 (Backend, Database & Telemetry)
- **Normalized PostgreSQL Schema (Topic 4):** 9 relational models (*User, Lab, Equipment, BorrowRequest, MaintenanceTicket, MaintenanceWorkLog, CalibrationRecord, AuditLog, EmailEvent*) with 8 domain enums and 30+ indexes.
- **Deterministic Automated Seeding (Topic 4):** Powered by `@faker-js/faker` with `faker.seed(123456)` to generate 32 multi-role users, 6 labs, 66 equipment assets, 90 borrow records, 35 repair tickets, and 130 audit logs.
- **Transactional Email Subsystem (Topic 5):** Resend SDK integration with 7 responsive `@react-email` JSX templates and local simulation fallback mode.
- **Delivery Webhook Tracking (Topic 5):** Cryptographic Svix signature validation endpoint at `/api/webhooks/resend` for tracking *Sent*, *Delivered*, *Opened*, and *Bounced* states.
- **4-Tier RBAC Security:** Role-Based Access Control guarded by Next.js Edge Middleware and server-side authorization checks (`Student`, `Technician`, `Lab Manager`, `Admin`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14.2 (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript 5.6 (Strict Type Checking) |
| **Styling & UI** | Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons, Sonner |
| **State & Forms** | Zustand, React Hook Form, Zod |
| **Database & ORM** | PostgreSQL, Prisma ORM 5.20 |
| **Mock Seeding** | Faker.js v9 (`@faker-js/faker`) |
| **Transactional Email** | Resend SDK, React Email (`@react-email/components`) |
| **Webhook Security** | Svix (`svix`) |
| **Authentication & RBAC**| Jose (JWT), Next.js Edge Middleware |

---

## ⚡ Quick Start Guide (How to Run)

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js:** `v18.18.0` or higher
- **PostgreSQL:** `v15` or higher running locally on port `5432`

---

### 2. Clone the Repository
```bash
git clone https://github.com/TirrthM/FST_LabVault.git
cd FST_LabVault
```

---

### 3. Install Dependencies
```bash
npm install
```

---

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
# PostgreSQL Database Connection URL
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/labvault?schema=public"

# Auth Session Secret
AUTH_SECRET="labvault-super-secure-production-auth-secret-change-in-prod"

# Resend Transactional Email (Uses development simulation if mock key is kept)
RESEND_API_KEY="re_mock_api_key_for_development"
RESEND_FROM_EMAIL="LabVault Notifications <notifications@labvault.edu>"
RESEND_WEBHOOK_SECRET="whsec_mock_webhook_secret_development"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### 5. Create Database & Apply Migrations
Make sure PostgreSQL is running, create the database (if not already created), and run the Prisma migrations:

```bash
# Apply migrations to create all 9 relational tables
npx prisma migrate dev --name init
```

---

### 6. Seed the Database with Faker.js
Populate the database with realistic academic equipment, users, loan requests, and audit logs:

```bash
npm run db:seed
```

*Output:*
```
🌱 Starting LabVault Database Seeding (Topic 4: Faker.js + Prisma)...
👥 Created 32 Users (Students: 19, Techs: 4, Managers: 7, Admins: 2)
🏢 Created 6 Facilities
🔬 Created 66 Equipment Assets
📋 Created 90 Borrow Requisitions
🔧 Created 35 Maintenance Work Orders & Diagnostic Logs
⚖️ Created 35 Calibration Records
🛡️ Created 130 Immutable Audit Log Events
📧 Created 25 Transactional Email Delivery Records
🎉 Database Seeding Completed Successfully!
```

---

### 7. Run the Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application!

---

### 8. View Database in Visual GUI (Prisma Studio)
In a separate terminal, run:
```bash
npx prisma studio
```
Open **[http://localhost:5555](http://localhost:5555)** to explore all tables, relations, and records in real time.

---

## 👥 Multi-Role User Switcher & Credentials

LabVault includes an instant **Institutional Role Switcher** in the top navigation bar. You can test all 4 perspectives seamlessly:

| Role | Test User | Department / Access Level |
|---|---|---|
| **Student** | `Alex Rivera` | Can view catalog, search instruments, and submit borrow requests. |
| **Lab Technician** | `Dave Chen` | Can perform checkouts, return inspections, log repairs, and record calibrations. |
| **Lab Manager** | `Dr. Marcus Sterling` | Can approve/reject loan requests, assign maintenance tickets, and monitor facility status. |
| **Administrator** | `Dr. Eleanor Vance` | Full system access: immutable chain-of-custody audit logs, lab configs, and user management. |

---

## 📧 Transactional Email Templates (Topic 5)

LabVault contains 7 modular React Email templates in `src/emails/`:

1. **`BorrowApprovedEmail`** — Notifies student of approved requisition with pickup details.
2. **`BorrowRejectedEmail`** — Informs student of request rejection with reason.
3. **`EquipmentDueReminderEmail`** — Automated 24-hour return reminder before loan expires.
4. **`MaintenanceAssignedEmail`** — Alerts technician of a new repair order and hardware issue.
5. **`MaintenanceResolvedEmail`** — Confirms repair completion and status restoration.
6. **`CalibrationDueEmail`** — Warns lab managers of upcoming ISO-17025 calibration deadlines.
7. **`CriticalIssueEmail`** — Immediate escalation alert to administrators for safety/hazard faults.

---

## 📁 Repository Structure

```
d:\LabVault
├── prisma/
│   ├── schema.prisma           # 9 Relational PostgreSQL models & enums
│   ├── seed.ts                 # Deterministic Faker.js database seeder
│   └── migrations/             # SQL migration files
├── src/
│   ├── actions/                # Next.js Server Actions (Borrow, Maintenance, Auth, Equipment)
│   ├── app/                    # Next.js App Router (13 views + 8 API/Webhook routes)
│   │   ├── activity/           # Immutable Audit Log stream (RBAC protected)
│   │   ├── api/                # REST API routes & Svix Webhook endpoints
│   │   ├── borrow-requests/    # Loan requisition management
│   │   ├── calibration/        # ISO-17025 metrology calibration tracking
│   │   ├── dashboard/          # Real-time institutional telemetry overview
│   │   ├── equipment/          # Equipment catalog & detail pages ([id])
│   │   ├── labs/               # Academic research facilities overview
│   │   └── maintenance/        # Diagnostic work orders queue
│   ├── components/             # Reusable UI & domain components
│   ├── emails/                 # 7 React Email JSX templates
│   ├── lib/                    # Prisma singleton, auth guards, Resend email dispatch
│   ├── stores/                 # Zustand client stores (role switcher, filters)
│   └── types/                  # Shared TypeScript domain definitions
├── submission/                 # Presentation & formal report artifacts
│   ├── Gamma_AI_Master_Prompt.txt # Master prompt for AI presentation generator
│   ├── LabVault_Project_Presentation.pptx # 5-Slide Master PPT
│   ├── LabVault_Project_Technical_Report.docx # Comprehensive DOCX Report
│   └── assets/                 # Architecture, schema, and workflow diagrams
└── docs/                       # 20+ Detailed technical documentation files
```

---

## 🧪 Build & Verification Commands

```bash
# Type Checking (0 errors)
npx tsc --noEmit

# Production Build (Exit Code 0)
npm run build

# Reset & Re-seed Database
npm run db:reset
npm run db:seed
```

---

## 📄 Academic Submission Deliverables

- **Comprehensive Technical Report (.docx):** [`submission/LabVault_Project_Technical_Report.docx`](submission/LabVault_Project_Technical_Report.docx)
- **Master Presentation (.pptx):** [`submission/LabVault_Project_Presentation.pptx`](submission/LabVault_Project_Presentation.pptx)
- **Gamma AI Presentation Prompt:** [`submission/Gamma_AI_Master_Prompt.txt`](submission/Gamma_AI_Master_Prompt.txt)
- **Technical Documentation & Reports:** [`docs/`](docs/)

---

## 👨‍💻 Author & Course Information
- **Student:** Tirrth M
- **Repository:** [https://github.com/TirrthM/FST_LabVault](https://github.com/TirrthM/FST_LabVault)
- **Course:** Full-Stack Technology / Advanced Web Engineering
- **Academic Year:** 2026
