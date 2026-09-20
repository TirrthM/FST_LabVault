# Implementation Plan: LabVault — Laboratory Equipment Lifecycle & Maintenance Platform

LabVault is a production-quality laboratory equipment lifecycle, maintenance, calibration, and chain-of-custody management platform for academic institutions. This plan covers the complete implementation of Assignment 1 with extensible architecture designed for seamless Assignment 2 Prisma integration.

## Proposed Architecture & Directory Structure

```
d:/LabVault/
├── .github/
├── docs/
│   ├── architecture.md
│   ├── rsc-client-analysis.md
│   ├── state-management.md
│   ├── server-actions.md
│   ├── og-images.md
│   ├── lighthouse-report.md
│   ├── submission-checklist.md
│   ├── Topic-1-Summary-Sheet.md
│   ├── Topic-2-Survey-Report.md
│   ├── Topic-3-Quiz.md
│   └── Assignment-1-Technical-Report.md
├── public/
├── src/
│   ├── actions/
│   │   ├── equipment.ts
│   │   ├── borrow.ts
│   │   ├── maintenance.ts
│   │   └── calibration.ts
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── equipment/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   ├── borrow-requests/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── maintenance/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── calibration/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── labs/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── activity/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── ui/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── og/
│   │           └── equipment/
│   │               └── [id]/
│   │                   └── route.tsx
│   ├── components/
│   │   ├── ui/ (shadcn/Radix accessible primitives: button, dialog, dropdown-menu, select, tabs, sheet, table, badge, card, input, textarea, label, tooltip, popover, alert-dialog, command, calendar, toast, etc.)
│   │   ├── layout/ (navbar, sidebar, role-switcher, theme-toggle, breadcrumbs, user-nav)
│   │   ├── equipment/ (equipment-card, equipment-table, equipment-filters, equipment-detail-header, equipment-specs, custody-card)
│   │   ├── timeline/ (lifecycle-timeline, custody-stepper, audit-badge)
│   │   ├── borrowing/ (borrow-modal, borrow-request-card, borrow-workflow-tracker, quick-return-modal)
│   │   ├── maintenance/ (maintenance-ticket-card, maintenance-status-stepper, report-issue-modal, maintenance-action-modal)
│   │   ├── calibration/ (calibration-badge, calibration-card, schedule-calibration-modal)
│   │   ├── dashboard/ (stat-card, urgent-attention-list, equipment-status-chart, recent-activity-feed, lab-distribution)
│   │   └── forms/ (borrow-form, report-issue-form, maintenance-request-form, equipment-form, inspect-return-form)
│   ├── data/
│   │   ├── mock-db.ts (Thread-safe in-memory data store with full relational models, seeding, and query methods simulating DB)
│   │   ├── seed-data.ts (Realistic academic laboratory equipment, labs, users, maintenance records, calibration, audit logs)
│   │   └── repository.ts (Repository pattern abstraction layer ready for Prisma replacement in Assignment 2)
│   ├── hooks/
│   │   ├── use-mounted.ts
│   │   └── use-debounce.ts
│   ├── lib/
│   │   ├── utils.ts (cn helper, date formatters, status colors)
│   │   └── constants.ts
│   ├── schemas/
│   │   ├── equipment.schema.ts
│   │   ├── borrow.schema.ts
│   │   ├── maintenance.schema.ts
│   │   └── calibration.schema.ts
│   ├── stores/
│   │   ├── equipment-filter-store.ts (Zustand with localStorage persistence, granular selectors)
│   │   ├── user-role-store.ts (Role-based UI session abstraction)
│   │   └── ui-store.ts (Sidebar, saved items, view mode)
│   └── types/
│       ├── equipment.ts
│       ├── borrow.ts
│       ├── maintenance.ts
│       ├── calibration.ts
│       ├── lab.ts
│       ├── user.ts
│       └── audit.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## Implementation Phases

### Phase 1: Project Initialization & Core Infrastructure
1. Initialize Next.js App Router project with TypeScript, Tailwind CSS, Lucide icons, Radix UI primitives, next-themes, Zustand, React Hook Form, Zod, @hookform/resolvers, Sonner, clsx, tailwind-merge, date-fns.
2. Configure `tailwind.config.ts`, `globals.css` with HSL color tokens for dark/light themes, custom animations, accessible focus rings.
3. Setup `next-themes` ThemeProvider with hydration-safe root layout.

### Phase 2: Domain Models, Schemas, and Repository Layer
1. Define comprehensive TypeScript types and enums for Equipment, Status, Condition, BorrowRequest, MaintenanceTicket, CalibrationRecord, AuditLog, Lab, UserRole.
2. Build Zod validation schemas for all actions with strict validation rules.
3. Build in-memory repository layer with realistic academic laboratory seed data and chain-of-custody logging.

### Phase 3: Accessible UI Primitives (Topic 1) & Theme System
1. Implement full suite of accessible Radix UI-backed components in `src/components/ui/`.
2. Build `/ui` Component Sandbox route showcasing all primitives, accessible focus rings, keyboard interactions, dialogs, sheets, tooltips, tabs, and theme toggling.

### Phase 4: Zustand Client State Stores (Topic 2)
1. Build `equipment-filter-store.ts` with granular selectors, filter states (search, lab, category, status, condition, calibration status, sorting, view mode), and localStorage persistence.
2. Build `user-role-store.ts` for switching roles (Student, Lab Technician, Lab Manager, Admin) with corresponding UI capabilities.
3. Build `ui-store.ts` for responsive sidebar toggle and saved equipment bookmarks.

### Phase 5: Server Actions & Type-Safe Forms (Topic 3) & Optimistic UI
1. Implement Server Actions with double Zod validation (`borrow.ts`, `maintenance.ts`, `calibration.ts`, `equipment.ts`).
2. Build React Hook Form components with inline validation error states and toast notifications.
3. Implement Optimistic UI on borrow requests and status updates with automatic rollback on server error.

### Phase 6: Pages & Features
1. **Home / Landing (`/`)**: High-level platform overview, key metrics, role quick-start guide, navigation links.
2. **Dashboard (`/dashboard`)**: KPI cards, equipment requiring attention, recent activity feed, lab distribution, quick action triggers.
3. **Equipment Catalog (`/equipment`)**: Interactive discovery with Zustand filters, search, table/grid views, pagination/stats, bookmarking, action menus.
4. **Equipment Detail (`/equipment/[id]`)**: Comprehensive asset detail, custody card, specifications, lifecycle timeline, borrowing history, maintenance logs, calibration status, interactive action modals.
5. **Borrow Requests (`/borrow-requests`)**: Status tabs (REQUESTED, APPROVED, BORROWED, RETURNED, INSPECTED, REJECTED), review modal, inspect & return modal.
6. **Maintenance & Repairs (`/maintenance`)**: Maintenance tickets queue, priority badges, status tracker (OPEN -> ASSIGNED -> IN_REPAIR -> TESTING -> RESOLVED), update status modal.
7. **Calibration Schedule (`/calibration`)**: Calibration records, due status (Overdue, Due Soon, Calibrated), schedule new calibration action.
8. **Labs Management (`/labs`)**: Lab cards with capacity, manager details, active equipment list, lab-level metrics.
9. **Activity / Audit Trail (`/activity`)**: Complete immutable chain-of-custody event log with filtering by entity, user, and date.
10. **Settings (`/settings`)**: Role switcher, theme preferences, mock data reset, system health diagnostics.
11. **Dynamic OG Image (`/api/og/equipment/[id]`)**: `@vercel/og` visual asset generation for social sharing and asset cards.

### Phase 7: Academic Deliverables & Comprehensive Documentation
1. `README.md`
2. `docs/architecture.md`
3. `docs/rsc-client-analysis.md`
4. `docs/state-management.md`
5. `docs/server-actions.md`
6. `docs/og-images.md`
7. `docs/lighthouse-report.md`
8. `docs/Topic-1-Summary-Sheet.md`
9. `docs/Topic-2-Survey-Report.md` (2–3 pages)
10. `docs/Topic-3-Quiz.md`
11. `docs/Assignment-1-Technical-Report.md` (2–3 pages)
12. `docs/submission-checklist.md`

### Phase 8: Verification & Quality Assurance
1. Run `npx tsc --noEmit` to verify type safety.
2. Run `npm run lint` and `npm run build` to verify production build.
3. Test all API routes, theme switching, Zustand persistence, form validations, optimistic updates, and accessibility.

## User Review Required
None - All specifications align directly with the user prompt. We are ready to execute upon approval.
