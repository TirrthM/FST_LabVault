import * as React from "react";
import { maintenanceRepository } from "@/data/repository";
import { MaintenanceQueueView } from "@/components/maintenance/maintenance-queue-view";

export const metadata = {
  title: "Maintenance Queue — LabVault",
  description: "Technician work order queue, equipment repairs, parts replacement logs, and diagnostics.",
};

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const tickets = await maintenanceRepository.findMany();
  return <MaintenanceQueueView initialTickets={tickets} />;
}
