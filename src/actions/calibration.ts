"use server";

import { revalidatePath } from "next/cache";
import { calibrationRepository, equipmentRepository } from "@/data/repository";
import { scheduleCalibrationSchema } from "@/schemas";
import { ActionResult } from "./borrow";
import { getServerSession, authorizeRole } from "@/lib/auth";

/**
 * Schedule or Record ISO-17025 Metrology Calibration (Requires TECHNICIAN, MANAGER, ADMIN)
 */
export async function scheduleCalibrationAction(
  rawInput: unknown
): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!authorizeRole(session.role, ["LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"])) {
      return {
        success: false,
        error: "Forbidden: Only certified technical staff can record calibration logs.",
      };
    }

    const validation = scheduleCalibrationSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed on calibration submission.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const input = validation.data;
    const equipment = await equipmentRepository.findById(input.equipmentId);
    if (!equipment) {
      return {
        success: false,
        error: "Equipment asset not found.",
      };
    }

    const record = await calibrationRepository.create({
      equipmentId: equipment.id,
      equipmentAssetId: equipment.assetId,
      equipmentName: equipment.name,
      labId: equipment.labId,
      labName: equipment.labName,
      standardUsed: input.standardUsed,
      calibrationDate: input.calibrationDate,
      nextDueDate: input.nextDueDate,
      technicianId: session.user.id || "usr_tech_01",
      technicianName: session.user.name || input.technicianName,
      technicianCompany: input.technicianCompany,
      result: input.result,
      certificateNumber: input.certificateNumber,
      toleranceRange: input.toleranceRange,
      measuredError: input.measuredError,
      notes: input.notes,
    });

    revalidatePath("/calibration");
    revalidatePath("/equipment");
    revalidatePath(`/equipment/${equipment.id}`);
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return {
      success: true,
      data: record,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to record calibration log.",
    };
  }
}
