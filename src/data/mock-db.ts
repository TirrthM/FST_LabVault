import {
  EquipmentItem,
  Lab,
  User,
  BorrowRequest,
  MaintenanceTicket,
  CalibrationRecord,
  AuditEvent,
  DashboardStats,
  EquipmentStatus,
  EquipmentCondition,
  EquipmentCategory,
} from "@/types";
import {
  SEED_USERS,
  SEED_LABS,
  SEED_EQUIPMENT,
  SEED_BORROW_REQUESTS,
  SEED_MAINTENANCE_TICKETS,
  SEED_CALIBRATION_RECORDS,
  SEED_AUDIT_EVENTS,
} from "./seed-data";

class MockDatabase {
  private users: Map<string, User> = new Map();
  private labs: Map<string, Lab> = new Map();
  private equipment: Map<string, EquipmentItem> = new Map();
  private borrowRequests: Map<string, BorrowRequest> = new Map();
  private maintenanceTickets: Map<string, MaintenanceTicket> = new Map();
  private calibrationRecords: Map<string, CalibrationRecord> = new Map();
  private auditEvents: AuditEvent[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    this.users.clear();
    this.labs.clear();
    this.equipment.clear();
    this.borrowRequests.clear();
    this.maintenanceTickets.clear();
    this.calibrationRecords.clear();
    this.auditEvents = [];

    SEED_USERS.forEach((u) => this.users.set(u.id, { ...u }));
    SEED_LABS.forEach((l) => this.labs.set(l.id, { ...l }));
    SEED_EQUIPMENT.forEach((e) => this.equipment.set(e.id, { ...e }));
    SEED_BORROW_REQUESTS.forEach((b) => this.borrowRequests.set(b.id, { ...b }));
    SEED_MAINTENANCE_TICKETS.forEach((m) => this.maintenanceTickets.set(m.id, { ...m }));
    SEED_CALIBRATION_RECORDS.forEach((c) => this.calibrationRecords.set(c.id, { ...c }));
    this.auditEvents = SEED_AUDIT_EVENTS.map((a) => ({ ...a }));
  }

  // --- Users ---
  public getUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  // --- Labs ---
  public getLabs(): Lab[] {
    return Array.from(this.labs.values());
  }

  public getLabById(id: string): Lab | undefined {
    return this.labs.get(id);
  }

  // --- Equipment ---
  public getEquipment(filters?: {
    search?: string;
    labId?: string;
    category?: EquipmentCategory;
    status?: EquipmentStatus;
    condition?: EquipmentCondition;
    calibrationStatus?: "CALIBRATED" | "DUE_SOON" | "OVERDUE";
  }): EquipmentItem[] {
    let items = Array.from(this.equipment.values());

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.assetId.toLowerCase().includes(q) ||
          i.manufacturer.toLowerCase().includes(q) ||
          i.model.toLowerCase().includes(q) ||
          i.serialNumber.toLowerCase().includes(q) ||
          i.labName.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
      );
    }

    if (filters?.labId && filters.labId !== "ALL") {
      items = items.filter((i) => i.labId === filters.labId);
    }

    if (filters?.category && (filters.category as any) !== "ALL") {
      items = items.filter((i) => i.category === filters.category);
    }

    if (filters?.status && (filters.status as any) !== "ALL") {
      items = items.filter((i) => i.status === filters.status);
    }

    if (filters?.condition && (filters.condition as any) !== "ALL") {
      items = items.filter((i) => i.condition === filters.condition);
    }

    if (filters?.calibrationStatus && (filters.calibrationStatus as any) !== "ALL") {
      const now = new Date();
      items = items.filter((i) => {
        if (!i.nextCalibrationDate) return false;
        const target = new Date(i.nextCalibrationDate);
        const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (filters.calibrationStatus === "OVERDUE") return diffDays < 0;
        if (filters.calibrationStatus === "DUE_SOON") return diffDays >= 0 && diffDays <= 14;
        if (filters.calibrationStatus === "CALIBRATED") return diffDays > 14;
        return true;
      });
    }

    return items;
  }

  public getEquipmentById(id: string): EquipmentItem | undefined {
    return this.equipment.get(id);
  }

  public createEquipment(item: Omit<EquipmentItem, "id" | "createdAt" | "updatedAt">): EquipmentItem {
    const id = `eq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newItem: EquipmentItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.equipment.set(id, newItem);

    // Audit Log
    this.addAuditEvent({
      entityType: "EQUIPMENT",
      entityId: id,
      equipmentAssetId: newItem.assetId,
      equipmentName: newItem.name,
      eventType: "EQUIPMENT_CREATED",
      title: "New Equipment Commissioned",
      description: `Asset ${newItem.assetId} (${newItem.name}) commissioned and placed in ${newItem.labName}.`,
      actorId: "usr_admin_1",
      actorName: "System Administrator",
      actorRole: "ADMIN",
      timestamp: now,
    });

    return newItem;
  }

  public updateEquipment(id: string, updates: Partial<EquipmentItem>): EquipmentItem | undefined {
    const existing = this.equipment.get(id);
    if (!existing) return undefined;
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...updates,
      updatedAt: now,
    };
    this.equipment.set(id, updated);
    return updated;
  }

  // --- Borrow Requests ---
  public getBorrowRequests(filters?: {
    userId?: string;
    equipmentId?: string;
    status?: string;
    labId?: string;
  }): BorrowRequest[] {
    let requests = Array.from(this.borrowRequests.values());

    if (filters?.userId) {
      requests = requests.filter((r) => r.userId === filters.userId);
    }
    if (filters?.equipmentId) {
      requests = requests.filter((r) => r.equipmentId === filters.equipmentId);
    }
    if (filters?.status && filters.status !== "ALL") {
      requests = requests.filter((r) => r.status === filters.status);
    }
    if (filters?.labId && filters.labId !== "ALL") {
      requests = requests.filter((r) => r.labId === filters.labId);
    }

    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBorrowRequestById(id: string): BorrowRequest | undefined {
    return this.borrowRequests.get(id);
  }

  public createBorrowRequest(data: Omit<BorrowRequest, "id" | "status" | "createdAt" | "updatedAt">): BorrowRequest {
    const id = `br_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newRequest: BorrowRequest = {
      ...data,
      id,
      status: "REQUESTED",
      createdAt: now,
      updatedAt: now,
    };
    this.borrowRequests.set(id, newRequest);

    // Audit Log
    this.addAuditEvent({
      entityType: "BORROW_REQUEST",
      entityId: id,
      equipmentAssetId: data.equipmentAssetId,
      equipmentName: data.equipmentName,
      eventType: "BORROW_REQUESTED",
      title: "Equipment Borrow Request Submitted",
      description: `${data.userName} (${data.userRole}) submitted borrow request for ${data.projectCourseName || "Academic project"}.`,
      actorId: data.userId,
      actorName: data.userName,
      actorRole: data.userRole,
      timestamp: now,
    });

    return newRequest;
  }

  public approveBorrowRequest(requestId: string, approverId: string, approverName: string): BorrowRequest | undefined {
    const req = this.borrowRequests.get(requestId);
    if (!req) return undefined;
    const now = new Date().toISOString();

    req.status = "APPROVED";
    req.approvedById = approverId;
    req.approvedByName = approverName;
    req.approvalDate = now;
    req.updatedAt = now;

    // Update equipment status to RESERVED
    const eq = this.equipment.get(req.equipmentId);
    if (eq && eq.status === "AVAILABLE") {
      eq.status = "RESERVED";
      eq.updatedAt = now;
    }

    this.addAuditEvent({
      entityType: "BORROW_REQUEST",
      entityId: requestId,
      equipmentAssetId: req.equipmentAssetId,
      equipmentName: req.equipmentName,
      eventType: "BORROW_APPROVED",
      title: "Borrow Request Approved",
      description: `Borrow request #${requestId} approved by ${approverName}. Asset marked as RESERVED.`,
      actorId: approverId,
      actorName: approverName,
      actorRole: "LAB_MANAGER",
      timestamp: now,
    });

    return req;
  }

  public rejectBorrowRequest(requestId: string, reason: string): BorrowRequest | undefined {
    const req = this.borrowRequests.get(requestId);
    if (!req) return undefined;
    const now = new Date().toISOString();

    req.status = "REJECTED";
    req.rejectionReason = reason;
    req.updatedAt = now;

    // Restore equipment status to AVAILABLE if it was reserved
    const eq = this.equipment.get(req.equipmentId);
    if (eq && eq.status === "RESERVED") {
      eq.status = "AVAILABLE";
      eq.updatedAt = now;
    }

    this.addAuditEvent({
      entityType: "BORROW_REQUEST",
      entityId: requestId,
      equipmentAssetId: req.equipmentAssetId,
      equipmentName: req.equipmentName,
      eventType: "BORROW_REJECTED",
      title: "Borrow Request Rejected",
      description: `Requisition #${requestId} rejected. Reason: ${reason}`,
      actorId: "usr_mgr_01",
      actorName: "Lab Manager",
      actorRole: "LAB_MANAGER",
      timestamp: now,
    });

    return req;
  }

  public checkoutBorrowRequest(requestId: string): BorrowRequest | undefined {
    const req = this.borrowRequests.get(requestId);
    if (!req) return undefined;
    const now = new Date().toISOString();

    req.status = "BORROWED";
    req.actualBorrowDate = now;
    req.updatedAt = now;

    // Update equipment to BORROWED with Custodian
    const eq = this.equipment.get(req.equipmentId);
    if (eq) {
      eq.status = "BORROWED";
      eq.currentCustodianId = req.userId;
      eq.currentCustodianName = req.userName;
      eq.currentCustodianEmail = req.userEmail;
      eq.currentCustodianRole = req.userRole;
      eq.updatedAt = now;
    }

    this.addAuditEvent({
      entityType: "BORROW_REQUEST",
      entityId: requestId,
      equipmentAssetId: req.equipmentAssetId,
      equipmentName: req.equipmentName,
      eventType: "EQUIPMENT_CHECKED_OUT",
      title: "Equipment Handed Over & Checked Out",
      description: `Asset physical custody transferred to ${req.userName}. Status changed to BORROWED.`,
      actorId: req.userId,
      actorName: req.userName,
      actorRole: req.userRole,
      timestamp: now,
    });

    return req;
  }

  public returnAndInspectBorrowRequest(params: {
    requestId: string;
    inspectorId: string;
    inspectorName: string;
    returnCondition: EquipmentCondition;
    inspectionNotes: string;
    requiresMaintenance: boolean;
  }): BorrowRequest | undefined {
    const req = this.borrowRequests.get(params.requestId);
    if (!req) return undefined;
    const now = new Date().toISOString();

    req.status = "INSPECTED";
    req.actualReturnDate = now;
    req.returnCondition = params.returnCondition;
    req.inspectionNotes = params.inspectionNotes;
    req.inspectedById = params.inspectorId;
    req.inspectedByName = params.inspectorName;
    req.inspectionDate = now;
    req.updatedAt = now;

    // Update equipment
    const eq = this.equipment.get(req.equipmentId);
    if (eq) {
      eq.currentCustodianId = undefined;
      eq.currentCustodianName = undefined;
      eq.currentCustodianEmail = undefined;
      eq.currentCustodianRole = undefined;
      eq.condition = params.returnCondition;
      eq.lastInspectionDate = now;
      eq.lastInspectionBy = params.inspectorName;

      if (params.requiresMaintenance || params.returnCondition === "DAMAGED" || params.returnCondition === "CRITICAL") {
        eq.status = "UNDER_MAINTENANCE";
        // Create maintenance ticket
        this.createMaintenanceTicket({
          equipmentId: eq.id,
          equipmentAssetId: eq.assetId,
          equipmentName: eq.name,
          labId: eq.labId,
          labName: eq.labName,
          reportedById: params.inspectorId,
          reportedByName: params.inspectorName,
          reportedByRole: "LAB_TECHNICIAN",
          priority: params.returnCondition === "CRITICAL" ? "URGENT" : "HIGH",
          issueCategory: "PHYSICAL_DAMAGE",
          issueDescription: `Post-return inspection flagged damage: ${params.inspectionNotes}`,
        });
      } else {
        eq.status = "AVAILABLE";
      }
      eq.updatedAt = now;
    }

    this.addAuditEvent({
      entityType: "BORROW_REQUEST",
      entityId: params.requestId,
      equipmentAssetId: req.equipmentAssetId,
      equipmentName: req.equipmentName,
      eventType: "INSPECTION_RECORDED",
      title: "Return Inspection Recorded",
      description: `Equipment returned by ${req.userName} and inspected by ${params.inspectorName}. Condition: ${params.returnCondition}.`,
      actorId: params.inspectorId,
      actorName: params.inspectorName,
      actorRole: "LAB_TECHNICIAN",
      timestamp: now,
    });

    return req;
  }

  // --- Maintenance ---
  public getMaintenanceTickets(filters?: {
    equipmentId?: string;
    status?: string;
    priority?: string;
  }): MaintenanceTicket[] {
    let tickets = Array.from(this.maintenanceTickets.values());
    if (filters?.equipmentId) {
      tickets = tickets.filter((t) => t.equipmentId === filters.equipmentId);
    }
    if (filters?.status && filters.status !== "ALL") {
      tickets = tickets.filter((t) => t.status === filters.status);
    }
    if (filters?.priority && filters.priority !== "ALL") {
      tickets = tickets.filter((t) => t.priority === filters.priority);
    }
    return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getMaintenanceTicketById(id: string): MaintenanceTicket | undefined {
    return this.maintenanceTickets.get(id);
  }

  public createMaintenanceTicket(data: {
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
  }): MaintenanceTicket {
    const id = `mnt_tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ticketNumber = `MNT-${new Date().getFullYear()}-${String(this.maintenanceTickets.size + 42).padStart(3, "0")}`;
    const now = new Date().toISOString();

    const newTicket: MaintenanceTicket = {
      ...data,
      id,
      ticketNumber,
      reportedDate: now,
      status: data.assignedTechnicianId ? "ASSIGNED" : "OPEN",
      workLogs: [
        {
          id: `wl_${Date.now()}`,
          authorName: data.reportedByName,
          date: now,
          notes: `Ticket created: ${data.issueDescription}`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    this.maintenanceTickets.set(id, newTicket);

    // Set equipment status
    const eq = this.equipment.get(data.equipmentId);
    if (eq) {
      eq.status = "UNDER_MAINTENANCE";
      eq.updatedAt = now;
    }

    this.addAuditEvent({
      entityType: "MAINTENANCE",
      entityId: id,
      equipmentAssetId: data.equipmentAssetId,
      equipmentName: data.equipmentName,
      eventType: "MAINTENANCE_SCHEDULED",
      title: `Maintenance Ticket ${ticketNumber} Opened`,
      description: `Issue (${data.issueCategory}): ${data.issueDescription}`,
      actorId: data.reportedById,
      actorName: data.reportedByName,
      actorRole: data.reportedByRole,
      timestamp: now,
    });

    return newTicket;
  }

  public updateMaintenanceStatus(params: {
    ticketId: string;
    status: any;
    technicianName: string;
    technicianNotes: string;
    partsReplaced?: string;
    repairCost?: number;
    returnToServiceCondition?: EquipmentCondition;
  }): MaintenanceTicket | undefined {
    const ticket = this.maintenanceTickets.get(params.ticketId);
    if (!ticket) return undefined;
    const now = new Date().toISOString();

    ticket.status = params.status;
    ticket.workLogs.push({
      id: `wl_${Date.now()}`,
      authorName: params.technicianName,
      date: now,
      notes: params.technicianNotes,
      statusChange: params.status,
    });

    if (params.partsReplaced) {
      ticket.partsReplaced = (ticket.partsReplaced || []).concat(params.partsReplaced.split(",").map((s) => s.trim()));
    }
    if (params.repairCost !== undefined) {
      ticket.repairCost = (ticket.repairCost || 0) + params.repairCost;
    }

    if (params.status === "RESOLVED") {
      ticket.resolvedDate = now;
      ticket.resolutionNotes = params.technicianNotes;

      // Restore equipment to AVAILABLE
      const eq = this.equipment.get(ticket.equipmentId);
      if (eq) {
        eq.status = "AVAILABLE";
        eq.lastMaintenanceDate = now;
        if (params.returnToServiceCondition) {
          eq.condition = params.returnToServiceCondition;
        }
        eq.updatedAt = now;
      }
    }

    ticket.updatedAt = now;

    this.addAuditEvent({
      entityType: "MAINTENANCE",
      entityId: ticket.id,
      equipmentAssetId: ticket.equipmentAssetId,
      equipmentName: ticket.equipmentName,
      eventType: params.status === "RESOLVED" ? "MAINTENANCE_COMPLETED" : "MAINTENANCE_STATUS_UPDATED",
      title: `Ticket ${ticket.ticketNumber} status: ${params.status}`,
      description: params.technicianNotes,
      actorId: "usr_tech_1",
      actorName: params.technicianName,
      actorRole: "LAB_TECHNICIAN",
      timestamp: now,
    });

    return ticket;
  }

  // --- Calibration ---
  public getCalibrationRecords(filters?: { equipmentId?: string }): CalibrationRecord[] {
    let records = Array.from(this.calibrationRecords.values());
    if (filters?.equipmentId) {
      records = records.filter((r) => r.equipmentId === filters.equipmentId);
    }
    return records.sort((a, b) => new Date(b.calibrationDate).getTime() - new Date(a.calibrationDate).getTime());
  }

  public createCalibrationRecord(data: Omit<CalibrationRecord, "id" | "calibrationNumber" | "createdAt">): CalibrationRecord {
    const id = `cal_rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const calibrationNumber = `CAL-${new Date().getFullYear()}-${String(this.calibrationRecords.size + 15).padStart(3, "0")}`;
    const now = new Date().toISOString();

    const newRecord: CalibrationRecord = {
      ...data,
      id,
      calibrationNumber,
      createdAt: now,
    };
    this.calibrationRecords.set(id, newRecord);

    // Update equipment calibration dates
    const eq = this.equipment.get(data.equipmentId);
    if (eq) {
      eq.lastCalibrationDate = data.calibrationDate;
      eq.nextCalibrationDate = data.nextDueDate;
      if (eq.status === "UNDER_CALIBRATION") {
        eq.status = "AVAILABLE";
      }
      eq.updatedAt = now;
    }

    this.addAuditEvent({
      entityType: "CALIBRATION",
      entityId: id,
      equipmentAssetId: data.equipmentAssetId,
      equipmentName: data.equipmentName,
      eventType: "CALIBRATION_COMPLETED",
      title: `Calibration ${calibrationNumber} Completed (${data.result})`,
      description: `Calibrated against ${data.standardUsed}. Next due: ${data.nextDueDate}.`,
      actorId: data.technicianId,
      actorName: data.technicianName,
      actorRole: "LAB_TECHNICIAN",
      timestamp: now,
    });

    return newRecord;
  }

  // --- Audit Events ---
  public getAuditEvents(filters?: {
    entityId?: string;
    entityType?: string;
    limit?: number;
  }): AuditEvent[] {
    let events = [...this.auditEvents];
    if (filters?.entityId) {
      events = events.filter((e) => e.entityId === filters.entityId || e.metadata?.equipmentId === filters.entityId);
    }
    if (filters?.entityType && filters.entityType !== "ALL") {
      events = events.filter((e) => e.entityType === filters.entityType);
    }
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (filters?.limit) {
      events = events.slice(0, filters.limit);
    }
    return events;
  }

  public addAuditEvent(event: Omit<AuditEvent, "id">): AuditEvent {
    const newEvent: AuditEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    this.auditEvents.unshift(newEvent);
    return newEvent;
  }

  // --- Dashboard Aggregations ---
  public getDashboardStats(): DashboardStats {
    const eqList = Array.from(this.equipment.values());
    const totalEquipment = eqList.length;
    const availableCount = eqList.filter((e) => e.status === "AVAILABLE").length;
    const borrowedCount = eqList.filter((e) => e.status === "BORROWED").length;
    const maintenanceCount = eqList.filter((e) => e.status === "UNDER_MAINTENANCE").length;

    const now = new Date();
    const calibrationDueCount = eqList.filter((e) => {
      if (!e.nextCalibrationDate) return false;
      const target = new Date(e.nextCalibrationDate);
      const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= 14;
    }).length;

    const openMaintenanceTickets = Array.from(this.maintenanceTickets.values()).filter(
      (t) => t.status === "OPEN" || t.status === "ASSIGNED" || t.status === "IN_REPAIR" || t.status === "TESTING"
    ).length;

    const pendingBorrowRequests = Array.from(this.borrowRequests.values()).filter(
      (b) => b.status === "REQUESTED"
    ).length;

    const statusCounts: Record<EquipmentStatus, number> = {
      AVAILABLE: 0,
      RESERVED: 0,
      BORROWED: 0,
      UNDER_MAINTENANCE: 0,
      UNDER_CALIBRATION: 0,
      LOST: 0,
      RETIRED: 0,
    };
    eqList.forEach((e) => {
      if (statusCounts[e.status] !== undefined) {
        statusCounts[e.status]++;
      }
    });

    const equipmentByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status: status as EquipmentStatus,
      count,
    }));

    const labs = Array.from(this.labs.values());
    const equipmentByLab = labs.map((l) => {
      const inLab = eqList.filter((e) => e.labId === l.id);
      return {
        labName: l.name,
        count: inLab.length,
        available: inLab.filter((e) => e.status === "AVAILABLE").length,
      };
    });

    // Urgent Attention Items
    const urgentAttentionList: {
      equipment: EquipmentItem;
      issueType: "MAINTENANCE_URGENT" | "CALIBRATION_OVERDUE" | "OVERDUE_RETURN" | "DAMAGED";
      details: string;
    }[] = [];

    eqList.forEach((eq) => {
      if (eq.status === "UNDER_MAINTENANCE" || eq.condition === "DAMAGED" || eq.condition === "CRITICAL") {
        urgentAttentionList.push({
          equipment: eq,
          issueType: "MAINTENANCE_URGENT",
          details: `Flagged under maintenance with condition ${eq.condition}.`,
        });
      }
      if (eq.nextCalibrationDate) {
        const diff = Math.ceil((new Date(eq.nextCalibrationDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) {
          urgentAttentionList.push({
            equipment: eq,
            issueType: "CALIBRATION_OVERDUE",
            details: `NIST calibration expired ${Math.abs(diff)} days ago.`,
          });
        }
      }
    });

    return {
      totalEquipment,
      availableCount,
      borrowedCount,
      maintenanceCount,
      calibrationDueCount,
      openMaintenanceTickets,
      pendingBorrowRequests,
      totalLabs: labs.length,
      equipmentByStatus,
      equipmentByLab,
      recentActivity: this.getAuditEvents({ limit: 8 }),
      urgentAttentionList: urgentAttentionList.slice(0, 5),
    };
  }
}

// Global singleton instance for in-memory persistence across Server Actions & RSC
const globalForDb = globalThis as unknown as { mockDb: MockDatabase | undefined };
export const db = globalForDb.mockDb ?? new MockDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.mockDb = db;
