"use server";

import { revalidatePath } from "next/cache";
import { borrowRepository, equipmentRepository } from "@/data/repository";
import {
  borrowEquipmentSchema,
  inspectReturnSchema,
} from "@/schemas";
import { EquipmentCondition } from "@/types";
import { getServerSession, authorizeRole } from "@/lib/auth";
import { emailService } from "@/lib/email";

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Submit New Equipment Borrow Requisition
 */
export async function createBorrowRequestAction(
  rawInput: unknown
): Promise<ActionResult> {
  try {
    const session = await getServerSession();

    // 1. Double Zod Validation (Server-side defense)
    const validationResult = borrowEquipmentSchema.safeParse(rawInput);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed on server.",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const input = validationResult.data;

    // 2. Domain Business Rule Checks
    const equipment = await equipmentRepository.findById(input.equipmentId);
    if (!equipment) {
      return {
        success: false,
        error: "Specified laboratory equipment asset was not found.",
      };
    }

    if (equipment.status === "RETIRED" || equipment.status === "LOST") {
      return {
        success: false,
        error: `Equipment is currently ${equipment.status.toLowerCase()} and cannot be requested.`,
      };
    }

    // 3. Create Borrow Request Record
    const newRequest = await borrowRepository.create({
      equipmentId: equipment.id,
      equipmentAssetId: equipment.assetId,
      equipmentName: equipment.name,
      equipmentCategory: equipment.category,
      labId: equipment.labId,
      labName: equipment.labName,
      userId: session.user.id || input.userId,
      userName: session.user.name || input.userName,
      userEmail: session.user.email || input.userEmail,
      userRole: session.role || input.userRole,
      userDept: session.user.department || "Academic Department",
      purpose: input.purpose,
      projectCourseName: input.projectCourseName,
      requestedStartDate: input.requestedStartDate,
      requestedEndDate: input.requestedEndDate,
    });

    revalidatePath("/equipment");
    revalidatePath(`/equipment/${equipment.id}`);
    revalidatePath("/borrow-requests");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return {
      success: true,
      data: newRequest,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred while processing borrow request.",
    };
  }
}

/**
 * Approve Borrow Requisition (Requires LAB_MANAGER or ADMIN)
 */
export async function approveBorrowRequestAction(params: {
  requestId: string;
  approverId?: string;
  approverName?: string;
}): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!authorizeRole(session.role, ["LAB_MANAGER", "ADMIN"])) {
      return {
        success: false,
        error: "Forbidden: Only Lab Managers and Admins can approve borrow requisitions.",
      };
    }

    const approverId = session.user.id || params.approverId || "usr_mgr_01";
    const approverName = session.user.name || params.approverName || "Lab Manager";

    const updated = await borrowRepository.approve(
      params.requestId,
      approverId,
      approverName
    );

    if (!updated) {
      return { success: false, error: "Requisition not found or could not be approved." };
    }

    // Trigger Transactional Email via Resend + React Email
    await emailService.sendBorrowApproved({
      to: updated.userEmail,
      requesterName: updated.userName,
      equipmentName: updated.equipmentName,
      assetId: updated.equipmentAssetId,
      labName: updated.labName,
      startDate: updated.requestedStartDate,
      endDate: updated.requestedEndDate,
      approverName,
      approvalNotes: updated.approvalDate ? `Approved on ${updated.approvalDate}` : "Approved by faculty.",
      requisitionNumber: updated.id,
    });

    revalidatePath("/equipment");
    revalidatePath(`/equipment/${updated.equipmentId}`);
    revalidatePath("/borrow-requests");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Reject Borrow Requisition (Requires LAB_MANAGER or ADMIN)
 */
export async function rejectBorrowRequestAction(params: {
  requestId: string;
  reason: string;
}): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!authorizeRole(session.role, ["LAB_MANAGER", "ADMIN"])) {
      return {
        success: false,
        error: "Forbidden: Only Lab Managers and Admins can reject borrow requisitions.",
      };
    }

    const updated = await borrowRepository.reject(params.requestId, params.reason);
    if (!updated) {
      return { success: false, error: "Requisition not found." };
    }

    // Trigger Transactional Email
    await emailService.sendBorrowRejected({
      to: updated.userEmail,
      requesterName: updated.userName,
      equipmentName: updated.equipmentName,
      assetId: updated.equipmentAssetId,
      rejectionReason: params.reason,
      requisitionNumber: updated.id,
    });

    revalidatePath("/equipment");
    revalidatePath(`/equipment/${updated.equipmentId}`);
    revalidatePath("/borrow-requests");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Handover Equipment to Student (Check Out)
 */
export async function checkOutEquipmentAction(params: {
  requestId: string;
} | string): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!authorizeRole(session.role, ["LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"])) {
      return {
        success: false,
        error: "Forbidden: Only technical staff can perform physical equipment handover.",
      };
    }

    const requestId = typeof params === "string" ? params : params.requestId;
    const updated = await borrowRepository.checkout(requestId);
    if (!updated) {
      return { success: false, error: "Could not complete equipment check-out." };
    }

    revalidatePath("/equipment");
    revalidatePath(`/equipment/${updated.equipmentId}`);
    revalidatePath("/borrow-requests");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const checkoutBorrowRequestAction = checkOutEquipmentAction;

/**
 * Inspect Returned Equipment and Restore to Service (Requires TECHNICIAN, MANAGER, ADMIN)
 */
export async function inspectReturnAction(
  rawInput: unknown
): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!authorizeRole(session.role, ["LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"])) {
      return {
        success: false,
        error: "Forbidden: Only Lab Technicians and Managers can perform check-in inspection.",
      };
    }

    const validationResult = inspectReturnSchema.safeParse(rawInput);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed on inspection form.",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const input = validationResult.data;
    const inspectorId = session.user.id || input.inspectedById;
    const inspectorName = session.user.name || input.inspectedByName;

    const updated = await borrowRepository.returnAndInspect({
      requestId: input.requestId,
      inspectorId,
      inspectorName,
      returnCondition: input.returnCondition as EquipmentCondition,
      inspectionNotes: input.inspectionNotes,
      requiresMaintenance: input.requiresMaintenance ?? false,
    });

    if (!updated) {
      return { success: false, error: "Requisition not found or already inspected." };
    }

    revalidatePath("/equipment");
    revalidatePath(`/equipment/${updated.equipmentId}`);
    revalidatePath("/borrow-requests");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const inspectAndReturnAction = inspectReturnAction;
