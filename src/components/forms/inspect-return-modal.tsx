"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inspectReturnSchema, InspectReturnInput } from "@/schemas";
import { inspectAndReturnAction } from "@/actions/borrow";
import { BorrowRequest } from "@/types";
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
import { CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";

interface InspectReturnModalProps {
  request: BorrowRequest;
  isOpen: boolean;
  onClose: () => void;
}

export function InspectReturnModal({
  request,
  isOpen,
  onClose,
}: InspectReturnModalProps) {
  const { currentUser } = useUserRoleStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InspectReturnInput>({
    resolver: zodResolver(inspectReturnSchema),
    defaultValues: {
      requestId: request.id,
      equipmentId: request.equipmentId,
      inspectedById: currentUser.id,
      inspectedByName: currentUser.name,
      returnCondition: "GOOD",
      inspectionNotes: "All standard probes and power cords returned. Passed baseline self-test.",
      requiresMaintenance: false,
    },
  });

  const condition = watch("returnCondition");

  const onSubmit = async (data: InspectReturnInput) => {
    setIsSubmitting(true);
    try {
      const result = await inspectAndReturnAction(data);
      if (!result.success) {
        toast.error("Failed to Inspect Return", {
          description: result.error || "Server error.",
        });
      } else {
        toast.success("Return Inspection Verified", {
          description: `Custody released from ${request.userName}. Status restored.`,
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
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Inspect & Process Equipment Return</span>
          </DialogTitle>
          <DialogDescription>
            Verify condition and release physical custody for{" "}
            <span className="font-semibold text-foreground">{request.equipmentName}</span> ({request.equipmentAssetId}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("requestId")} />
          <input type="hidden" {...register("equipmentId")} />
          <input type="hidden" {...register("inspectedById")} />
          <input type="hidden" {...register("inspectedByName")} />

          <div className="p-3 bg-muted/40 border rounded-md text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Borrower:</span>
              <span className="font-medium text-foreground">{request.userName} ({request.userRole})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requisition:</span>
              <span className="font-mono text-foreground">#{request.id}</span>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Inspected Return Condition</Label>
            <Select
              defaultValue="GOOD"
              onValueChange={(val: any) => {
                setValue("returnCondition", val);
                if (val === "DAMAGED" || val === "CRITICAL") {
                  setValue("requiresMaintenance", true);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCELLENT">EXCELLENT (Like New, Cleaned)</SelectItem>
                <SelectItem value="GOOD">GOOD (Normal Expected Wear)</SelectItem>
                <SelectItem value="FAIR">FAIR (Minor Smudges/Cables Knotted)</SelectItem>
                <SelectItem value="DAMAGED">DAMAGED (Hardware Fault / Enclosure Broken)</SelectItem>
                <SelectItem value="CRITICAL">CRITICAL (Unsafe / Non-functional)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="inspectionNotes" className="text-xs font-medium">
              Inspection Checklist & Notes <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="inspectionNotes"
              rows={3}
              placeholder="Verify power up, display test, included accessories, clean casing..."
              {...register("inspectionNotes")}
              className={errors.inspectionNotes ? "border-destructive" : ""}
            />
            {errors.inspectionNotes && (
              <p className="text-[11px] text-destructive mt-1">{errors.inspectionNotes.message}</p>
            )}
          </div>

          {/* Requires Maintenance Check */}
          {(condition === "DAMAGED" || condition === "CRITICAL") && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-md text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Equipment condition is degraded. An automatic Maintenance Ticket will be generated and asset status set to <strong>UNDER_MAINTENANCE</strong>.
              </span>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete Return</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
