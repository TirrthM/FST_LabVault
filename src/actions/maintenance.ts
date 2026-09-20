"use server";

import { revalidatePath } from "next/cache";
import { maintenanceRepository, equipmentRepository } from "@/data/repository";
import {
  reportIssueSchema,
  updateMaintenanceStatusSchema,
} from "@/schemas";
import { ActionResult } from "./borrow";
import { EquipmentCondition } from "@/types";
import { getServerSession, authorizeRole } from "@/lib/auth";
import { emailService } from "@/lib/email";

/**
 * Report Equipment Hardware Fault / Issue
 */
export async function reportEquipmentIssueAction(
  rawInput: unknown
): Promise<ActionResult> {
  try {
    const session = await getServerSession();

    const validation = reportIssueSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed on issue report.",
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

    // Update equipment condition if degraded or urgent
    if (input.observedCondition === "DAMAGED" || input.immediateSafetyHazard || input.priority === "URGENT") {
      await equipmentRepository.update(equipment.id, {
        condition: input.observedCondition as EquipmentCondition,
        status: "UNDER_MAINTENANCE",
      });
    }

    const ticket = await maintenanceRepository.create({
      equipmentId: equipment.id,
      equipmentAssetId: equipment.assetId,
      equipmentName: equipment.name,
      labId: equipment.labId,
      labName: equipment.labName,
      reportedById: session.user.id || input.reportedById,
      reportedByName: session.user.name || input.reportedByName,
      reportedByRole: session.role,
      priority: input.priority,
      issueCategory: input.issueCategory,
      issueDescription: input.issueDescription + (input.immediateSafetyHazard ? " [IMMEDIATE SAFETY HAZARD FLAGGED]" : ""),
    });

    // If critical priority or immediate safety hazard, dispatch safety alert email to admin/manager
    if (input.priority === "URGENT" || input.immediateSafetyHazard) {
      await emailService.sendCriticalIssue({
        to: "eleanor.vance@labvault.edu",
        recipientName: "Dr. Eleanor Vance (Dean of Research)",
        ticketNumber: ticket.ticketNumber,
        equipmentName: equipment.name,
        assetId: equipment.assetId,
        labName: equipment.labName,
        issueDescription: input.issueDescription,
        reportedByName: session.user.name || input.reportedByName,
      });
    }

    revalidatePath("/equipment");
    revalidatePath(`/equipment/${equipment.id}`);
    revalidatePath("/maintenance");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return {
      success: true,
      data: ticket,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to submit issue report.",
    };
  }
}

/**
 * Update Maintenance Status / Add Diagnostic Work Log (Requires TECHNICIAN, MANAGER, ADMIN)
 */
export async function updateMaintenanceStatusAction(
  rawInput: unknown
): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!authorizeRole(session.role, ["LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"])) {
      return {
        success: false,
        error: "Forbidden: Only technical staff can update maintenance work orders.",
      };
    }

    const validation = updateMaintenanceStatusSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed on maintenance status update.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const input = validation.data;
    const technicianName = session.user.name || input.technicianName || "Service Technician";

    const updated = await maintenanceRepository.updateStatus({
      ticketId: input.ticketId,
      status: input.status,
      technicianName,
      technicianNotes: input.technicianNotes,
      partsReplaced: input.partsReplaced,
      repairCost: input.repairCost,
      returnToServiceCondition: input.returnToServiceCondition as EquipmentCondition | undefined,
    });

    if (!updated) {
      return {
        success: false,
        error: "Maintenance ticket not found.",
      };
    }

    // If resolved, notify the reporter via transactional email
    if (input.status === "RESOLVED") {
      await emailService.sendMaintenanceResolved({
        to: "marcus.sterling@labvault.edu",
        reportedByName: updated.reportedByName,
        ticketNumber: updated.ticketNumber,
        equipmentName: updated.equipmentName,
        assetId: updated.equipmentAssetId,
        resolutionSummary: input.technicianNotes || "Diagnostics passed and restored to service.",
        technicianName,
      });
    }

    revalidatePath("/equipment");
    revalidatePath(`/equipment/${updated.equipmentId}`);
    revalidatePath("/maintenance");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return {
      success: true,
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to update maintenance status.",
    };
  }
}
