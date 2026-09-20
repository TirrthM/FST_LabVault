import * as React from "react";
import { auditRepository } from "@/data/repository";
import { LifecycleTimeline } from "@/components/timeline/lifecycle-timeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { History, ShieldCheck, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Chain of Custody & Audit Log — LabVault",
  description: "Immutable custody transfers, return inspections, and technician maintenance audit records.",
};

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const events = await auditRepository.findMany();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
            <History className="h-6 w-6 text-primary" />
            <span>Chain of Custody & Platform Audit Trail</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Chronological, immutable record of all physical custody handovers, return condition checks, and maintenance work orders.
          </p>
        </div>

        <Badge variant="outline" className="h-7 text-xs gap-1.5 self-start sm:self-auto font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>{events.length} Recorded Events</span>
        </Badge>
      </div>

      {/* Timeline Card */}
      <Card className="shadow-xs">
        <CardHeader className="p-5 pb-2 border-b bg-muted/10">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span>Chronological Event Stream</span>
            <span className="text-xs font-normal text-muted-foreground">Most recent first</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <LifecycleTimeline events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
