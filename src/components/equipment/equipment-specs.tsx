import * as React from "react";
import { EquipmentItem } from "@/types";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Sliders, Shield, Calendar, DollarSign, BookOpen } from "lucide-react";

interface EquipmentSpecsProps {
  equipment: EquipmentItem;
}

export function EquipmentSpecs({ equipment }: EquipmentSpecsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Technical Specifications */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <span>Technical Specifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          {equipment.specifications && equipment.specifications.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableBody>
                  {equipment.specifications.map((spec, idx) => (
                    <TableRow key={idx} className="text-xs">
                      <TableCell className="font-medium text-muted-foreground w-1/3 bg-muted/20">
                        {spec.key}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {spec.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Standard engineering specifications applicable.</p>
          )}
        </CardContent>
      </Card>

      {/* Procurement & Lifecycle Data */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>Procurement & Maintenance Baseline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableBody>
                <TableRow className="text-xs">
                  <TableCell className="font-medium text-muted-foreground w-1/2 bg-muted/20">
                    Acquisition Date
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatDate(equipment.purchaseDate)}
                  </TableCell>
                </TableRow>

                {equipment.purchaseCost !== undefined && (
                  <TableRow className="text-xs">
                    <TableCell className="font-medium text-muted-foreground bg-muted/20">
                      Acquisition Value
                    </TableCell>
                    <TableCell className="font-semibold text-foreground font-mono">
                      ${equipment.purchaseCost.toLocaleString()} USD
                    </TableCell>
                  </TableRow>
                )}

                <TableRow className="text-xs">
                  <TableCell className="font-medium text-muted-foreground bg-muted/20">
                    Warranty Status
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {equipment.warrantyStatus} {equipment.warrantyExpiryDate ? `(Exp: ${formatDate(equipment.warrantyExpiryDate)})` : ""}
                  </TableCell>
                </TableRow>

                <TableRow className="text-xs">
                  <TableCell className="font-medium text-muted-foreground bg-muted/20">
                    Last Inspection Date
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatDate(equipment.lastInspectionDate)} {equipment.lastInspectionBy ? `by ${equipment.lastInspectionBy}` : ""}
                  </TableCell>
                </TableRow>

                <TableRow className="text-xs">
                  <TableCell className="font-medium text-muted-foreground bg-muted/20">
                    Last Maintenance Servicing
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatDate(equipment.lastMaintenanceDate)}
                  </TableCell>
                </TableRow>

                <TableRow className="text-xs">
                  <TableCell className="font-medium text-muted-foreground bg-muted/20">
                    Next ISO Calibration Due
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatDate(equipment.nextCalibrationDate)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
