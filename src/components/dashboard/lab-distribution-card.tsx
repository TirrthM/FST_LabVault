import * as React from "react";
import Link from "next/link";
import { DashboardStats } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabDistributionCardProps {
  distribution: DashboardStats["equipmentByLab"];
}

export function LabDistributionCard({ distribution }: LabDistributionCardProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <span>Laboratory Asset Distribution</span>
        </CardTitle>
        <Link href="/labs">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
            <span>All Labs</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-xs">
        {distribution.map((lab, idx) => {
          const percentage = lab.count > 0 ? Math.round((lab.available / lab.count) * 100) : 0;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground truncate max-w-[200px]">{lab.labName}</span>
                <span className="text-muted-foreground font-mono">
                  {lab.available}/{lab.count} available ({percentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  className="bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
