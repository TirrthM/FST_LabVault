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
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorrowFormModal } from "@/components/forms/borrow-form-modal";
import { ReportIssueModal } from "@/components/forms/report-issue-modal";
import { useEquipmentFilterStore } from "@/stores/equipment-filter-store";
import {
  Cpu,
  Bookmark,
  BookmarkCheck,
  Building2,
  MapPin,
  Calendar,
  Wrench,
  Gauge,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface EquipmentCardProps {
  equipment: EquipmentItem;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const [borrowModalOpen, setBorrowModalOpen] = React.useState(false);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);

  const savedIds = useEquipmentFilterStore((s) => s.savedEquipmentIds);
  const toggleSaved = useEquipmentFilterStore((s) => s.toggleSavedEquipment);
  const isSaved = savedIds.includes(equipment.id);

  const statusBadge = getStatusBadgeVariant(equipment.status);
  const conditionBadge = getConditionBadge(equipment.condition);
  const calStatus = getCalibrationStatus(equipment.nextCalibrationDate);

  return (
    <>
      <Card className="group relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40">
        <div>
          {/* Card Header with Category and Bookmark */}
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {equipment.assetId}
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusBadge.bgClass} ${statusBadge.textClass} ${statusBadge.borderClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dotColor}`} />
                  {statusBadge.label}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSaved(equipment.id)}
                className="h-7 w-7 text-muted-foreground hover:text-primary shrink-0"
                aria-label={isSaved ? "Remove bookmark" : "Bookmark equipment"}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary fill-primary/20" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Link href={`/equipment/${equipment.id}`} className="hover:underline mt-1 block">
              <h4 className="font-semibold text-sm leading-snug text-foreground line-clamp-2">
                {equipment.name}
              </h4>
            </Link>

            <p className="text-xs text-muted-foreground">
              {equipment.manufacturer} · {equipment.model}
            </p>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-4 pt-1 space-y-2.5 text-xs">
            {/* Lab & Location */}
            <div className="space-y-1 text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                <span className="truncate">{equipment.labName}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                <span className="truncate">{equipment.location}</span>
              </div>
            </div>

            {/* Custodian tag if borrowed */}
            {equipment.status === "BORROWED" && equipment.currentCustodianName && (
              <div className="rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 p-2 text-[11px] text-blue-900 dark:text-blue-200">
                <span className="font-medium">In Custody of:</span> {equipment.currentCustodianName} ({equipment.currentCustodianRole})
              </div>
            )}

            {/* Badges row: Condition & Calibration */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${conditionBadge.bgClass} ${conditionBadge.textClass} ${conditionBadge.borderClass}`}>
                {conditionBadge.label}
              </span>

              {equipment.nextCalibrationDate && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded border flex items-center gap-1 ${calStatus.bgClass} ${calStatus.textClass} ${calStatus.borderClass}`}>
                  <Gauge className="h-2.5 w-2.5" />
                  <span>Cal: {calStatus.label}</span>
                </span>
              )}

              {equipment.requiresTraining && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded border bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800 flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Training Req.</span>
                </span>
              )}
            </div>
          </CardContent>
        </div>

        {/* Card Footer with Quick Actions */}
        <CardFooter className="p-4 pt-2 border-t bg-muted/10 flex items-center justify-between gap-2">
          <Link href={`/equipment/${equipment.id}`}>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1 group-hover:border-primary/40">
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>

          <div className="flex items-center gap-1.5">
            {equipment.status === "AVAILABLE" ? (
              <Button
                size="sm"
                onClick={() => setBorrowModalOpen(true)}
                className="h-8 text-xs font-medium"
              >
                Request Borrow
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReportModalOpen(true)}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                Report Issue
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Action Modals */}
      <BorrowFormModal
        equipment={equipment}
        isOpen={borrowModalOpen}
        onClose={() => setBorrowModalOpen(false)}
      />
      <ReportIssueModal
        equipment={equipment}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </>
  );
}
