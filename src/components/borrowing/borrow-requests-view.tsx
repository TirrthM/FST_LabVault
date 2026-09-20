"use client";

import * as React from "react";
import Link from "next/link";
import { BorrowRequest } from "@/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  approveBorrowRequestAction,
  checkoutBorrowRequestAction,
} from "@/actions/borrow";
import { useUserRoleStore } from "@/stores/user-role-store";
import { InspectReturnModal } from "@/components/forms/inspect-return-modal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  UserCheck,
  ShieldCheck,
  Eye,
  Building2,
  Calendar,
} from "lucide-react";

interface BorrowRequestsViewProps {
  initialRequests: BorrowRequest[];
}

export function BorrowRequestsView({ initialRequests }: BorrowRequestsViewProps) {
  const { currentRole, currentUser } = useUserRoleStore();
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [inspectModalReq, setInspectModalReq] = React.useState<BorrowRequest | null>(null);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

  const canApprove = currentRole === "LAB_MANAGER" || currentRole === "ADMIN";
  const canCheckout = currentRole === "LAB_TECHNICIAN" || currentRole === "LAB_MANAGER" || currentRole === "ADMIN";
  const canInspect = currentRole === "LAB_TECHNICIAN" || currentRole === "LAB_MANAGER" || currentRole === "ADMIN";

  const handleApprove = async (req: BorrowRequest) => {
    setActionLoadingId(req.id);
    try {
      const result = await approveBorrowRequestAction({
        requestId: req.id,
        approverId: currentUser.id,
        approverName: currentUser.name,
      });
      if (!result.success) {
        toast.error("Failed to Approve Request", { description: result.error });
      } else {
        toast.success("Borrow Request Approved", {
          description: `Approved request for ${req.equipmentName}. Status changed to APPROVED.`,
        });
      }
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCheckout = async (req: BorrowRequest) => {
    setActionLoadingId(req.id);
    try {
      const result = await checkoutBorrowRequestAction(req.id);
      if (!result.success) {
        toast.error("Failed to Check Out", { description: result.error });
      } else {
        toast.success("Equipment Handed Over & Checked Out", {
          description: `Custody transferred to ${req.userName}. Status changed to BORROWED.`,
        });
      }
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = React.useMemo(() => {
    if (activeTab === "ALL") return initialRequests;
    return initialRequests.filter((r) => r.status === activeTab);
  }, [initialRequests, activeTab]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
            <ClipboardList className="h-6 w-6 text-primary" />
            <span>Borrow Requisitions & Custody Log</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage custody lifecycle: REQUESTED → APPROVED → BORROWED → RETURNED → INSPECTED.
          </p>
        </div>

        <Link href="/equipment">
          <Button size="sm" className="gap-2 font-semibold">
            <span>Browse Equipment to Requisition</span>
          </Button>
        </Link>
      </div>

      {/* Tabs Filter */}
      <Tabs defaultValue="ALL" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-muted/60">
          <TabsTrigger value="ALL" className="text-xs py-1.5">
            All ({initialRequests.length})
          </TabsTrigger>
          <TabsTrigger value="REQUESTED" className="text-xs py-1.5 gap-1">
            <Clock className="h-3 w-3 text-amber-500" />
            <span>Requested ({initialRequests.filter((r) => r.status === "REQUESTED").length})</span>
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="text-xs py-1.5 gap-1">
            <CheckCircle className="h-3 w-3 text-purple-500" />
            <span>Approved ({initialRequests.filter((r) => r.status === "APPROVED").length})</span>
          </TabsTrigger>
          <TabsTrigger value="BORROWED" className="text-xs py-1.5 gap-1">
            <UserCheck className="h-3 w-3 text-blue-500" />
            <span>In Custody ({initialRequests.filter((r) => r.status === "BORROWED").length})</span>
          </TabsTrigger>
          <TabsTrigger value="INSPECTED" className="text-xs py-1.5 gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Inspected ({initialRequests.filter((r) => r.status === "INSPECTED").length})</span>
          </TabsTrigger>
          <TabsTrigger value="REJECTED" className="text-xs py-1.5">
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  No borrow requisitions found in status &ldquo;{activeTab}&rdquo;.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/40 text-xs">
                    <TableRow>
                      <TableHead>Requisition</TableHead>
                      <TableHead>Asset & Lab</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Project / Purpose</TableHead>
                      <TableHead>Requested Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {filteredRequests.map((req) => (
                      <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                        {/* ID */}
                        <TableCell className="font-mono font-medium text-foreground">
                          {req.id}
                        </TableCell>

                        {/* Equipment */}
                        <TableCell>
                          <div className="flex flex-col">
                            <Link
                              href={`/equipment/${req.equipmentId}`}
                              className="font-semibold text-foreground hover:underline text-primary line-clamp-1"
                            >
                              {req.equipmentName}
                            </Link>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {req.equipmentAssetId} · {req.labName}
                            </span>
                          </div>
                        </TableCell>

                        {/* Requester */}
                        <TableCell>
                          <div>
                            <span className="font-medium text-foreground">{req.userName}</span>
                            <p className="text-[11px] text-muted-foreground">
                              {req.userRole} · {req.userEmail}
                            </p>
                          </div>
                        </TableCell>

                        {/* Purpose */}
                        <TableCell className="max-w-[200px]">
                          <span className="font-medium text-foreground block truncate">
                            {req.projectCourseName || "Academic Lab"}
                          </span>
                          <span className="text-[11px] text-muted-foreground line-clamp-1">
                            {req.purpose}
                          </span>
                        </TableCell>

                        {/* Period */}
                        <TableCell className="whitespace-nowrap">
                          <span>{formatDate(req.requestedStartDate)}</span>
                          <span className="text-muted-foreground"> → </span>
                          <span>{formatDate(req.requestedEndDate)}</span>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge
                            variant={
                              req.status === "REQUESTED"
                                ? "warning"
                                : req.status === "APPROVED"
                                ? "purple"
                                : req.status === "BORROWED"
                                ? "info"
                                : req.status === "INSPECTED"
                                ? "success"
                                : "outline"
                            }
                            className="text-[10px]"
                          >
                            {req.status}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status === "REQUESTED" && canApprove && (
                              <Button
                                size="sm"
                                onClick={() => handleApprove(req)}
                                disabled={actionLoadingId === req.id}
                                className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Approve
                              </Button>
                            )}

                            {req.status === "APPROVED" && canCheckout && (
                              <Button
                                size="sm"
                                onClick={() => handleCheckout(req)}
                                disabled={actionLoadingId === req.id}
                                className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Check Out
                              </Button>
                            )}

                            {req.status === "BORROWED" && canInspect && (
                              <Button
                                size="sm"
                                onClick={() => setInspectModalReq(req)}
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Inspect Return
                              </Button>
                            )}

                            <Link href={`/equipment/${req.equipmentId}`}>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Return Inspection Modal */}
      {inspectModalReq && (
        <InspectReturnModal
          request={inspectModalReq}
          isOpen={true}
          onClose={() => setInspectModalReq(null)}
        />
      )}
    </div>
  );
}
