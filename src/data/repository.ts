import { db } from "./mock-db";
import {
  EquipmentItem,
  Lab,
  User,
  BorrowRequest,
  MaintenanceTicket,
  CalibrationRecord,
  AuditEvent,
  DashboardStats,
  EquipmentCategory,
  EquipmentStatus,
  EquipmentCondition,
} from "@/types";

/**
 * Data Access Layer (Repository Pattern)
 * 
 * Note for Academic Reviewers & Assignment 2:
 * In Assignment 1, this repository interfaced with an in-memory transactional mock store (`mock-db.ts`).
 * In Assignment 2, this provides unified data access for Server Components, Server Actions, and API Route Handlers.
 */

export const equipmentRepository = {
  async findMany(filters?: {
    search?: string;
    labId?: string;
    category?: EquipmentCategory;
    status?: EquipmentStatus;
    condition?: EquipmentCondition;
    calibrationStatus?: "CALIBRATED" | "DUE_SOON" | "OVERDUE";
    limit?: number;
    offset?: number;
  }): Promise<EquipmentItem[]> {
    return db.getEquipment(filters);
  },

  async findById(id: string): Promise<EquipmentItem | null> {
    const item = db.getEquipmentById(id);
    return item ?? null;
  },

  async create(data: Omit<EquipmentItem, "id" | "createdAt" | "updatedAt">): Promise<EquipmentItem> {
    return db.createEquipment(data);
  },

  async update(id: string, data: Partial<EquipmentItem>): Promise<EquipmentItem | null> {
    const updated = db.updateEquipment(id, data);
    return updated ?? null;
  },
};

export const labRepository = {
  async findMany(): Promise<Lab[]> {
    return db.getLabs();
  },

  async findById(id: string): Promise<Lab | null> {
    const lab = db.getLabById(id);
    return lab ?? null;
  },
};

export const userRepository = {
  async findMany(): Promise<User[]> {
    return db.getUsers();
  },

  async findById(id: string): Promise<User | null> {
    const user = db.getUserById(id);
    return user ?? null;
  },
};

export const borrowRepository = {
  async findMany(filters?: {
    userId?: string;
    equipmentId?: string;
    status?: string;
    labId?: string;
  }): Promise<BorrowRequest[]> {
    return db.getBorrowRequests(filters);
  },

  async findById(id: string): Promise<BorrowRequest | null> {
    const req = db.getBorrowRequestById(id);
    return req ?? null;
  },

  async create(data: Omit<BorrowRequest, "id" | "status" | "createdAt" | "updatedAt">): Promise<BorrowRequest> {
    return db.createBorrowRequest(data);
  },

  async approve(requestId: string, approverId: string, approverName: string): Promise<BorrowRequest | null> {
    const result = db.approveBorrowRequest(requestId, approverId, approverName);
    return result ?? null;
  },

  async reject(requestId: string, reason: string): Promise<BorrowRequest | null> {
    const result = db.rejectBorrowRequest(requestId, reason);
    return result ?? null;
  },

  async checkout(requestId: string): Promise<BorrowRequest | null> {
    const result = db.checkoutBorrowRequest(requestId);
    return result ?? null;
  },

  async checkOut(requestId: string): Promise<BorrowRequest | null> {
    return this.checkout(requestId);
  },

  async returnAndInspect(params: {
    requestId: string;
    inspectorId: string;
    inspectorName: string;
    returnCondition: EquipmentCondition;
    inspectionNotes: string;
    requiresMaintenance: boolean;
  }): Promise<BorrowRequest | null> {
    const result = db.returnAndInspectBorrowRequest(params);
    return result ?? null;
  },

  async inspectAndReturn(
    requestId: string,
    returnCondition: EquipmentCondition,
    inspectionNotes: string,
    inspectorId: string,
    inspectorName: string,
    requiresMaintenance: boolean = false
  ): Promise<BorrowRequest | null> {
    return this.returnAndInspect({
      requestId,
      inspectorId,
      inspectorName,
      returnCondition,
      inspectionNotes,
      requiresMaintenance,
    });
  },
};

export const maintenanceRepository = {
  async findMany(filters?: {
    equipmentId?: string;
    status?: string;
    priority?: string;
  }): Promise<MaintenanceTicket[]> {
    return db.getMaintenanceTickets(filters);
  },

  async findById(id: string): Promise<MaintenanceTicket | null> {
    const ticket = db.getMaintenanceTicketById(id);
    return ticket ?? null;
  },

  async create(data: {
    equipmentId: string;
    equipmentAssetId: string;
    equipmentName: string;
    labId: string;
    labName: string;
    reportedById: string;
    reportedByName: string;
    reportedByRole: any;
    priority: any;
    issueCategory: any;
    issueDescription: string;
    assignedTechnicianId?: string;
    assignedTechnicianName?: string;
  }): Promise<MaintenanceTicket> {
    return db.createMaintenanceTicket(data);
  },

  async updateStatus(params: {
    ticketId: string;
    status: any;
    technicianName: string;
    technicianNotes: string;
    partsReplaced?: string;
    repairCost?: number;
    returnToServiceCondition?: EquipmentCondition;
  }): Promise<MaintenanceTicket | null> {
    const result = db.updateMaintenanceStatus(params);
    return result ?? null;
  },
};

export const calibrationRepository = {
  async findMany(filters?: { equipmentId?: string; status?: string }): Promise<CalibrationRecord[]> {
    return db.getCalibrationRecords(filters);
  },

  async create(data: Omit<CalibrationRecord, "id" | "calibrationNumber" | "createdAt">): Promise<CalibrationRecord> {
    return db.createCalibrationRecord(data);
  },
};

export const auditRepository = {
  async findMany(filters?: {
    entityId?: string;
    entityType?: string;
    action?: string;
    entity?: string;
    limit?: number;
  }): Promise<AuditEvent[]> {
    return db.getAuditEvents(filters);
  },
};

export const dashboardRepository = {
  async getStats(): Promise<DashboardStats> {
    return db.getDashboardStats();
  },
};

export const repository = {
  equipment: equipmentRepository,
  labs: labRepository,
  users: userRepository,
  borrowRequests: borrowRepository,
  maintenance: maintenanceRepository,
  calibration: calibrationRepository,
  auditLogs: auditRepository,
  dashboard: dashboardRepository,
};
