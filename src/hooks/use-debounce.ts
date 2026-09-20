"use client";

import { useState, useEffect } from "react";

/**
 * Debounce a value by a specified delay.
 * Commonly used for search inputs to prevent excessive filtering/API calls.
 *
 * @param value - The value to debounce.
 * @param delay - Delay in milliseconds (default: 300ms).
 * @returns The debounced value.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // Filter equipment based on debouncedSearch
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
