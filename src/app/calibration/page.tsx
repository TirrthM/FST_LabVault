import * as React from "react";
import { calibrationRepository, equipmentRepository } from "@/data/repository";
import { CalibrationView } from "@/components/calibration/calibration-view";

export const metadata = {
  title: "Calibration Schedule — LabVault",
  description: "ISO-17025 metrology calibration tracking, NIST traceable standards, and certificate records.",
};

export const dynamic = "force-dynamic";

export default async function CalibrationPage() {
  const records = await calibrationRepository.findMany();
  const equipmentList = await equipmentRepository.findMany();

  return <CalibrationView records={records} equipmentList={equipmentList} />;
}
