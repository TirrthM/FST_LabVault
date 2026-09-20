import * as React from "react";
import { AuditEvent } from "@/types";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Wrench,
  Gauge,
  AlertTriangle,
  UserCheck,
  PackagePlus,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LifecycleTimelineProps {
  events: AuditEvent[];
  emptyMessage?: string;
}

export function LifecycleTimeline({
  events,
  emptyMessage = "No lifecycle events recorded for this asset yet.",
}: LifecycleTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const getEventIcon = (type: AuditEvent["eventType"]) => {
    switch (type) {
      case "EQUIPMENT_CREATED":
        return <PackagePlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "BORROW_REQUESTED":
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "BORROW_APPROVED":
        return <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case "EQUIPMENT_CHECKED_OUT":
        return <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case "EQUIPMENT_RETURNED":
      case "INSPECTION_RECORDED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "DAMAGE_REPORTED":
      case "STATUS_CHANGED":
        return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "MAINTENANCE_SCHEDULED":
      case "MAINTENANCE_STATUS_UPDATED":
      case "MAINTENANCE_COMPLETED":
        return <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "CALIBRATION_COMPLETED":
        return <Gauge className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
      default:
        return <ArrowRightLeft className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border space-y-6">
      {events.map((evt, index) => (
        <div key={evt.id || index} className="relative group">
          {/* Node dot */}
          <div className="absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-xs transition-transform group-hover:scale-110">
            {getEventIcon(evt.eventType)}
          </div>

          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-xs transition-colors hover:border-primary/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{evt.title}</span>
                <Badge variant="outline" className="text-[10px] py-0">
                  {evt.actorRole}
                </Badge>
              </div>
              <time
                dateTime={evt.timestamp}
                className="text-xs text-muted-foreground whitespace-nowrap"
                title={formatDateTime(evt.timestamp)}
              >
                {formatRelativeTime(evt.timestamp)}
              </time>
            </div>

            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              {evt.description}
            </p>

            <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="font-medium text-foreground">Actor:</span> {evt.actorName}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/80">
                {formatDateTime(evt.timestamp)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
