"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EquipmentCategory, EquipmentStatus, EquipmentCondition } from "@/types";

export type SortField = "name" | "assetId" | "category" | "labName" | "status" | "condition" | "nextCalibrationDate" | "purchaseDate";
export type SortDirection = "asc" | "desc";

export interface EquipmentFilterState {
  // Search & Filter state
  search: string;
  selectedLabId: string;
  selectedCategory: EquipmentCategory | "ALL";
  selectedStatus: EquipmentStatus | "ALL";
  selectedCondition: EquipmentCondition | "ALL";
  selectedCalibrationStatus: "ALL" | "CALIBRATED" | "DUE_SOON" | "OVERDUE";
  
  // Sorting state
  sortField: SortField;
  sortDirection: SortDirection;
  
  // UI Display state
  viewMode: "grid" | "table";
  savedEquipmentIds: string[];

  // Actions
  setSearch: (search: string) => void;
  setSelectedLabId: (labId: string) => void;
  setSelectedCategory: (category: EquipmentCategory | "ALL") => void;
  setSelectedStatus: (status: EquipmentStatus | "ALL") => void;
  setSelectedCondition: (condition: EquipmentCondition | "ALL") => void;
  setSelectedCalibrationStatus: (status: "ALL" | "CALIBRATED" | "DUE_SOON" | "OVERDUE") => void;
  setSort: (field: SortField, direction?: SortDirection) => void;
  setViewMode: (mode: "grid" | "table") => void;
  toggleSavedEquipment: (equipmentId: string) => void;
  clearFilters: () => void;
}

const initialFilters = {
  search: "",
  selectedLabId: "ALL",
  selectedCategory: "ALL" as const,
  selectedStatus: "ALL" as const,
  selectedCondition: "ALL" as const,
  selectedCalibrationStatus: "ALL" as const,
  sortField: "name" as SortField,
  sortDirection: "asc" as SortDirection,
};

export const useEquipmentFilterStore = create<EquipmentFilterState>()(
  persist(
    (set, get) => ({
      ...initialFilters,
      viewMode: "grid",
      savedEquipmentIds: [],

      setSearch: (search) => set({ search }),
      setSelectedLabId: (selectedLabId) => set({ selectedLabId }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
      setSelectedCondition: (selectedCondition) => set({ selectedCondition }),
      setSelectedCalibrationStatus: (selectedCalibrationStatus) => set({ selectedCalibrationStatus }),
      
      setSort: (field, direction) => {
        const currentField = get().sortField;
        const currentDir = get().sortDirection;
        const newDirection = direction ?? (currentField === field && currentDir === "asc" ? "desc" : "asc");
        set({ sortField: field, sortDirection: newDirection });
      },

      setViewMode: (viewMode) => set({ viewMode }),

      toggleSavedEquipment: (id) => {
        const current = get().savedEquipmentIds;
        const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
        set({ savedEquipmentIds: next });
      },

      clearFilters: () => set(initialFilters),
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

// Granular Selectors to avoid unnecessary re-renders (Topic 2 Demonstration)
export const selectSearch = (state: EquipmentFilterState) => state.search;
export const selectLabId = (state: EquipmentFilterState) => state.selectedLabId;
export const selectCategory = (state: EquipmentFilterState) => state.selectedCategory;
export const selectStatus = (state: EquipmentFilterState) => state.selectedStatus;
export const selectCondition = (state: EquipmentFilterState) => state.selectedCondition;
export const selectCalibrationStatus = (state: EquipmentFilterState) => state.selectedCalibrationStatus;
export const selectViewMode = (state: EquipmentFilterState) => state.viewMode;
export const selectSavedEquipmentIds = (state: EquipmentFilterState) => state.savedEquipmentIds;
export const selectSorting = (state: EquipmentFilterState) => ({
  field: state.sortField,
  direction: state.sortDirection,
});
export const selectIsFiltered = (state: EquipmentFilterState) =>
  state.search !== "" ||
  state.selectedLabId !== "ALL" ||
  state.selectedCategory !== "ALL" ||
  state.selectedStatus !== "ALL" ||
  state.selectedCondition !== "ALL" ||
  state.selectedCalibrationStatus !== "ALL";
