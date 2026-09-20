"use client";

import * as React from "react";
import {
  useEquipmentFilterStore,
  selectSearch,
  selectLabId,
  selectCategory,
  selectStatus,
  selectCondition,
  selectCalibrationStatus,
  selectViewMode,
  selectIsFiltered,
} from "@/stores/equipment-filter-store";
import { Lab, EquipmentCategory, EquipmentStatus, EquipmentCondition } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EquipmentFiltersProps {
  labs: Lab[];
  totalResults: number;
}

export function EquipmentFilters({ labs, totalResults }: EquipmentFiltersProps) {
  // Using granular Zustand selectors (Topic 2 Requirement)
  const search = useEquipmentFilterStore(selectSearch);
  const selectedLabId = useEquipmentFilterStore(selectLabId);
  const selectedCategory = useEquipmentFilterStore(selectCategory);
  const selectedStatus = useEquipmentFilterStore(selectStatus);
  const selectedCondition = useEquipmentFilterStore(selectCondition);
  const selectedCalibrationStatus = useEquipmentFilterStore(selectCalibrationStatus);
  const viewMode = useEquipmentFilterStore(selectViewMode);
  const isFiltered = useEquipmentFilterStore(selectIsFiltered);

  const setSearch = useEquipmentFilterStore((s) => s.setSearch);
  const setSelectedLabId = useEquipmentFilterStore((s) => s.setSelectedLabId);
  const setSelectedCategory = useEquipmentFilterStore((s) => s.setSelectedCategory);
  const setSelectedStatus = useEquipmentFilterStore((s) => s.setSelectedStatus);
  const setSelectedCondition = useEquipmentFilterStore((s) => s.setSelectedCondition);
  const setSelectedCalibrationStatus = useEquipmentFilterStore((s) => s.setSelectedCalibrationStatus);
  const setViewMode = useEquipmentFilterStore((s) => s.setViewMode);
  const clearFilters = useEquipmentFilterStore((s) => s.clearFilters);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-28 w-full animate-pulse rounded-lg bg-muted/40" />
    );
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4 shadow-xs">
      {/* Top row: Search, View Mode Toggle, and Count */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by equipment name, asset ID, manufacturer, model, serial..."
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center rounded-md border p-0.5 bg-muted/30">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-7 px-2.5"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Grid</span>
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-7 px-2.5"
              aria-label="Table view"
            >
              <List className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Table</span>
            </Button>
          </div>

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1 border-t">
        {/* Lab selector */}
        <div>
          <Select value={selectedLabId} onValueChange={setSelectedLabId}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Laboratories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Laboratories</SelectItem>
              {labs.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category selector */}
        <div>
          <Select value={selectedCategory} onValueChange={(val: any) => setSelectedCategory(val)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="OSCILLOSCOPES">Oscilloscopes</SelectItem>
              <SelectItem value="POWER_SUPPLIES">Power Supplies</SelectItem>
              <SelectItem value="SIGNAL_GENERATORS">Signal Generators</SelectItem>
              <SelectItem value="MULTIMETERS">Multimeters</SelectItem>
              <SelectItem value="SPECTRUM_ANALYZERS">Spectrum Analyzers</SelectItem>
              <SelectItem value="MICROCONTROLLERS">Microcontrollers</SelectItem>
              <SelectItem value="ROBOTICS">Robotics</SelectItem>
              <SelectItem value="COMPUTING_AI">AI Compute</SelectItem>
              <SelectItem value="OPTICAL_MICROSCOPES">Microscopes</SelectItem>
              <SelectItem value="SOLDERING_REWORK">Soldering / Rework</SelectItem>
              <SelectItem value="SENSORS_IOT">Sensors & IoT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status selector */}
        <div>
          <Select value={selectedStatus} onValueChange={(val: any) => setSelectedStatus(val)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="BORROWED">Borrowed</SelectItem>
              <SelectItem value="RESERVED">Reserved</SelectItem>
              <SelectItem value="UNDER_MAINTENANCE">In Maintenance</SelectItem>
              <SelectItem value="UNDER_CALIBRATION">In Calibration</SelectItem>
              <SelectItem value="LOST">Lost</SelectItem>
              <SelectItem value="RETIRED">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition selector */}
        <div>
          <Select value={selectedCondition} onValueChange={(val: any) => setSelectedCondition(val)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Conditions</SelectItem>
              <SelectItem value="EXCELLENT">Excellent</SelectItem>
              <SelectItem value="GOOD">Good</SelectItem>
              <SelectItem value="FAIR">Fair</SelectItem>
              <SelectItem value="DAMAGED">Damaged</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calibration status selector */}
        <div className="col-span-2 sm:col-span-1">
          <Select
            value={selectedCalibrationStatus}
            onValueChange={(val: any) => setSelectedCalibrationStatus(val)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Calibration Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Calibration</SelectItem>
              <SelectItem value="CALIBRATED">Calibrated</SelectItem>
              <SelectItem value="DUE_SOON">Due Soon (≤ 14d)</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>
          Showing <strong className="text-foreground">{totalResults}</strong> laboratory asset{totalResults === 1 ? "" : "s"}
        </span>
        {isFiltered && (
          <span className="text-primary font-medium flex items-center gap-1 text-[11px]">
            <Filter className="h-3 w-3" /> Filters active
          </span>
        )}
      </div>
    </div>
  );
}
