import * as React from "react";
import { equipmentRepository, labRepository } from "@/data/repository";
import { EquipmentCatalogView } from "@/components/equipment/equipment-catalog-view";

export const metadata = {
  title: "Equipment Catalog — LabVault",
  description: "Browse, filter, and inspect engineering and scientific equipment across university laboratories.",
};

export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  // RSC server fetch
  const equipment = await equipmentRepository.findMany();
  const labs = await labRepository.findMany();

  return <EquipmentCatalogView initialEquipment={equipment} labs={labs} />;
}
