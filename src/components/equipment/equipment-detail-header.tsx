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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BorrowFormModal } from "@/components/forms/borrow-form-modal";
import { ReportIssueModal } from "@/components/forms/report-issue-modal";
import { ScheduleCalibrationModal } from "@/components/forms/schedule-calibration-modal";
import {
  Cpu,
  Building2,
  MapPin,
  Calendar,
  Wrench,
  Gauge,
  Share2,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useEquipmentFilterStore } from "@/stores/equipment-filter-store";
import { toast } from "sonner";

interface EquipmentDetailHeaderProps {
  equipment: EquipmentItem;
}

export function EquipmentDetailHeader({ equipment }: EquipmentDetailHeaderProps) {
  const [borrowModalOpen, setBorrowModalOpen] = React.useState(false);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [calModalOpen, setCalModalOpen] = React.useState(false);

  const savedIds = useEquipmentFilterStore((s) => s.savedEquipmentIds);
  const toggleSaved = useEquipmentFilterStore((s) => s.toggleSavedEquipment);
  const isSaved = savedIds.includes(equipment.id);

  const statusBadge = getStatusBadgeVariant(equipment.status);
  const conditionBadge = getConditionBadge(equipment.condition);
  const calStatus = getCalibrationStatus(equipment.nextCalibrationDate);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied", {
        description: `Direct custody link for ${equipment.assetId} copied to clipboard.`,
      });
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-card p-6 shadow-xs space-y-6">
        {/* Top bar: Asset ID, Badges, and Utility actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
              {equipment.assetId}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusBadge.bgClass} ${statusBadge.textClass} ${statusBadge.borderClass}`}>
              <span className={`h-2 w-2 rounded-full ${statusBadge.dotColor}`} />
              {statusBadge.label}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${conditionBadge.bgClass} ${conditionBadge.textClass} ${conditionBadge.borderClass}`}>
              Condition: {conditionBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 gap-1.5 text-xs"
              aria-label="Share equipment link"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSaved(equipment.id)}
              className="h-8 gap-1.5 text-xs"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Bookmarked</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Bookmark</span>
                </>
              )}
            </Button>
            <a
              href={`/api/og/equipment/${equipment.id}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground">
                <span>View OG Card</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>

        {/* Title, Manufacturer, Model & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {equipment.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span><strong>Manufacturer:</strong> {equipment.manufacturer}</span>
            <span>·</span>
            <span><strong>Model:</strong> {equipment.model}</span>
            <span>·</span>
            <span><strong>Serial:</strong> <code className="font-mono">{equipment.serialNumber}</code></span>
            <span>·</span>
            <span><strong>Category:</strong> {equipment.category}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pt-1 max-w-4xl">
            {equipment.description}
          </p>
        </div>

        {/* Metadata stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/30 border text-xs">
          <div>
            <span className="text-muted-foreground">Laboratory Home</span>
            <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">{equipment.labName}</span>
            </p>
          </div>

          <div>
            <span className="text-muted-foreground">Bench Location</span>
            <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{equipment.location}</span>
            </p>
          </div>

          <div>
            <span className="text-muted-foreground">Calibration Status</span>
            <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{calStatus.label}</span>
            </p>
          </div>

          <div>
            <span className="text-muted-foreground">Warranty</span>
            <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{equipment.warrantyStatus}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t">
          {equipment.status === "AVAILABLE" ? (
            <Button
              size="default"
              onClick={() => setBorrowModalOpen(true)}
              className="gap-2 shadow-sm font-semibold"
            >
              <Calendar className="h-4 w-4" />
              <span>Request to Borrow</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled
              className="gap-2 text-muted-foreground"
            >
              <span>Asset Currently {equipment.status}</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setReportModalOpen(true)}
            className="gap-2 text-foreground hover:text-destructive"
          >
            <Wrench className="h-4 w-4 text-amber-600" />
            <span>Report Malfunction / Issue</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setCalModalOpen(true)}
            className="gap-2 text-foreground hover:text-teal-600"
          >
            <Gauge className="h-4 w-4 text-teal-600" />
            <span>Record ISO Calibration</span>
          </Button>
        </div>
      </div>

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
      <ScheduleCalibrationModal
        equipment={equipment}
        isOpen={calModalOpen}
        onClose={() => setCalModalOpen(false)}
      />
    </>
  );
}
