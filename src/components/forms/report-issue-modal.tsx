"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportIssueSchema, ReportIssueInput } from "@/schemas";
import { reportEquipmentIssueAction } from "@/actions/maintenance";
import { EquipmentItem } from "@/types";
import { useUserRoleStore } from "@/stores/user-role-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Wrench, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ReportIssueModalProps {
  equipment: EquipmentItem;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportIssueModal({
  equipment,
  isOpen,
  onClose,
}: ReportIssueModalProps) {
  const { currentUser } = useUserRoleStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReportIssueInput>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      equipmentId: equipment.id,
      reportedById: currentUser.id,
      reportedByName: currentUser.name,
      issueCategory: "HARDWARE_FAULT",
      priority: "MEDIUM",
      observedCondition: "FAIR",
      issueDescription: "",
      immediateSafetyHazard: false,
    },
  });

  const onSubmit = async (data: ReportIssueInput) => {
    setIsSubmitting(true);
    try {
      const result = await reportEquipmentIssueAction(data);
      if (!result.success) {
        toast.error("Failed to Report Issue", {
          description: result.error || "Server rejected the issue ticket.",
        });
      } else {
        toast.success("Maintenance Ticket Created", {
          description: `Issue logged for ${equipment.assetId}. Assigned to technician queue.`,
        });
        reset();
        onClose();
      }
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Report Equipment Issue / Damage</span>
          </DialogTitle>
          <DialogDescription>
            Flag malfunction, physical damage, or drift for{" "}
            <span className="font-semibold text-foreground">{equipment.name}</span> ({equipment.assetId}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("equipmentId")} />
          <input type="hidden" {...register("reportedById")} />
          <input type="hidden" {...register("reportedByName")} />

          {/* Issue Category */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Issue Category</Label>
            <Select
              defaultValue="HARDWARE_FAULT"
              onValueChange={(val: any) => setValue("issueCategory", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HARDWARE_FAULT">Hardware Fault (Power, Ports, Logic)</SelectItem>
                <SelectItem value="CALIBRATION_DRIFT">Calibration Drift / Inaccurate Readings</SelectItem>
                <SelectItem value="PHYSICAL_DAMAGE">Physical Damage / Broken Enclosure</SelectItem>
                <SelectItem value="SOFTWARE_FIRMWARE">Firmware / Software Crash</SelectItem>
                <SelectItem value="ROUTINE_SERVICE">Routine Maintenance / Preventive Service</SelectItem>
                <SelectItem value="ACCESSORY_MISSING">Missing Accessory / Cable / Probe</SelectItem>
              </SelectContent>
            </Select>
            {errors.issueCategory && (
              <p className="text-[11px] text-destructive mt-1">{errors.issueCategory.message}</p>
            )}
          </div>

          {/* Priority & Observed Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Priority Level</Label>
              <Select
                defaultValue="MEDIUM"
                onValueChange={(val: any) => setValue("priority", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low (Cosmetic / Minor)</SelectItem>
                  <SelectItem value="MEDIUM">Medium (Degraded Performance)</SelectItem>
                  <SelectItem value="HIGH">High (Major Feature Inoperable)</SelectItem>
                  <SelectItem value="URGENT">Urgent (Safety / Complete Lockout)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Observed Condition</Label>
              <Select
                defaultValue="FAIR"
                onValueChange={(val: any) => setValue("observedCondition", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GOOD">Good (Operational)</SelectItem>
                  <SelectItem value="FAIR">Fair (Minor Glitches)</SelectItem>
                  <SelectItem value="DAMAGED">Damaged (Needs Repair)</SelectItem>
                  <SelectItem value="CRITICAL">Critical (Unsafe)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-1">
            <Label htmlFor="issueDescription" className="text-xs font-medium">
              Diagnostic & Symptom Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="issueDescription"
              rows={4}
              placeholder="Describe what happened: error codes displayed, smoke/smell, loose connectors, dropped equipment, etc."
              {...register("issueDescription")}
              className={errors.issueDescription ? "border-destructive" : ""}
            />
            {errors.issueDescription && (
              <p className="text-[11px] text-destructive mt-1">
                {errors.issueDescription.message}
              </p>
            )}
          </div>

          {/* Immediate Safety Hazard */}
          <div className="flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-3">
            <input
              type="checkbox"
              id="immediateSafetyHazard"
              {...register("immediateSafetyHazard")}
              className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
            />
            <Label htmlFor="immediateSafetyHazard" className="text-xs font-semibold text-amber-900 dark:text-amber-200 cursor-pointer">
              Immediate Safety Hazard (High Voltage, Burn Risk, Mechanical Pinch)
            </Label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <span>Logging Ticket...</span>
              ) : (
                <>
                  <Wrench className="h-4 w-4" />
                  <span>Log Maintenance Ticket</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
