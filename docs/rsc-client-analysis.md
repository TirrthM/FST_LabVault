# React Server Components (RSC) vs. Client Components Analysis

## 1. Executive Summary

A core requirement of modern Next.js App Router engineering is adhering to the **Server Component First** paradigm. Rather than marking parent route files with `"use client"`, LabVault strategically positions `"use client"` boundaries as low and localized as possible in the component tree.

---

## 2. Component Boundary Taxonomy

```mermaid
graph TD
    subgraph "Server Environment (Zero JS Bundle to Client)"
        RootLayout[app/layout.tsx]
        HomePage[app/page.tsx]
        DashboardPage[app/dashboard/page.tsx]
        EquipmentPage[app/equipment/page.tsx]
        EquipmentDetailPage[app/equipment/[id]/page.tsx]
        LabsPage[app/labs/page.tsx]
        ActivityPage[app/activity/page.tsx]
        SpecsComp[components/equipment/equipment-specs.tsx]
        TimelineComp[components/timeline/lifecycle-timeline.tsx]
        OGRoute[app/api/og/equipment/[id]/route.tsx]
    end

    subgraph "Client Environment (Hydrated for Interactivity)"
        ThemeProv[components/layout/theme-provider.tsx]
        ThemeToggle[components/layout/theme-toggle.tsx]
        RoleSwitcher[components/layout/role-switcher.tsx]
        AppSidebar[components/layout/app-sidebar.tsx]
        CmdPalette[components/layout/command-palette.tsx]
        CatalogView[components/equipment/equipment-catalog-view.tsx]
        FiltersComp[components/equipment/equipment-filters.tsx]
        EquipmentCard[components/equipment/equipment-card.tsx]
        EquipmentTable[components/equipment/equipment-table.tsx]
        DetailHeader[components/equipment/equipment-detail-header.tsx]
        BorrowForm[components/forms/borrow-form-modal.tsx]
        ReportForm[components/forms/report-issue-modal.tsx]
        MaintForm[components/forms/maintenance-status-modal.tsx]
        CalForm[components/forms/schedule-calibration-modal.tsx]
        InspectForm[components/forms/inspect-return-modal.tsx]
        AddForm[components/forms/add-equipment-modal.tsx]
        SettingsPage[app/settings/page.tsx]
        UiSandbox[app/ui/page.tsx]
    end

    DashboardPage --> TimelineComp
    EquipmentPage --> CatalogView
    CatalogView --> FiltersComp
    CatalogView --> EquipmentCard
    EquipmentDetailPage --> DetailHeader
    EquipmentDetailPage --> SpecsComp
    EquipmentDetailPage --> TimelineComp
```

---

## 3. Rationale for Server Component Placement

### 3.1 `app/dashboard/page.tsx` (RSC)
- **Why Server?** The dashboard fetches aggregated data (`dashboardRepository.getStats()`) directly from the data layer without sending database drivers, SQL builders, or raw aggregation logic to the client browser.
- **Benefits:** Minimal client bundle footprint, zero client-side fetch waterfalls, instant static HTML streaming.

### 3.2 `app/equipment/[id]/page.tsx` (RSC)
- **Why Server?** Resolves dynamic routing parameters, queries multiple data collections (asset details, historical borrow requests, maintenance work orders, calibration logs, and audit trails) in parallel on the server, and renders SEO-optimized metadata (`generateMetadata`) with dynamic Open Graph tags.

### 3.3 `components/timeline/lifecycle-timeline.tsx` (RSC)
- **Why Server?** This component simply receives an array of audit events and renders semantic HTML timeline nodes. Because it requires no client event listeners or browser APIs, keeping it as a Server Component saves client JavaScript execution time.

---

## 4. Rationale for Client Component Boundaries (`"use client"`)

| Component | Reason for `"use client"` Boundary |
| :--- | :--- |
| `equipment-filter-store.ts` | Subscribes to Zustand client store, listens to search input events, and reads/writes `localStorage`. |
| `theme-toggle.tsx` / `role-switcher.tsx` | Requires `onClick` event listeners and reactive theme/session context changes. |
| `command-palette.tsx` | Attaches a global `keydown` listener (`Ctrl+K` / `⌘K`) and controls Radix Dialog open/close state. |
| `borrow-form-modal.tsx` | Manages React Hook Form internal state, Zod resolver validation errors, and optimistic UI dispatch. |
| `app/ui/page.tsx` | Demonstrates interactive Radix primitives, switches, radio groups, dialog triggers, and toast dispatches. |

---

## 5. Serialization Boundaries & Hydration Safety

When passing props from a Server Component to a Client Component across the serialization boundary:
1. **JSON Serializable Only:** All props passed (e.g. `initialEquipment`, `labs`) are plain JavaScript objects and arrays with ISO date strings. Functions and class instances are never passed across the boundary.
2. **Hydration Mismatch Prevention:** `next-themes` and `zustand/persist` interact with browser `localStorage`. To prevent SSR hydration warnings, the root layout uses `suppressHydrationWarning` on `<html>`, and client components that display persisted state use a `mounted` check pattern:
```tsx
const [mounted, setMounted] = React.useState(false);
React.useEffect(() => setMounted(true), []);
if (!mounted) return <Skeleton />;
```
