"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleCalibrationSchema, ScheduleCalibrationInput } from "@/schemas";
import { scheduleCalibrationAction } from "@/actions/calibration";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Gauge, CheckCircle2 } from "lucide-react";

interface ScheduleCalibrationModalProps {
  equipment: EquipmentItem;
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleCalibrationModal({
  equipment,
  isOpen,
  onClose,
}: ScheduleCalibrationModalProps) {
  const { currentUser } = useUserRoleStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearStr = nextYear.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ScheduleCalibrationInput>({
    resolver: zodResolver(scheduleCalibrationSchema),
    defaultValues: {
      equipmentId: equipment.id,
      standardUsed: "Fluke 9500B / 5730A NIST Traceable Calibrator",
      calibrationDate: todayStr,
      nextDueDate: nextYearStr,
      technicianName: currentUser.name,
      technicianCompany: "Precision Metrology Core Facility",
      result: "PASS",
      certificateNumber: `CERT-NIST-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      toleranceRange: "±1.0% Full Scale Range",
      measuredError: "+0.18% max offset",
      notes: "Instrument meets all manufacturer specifications.",
    },
  });

  const onSubmit = async (data: ScheduleCalibrationInput) => {
    setIsSubmitting(true);
    try {
      const result = await scheduleCalibrationAction(data);
      if (!result.success) {
        toast.error("Failed to Record Calibration", {
          description: result.error || "Server error.",
        });
      } else {
        toast.success("Calibration Recorded", {
          description: `ISO-17025 certificate ${data.certificateNumber} logged for ${equipment.assetId}.`,
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Gauge className="h-5 w-5 text-indigo-600" />
            <span>Record ISO-17025 Metrology Calibration</span>
          </DialogTitle>
          <DialogDescription>
            Certify traceable calibration standard for{" "}
            <span className="font-semibold text-foreground">{equipment.name}</span> ({equipment.assetId}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("equipmentId")} />
          <input type="hidden" {...register("technicianName")} />

          {/* Standard Used */}
          <div className="space-y-1">
            <Label htmlFor="standardUsed" className="text-xs font-medium">
              Calibration Standard / Transfer Reference <span className="text-destructive">*</span>
            </Label>
            <Input
              id="standardUsed"
              {...register("standardUsed")}
              className={errors.standardUsed ? "border-destructive" : ""}
            />
            {errors.standardUsed && (
              <p className="text-[11px] text-destructive mt-1">{errors.standardUsed.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="calibrationDate" className="text-xs font-medium">
                Calibration Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="calibrationDate"
                type="date"
                {...register("calibrationDate")}
                className={errors.calibrationDate ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="nextDueDate" className="text-xs font-medium">
                Next Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nextDueDate"
                type="date"
                {...register("nextDueDate")}
                className={errors.nextDueDate ? "border-destructive" : ""}
              />
            </div>
          </div>

          {/* Result & Certificate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Result</Label>
              <Select
                defaultValue="PASS"
                onValueChange={(val: any) => setValue("result", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PASS">PASS (Within Tolerance)</SelectItem>
                  <SelectItem value="ADJUSTED_AND_PASSED">Adjusted & Passed</SelectItem>
                  <SelectItem value="FAIL_OUT_OF_TOLERANCE">FAIL (Out of Tolerance)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="certificateNumber" className="text-xs font-medium">
                Certificate # <span className="text-destructive">*</span>
              </Label>
              <Input
                id="certificateNumber"
                {...register("certificateNumber")}
                className={errors.certificateNumber ? "border-destructive" : ""}
              />
            </div>
          </div>

          {/* Tolerance & Measured Error */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="toleranceRange" className="text-xs font-medium">
                Tolerance Spec (e.g. ±0.1%)
              </Label>
              <Input id="toleranceRange" {...register("toleranceRange")} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="measuredError" className="text-xs font-medium">
                Measured Max Error
              </Label>
              <Input id="measuredError" {...register("measuredError")} />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs font-medium">
              Metrologist Comments
            </Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Record Certificate</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
