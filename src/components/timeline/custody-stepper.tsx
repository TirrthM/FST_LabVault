import * as React from "react";
import { BorrowStatus, EquipmentStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Check, Clock, AlertCircle } from "lucide-react";

interface CustodyStepperProps {
  currentStatus: EquipmentStatus;
  borrowStatus?: BorrowStatus;
}

const STEPS = [
  { key: "ACQUISITION", label: "Acquired" },
  { key: "AVAILABLE", label: "In Service" },
  { key: "BORROWED", label: "In Custody" },
  { key: "RETURNED", label: "Inspected" },
  { key: "CALIBRATED", label: "Calibrated" },
];

export function CustodyStepper({ currentStatus, borrowStatus }: CustodyStepperProps) {
  const getStepState = (index: number) => {
    if (currentStatus === "AVAILABLE") {
      return index <= 1 ? "completed" : "upcoming";
    }
    if (currentStatus === "BORROWED") {
      return index <= 2 ? "active" : "upcoming";
    }
    if (currentStatus === "UNDER_MAINTENANCE" || currentStatus === "UNDER_CALIBRATION") {
      return index === 2 ? "warning" : index < 2 ? "completed" : "upcoming";
    }
    return "completed";
  };

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const state = getStepState(idx);
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border transition-all",
                    state === "completed" && "bg-primary text-primary-foreground border-primary",
                    state === "active" && "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200 dark:ring-blue-900",
                    state === "warning" && "bg-amber-500 text-white border-amber-500",
                    state === "upcoming" && "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {state === "completed" ? (
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  ) : state === "active" ? (
                    <Clock className="h-3.5 w-3.5 animate-pulse" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-muted-foreground text-center">
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 -mt-5 transition-colors",
                    state === "completed" ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
