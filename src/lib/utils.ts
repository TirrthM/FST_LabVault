import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";
import { EquipmentStatus, EquipmentCondition, MaintenancePriority, MaintenanceStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsed.getTime())) return "Invalid Date";
  return format(parsed, "MMM dd, yyyy");
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsed.getTime())) return "Invalid Date";
  return format(parsed, "MMM dd, yyyy · hh:mm a");
}

export function formatRelativeTime(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsed.getTime())) return "Invalid Date";
  return formatDistanceToNow(parsed, { addSuffix: true });
}

export function getStatusBadgeVariant(status: EquipmentStatus): {
  variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "purple";
  label: string;
  dotColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  switch (status) {
    case "AVAILABLE":
      return {
        variant: "success",
        label: "Available",
        dotColor: "bg-emerald-500",
        bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
        textClass: "text-emerald-700 dark:text-emerald-300",
        borderClass: "border-emerald-200 dark:border-emerald-800",
      };
    case "BORROWED":
      return {
        variant: "info",
        label: "Borrowed",
        dotColor: "bg-blue-500",
        bgClass: "bg-blue-50 dark:bg-blue-950/40",
        textClass: "text-blue-700 dark:text-blue-300",
        borderClass: "border-blue-200 dark:border-blue-800",
      };
    case "RESERVED":
      return {
        variant: "purple",
        label: "Reserved",
        dotColor: "bg-purple-500",
        bgClass: "bg-purple-50 dark:bg-purple-950/40",
        textClass: "text-purple-700 dark:text-purple-300",
        borderClass: "border-purple-200 dark:border-purple-800",
      };
    case "UNDER_MAINTENANCE":
      return {
        variant: "warning",
        label: "In Maintenance",
        dotColor: "bg-amber-500",
        bgClass: "bg-amber-50 dark:bg-amber-950/40",
        textClass: "text-amber-700 dark:text-amber-300",
        borderClass: "border-amber-200 dark:border-amber-800",
      };
    case "UNDER_CALIBRATION":
      return {
        variant: "secondary",
        label: "In Calibration",
        dotColor: "bg-indigo-500",
        bgClass: "bg-indigo-50 dark:bg-indigo-950/40",
        textClass: "text-indigo-700 dark:text-indigo-300",
        borderClass: "border-indigo-200 dark:border-indigo-800",
      };
    case "LOST":
      return {
        variant: "destructive",
        label: "Lost / Missing",
        dotColor: "bg-rose-500",
        bgClass: "bg-rose-50 dark:bg-rose-950/40",
        textClass: "text-rose-700 dark:text-rose-300",
        borderClass: "border-rose-200 dark:border-rose-800",
      };
    case "RETIRED":
      return {
        variant: "outline",
        label: "Retired",
        dotColor: "bg-slate-400",
        bgClass: "bg-slate-100 dark:bg-slate-900/60",
        textClass: "text-slate-600 dark:text-slate-400",
        borderClass: "border-slate-200 dark:border-slate-800",
      };
    default:
      return {
        variant: "outline",
        label: status,
        dotColor: "bg-slate-400",
        bgClass: "bg-slate-100 dark:bg-slate-800",
        textClass: "text-slate-700 dark:text-slate-300",
        borderClass: "border-slate-200 dark:border-slate-700",
      };
  }
}

export function getConditionBadge(condition: EquipmentCondition): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  switch (condition) {
    case "EXCELLENT":
      return {
        label: "Excellent",
        bgClass: "bg-teal-50 dark:bg-teal-950/30",
        textClass: "text-teal-700 dark:text-teal-300",
        borderClass: "border-teal-200 dark:border-teal-800",
      };
    case "GOOD":
      return {
        label: "Good",
        bgClass: "bg-sky-50 dark:bg-sky-950/30",
        textClass: "text-sky-700 dark:text-sky-300",
        borderClass: "border-sky-200 dark:border-sky-800",
      };
    case "FAIR":
      return {
        label: "Fair (Minor Wear)",
        bgClass: "bg-amber-50 dark:bg-amber-950/30",
        textClass: "text-amber-700 dark:text-amber-300",
        borderClass: "border-amber-200 dark:border-amber-800",
      };
    case "DAMAGED":
      return {
        label: "Damaged",
        bgClass: "bg-rose-50 dark:bg-rose-950/30",
        textClass: "text-rose-700 dark:text-rose-300",
        borderClass: "border-rose-200 dark:border-rose-800",
      };
    case "CRITICAL":
      return {
        label: "Critical Condition",
        bgClass: "bg-red-100 dark:bg-red-950/50",
        textClass: "text-red-800 dark:text-red-200",
        borderClass: "border-red-300 dark:border-red-800",
      };
    default:
      return {
        label: condition,
        bgClass: "bg-slate-100 dark:bg-slate-800",
        textClass: "text-slate-700 dark:text-slate-300",
        borderClass: "border-slate-200 dark:border-slate-700",
      };
  }
}

export function getPriorityBadge(priority: MaintenancePriority): {
  label: string;
  bgClass: string;
  textClass: string;
} {
  switch (priority) {
    case "LOW":
      return { label: "Low Priority", bgClass: "bg-slate-100 dark:bg-slate-800", textClass: "text-slate-700 dark:text-slate-300" };
    case "MEDIUM":
      return { label: "Medium", bgClass: "bg-blue-50 dark:bg-blue-950/40", textClass: "text-blue-700 dark:text-blue-300" };
    case "HIGH":
      return { label: "High Priority", bgClass: "bg-amber-50 dark:bg-amber-950/40", textClass: "text-amber-700 dark:text-amber-300" };
    case "URGENT":
      return { label: "Urgent", bgClass: "bg-red-100 dark:bg-red-950/50", textClass: "text-red-700 dark:text-red-300" };
  }
}

export function getCalibrationStatus(nextCalibrationDate: string | undefined): {
  status: "CALIBRATED" | "DUE_SOON" | "OVERDUE" | "NOT_REQUIRED";
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  if (!nextCalibrationDate) {
    return {
      status: "NOT_REQUIRED",
      label: "N/A",
      bgClass: "bg-slate-100 dark:bg-slate-800",
      textClass: "text-slate-600 dark:text-slate-400",
      borderClass: "border-slate-200 dark:border-slate-700",
    };
  }

  const target = new Date(nextCalibrationDate);
  const now = new Date();
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "OVERDUE",
      label: `Overdue (${Math.abs(diffDays)}d ago)`,
      bgClass: "bg-rose-50 dark:bg-rose-950/40",
      textClass: "text-rose-700 dark:text-rose-300",
      borderClass: "border-rose-200 dark:border-rose-800",
    };
  }

  if (diffDays <= 14) {
    return {
      status: "DUE_SOON",
      label: `Due in ${diffDays}d`,
      bgClass: "bg-amber-50 dark:bg-amber-950/40",
      textClass: "text-amber-700 dark:text-amber-300",
      borderClass: "border-amber-200 dark:border-amber-800",
    };
  }

  return {
    status: "CALIBRATED",
    label: "Calibrated",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-200 dark:border-emerald-800",
  };
}
