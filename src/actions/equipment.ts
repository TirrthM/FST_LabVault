"use server";

import { revalidatePath } from "next/cache";
import { equipmentRepository, labRepository } from "@/data/repository";
import { equipmentSchema } from "@/schemas";
import { ActionResult } from "./borrow";
import { getServerSession, authorizeRole } from "@/lib/auth";

/**
 * Commission and Onboard New Laboratory Equipment (Requires LAB_MANAGER or ADMIN)
 */
export async function addEquipmentAction(rawInput: unknown): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!authorizeRole(session.role, ["LAB_MANAGER", "ADMIN"])) {
      return {
        success: false,
        error: "Forbidden: Only Lab Managers and Admins can commission new laboratory equipment.",
      };
    }

    const validation = equipmentSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed for equipment commissioning.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const input = validation.data;
    const lab = await labRepository.findById(input.labId);
    if (!lab) {
      return {
        success: false,
        error: "Assigned laboratory not found.",
      };
    }

    const newItem = await equipmentRepository.create({
      assetId: input.assetId,
      name: input.name,
      category: input.category,
      manufacturer: input.manufacturer,
      model: input.model,
      serialNumber: input.serialNumber,
      labId: lab.id,
      labName: lab.name,
      location: input.location,
      purchaseDate: input.purchaseDate,
      purchaseCost: input.purchaseCost,
      warrantyStatus: input.warrantyStatus,
      warrantyExpiryDate: input.warrantyExpiryDate,
      status: "AVAILABLE",
      condition: input.condition,
      description: input.description,
      specifications: [
        { key: "Manufacturer", value: input.manufacturer },
        { key: "Model", value: input.model },
        { key: "Serial Number", value: input.serialNumber },
      ],
      requiresTraining: input.requiresTraining,
      trainingModule: input.trainingModule,
    });

    revalidatePath("/equipment");
    revalidatePath("/labs");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return {
      success: true,
      data: newItem,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to add equipment.",
    };
  }
}
