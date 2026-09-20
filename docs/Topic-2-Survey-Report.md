# Topic 2 Survey Report — Client-Side State Management with Zustand

## 1. Introduction

Modern React applications require robust client-side state management for interactive UI features that go beyond what server-rendered content provides. This report surveys the landscape of client-side state management solutions in the React ecosystem, evaluates their trade-offs, and documents the rationale behind selecting **Zustand** for LabVault's client-state layer.

The scope of this survey covers libraries and patterns applicable to Next.js App Router applications where React Server Components (RSC) handle data fetching and rendering, while client state manages UI-specific concerns: filters, preferences, session state, and optimistic updates.

## 2. State Management Landscape

### 2.1 React Context + useReducer (Built-in)

React's built-in `useContext` + `useReducer` pattern provides state management without external dependencies.

**Strengths:**
- Zero bundle size overhead
- First-party API, no vendor lock-in
- Simple to understand for small applications

**Weaknesses:**
- **Re-render propagation**: All consumers of a Context re-render when any part of the context value changes, even if they only consume a subset
- **Boilerplate**: Requires creating Context, Provider, reducer, action types, and custom hooks for each state domain
- **No built-in persistence**: LocalStorage/SessionStorage synchronisation must be manually implemented
- **No devtools**: Debugging state transitions requires custom logging

### 2.2 Redux Toolkit (RTK)

Redux Toolkit modernises Redux with opinionated defaults, `createSlice`, and `createAsyncThunk`.

**Strengths:**
- Mature ecosystem with excellent DevTools
- `createSlice` eliminates boilerplate (auto-generates action creators and action types)
- `immer` integration enables "mutable" state update syntax
- Middleware system (saga, thunk, listener) for complex async workflows
- Large community and extensive documentation

**Weaknesses:**
- **Bundle size**: ~33 kB (minified + gzipped), significant for client-side-only state
- **Conceptual overhead**: Reducers, actions, selectors, middleware, store configuration — steep learning curve for teams
- **Overkill for UI state**: LabVault's client state (filters, preferences, UI toggles) does not warrant Redux's architecture
- **SSR hydration complexity**: Requires careful store initialisation to avoid hydration mismatches with RSC

### 2.3 Zustand

Zustand is a minimal, hook-based state management library built on React's external store subscription API (`useSyncExternalStore`).

**Strengths:**
- **Tiny bundle**: ~1.1 kB (minified + gzipped)
- **Minimal API surface**: `create()` returns a hook; no Providers, no boilerplate
- **Granular selectors**: `useStore(state => state.field)` only re-renders when the selected field changes
- **Built-in middleware**: `persist` (localStorage/sessionStorage), `devtools`, `immer`, `subscribeWithSelector`
- **SSR-compatible**: Works with Next.js App Router when combined with hydration guards
- **TypeScript-first**: Full type inference without verbose generics

**Weaknesses:**
- Smaller community compared to Redux (though growing rapidly)
- No built-in async middleware (though easily composed with async functions in actions)

### 2.4 Jotai

Jotai implements an **atomic** state model inspired by Recoil.

**Strengths:**
- Bottom-up composition — each atom is an independent unit of state
- Fine-grained reactivity (per-atom subscriptions)
- Excellent for deeply nested or graph-like state relationships
- Small bundle (~3.4 kB)

**Weaknesses:**
- Requires a `<Provider>` component for scoped state (though optional for global state)
- Debugging complex atom dependency graphs can be challenging
- Less intuitive for teams accustomed to object-based stores

### 2.5 Comparison Matrix

| Criterion             | Context+Reducer | Redux Toolkit | Zustand | Jotai  |
|-----------------------|-----------------|---------------|---------|--------|
| Bundle Size           | 0 kB            | ~33 kB        | ~1.1 kB | ~3.4 kB|
| Boilerplate           | High            | Medium        | Low     | Low    |
| Learning Curve        | Low             | High          | Low     | Medium |
| Granular Re-renders   | ✗               | ✓ (selectors) | ✓       | ✓      |
| Persistence Middleware| Manual          | Manual        | Built-in| Plugin |
| DevTools              | ✗               | ✓ (excellent) | ✓       | ✓      |
| SSR/RSC Compatibility | ✓               | Complex       | ✓       | ✓      |
| Provider Required     | ✓               | ✓             | ✗       | Optional|

## 3. Why Zustand for LabVault

### 3.1 Alignment with Next.js App Router

In Next.js App Router, **data fetching is a server concern** (RSC, Server Actions). Client state should be limited to:

1. **UI preferences**: Theme, sidebar state, view mode (grid/table)
2. **Filter/search state**: Equipment filters, sort options, search terms
3. **Session abstractions**: Current user role selection
4. **Saved items**: Bookmarked equipment IDs

Zustand's lightweight, Provider-free architecture is ideal for this scope. Redux's infrastructure would be disproportionate.

### 3.2 Implementation in LabVault

LabVault uses three Zustand stores:

#### `equipment-filter-store.ts`
```typescript
interface EquipmentFilterState {
  search: string;
  labFilter: string | null;
  categoryFilter: EquipmentCategory | null;
  statusFilter: EquipmentStatus | null;
  conditionFilter: EquipmentCondition | null;
  calibrationFilter: string | null;
  sortField: SortField;
  sortDirection: SortDirection;
  viewMode: "grid" | "table";
  savedEquipmentIds: string[];
  // ... actions
}
```
- Uses `persist` middleware with `localStorage` for cross-session persistence
- Granular selectors prevent unnecessary re-renders in filter UI
- `resetFilters()` action clears all filters atomically

#### `user-role-store.ts`
- Manages the active user role and corresponding seed user
- Persisted to `localStorage` to survive page reloads
- Used by role-aware components to conditionally render actions

#### `ui-store.ts`
- Manages sidebar toggle and command palette visibility
- Non-persisted (resets on navigation)

### 3.3 Hydration Safety

Zustand's `persist` middleware can cause hydration mismatches because the server renders with default values while the client rehydrates from `localStorage`. LabVault addresses this with:

```typescript
// hooks/use-mounted.ts
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
```

Components check `useMounted()` and render skeleton placeholders until hydration completes.

## 4. Conclusion

Zustand provides the optimal balance of **minimal bundle impact** (~1.1 kB), **developer ergonomics** (no Provider, no boilerplate), and **granular reactivity** (selector-based subscriptions) for LabVault's client-state requirements. Its built-in `persist` middleware and compatibility with Next.js App Router make it the clear choice over Redux Toolkit (overkill), Context+Reducer (re-render issues), and Jotai (unnecessary atomic model) for this project's scope.

## References

1. Zustand GitHub Repository — https://github.com/pmndrs/zustand
2. Redux Toolkit Documentation — https://redux-toolkit.js.org/
3. Jotai Documentation — https://jotai.org/
4. React `useSyncExternalStore` RFC — https://github.com/reactwg/react-18/discussions/86
5. Next.js App Router State Management — https://nextjs.org/docs/app/building-your-application/rendering
