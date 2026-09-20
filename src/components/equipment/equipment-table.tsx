"use client";

import * as React from "react";
import Link from "next/link";
import { EquipmentItem } from "@/types";
import {
  getStatusBadgeVariant,
  getConditionBadge,
  getCalibrationStatus,
  formatDate,
} from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BorrowFormModal } from "@/components/forms/borrow-form-modal";
import { ReportIssueModal } from "@/components/forms/report-issue-modal";
import { ScheduleCalibrationModal } from "@/components/forms/schedule-calibration-modal";
import {
  MoreHorizontal,
  Eye,
  Calendar,
  Wrench,
  Gauge,
  ArrowUpDown,
} from "lucide-react";

interface EquipmentTableProps {
  items: EquipmentItem[];
}

export function EquipmentTable({ items }: EquipmentTableProps) {
  const [selectedForBorrow, setSelectedForBorrow] = React.useState<EquipmentItem | null>(null);
  const [selectedForReport, setSelectedForReport] = React.useState<EquipmentItem | null>(null);
  const [selectedForCal, setSelectedForCal] = React.useState<EquipmentItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        No equipment found matching the active filter criteria.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[140px] font-semibold">Asset ID</TableHead>
            <TableHead className="font-semibold">Equipment Name</TableHead>
            <TableHead className="font-semibold">Laboratory / Location</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Condition</TableHead>
            <TableHead className="font-semibold">Calibration</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((eq) => {
            const statusBadge = getStatusBadgeVariant(eq.status);
            const conditionBadge = getConditionBadge(eq.condition);
            const calStatus = getCalibrationStatus(eq.nextCalibrationDate);

            return (
              <TableRow key={eq.id} className="hover:bg-muted/30 transition-colors">
                {/* Asset ID */}
                <TableCell className="font-mono text-xs font-semibold text-foreground">
                  <Link href={`/equipment/${eq.id}`} className="hover:underline text-primary">
                    {eq.assetId}
                  </Link>
                </TableCell>

                {/* Name & Manufacturer */}
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/equipment/${eq.id}`}
                      className="font-medium text-xs text-foreground hover:underline line-clamp-1"
                    >
                      {eq.name}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">
                      {eq.manufacturer} · {eq.model}
                    </span>
                  </div>
                </TableCell>

                {/* Lab & Location */}
                <TableCell className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground truncate max-w-[180px]">{eq.labName}</span>
                    <span className="text-[11px] text-muted-foreground">{eq.location}</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusBadge.bgClass} ${statusBadge.textClass} ${statusBadge.borderClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dotColor}`} />
                    {statusBadge.label}
                  </span>
                </TableCell>

                {/* Condition */}
                <TableCell>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${conditionBadge.bgClass} ${conditionBadge.textClass} ${conditionBadge.borderClass}`}>
                    {conditionBadge.label}
                  </span>
                </TableCell>

                {/* Calibration */}
                <TableCell>
                  {eq.nextCalibrationDate ? (
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${calStatus.bgClass} ${calStatus.textClass} ${calStatus.borderClass}`}>
                      {calStatus.label}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">N/A</span>
                  )}
                </TableCell>

                {/* Actions Dropdown */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/equipment/${eq.id}`} className="cursor-pointer gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>View Details & Timeline</span>
                        </Link>
                      </DropdownMenuItem>

                      {eq.status === "AVAILABLE" && (
                        <DropdownMenuItem
                          onClick={() => setSelectedForBorrow(eq)}
                          className="cursor-pointer gap-2"
                        >
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>Request Borrow</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() => setSelectedForReport(eq)}
                        className="cursor-pointer gap-2"
                      >
                        <Wrench className="h-4 w-4 text-amber-600" />
                        <span>Report Issue / Service</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setSelectedForCal(eq)}
                        className="cursor-pointer gap-2"
                      >
                        <Gauge className="h-4 w-4 text-teal-600" />
                        <span>Record Calibration</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Action Modals */}
      {selectedForBorrow && (
        <BorrowFormModal
          equipment={selectedForBorrow}
          isOpen={true}
          onClose={() => setSelectedForBorrow(null)}
        />
      )}
      {selectedForReport && (
        <ReportIssueModal
          equipment={selectedForReport}
          isOpen={true}
          onClose={() => setSelectedForReport(null)}
        />
      )}
      {selectedForCal && (
        <ScheduleCalibrationModal
          equipment={selectedForCal}
          isOpen={true}
          onClose={() => setSelectedForCal(null)}
        />
      )}
    </div>
  );
}
