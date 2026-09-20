import * as React from "react";
import Link from "next/link";
import { AuditEvent } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ArrowRight, UserCheck, Wrench, Gauge, CheckCircle2 } from "lucide-react";

interface ActivityFeedProps {
  events: AuditEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span>Real-Time Chain of Custody & Audit Activity</span>
        </CardTitle>
        <Link href="/activity">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
            <span>View Full Log</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0 divide-y">
        {events.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No recent activity recorded.
          </div>
        ) : (
          events.map((evt) => (
            <div key={evt.id} className="p-3.5 hover:bg-muted/20 transition-colors text-xs flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground text-xs">{evt.title}</span>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(evt.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {evt.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80 pt-0.5">
                  <span>by <strong>{evt.actorName}</strong> ({evt.actorRole})</span>
                  {evt.equipmentAssetId && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-primary">{evt.equipmentAssetId}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
