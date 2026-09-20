import * as React from "react";
import { EquipmentItem, BorrowRequest } from "@/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustodyStepper } from "@/components/timeline/custody-stepper";
import { Badge } from "@/components/ui/badge";
import { UserCheck, ShieldAlert, Clock, Building2, MapPin } from "lucide-react";

interface CustodyCardProps {
  equipment: EquipmentItem;
  activeBorrow?: BorrowRequest | null;
}

export function CustodyCard({ equipment, activeBorrow }: CustodyCardProps) {
  return (
    <Card className="border shadow-xs">
      <CardHeader className="p-4 pb-2 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <span>Chain of Custody Status</span>
          </CardTitle>
          <Badge variant="outline" className="font-mono text-[10px]">
            {equipment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Stepper */}
        <CustodyStepper currentStatus={equipment.status} />

        {/* Current Custodian or Available Station */}
        {equipment.status === "BORROWED" && equipment.currentCustodianName ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200 space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <span>Active Custodian (Physical Custody)</span>
              </span>
              <span className="text-[11px] bg-blue-200/60 dark:bg-blue-900 px-2 py-0.5 rounded">
                {equipment.currentCustodianRole}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-blue-200/60 dark:border-blue-900/60 text-[11px]">
              <div>
                <span className="text-muted-foreground">Name:</span> <strong>{equipment.currentCustodianName}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span> {equipment.currentCustodianEmail}
              </div>
              {activeBorrow && (
                <>
                  <div>
                    <span className="text-muted-foreground">Project / Course:</span> {activeBorrow.projectCourseName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Scheduled Return:</span> <strong>{formatDate(activeBorrow.requestedEndDate)}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : equipment.status === "UNDER_MAINTENANCE" ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>Asset Under Maintenance & Repair</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              This unit is secured in the technician service bay. Requisitions are temporarily locked until repair completion and inspection verification.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <Building2 className="h-4 w-4 text-emerald-600" />
              <span>Secured at Laboratory Station</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Equipment is available in <strong>{equipment.labName}</strong> at location <strong>{equipment.location}</strong>. Ready for checkout.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
