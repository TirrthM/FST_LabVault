"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { borrowEquipmentSchema, BorrowEquipmentInput } from "@/schemas";
import { createBorrowRequestAction } from "@/actions/borrow";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertCircle, Calendar, CheckCircle2, ShieldAlert } from "lucide-react";

interface BorrowFormModalProps {
  equipment: EquipmentItem;
  isOpen: boolean;
  onClose: () => void;
  onOptimisticSubmit?: (optimisticRequest: any) => void;
}

export function BorrowFormModal({
  equipment,
  isOpen,
  onClose,
  onOptimisticSubmit,
}: BorrowFormModalProps) {
  const { currentUser, currentRole } = useUserRoleStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Tomorrow as default start
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const startStr = defaultStart.toISOString().split("T")[0];

  const defaultEnd = new Date();
  defaultEnd.setDate(defaultEnd.getDate() + 7);
  const endStr = defaultEnd.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BorrowEquipmentInput>({
    resolver: zodResolver(borrowEquipmentSchema),
    defaultValues: {
      equipmentId: equipment.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentRole,
      purpose: "",
      projectCourseName: "",
      requestedStartDate: startStr,
      requestedEndDate: endStr,
      agreeToTerms: false,
    },
  });

  // Keep user sync if switched
  React.useEffect(() => {
    reset({
      equipmentId: equipment.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentRole,
      purpose: "",
      projectCourseName: "",
      requestedStartDate: startStr,
      requestedEndDate: endStr,
      agreeToTerms: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, currentRole, equipment, reset]);

  const onSubmit = async (data: BorrowEquipmentInput) => {
    setIsSubmitting(true);
    setServerError(null);

    // Optimistic UI callback (Topic: Optimistic UI Demonstration)
    const optimisticId = `opt_${Date.now()}`;
    const optimisticPayload = {
      id: optimisticId,
      equipmentId: equipment.id,
      equipmentAssetId: equipment.assetId,
      equipmentName: equipment.name,
      equipmentCategory: equipment.category,
      labId: equipment.labId,
      labName: equipment.labName,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentRole,
      userDept: currentUser.department,
      purpose: data.purpose,
      projectCourseName: data.projectCourseName,
      requestedStartDate: data.requestedStartDate,
      requestedEndDate: data.requestedEndDate,
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true,
    };

    if (onOptimisticSubmit) {
      onOptimisticSubmit(optimisticPayload);
    }

    try {
      const result = await createBorrowRequestAction(data);
      if (!result.success) {
        setServerError(result.error || "Failed to submit request.");
        toast.error("Submission Failed", {
          description: result.error || "Server rejected the borrow request.",
        });
      } else {
        toast.success("Borrow Request Submitted", {
          description: `Request for ${equipment.name} received. Pending Lab Manager approval.`,
        });
        reset();
        onClose();
      }
    } catch (err: any) {
      setServerError(err.message || "Network error submitting borrow request.");
      toast.error("Network Error", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Equipment Borrow Request</span>
          </DialogTitle>
          <DialogDescription>
            Submit an academic custody requisition for{" "}
            <span className="font-semibold text-foreground">{equipment.name}</span> ({equipment.assetId}).
          </DialogDescription>
        </DialogHeader>

        {equipment.requiresTraining && (
          <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold">Mandatory Lab Training Required</p>
              <p className="mt-0.5 text-[11px] leading-tight">
                {equipment.trainingModule || "Standard High-Frequency Instrument Safety Module"}. Submitting verifies compliance.
              </p>
            </div>
          </div>
        )}

        {serverError && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("equipmentId")} />
          <input type="hidden" {...register("userId")} />
          <input type="hidden" {...register("userRole")} />

          {/* User Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-md bg-muted/40 border text-xs">
            <div>
              <span className="text-muted-foreground">Requester Name:</span>
              <p className="font-semibold text-foreground">{currentUser.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Institutional Email:</span>
              <p className="font-semibold text-foreground">{currentUser.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Role / ID:</span>
              <p className="font-semibold text-foreground">{currentRole} ({currentUser.studentOrEmployeeId})</p>
            </div>
            <div>
              <span className="text-muted-foreground">Lab Home:</span>
              <p className="font-semibold text-foreground">{equipment.labName}</p>
            </div>
          </div>

          {/* Course / Project ID */}
          <div className="space-y-1">
            <Label htmlFor="projectCourseName" className="text-xs font-medium">
              Course / Project Identifier <span className="text-destructive">*</span>
            </Label>
            <Input
              id="projectCourseName"
              placeholder="e.g. EE490 Senior Capstone or UAV Radar Project"
              {...register("projectCourseName")}
              className={errors.projectCourseName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.projectCourseName && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors.projectCourseName.message}
              </p>
            )}
          </div>

          {/* Date range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="requestedStartDate" className="text-xs font-medium">
                Requested Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="requestedStartDate"
                type="date"
                {...register("requestedStartDate")}
                className={errors.requestedStartDate ? "border-destructive" : ""}
              />
              {errors.requestedStartDate && (
                <p className="text-[11px] font-medium text-destructive mt-1">
                  {errors.requestedStartDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="requestedEndDate" className="text-xs font-medium">
                Scheduled Return Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="requestedEndDate"
                type="date"
                {...register("requestedEndDate")}
                className={errors.requestedEndDate ? "border-destructive" : ""}
              />
              {errors.requestedEndDate && (
                <p className="text-[11px] font-medium text-destructive mt-1">
                  {errors.requestedEndDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1">
            <Label htmlFor="purpose" className="text-xs font-medium">
              Academic Purpose & Technical Justification <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="purpose"
              rows={3}
              placeholder="Provide a detailed explanation of the experiments, signals, or tasks this asset is needed for..."
              {...register("purpose")}
              className={errors.purpose ? "border-destructive" : ""}
            />
            {errors.purpose && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors.purpose.message}
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-muted-foreground">
              <input
                type="checkbox"
                {...register("agreeToTerms")}
                className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4"
              />
              <span>
                I agree to laboratory custody policies, agree to return the item on or before the due date, and will immediately report any malfunctions or damage.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Requisition</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
