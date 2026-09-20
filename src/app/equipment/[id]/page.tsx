import * as React from "react";
import { notFound } from "next/navigation";
import {
  equipmentRepository,
  borrowRepository,
  maintenanceRepository,
  calibrationRepository,
  auditRepository,
} from "@/data/repository";
import { EquipmentDetailHeader } from "@/components/equipment/equipment-detail-header";
import { EquipmentSpecs } from "@/components/equipment/equipment-specs";
import { CustodyCard } from "@/components/equipment/custody-card";
import { LifecycleTimeline } from "@/components/timeline/lifecycle-timeline";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime, getConditionBadge } from "@/lib/utils";
import {
  History,
  Sliders,
  Calendar,
  Wrench,
  Gauge,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface EquipmentDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: EquipmentDetailPageProps) {
  const item = await equipmentRepository.findById(params.id);
  if (!item) return { title: "Asset Not Found — LabVault" };

  return {
    title: `${item.name} (${item.assetId}) — LabVault`,
    description: `${item.manufacturer} ${item.model} located in ${item.labName}. Current status: ${item.status}.`,
    openGraph: {
      title: `${item.assetId}: ${item.name}`,
      description: `Lab: ${item.labName} | Status: ${item.status} | Condition: ${item.condition}`,
      images: [
        {
          url: `/api/og/equipment/${item.id}`,
          width: 1200,
          height: 630,
          alt: item.name,
        },
      ],
    },
  };
}

export default async function EquipmentDetailPage({ params }: EquipmentDetailPageProps) {
  const equipment = await equipmentRepository.findById(params.id);
  if (!equipment) {
    notFound();
  }

  // Related entity queries
  const borrowHistory = await borrowRepository.findMany({ equipmentId: equipment.id });
  const maintenanceHistory = await maintenanceRepository.findMany({ equipmentId: equipment.id });
  const calibrationHistory = await calibrationRepository.findMany({ equipmentId: equipment.id });
  const timelineEvents = await auditRepository.findMany({ entityId: equipment.id });

  const activeBorrow = borrowHistory.find((b) => b.status === "BORROWED" || b.status === "APPROVED");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <EquipmentDetailHeader equipment={equipment} />

      {/* Custody Card */}
      <CustodyCard equipment={equipment} activeBorrow={activeBorrow} />

      {/* Tabbed Detail Sections */}
      <Tabs defaultValue="timeline" className="w-full space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto p-1 bg-muted/60">
          <TabsTrigger value="timeline" className="gap-1.5 py-2 text-xs">
            <History className="h-3.5 w-3.5" />
            <span>Chain of Custody</span>
          </TabsTrigger>
          <TabsTrigger value="specs" className="gap-1.5 py-2 text-xs">
            <Sliders className="h-3.5 w-3.5" />
            <span>Specifications</span>
          </TabsTrigger>
          <TabsTrigger value="borrowing" className="gap-1.5 py-2 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>Borrowing ({borrowHistory.length})</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-1.5 py-2 text-xs">
            <Wrench className="h-3.5 w-3.5" />
            <span>Maintenance ({maintenanceHistory.length})</span>
          </TabsTrigger>
          <TabsTrigger value="calibration" className="gap-1.5 py-2 text-xs">
            <Gauge className="h-3.5 w-3.5" />
            <span>Calibration ({calibrationHistory.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. Chain of Custody Timeline */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <span>Lifecycle & Physical Custody Timeline Log</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <LifecycleTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Specifications */}
        <TabsContent value="specs">
          <EquipmentSpecs equipment={equipment} />
        </TabsContent>

        {/* 3. Borrowing History */}
        <TabsContent value="borrowing">
          <Card>
            <CardHeader className="p-4 pb-2 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Custody Loans & Requisition History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {borrowHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No historical borrow requisitions on record for this asset.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/40 text-xs">
                    <TableRow>
                      <TableHead>Requisition</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Project / Course</TableHead>
                      <TableHead>Loan Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Return Inspection Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {borrowHistory.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono font-medium">{req.id}</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-semibold text-foreground">{req.userName}</span>
                            <p className="text-[11px] text-muted-foreground">{req.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{req.projectCourseName || req.purpose}</TableCell>
                        <TableCell>
                          <span>{formatDate(req.requestedStartDate)} → {formatDate(req.requestedEndDate)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{req.status}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          {req.inspectionNotes ? (
                            <span className="text-[11px] text-muted-foreground italic">
                              &ldquo;{req.inspectionNotes}&rdquo; ({req.returnCondition})
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Maintenance History */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader className="p-4 pb-2 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <span>Maintenance Work Orders & Repair History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {maintenanceHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No service tickets or maintenance issues recorded.
                </div>
              ) : (
                maintenanceHistory.map((ticket) => (
                  <div key={ticket.id} className="rounded-lg border p-4 space-y-3 bg-muted/10">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs">{ticket.ticketNumber}</span>
                        <Badge variant="outline">{ticket.issueCategory}</Badge>
                        <Badge variant="warning">{ticket.priority}</Badge>
                      </div>
                      <Badge variant="default">{ticket.status}</Badge>
                    </div>

                    <p className="text-xs text-foreground font-medium">
                      {ticket.issueDescription}
                    </p>

                    {ticket.workLogs && ticket.workLogs.length > 0 && (
                      <div className="space-y-1.5 pl-4 border-l-2 border-primary/30 pt-1 text-xs">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase">Work Logs</span>
                        {ticket.workLogs.map((log) => (
                          <div key={log.id} className="text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground">{log.authorName}:</span> {log.notes}
                            <time className="text-[10px] ml-2 text-muted-foreground/70">({formatDateTime(log.date)})</time>
                          </div>
                        ))}
                      </div>
                    )}

                    {ticket.partsReplaced && ticket.partsReplaced.length > 0 && (
                      <div className="flex items-center gap-2 text-xs pt-1">
                        <span className="font-semibold text-foreground">Parts Replaced:</span>
                        <span className="text-muted-foreground">{ticket.partsReplaced.join(", ")}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Calibration Records */}
        <TabsContent value="calibration">
          <Card>
            <CardHeader className="p-4 pb-2 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                <span>ISO-17025 Metrology & NIST Traceability Records</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {calibrationHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No calibration certificates uploaded.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/40 text-xs">
                    <TableRow>
                      <TableHead>Certificate #</TableHead>
                      <TableHead>Standard Transfer Reference</TableHead>
                      <TableHead>Calibrated Date</TableHead>
                      <TableHead>Next Due Date</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Measured Max Error</TableHead>
                      <TableHead>Metrologist</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {calibrationHistory.map((cal) => (
                      <TableRow key={cal.id}>
                        <TableCell className="font-mono font-semibold text-primary">{cal.certificateNumber}</TableCell>
                        <TableCell>{cal.standardUsed}</TableCell>
                        <TableCell>{formatDate(cal.calibrationDate)}</TableCell>
                        <TableCell className="font-semibold">{formatDate(cal.nextDueDate)}</TableCell>
                        <TableCell>
                          <Badge variant="success" className="text-[10px]">{cal.result}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">{cal.measuredError}</TableCell>
                        <TableCell>{cal.technicianName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
