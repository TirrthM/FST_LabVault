"use client";

import * as React from "react";
import Link from "next/link";
import { MaintenanceTicket } from "@/types";
import { formatDate, formatDateTime, getPriorityBadge } from "@/lib/utils";
import { MaintenanceStatusModal } from "@/components/forms/maintenance-status-modal";
import { useUserRoleStore } from "@/stores/user-role-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Sliders,
  DollarSign,
} from "lucide-react";

interface MaintenanceQueueViewProps {
  initialTickets: MaintenanceTicket[];
}

export function MaintenanceQueueView({ initialTickets }: MaintenanceQueueViewProps) {
  const { currentRole } = useUserRoleStore();
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [selectedTicket, setSelectedTicket] = React.useState<MaintenanceTicket | null>(null);

  const canManageWorkOrders =
    currentRole === "LAB_TECHNICIAN" ||
    currentRole === "LAB_MANAGER" ||
    currentRole === "ADMIN";

  const filteredTickets = React.useMemo(() => {
    if (activeTab === "ALL") return initialTickets;
    if (activeTab === "ACTIVE") {
      return initialTickets.filter(
        (t) => t.status === "OPEN" || t.status === "ASSIGNED" || t.status === "IN_REPAIR" || t.status === "TESTING"
      );
    }
    return initialTickets.filter((t) => t.status === activeTab);
  }, [initialTickets, activeTab]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
            <Wrench className="h-6 w-6 text-amber-600" />
            <span>Technician Maintenance & Repair Queue</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage work order tickets, parts replacement, diagnostics, and return-to-service validation.
          </p>
        </div>
      </div>

      {/* Tabs Filter */}
      <Tabs defaultValue="ACTIVE" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 h-auto p-1 bg-muted/60">
          <TabsTrigger value="ACTIVE" className="text-xs py-1.5">
            Active Queue ({initialTickets.filter((t) => t.status !== "RESOLVED" && t.status !== "REJECTED").length})
          </TabsTrigger>
          <TabsTrigger value="ALL" className="text-xs py-1.5">
            All Tickets ({initialTickets.length})
          </TabsTrigger>
          <TabsTrigger value="OPEN" className="text-xs py-1.5">
            Open
          </TabsTrigger>
          <TabsTrigger value="IN_REPAIR" className="text-xs py-1.5">
            In Repair
          </TabsTrigger>
          <TabsTrigger value="RESOLVED" className="text-xs py-1.5">
            Resolved
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center text-xs text-muted-foreground">
              No maintenance tickets currently in this filter view.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTickets.map((ticket) => {
                const priorityBadge = getPriorityBadge(ticket.priority);
                return (
                  <Card key={ticket.id} className="shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-colors">
                    <CardHeader className="p-4 pb-2 border-b bg-muted/10">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-foreground bg-muted px-2 py-0.5 rounded">
                              {ticket.ticketNumber}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${priorityBadge.bgClass} ${priorityBadge.textClass}`}>
                              {priorityBadge.label}
                            </span>
                          </div>
                          <Link
                            href={`/equipment/${ticket.equipmentId}`}
                            className="font-semibold text-sm text-foreground hover:underline block line-clamp-1"
                          >
                            {ticket.equipmentName}
                          </Link>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {ticket.equipmentAssetId} · {ticket.labName}
                          </p>
                        </div>

                        <Badge
                          variant={
                            ticket.status === "RESOLVED"
                              ? "success"
                              : ticket.status === "IN_REPAIR"
                              ? "warning"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3 text-xs">
                      {/* Description */}
                      <p className="text-foreground font-medium leading-snug">
                        {ticket.issueDescription}
                      </p>

                      {/* Reporter / Technician info */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-md bg-muted/30 text-[11px] text-muted-foreground">
                        <div>
                          <span>Reported By:</span>
                          <p className="font-semibold text-foreground">{ticket.reportedByName}</p>
                        </div>
                        <div>
                          <span>Assigned Tech:</span>
                          <p className="font-semibold text-foreground">
                            {ticket.assignedTechnicianName || "Unassigned"}
                          </p>
                        </div>
                      </div>

                      {/* Work logs preview */}
                      {ticket.workLogs && ticket.workLogs.length > 0 && (
                        <div className="space-y-1 border-t pt-2 text-[11px]">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Latest Work Log:
                          </span>
                          <p className="text-muted-foreground italic line-clamp-2">
                            &ldquo;{ticket.workLogs[ticket.workLogs.length - 1].notes}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between border-t pt-3">
                        <Link href={`/equipment/${ticket.equipmentId}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Asset History</span>
                          </Button>
                        </Link>

                        {canManageWorkOrders && ticket.status !== "RESOLVED" && (
                          <Button
                            size="sm"
                            onClick={() => setSelectedTicket(ticket)}
                            className="h-7 text-xs font-semibold gap-1 bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <Wrench className="h-3 w-3" />
                            <span>Update Work Order</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Maintenance Status Update Modal */}
      {selectedTicket && (
        <MaintenanceStatusModal
          ticket={selectedTicket}
          isOpen={true}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
