# State Management Architecture: Server State vs. Zustand Client State

## 1. Architectural Philosophy

In LabVault, state is strictly divided into three distinct tiers based on its lifecycle, source of truth, and synchronization requirements:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SERVER STATE (Data Layer)                                │
│ - Equipment inventory, borrow records, maintenance tickets  │
│ - Retrieved via React Server Components & Repository Layer  │
│ - Mutated via Next.js Server Actions & revalidatePath()     │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Server Actions / Mutations
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CLIENT UI STATE (Zustand)                                │
│ - Search query string, faceted filter selections            │
│ - Sort field & direction, view mode (grid vs table)         │
│ - Bookmarked equipment IDs, sidebar open/collapsed state    │
│ - Simulated user role & session profile                     │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Sync / Hydration
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. PERSISTENT STORAGE (Browser LocalStorage)                │
│ - Filter preferences, bookmarked items, theme choice        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Why Zustand for Client UI State?

Unlike traditional Redux (which introduces excessive boilerplate, actions, and reducers) or React Context (which causes cascading re-renders across all consumers when any slice changes), **Zustand** offers:

1. **Zero-Boilerplate Store Definition**: Plain TypeScript objects with concise setter functions.
2. **Granular Subscriptions (Selectors)**: Components re-render *only* when their selected slice changes.
3. **Built-in Middleware**: Seamless `persist` middleware with custom storage drivers.
4. **Decoupled from React Lifecycle**: Can be accessed and mutated outside of React render loops if needed.

---

## 3. Implementation in LabVault

### 3.1 Store Definition with Selective Persistence

From `src/stores/equipment-filter-store.ts`:
```typescript
export const useEquipmentFilterStore = create<EquipmentFilterState>()(
  persist(
    (set, get) => ({
      search: "",
      selectedLabId: "ALL",
      selectedCategory: "ALL",
      selectedStatus: "ALL",
      selectedCondition: "ALL",
      selectedCalibrationStatus: "ALL",
      sortField: "name",
      sortDirection: "asc",
      viewMode: "grid",
      savedEquipmentIds: [],

      setSearch: (search) => set({ search }),
      setSelectedLabId: (selectedLabId) => set({ selectedLabId }),
      // ...actions
    }),
    {
      name: "labvault_equipment_filters_v1",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : ({} as Storage))),
      partialize: (state) => ({
        selectedLabId: state.selectedLabId,
        selectedCategory: state.selectedCategory,
        selectedStatus: state.selectedStatus,
        viewMode: state.viewMode,
        savedEquipmentIds: state.savedEquipmentIds,
        sortField: state.sortField,
        sortDirection: state.sortDirection,
      }),
    }
  )
);
```

### 3.2 Granular Selectors to Prevent Unnecessary Re-Renders

```typescript
// Granular Selectors
export const selectSearch = (state: EquipmentFilterState) => state.search;
export const selectLabId = (state: EquipmentFilterState) => state.selectedLabId;
export const selectCategory = (state: EquipmentFilterState) => state.selectedCategory;
export const selectViewMode = (state: EquipmentFilterState) => state.viewMode;
```

In `src/components/equipment/equipment-filters.tsx`:
```typescript
// Subscribing only to specific fields
const search = useEquipmentFilterStore(selectSearch);
const selectedLabId = useEquipmentFilterStore(selectLabId);
const viewMode = useEquipmentFilterStore(selectViewMode);
```
If another component toggles `savedEquipmentIds`, the `EquipmentFilters` component will **not** re-render because its subscribed slices remain referentially unchanged.

---

## 4. Key Rules Followed in LabVault

- ❌ **Anti-Pattern Avoided:** Storing entire server database records inside Zustand and duplicating server cache.
- ✅ **Best Practice:** Server data flows through React Server Components (`initialEquipment`), while Zustand controls client-side display parameters (`search`, `selectedLabId`, `sortField`).
