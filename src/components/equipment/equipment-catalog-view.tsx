"use client";

import * as React from "react";
import { EquipmentItem, Lab } from "@/types";
import {
  useEquipmentFilterStore,
  selectSearch,
  selectLabId,
  selectCategory,
  selectStatus,
  selectCondition,
  selectCalibrationStatus,
  selectViewMode,
  selectSorting,
} from "@/stores/equipment-filter-store";
import { EquipmentFilters } from "./equipment-filters";
import { EquipmentCard } from "./equipment-card";
import { EquipmentTable } from "./equipment-table";
import { AddEquipmentModal } from "@/components/forms/add-equipment-modal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Cpu } from "lucide-react";
import { useUserRoleStore } from "@/stores/user-role-store";

interface EquipmentCatalogViewProps {
  initialEquipment: EquipmentItem[];
  labs: Lab[];
}

export function EquipmentCatalogView({
  initialEquipment,
  labs,
}: EquipmentCatalogViewProps) {
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const { currentRole } = useUserRoleStore();

  // Zustand state subscriptions (Topic 2 Demonstration)
  const search = useEquipmentFilterStore(selectSearch);
  const selectedLabId = useEquipmentFilterStore(selectLabId);
  const selectedCategory = useEquipmentFilterStore(selectCategory);
  const selectedStatus = useEquipmentFilterStore(selectStatus);
  const selectedCondition = useEquipmentFilterStore(selectCondition);
  const selectedCalibrationStatus = useEquipmentFilterStore(selectCalibrationStatus);
  const viewMode = useEquipmentFilterStore(selectViewMode);
  const { field: sortField, direction: sortDirection } = useEquipmentFilterStore(selectSorting);

  // Filter items in client Zustand loop
  const filteredEquipment = React.useMemo(() => {
    let result = [...initialEquipment];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (eq) =>
          eq.name.toLowerCase().includes(q) ||
          eq.assetId.toLowerCase().includes(q) ||
          eq.manufacturer.toLowerCase().includes(q) ||
          eq.model.toLowerCase().includes(q) ||
          eq.serialNumber.toLowerCase().includes(q) ||
          eq.labName.toLowerCase().includes(q) ||
          eq.location.toLowerCase().includes(q)
      );
    }

    // Lab
    if (selectedLabId !== "ALL") {
      result = result.filter((eq) => eq.labId === selectedLabId);
    }

    // Category
    if (selectedCategory !== "ALL") {
      result = result.filter((eq) => eq.category === selectedCategory);
    }

    // Status
    if (selectedStatus !== "ALL") {
      result = result.filter((eq) => eq.status === selectedStatus);
    }

    // Condition
    if (selectedCondition !== "ALL") {
      result = result.filter((eq) => eq.condition === selectedCondition);
    }

    // Calibration
    if (selectedCalibrationStatus !== "ALL") {
      const now = new Date();
      result = result.filter((eq) => {
        if (!eq.nextCalibrationDate) return false;
        const target = new Date(eq.nextCalibrationDate);
        const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (selectedCalibrationStatus === "OVERDUE") return diffDays < 0;
        if (selectedCalibrationStatus === "DUE_SOON") return diffDays >= 0 && diffDays <= 14;
        if (selectedCalibrationStatus === "CALIBRATED") return diffDays > 14;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any = a[sortField as keyof EquipmentItem] || "";
      let valB: any = b[sortField as keyof EquipmentItem] || "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    initialEquipment,
    search,
    selectedLabId,
    selectedCategory,
    selectedStatus,
    selectedCondition,
    selectedCalibrationStatus,
    sortField,
    sortDirection,
  ]);

  const canCommission = currentRole === "LAB_MANAGER" || currentRole === "ADMIN" || currentRole === "LAB_TECHNICIAN";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
            <Cpu className="h-6 w-6 text-primary" />
            <span>Equipment Discovery & Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Search, filter, check calibration currency, and request requisitions across all institutional research labs.
          </p>
        </div>

        {canCommission && (
          <Button onClick={() => setAddModalOpen(true)} className="gap-2 font-semibold shadow-xs">
            <PlusCircle className="h-4 w-4" />
            <span>Commission Asset</span>
          </Button>
        )}
      </div>

      {/* Zustand-driven Filters */}
      <EquipmentFilters labs={labs} totalResults={filteredEquipment.length} />

      {/* Grid or Table Presentation */}
      {viewMode === "grid" ? (
        filteredEquipment.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
            No equipment found matching the active filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((eq) => (
              <EquipmentCard key={eq.id} equipment={eq} />
            ))}
          </div>
        )
      ) : (
        <EquipmentTable items={filteredEquipment} />
      )}

      {/* Commissioning Modal */}
      <AddEquipmentModal
        labs={labs}
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
