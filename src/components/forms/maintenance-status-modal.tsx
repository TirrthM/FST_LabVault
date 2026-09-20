"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMaintenanceStatusSchema, UpdateMaintenanceStatusInput } from "@/schemas";
import { updateMaintenanceStatusAction } from "@/actions/maintenance";
import { MaintenanceTicket } from "@/types";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Wrench, CheckCircle } from "lucide-react";

interface MaintenanceStatusModalProps {
  ticket: MaintenanceTicket;
  isOpen: boolean;
  onClose: () => void;
}

export function MaintenanceStatusModal({
  ticket,
  isOpen,
  onClose,
}: MaintenanceStatusModalProps) {
  const { currentUser } = useUserRoleStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateMaintenanceStatusInput>({
    resolver: zodResolver(updateMaintenanceStatusSchema),
    defaultValues: {
      ticketId: ticket.id,
      status: ticket.status === "OPEN" ? "ASSIGNED" : ticket.status === "ASSIGNED" ? "IN_REPAIR" : "RESOLVED",
      technicianName: currentUser.name,
      technicianNotes: "",
      partsReplaced: "",
      repairCost: 0,
      returnToServiceCondition: "GOOD",
    },
  });

  const selectedStatus = watch("status");

  const onSubmit = async (data: UpdateMaintenanceStatusInput) => {
    setIsSubmitting(true);
    try {
      const result = await updateMaintenanceStatusAction(data);
      if (!result.success) {
        toast.error("Failed to Update Ticket", {
          description: result.error || "Server rejected the update.",
        });
      } else {
        toast.success("Maintenance Work Order Updated", {
          description: `Ticket ${ticket.ticketNumber} updated to ${data.status}.`,
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
            <Wrench className="h-5 w-5 text-amber-600" />
            <span>Update Maintenance Status ({ticket.ticketNumber})</span>
          </DialogTitle>
          <DialogDescription>
            Record work order progression for{" "}
            <span className="font-semibold text-foreground">{ticket.equipmentName}</span> ({ticket.equipmentAssetId}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("ticketId")} />
          <input type="hidden" {...register("technicianName")} />

          {/* Status Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">New Status Step</Label>
            <Select
              defaultValue={ticket.status === "OPEN" ? "ASSIGNED" : ticket.status === "ASSIGNED" ? "IN_REPAIR" : "RESOLVED"}
              onValueChange={(val: any) => setValue("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASSIGNED">ASSIGNED (Technician Claimed)</SelectItem>
                <SelectItem value="IN_REPAIR">IN_REPAIR (Work In Progress)</SelectItem>
                <SelectItem value="TESTING">TESTING (Bench Quality Checks)</SelectItem>
                <SelectItem value="RESOLVED">RESOLVED (Return to Service)</SelectItem>
                <SelectItem value="REJECTED">REJECTED (Decommission / Write-Off)</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-[11px] text-destructive mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Technician Notes */}
          <div className="space-y-1">
            <Label htmlFor="technicianNotes" className="text-xs font-medium">
              Technician Diagnostic & Repair Notes <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="technicianNotes"
              rows={3}
              placeholder="Detail parts tested, solder joints reflowed, components replaced, or reasons for status change..."
              {...register("technicianNotes")}
              className={errors.technicianNotes ? "border-destructive" : ""}
            />
            {errors.technicianNotes && (
              <p className="text-[11px] text-destructive mt-1">
                {errors.technicianNotes.message}
              </p>
            )}
          </div>

          {/* Parts Replaced & Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="partsReplaced" className="text-xs font-medium">
                Parts Replaced (comma separated)
              </Label>
              <Input
                id="partsReplaced"
                placeholder="e.g. BNC Jack, Op-Amp IC"
                {...register("partsReplaced")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="repairCost" className="text-xs font-medium">
                Repair Cost ($ USD)
              </Label>
              <Input
                id="repairCost"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                {...register("repairCost", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Return condition if resolving */}
          {selectedStatus === "RESOLVED" && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-md space-y-1.5">
              <Label className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                Post-Repair Equipment Condition (Return to Service)
              </Label>
              <Select
                defaultValue="GOOD"
                onValueChange={(val: any) => setValue("returnToServiceCondition", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCELLENT">Excellent (Like New)</SelectItem>
                  <SelectItem value="GOOD">Good (Fully Operational)</SelectItem>
                  <SelectItem value="FAIR">Fair (Operational with minor cosmetic blemishes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Update Work Order</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
