"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the component has mounted on the client.
 * Useful for preventing hydration mismatches with Zustand persisted stores
 * and any client-only rendering logic.
 *
 * @returns {boolean} `true` once the component has mounted on the client.
 *
 * @example
 * ```tsx
 * const mounted = useMounted();
 * if (!mounted) return <Skeleton />;
 * return <FilteredView filters={zustandFilters} />;
 * ```
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
