import * as React from "react";
import Link from "next/link";
import { labRepository, equipmentRepository } from "@/data/repository";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, User, Cpu, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Laboratories — LabVault",
  description: "Academic and research laboratories directory, facility managers, and active instrument inventory.",
};

export const dynamic = "force-dynamic";

export default async function LabsPage() {
  const labs = await labRepository.findMany();
  const allEquipment = await equipmentRepository.findMany();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-primary" />
            <span>Academic Laboratories Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Department facilities, room allocations, designated faculty managers, and active instrument load.
          </p>
        </div>
      </div>

      {/* Grid of Laboratories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => {
          const labEquipment = allEquipment.filter((e) => e.labId === lab.id);
          const availableCount = labEquipment.filter((e) => e.status === "AVAILABLE").length;

          return (
            <Card key={lab.id} className="shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between">
              <div>
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {lab.code}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {lab.department}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground mt-2">
                    {lab.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-1 space-y-3 text-xs">
                  <p className="text-muted-foreground leading-relaxed">
                    {lab.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>{lab.building}, {lab.roomNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>Manager: <strong className="text-foreground">{lab.managerName}</strong></span>
                    </div>
                  </div>

                  {/* Asset availability badge */}
                  <div className="p-2.5 rounded-md bg-muted/40 border flex items-center justify-between font-mono text-[11px]">
                    <span className="text-muted-foreground">Asset Capacity:</span>
                    <span className="font-bold text-foreground">
                      {availableCount} / {labEquipment.length} Available
                    </span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="p-5 pt-0 border-t bg-muted/10 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {labEquipment.length} Total Registered Assets
                </span>
                <Link href={`/equipment?lab=${lab.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-primary">
                    <span>View Assets</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
