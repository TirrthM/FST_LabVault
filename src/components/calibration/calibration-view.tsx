"use client";

import * as React from "react";
import Link from "next/link";
import { CalibrationRecord, EquipmentItem } from "@/types";
import { formatDate, getCalibrationStatus } from "@/lib/utils";
import { ScheduleCalibrationModal } from "@/components/forms/schedule-calibration-modal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Gauge, ShieldCheck, AlertTriangle, PlusCircle, Eye } from "lucide-react";
import { useUserRoleStore } from "@/stores/user-role-store";

interface CalibrationViewProps {
  records: CalibrationRecord[];
  equipmentList: EquipmentItem[];
}

export function CalibrationView({ records, equipmentList }: CalibrationViewProps) {
  const { currentRole } = useUserRoleStore();
  const [selectedEq, setSelectedEq] = React.useState<EquipmentItem | null>(null);

  const canCertify =
    currentRole === "LAB_TECHNICIAN" ||
    currentRole === "LAB_MANAGER" ||
    currentRole === "ADMIN";

  // Filter equipment that requires calibration
  const calSensors = equipmentList.filter((e) => e.nextCalibrationDate !== undefined);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
            <Gauge className="h-6 w-6 text-teal-600" />
            <span>ISO-17025 Metrology & Calibration Schedule</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor NIST-traceable calibration currency, tolerance drift, and upload metrology certificates.
          </p>
        </div>
      </div>

      {/* Equipment Calibration Status Overview */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span>Active Asset Calibration Watchlist ({calSensors.length})</span>
        </h2>

        <div className="rounded-lg border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/40 text-xs">
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Equipment Name</TableHead>
                <TableHead>Laboratory</TableHead>
                <TableHead>Last Calibrated</TableHead>
                <TableHead>Next Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {calSensors.map((eq) => {
                const calStatus = getCalibrationStatus(eq.nextCalibrationDate);
                return (
                  <TableRow key={eq.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-semibold text-primary">
                      <Link href={`/equipment/${eq.id}`} className="hover:underline">
                        {eq.assetId}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-[220px] truncate">
                      {eq.name}
                    </TableCell>
                    <TableCell>{eq.labName}</TableCell>
                    <TableCell>{formatDate(eq.lastCalibrationDate)}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {formatDate(eq.nextCalibrationDate)}
                    </TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${calStatus.bgClass} ${calStatus.textClass} ${calStatus.borderClass}`}>
                        {calStatus.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {canCertify && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedEq(eq)}
                          className="h-7 text-xs gap-1 bg-teal-600 hover:bg-teal-700 text-white font-medium"
                        >
                          <Gauge className="h-3 w-3" />
                          <span>Record Cal</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Historical Calibration Certificates */}
      <div className="space-y-3 pt-4 border-t">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Historical Calibration Log Certificates ({records.length})</span>
        </h2>

        <div className="rounded-lg border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/40 text-xs">
              <TableRow>
                <TableHead>Certificate #</TableHead>
                <TableHead>Asset ID & Name</TableHead>
                <TableHead>Standard Used</TableHead>
                <TableHead>Date Certified</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Max Offset</TableHead>
                <TableHead>Metrologist</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {records.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="font-mono font-semibold text-foreground">
                    {rec.certificateNumber}
                  </TableCell>
                  <TableCell>
                    <Link href={`/equipment/${rec.equipmentId}`} className="font-medium hover:underline text-primary">
                      {rec.equipmentAssetId}
                    </Link>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">{rec.equipmentName}</p>
                  </TableCell>
                  <TableCell>{rec.standardUsed}</TableCell>
                  <TableCell>{formatDate(rec.calibrationDate)}</TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[10px]">{rec.result}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{rec.measuredError}</TableCell>
                  <TableCell>{rec.technicianName} ({rec.technicianCompany || "In-house"})</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      {selectedEq && (
        <ScheduleCalibrationModal
          equipment={selectedEq}
          isOpen={true}
          onClose={() => setSelectedEq(null)}
        />
      )}
    </div>
  );
}
