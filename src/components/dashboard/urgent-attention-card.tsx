import * as React from "react";
import Link from "next/link";
import { DashboardStats } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Gauge, Wrench, ArrowRight } from "lucide-react";

interface UrgentAttentionCardProps {
  items: DashboardStats["urgentAttentionList"];
}

export function UrgentAttentionCard({ items }: UrgentAttentionCardProps) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-4 w-4 text-emerald-600" />
            <span>Equipment Requiring Immediate Attention</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-xs text-muted-foreground text-center py-8">
          All equipment operating normally. No urgent service tickets or calibration overdues.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200/60 dark:border-amber-900/40">
      <CardHeader className="p-4 pb-2 bg-amber-50/30 dark:bg-amber-950/20 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Equipment Requiring Immediate Attention</span>
          </CardTitle>
          <Badge variant="warning" className="text-[10px]">
            {items.length} Action Items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 divide-y">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors text-xs"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 mt-0.5">
                {item.issueType === "CALIBRATION_OVERDUE" ? (
                  <Gauge className="h-3.5 w-3.5" />
                ) : (
                  <Wrench className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/equipment/${item.equipment.id}`}
                    className="font-semibold text-foreground hover:underline line-clamp-1"
                  >
                    {item.equipment.name}
                  </Link>
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                    {item.equipment.assetId}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {item.details} · <em>{item.equipment.labName}</em>
                </p>
              </div>
            </div>

            <Link href={`/equipment/${item.equipment.id}`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                <span>Inspect</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
