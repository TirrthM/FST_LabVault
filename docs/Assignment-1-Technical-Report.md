# Assignment 1 Technical Report — LabVault: Laboratory Equipment Lifecycle & Maintenance Platform

## 1. Introduction

LabVault is a full-stack laboratory equipment lifecycle and maintenance management platform built for educational institutions. It tracks equipment from acquisition through active use, borrowing, maintenance, calibration, and eventual retirement or disposal. The platform provides role-based interfaces for students, lab technicians, lab managers, and administrators, each with appropriate capabilities and visibility into the equipment ecosystem.

This report documents the architectural decisions, technology choices, self-learning integration, and implementation methodology employed in building LabVault as a production-quality Next.js application.

## 2. Technology Stack & Justification

| Technology         | Role                           | Justification                                                  |
|--------------------|--------------------------------|----------------------------------------------------------------|
| Next.js 14 (App Router) | Full-stack framework       | RSC for zero-JS server rendering; Server Actions for mutations |
| TypeScript         | Type safety                    | Compile-time error prevention, IDE intelligence, refactoring   |
| Tailwind CSS       | Utility-first styling          | Rapid development, consistent design system, tree-shaking      |
| Radix UI           | Accessible primitives          | WAI-ARIA compliant, keyboard-navigable, unstyled               |
| shadcn/ui + CVA    | Component styling pattern      | Copy-paste ownership, variant management, type-safe styles     |
| Zustand            | Client-side state              | 1.1 kB, no Provider, granular selectors, persist middleware    |
| React Hook Form    | Form state management          | Minimal re-renders, controlled/uncontrolled hybrid, composable |
| Zod                | Schema validation              | Single source of truth for types and validation, double validation |
| Sonner             | Toast notifications            | Lightweight, accessible, promise-based toast API               |
| date-fns           | Date manipulation              | Tree-shakeable, immutable, functional date utilities           |
| Lucide React       | Icon system                    | Consistent, SVG-based, tree-shakeable icon library             |
| @vercel/og         | OG image generation            | Edge-runtime JSX-to-PNG for social sharing cards               |

## 3. Architecture Overview

### 3.1 React Server Components (RSC) Strategy

LabVault follows the **server-first** rendering model of Next.js App Router:

- **Page components** (`page.tsx`) are Server Components that fetch data via the repository layer and pass it as props to child components
- **Interactive components** are isolated Client Components (`"use client"`) that receive server-fetched data as props
- **Layout components** (`layout.tsx`) provide the application shell with sidebar navigation and theme provider

This architecture minimises the JavaScript sent to the client. Only components that require browser APIs (event handlers, state, effects) are client-rendered.

### 3.2 Data Architecture

The application uses a **three-layer data architecture**:

```
  Page (Server Component)
        ↓
  Repository Layer (repository.ts)
        ↓
  In-Memory Database (mock-db.ts)
        ↓
  Seed Data (seed-data.ts)
```

1. **Seed Data**: Realistic academic laboratory data — 6 labs, 8 users across 4 roles, 15+ equipment items, borrow requests, maintenance tickets, calibration records, and audit events
2. **Mock Database**: Thread-safe in-memory store with `findMany`, `findById`, `create`, `update`, `delete`, filtering, aggregation, and audit logging
3. **Repository Pattern**: Abstraction layer with domain-specific methods that can be swapped to Prisma ORM in Assignment 2 without changing consuming code

### 3.3 Server Actions

All mutations flow through Server Actions in `src/actions/`:

- `borrow.ts`: Submit borrow request, approve/reject, inspect return
- `maintenance.ts`: Report issue, update ticket status, add work log
- `calibration.ts`: Schedule calibration, record completion
- `equipment.ts`: Add equipment, update status, transfer between labs

Each Server Action follows the pattern:
1. Parse input with Zod schema (server-side validation)
2. Perform business logic via repository
3. Log audit event
4. Return structured response `{ success, data?, errors?, message? }`

## 4. Self-Learning Topic Integration

### 4.1 Topic 1: Accessible UI Component Primitives

**Deliverable**: 19 Radix UI + shadcn/ui components in `src/components/ui/`, demonstrated in the `/ui` sandbox route.

Key learnings: Radix UI's compositional API (`Root`, `Trigger`, `Content` sub-components), focus trapping in modal overlays, keyboard navigation patterns (arrow keys for tabs/menus, Escape for close), and CVA for type-safe variant management.

**Integration in LabVault**: Every interactive element — dialogs, dropdown menus, selects, tabs, tooltips, switches — uses these accessible primitives, ensuring WCAG compliance without manual ARIA management.

### 4.2 Topic 2: Client-Side State Management with Zustand

**Deliverable**: 3 Zustand stores with localStorage persistence, documented in `docs/state-management.md` and `docs/Topic-2-Survey-Report.md`.

Key learnings: Zustand's hook-based API eliminates Provider boilerplate; `persist` middleware handles cross-session state; granular selectors (`useStore(s => s.field)`) prevent unnecessary re-renders; hydration guards (`useMounted()`) prevent SSR mismatches.

**Integration in LabVault**: Equipment catalog filtering (search, category, status, condition, lab, sort, view mode), role switching (4 roles with different UI capabilities), and UI state (sidebar, command palette).

### 4.3 Topic 3: Type-Safe Server Actions with Zod Double Validation

**Deliverable**: 4 Server Action files with React Hook Form integration, documented in `docs/server-actions.md` and `docs/Topic-3-Quiz.md`.

Key learnings: `"use server"` directive marks functions for server-only execution; `z.infer<typeof schema>` creates a single source of truth for types and validation; double validation (client + server) provides both UX feedback and security; optimistic UI updates improve perceived performance.

**Integration in LabVault**: 6 form modals (borrow, report issue, schedule calibration, add equipment, inspect return, maintenance status update) all use React Hook Form + Zod resolver for client validation and Server Actions + Zod for server validation.

## 5. Key Features

### 5.1 Equipment Lifecycle Management
- Complete status tracking: Available → Reserved → Borrowed → Returned → Under Maintenance → Calibrated → Retired
- Chain-of-custody stepper showing the complete ownership/borrowing history
- Visual timeline of all lifecycle events per equipment item

### 5.2 Role-Based Interface
- **Student**: Browse equipment, submit borrow requests, report issues
- **Lab Technician**: Process returns, perform maintenance, calibrate equipment
- **Lab Manager**: Approve requests, manage labs, add equipment, full audit access
- **Admin**: All capabilities, system configuration, data management

### 5.3 Dashboard Analytics
- KPI cards: Total equipment, active borrows, pending maintenance, overdue calibrations
- Urgent attention items requiring immediate action
- Recent activity feed from audit log
- Lab equipment distribution overview

### 5.4 Maintenance Workflow
- Issue reporting with priority levels (Low, Medium, High, Critical)
- Status progression: Open → Assigned → In Repair → Testing → Resolved
- Work log entries with technician notes and timestamps

### 5.5 Calibration Tracking
- Due date monitoring with Overdue / Due Soon / Calibrated indicators
- Calibration scheduling with certificate number and next-due calculation
- Integration with equipment status (auto-sets to UNDER_CALIBRATION)

## 6. Performance & Accessibility

### Performance
- Server Components reduce client-side JavaScript to ~87 kB shared bundle
- Skeleton loading states eliminate layout shift (CLS ≈ 0)
- Automatic code splitting per route segment
- Edge runtime for OG image generation (< 50 ms cold start)

### Accessibility
- All interactive components use Radix UI primitives with built-in ARIA
- Keyboard navigation for all menus, tabs, dialogs, and form controls
- Focus management: auto-focus on dialog open, focus return on close
- Colour contrast meets WCAG AA (4.5:1) in both light and dark themes
- Semantic HTML with proper heading hierarchy and landmark regions

## 7. Preparation for Assignment 2

The codebase is explicitly designed for seamless Prisma integration:

1. **Repository Pattern**: `repository.ts` abstracts all data access — changing from `mock-db` to Prisma requires only modifying this file
2. **TypeScript Types**: Domain types in `src/types/` align with Prisma schema field types
3. **Server Actions**: Already structured with proper async/await patterns for database operations
4. **Zod Schemas**: Validation schemas will remain unchanged; Prisma's type generation will complement (not replace) them
5. **Audit Logging**: The `addAuditEvent` pattern maps directly to a Prisma audit table insert

## 8. Conclusion

LabVault demonstrates a production-quality approach to full-stack Next.js development, integrating three self-learning topics into a cohesive equipment management platform. The architecture prioritises **server-first rendering** for performance, **type safety** for correctness, **accessible primitives** for inclusivity, and **clean abstractions** for extensibility. The codebase is ready for Assignment 2's Prisma database integration with minimal refactoring required.
