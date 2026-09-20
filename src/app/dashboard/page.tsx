import * as React from "react";
import Link from "next/link";
import { dashboardRepository } from "@/data/repository";
import { StatCard } from "@/components/dashboard/stat-card";
import { UrgentAttentionCard } from "@/components/dashboard/urgent-attention-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { LabDistributionCard } from "@/components/dashboard/lab-distribution-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  CheckCircle2,
  Clock,
  Wrench,
  Gauge,
  ClipboardList,
  Building2,
  PlusCircle,
  Layers,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Dashboard — LabVault",
  description: "Executive and laboratory operational metrics, equipment status, and active maintenance queue.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // RSC direct server data access
  const stats = await dashboardRepository.getStats();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Laboratory Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time equipment availability, active custody requisitions, and maintenance queue overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/equipment">
            <Button size="sm" className="gap-1.5 shadow-xs font-semibold">
              <Cpu className="h-4 w-4" />
              <span>Equipment Catalog</span>
            </Button>
          </Link>
          <Link href="/borrow-requests">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ClipboardList className="h-4 w-4" />
              <span>Borrow Requests ({stats.pendingBorrowRequests})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Assets"
          value={stats.totalEquipment}
          subtitle="Registered devices"
          icon={Cpu}
          variant="default"
        />
        <StatCard
          title="Available"
          value={stats.availableCount}
          subtitle="Ready on shelf"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="In Custody"
          value={stats.borrowedCount}
          subtitle="Currently borrowed"
          icon={Clock}
          variant="info"
        />
        <StatCard
          title="Maintenance"
          value={stats.maintenanceCount}
          subtitle="Service bay"
          icon={Wrench}
          variant="warning"
        />
        <StatCard
          title="Cal. Due"
          value={stats.calibrationDueCount}
          subtitle="≤ 14 days or overdue"
          icon={Gauge}
          variant="destructive"
        />
        <StatCard
          title="Laboratories"
          value={stats.totalLabs}
          subtitle="Department facilities"
          icon={Building2}
          variant="purple"
        />
      </div>

      {/* Urgent Attention Alert Banner */}
      <UrgentAttentionCard items={stats.urgentAttentionList} />

      {/* Two Column Section: Realtime Activity Feed & Lab Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed events={stats.recentActivity} />
        <LabDistributionCard distribution={stats.equipmentByLab} />
      </div>
    </div>
  );
}
