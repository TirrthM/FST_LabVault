# Topic 1 Summary Sheet — Accessible UI Component Primitives

## Self-Learning Topic

**Topic**: Accessible UI Component Primitives with Radix UI, shadcn/ui, and CVA (Class Variance Authority)

## Key Concepts Learned

### 1. Radix UI Primitives

Radix UI provides **unstyled, accessible UI primitives** that handle complex interaction patterns out of the box:

| Concept                | Description                                                                |
|------------------------|----------------------------------------------------------------------------|
| **Composability**      | Primitives export named sub-components (e.g., `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`) that compose together |
| **Accessibility**      | Built-in ARIA attributes, focus trapping, keyboard navigation, screen-reader announcements |
| **Controlled/Uncontrolled** | All primitives support both controlled (`open`, `onOpenChange`) and uncontrolled modes |
| **Portal Rendering**   | Overlay components (Dialog, Popover, Dropdown) render via React Portal to `<body>` to avoid stacking-context issues |
| **Focus Management**   | Auto-focus on open, focus return on close, focus trapping within modal overlays |

### 2. shadcn/ui Pattern

shadcn/ui is **not a component library** — it is a collection of copy-paste component recipes that wrap Radix UI with Tailwind CSS styling:

- Components are copied into `src/components/ui/` and **owned by the project**
- Styling uses `cn()` utility (combining `clsx` + `tailwind-merge`)
- Components use `React.forwardRef` for ref forwarding
- Props extend native HTML element props via `React.ComponentPropsWithoutRef<T>`

### 3. Class Variance Authority (CVA)

CVA provides **type-safe variant management** for component styling:

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: { default: "bg-primary ...", destructive: "bg-destructive ..." },
      size:    { default: "h-10 px-4", sm: "h-9 px-3", lg: "h-11 px-8" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

- `VariantProps<typeof buttonVariants>` extracts the TypeScript type for variant props
- Variants are composable — each axis (variant, size) is independent
- Default variants reduce boilerplate at call sites

## Components Implemented in LabVault

| Component        | Radix Primitive Used        | Key Accessibility Features                      |
|------------------|-----------------------------|--------------------------------------------------|
| `Button`         | `@radix-ui/react-slot`      | `asChild` prop for custom elements, focus ring   |
| `Dialog`         | `@radix-ui/react-dialog`    | Focus trap, Esc close, body scroll lock          |
| `AlertDialog`    | `@radix-ui/react-alert-dialog` | Requires explicit action, no outside-click close |
| `DropdownMenu`   | `@radix-ui/react-dropdown-menu` | Arrow-key navigation, type-ahead, sub-menus   |
| `Select`         | `@radix-ui/react-select`    | Typeahead, keyboard selection, portal            |
| `Tabs`           | `@radix-ui/react-tabs`      | Arrow-key tab switching, `aria-selected`         |
| `Tooltip`        | `@radix-ui/react-tooltip`   | Delay open, accessible label, portal             |
| `Popover`        | `@radix-ui/react-popover`   | Portal, outside click, focus management          |
| `Switch`         | `@radix-ui/react-switch`    | `role="switch"`, `aria-checked`                  |
| `RadioGroup`     | `@radix-ui/react-radio-group` | Arrow-key navigation, group labelling          |
| `Label`          | `@radix-ui/react-label`     | Click-to-focus associated input                  |
| `Separator`      | `@radix-ui/react-separator` | `role="separator"`, `aria-orientation`            |
| `Sheet`          | `@radix-ui/react-dialog`    | Side panel variant, focus trap, overlay          |
| `Badge`          | Native `<div>`              | CVA variants for semantic colours                |
| `Card`           | Native `<div>`              | Semantic grouping, consistent spacing            |
| `Input`          | Native `<input>`            | `aria-invalid`, `aria-describedby` for errors    |
| `Textarea`       | Native `<textarea>`         | Auto-resize, error state integration             |
| `Table`          | Native `<table>`            | `<thead>`, `<th scope>`, proper structure        |
| `Skeleton`       | Native `<div>`              | `animate-pulse`, layout placeholder              |

## UI Component Sandbox

**Route**: `/ui`

The sandbox page demonstrates:
1. All button variants (default, destructive, outline, secondary, ghost, link) × sizes
2. Badge variants with semantic colours
3. Dialog and AlertDialog with focus trapping
4. Sheet (slide-out panel) from right edge
5. DropdownMenu with keyboard navigation
6. Select with search and grouped options
7. Tabs with content panels
8. Switch and RadioGroup state management
9. Tooltip with delay
10. Table with sorting indicators
11. Theme toggle (light/dark/system) demonstrating CSS custom property switching

## Keyboard Accessibility Summary

| Interaction          | Keys                              | Component              |
|----------------------|-----------------------------------|------------------------|
| Navigate tabs        | ← → arrows                       | Tabs                   |
| Open dropdown        | Enter / Space / ↓                 | DropdownMenu           |
| Navigate menu items  | ↑ ↓ arrows                       | DropdownMenu           |
| Type-ahead search    | Letter keys                       | DropdownMenu, Select   |
| Close overlay        | Escape                            | Dialog, Sheet, Popover |
| Toggle switch        | Space                             | Switch                 |
| Select radio option  | ↑ ↓ arrows                       | RadioGroup             |
| Submit form          | Enter (within input)              | Form                   |
| Activate button      | Enter / Space                     | Button                 |

## Reflection

Building accessible UI components with Radix UI + shadcn/ui + CVA provides a **foundation-first approach** to accessibility. Rather than retrofitting ARIA attributes, the primitives enforce correct patterns structurally. The CVA pattern for variant management eliminates the "className soup" problem while maintaining full type safety. This approach scales well — new variants are added by extending the CVA config, and all existing call sites remain valid.
