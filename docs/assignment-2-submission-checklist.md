# LabVault — Assignment 2 Submission & Evidence Capture Checklist

Use this checklist to verify and capture required screenshots and terminal evidence for the **Assignment 2** submission.

---

## 🗄️ 1. Database & Prisma (Topic 4 Evidence)

Capture screenshots or terminal logs for the following:

- [ ] **Prisma Schema (`prisma/schema.prisma`)**: Show the normalized relational models (`User`, `Lab`, `Equipment`, `BorrowRequest`, `MaintenanceTicket`, `CalibrationRecord`, `AuditLog`, `EmailEvent`).
- [ ] **Prisma Validation Terminal**:
  ```bash
  npx prisma validate
  ```
- [ ] **Prisma Client Generation Terminal**:
  ```bash
  npm run db:generate
  # (or: npx prisma generate)
  ```
- [ ] **Database Migration Terminal** (when connected to PostgreSQL):
  ```bash
  npm run db:migrate
  ```
- [ ] **Faker.js Database Seeding Terminal Output**:
  ```bash
  npm run db:seed
  ```
  *(Show terminal output confirming creation of 32 Users, 6 Labs, 65+ Equipment, 90 Borrow Requests, 35 Maintenance Tickets, 35 Calibration Records, and 130 Audit Logs).*
- [ ] **Prisma Studio Visualizer GUI**:
  ```bash
  npx prisma studio
  ```
  *(Capture browser view at `http://localhost:5555` showing the populated tables and foreign-key relations).*

---

## 🔐 2. Authentication & Role-Based Access Control (RBAC)

- [ ] **Role Switcher Dropdown**: Click the role switcher in the top navigation bar showing the 4 roles (**Student**, **Lab Technician**, **Lab Manager**, **System Admin**).
- [ ] **Student View (`/equipment`, `/borrow-requests`)**: Show active student session with requisition submission and personal borrowing tracker.
- [ ] **Technician Service Bay (`/maintenance`)**: Show maintenance work order queue and diagnostic log updater.
- [ ] **Manager Approval Portal (`/borrow-requests`)**: Show approval and rejection dialogs with note capture.
- [ ] **Unauthorized Route Protection Attempt**:
  - Switch to **Student** role.
  - Attempt to navigate directly to `/calibration` or `/activity`.
  - Capture screenshot of middleware redirecting back to `/dashboard` with security notice.
- [ ] **Protected API Route Response**:
  - Test `GET /api/calibration` under Student session (showing `403 Forbidden` response in browser DevTools Network tab or Postman).

---

## 📧 3. Transactional Email & Webhooks (Topic 5 Evidence)

- [ ] **React Email Templates (`src/emails/`)**:
  - Open `src/emails/BorrowApprovedEmail.tsx` or `CriticalIssueEmail.tsx` showing the component structure.
- [ ] **Email Dispatch Console Log / Live Email**:
  - Trigger borrow approval or critical fault report.
  - Capture terminal log showing:
    ```
    [EmailService:SIMULATED] -> To: alex.rivera@student.labvault.edu | Subject: Requisition Approved: ...
    ```
    *(Or capture actual received email inbox screenshot if live `RESEND_API_KEY` was configured).*
- [ ] **Resend Webhook Route (`src/app/api/webhooks/resend/route.ts`)**: Show Svix signature verification code and `EmailEvent` database logging.
- [ ] **Email Delivery Database Records (`EmailEvent`)**: Show `EmailEvent` table in Prisma Studio displaying delivery receipts.

---

## 💻 4. Application UI & Lifecycle Workflows

- [ ] **Executive Dashboard (`/dashboard`)**: KPI cards, urgency alerts, lab capacity distribution, and live audit feed.
- [ ] **Interactive Equipment Discovery (`/equipment`)**: Zustand-powered search, faceted filters, and table/grid view toggle.
- [ ] **Asset Detail & Custody Timeline (`/equipment/[id]`)**: Deep asset specifications, custody card, loan history, and lifecycle timeline.
- [ ] **Metrology & ISO-17025 Hub (`/calibration`)**: Currency badges (`Calibrated`, `Due Soon`, `Overdue`) and schedule calibration modal.
- [ ] **Immutable Audit Stream (`/activity`)**: Searchable chain-of-custody audit log.
- [ ] **Dynamic Open Graph Card (`/api/og/equipment/[id]`)**: Preview generated social card in browser.
- [ ] **Dark / Light Theme Toggle**: Showcase high-contrast light and dark themes.

---

## 🧪 5. Build & Compilation Verification

- [ ] **TypeScript Strict Compilation**:
  ```bash
  npx tsc --noEmit
  ```
  *(Exit code 0, zero errors).*
- [ ] **Next.js Production Build**:
  ```bash
  npm run build
  ```
  *(Capture terminal output showing all 14 routes compiled and static generation successful).*
