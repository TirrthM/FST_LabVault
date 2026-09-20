"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema, EquipmentInput } from "@/schemas";
import { addEquipmentAction } from "@/actions/equipment";
import { Lab } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, Cpu } from "lucide-react";

interface AddEquipmentModalProps {
  labs: Lab[];
  isOpen: boolean;
  onClose: () => void;
}

export function AddEquipmentModal({ labs, isOpen, onClose }: AddEquipmentModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EquipmentInput>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      assetId: `LV-EE-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      category: "OSCILLOSCOPES",
      manufacturer: "",
      model: "",
      serialNumber: "",
      labId: labs[0]?.id || "",
      location: "Bench 1",
      purchaseDate: todayStr,
      purchaseCost: 1500,
      warrantyStatus: "IN_WARRANTY",
      condition: "EXCELLENT",
      description: "",
      requiresTraining: false,
    },
  });

  const onSubmit = async (data: EquipmentInput) => {
    setIsSubmitting(true);
    try {
      const result = await addEquipmentAction(data);
      if (!result.success) {
        toast.error("Failed to Commission Equipment", {
          description: result.error || "Validation error.",
        });
      } else {
        toast.success("Equipment Commissioned", {
          description: `Asset ${data.assetId} (${data.name}) added to laboratory inventory.`,
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Cpu className="h-5 w-5 text-primary" />
            <span>Commission New Laboratory Equipment</span>
          </DialogTitle>
          <DialogDescription>
            Register a new engineering instrument into the LabVault custody registry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Asset ID */}
            <div className="space-y-1">
              <Label htmlFor="assetId" className="text-xs font-medium">
                Asset ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assetId"
                {...register("assetId")}
                className={errors.assetId ? "border-destructive font-mono" : "font-mono"}
              />
              {errors.assetId && <p className="text-[11px] text-destructive">{errors.assetId.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Category <span className="text-destructive">*</span></Label>
              <Select defaultValue="OSCILLOSCOPES" onValueChange={(val: any) => setValue("category", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OSCILLOSCOPES">Oscilloscopes</SelectItem>
                  <SelectItem value="POWER_SUPPLIES">Power Supplies</SelectItem>
                  <SelectItem value="SIGNAL_GENERATORS">Signal Generators</SelectItem>
                  <SelectItem value="MULTIMETERS">Digital Multimeters</SelectItem>
                  <SelectItem value="SPECTRUM_ANALYZERS">Spectrum / VNA Analyzers</SelectItem>
                  <SelectItem value="MICROCONTROLLERS">Microcontrollers & Logic</SelectItem>
                  <SelectItem value="ROBOTICS">Robotics & Actuators</SelectItem>
                  <SelectItem value="COMPUTING_AI">AI Compute / Workstations</SelectItem>
                  <SelectItem value="OPTICAL_MICROSCOPES">Optical & 3D Microscopes</SelectItem>
                  <SelectItem value="SOLDERING_REWORK">Soldering & Rework</SelectItem>
                  <SelectItem value="SENSORS_IOT">Sensors & IoT</SelectItem>
                  <SelectItem value="OTHER">Other Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-medium">
              Equipment Commercial Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Keysight Infiniium 4-Channel 1GHz Digital Storage Oscilloscope"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Manufacturer */}
            <div className="space-y-1">
              <Label htmlFor="manufacturer" className="text-xs font-medium">
                Manufacturer <span className="text-destructive">*</span>
              </Label>
              <Input id="manufacturer" placeholder="e.g. Tektronix" {...register("manufacturer")} />
            </div>

            {/* Model */}
            <div className="space-y-1">
              <Label htmlFor="model" className="text-xs font-medium">
                Model <span className="text-destructive">*</span>
              </Label>
              <Input id="model" placeholder="e.g. MSO44" {...register("model")} />
            </div>

            {/* Serial Number */}
            <div className="space-y-1">
              <Label htmlFor="serialNumber" className="text-xs font-medium">
                Serial Number <span className="text-destructive">*</span>
              </Label>
              <Input id="serialNumber" placeholder="e.g. SN-882914" {...register("serialNumber")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lab */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Assigned Laboratory <span className="text-destructive">*</span></Label>
              <Select defaultValue={labs[0]?.id} onValueChange={(val: any) => setValue("labId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Lab" />
                </SelectTrigger>
                <SelectContent>
                  {labs.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name} ({l.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <Label htmlFor="location" className="text-xs font-medium">
                Bench / Shelf Location <span className="text-destructive">*</span>
              </Label>
              <Input id="location" placeholder="e.g. Bench 04, Rack A" {...register("location")} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs font-medium">
              Technical Description & Capabilities <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Summary of bandwidth, sample rate, voltage limits, and accessories..."
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-[11px] text-destructive">{errors.description.message}</p>}
          </div>

          {/* Training check */}
          <div className="flex items-center gap-2 rounded-md bg-muted/40 p-3 border">
            <input
              type="checkbox"
              id="requiresTraining"
              {...register("requiresTraining")}
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            <Label htmlFor="requiresTraining" className="text-xs font-medium cursor-pointer">
              Requires certified student safety training before borrowing is permitted
            </Label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Commission Asset</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
