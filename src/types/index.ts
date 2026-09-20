export type UserRole = "STUDENT" | "LAB_TECHNICIAN" | "LAB_MANAGER" | "ADMIN";

export type EquipmentStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "BORROWED"
  | "UNDER_MAINTENANCE"
  | "UNDER_CALIBRATION"
  | "LOST"
  | "RETIRED";

export type EquipmentCondition =
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "DAMAGED"
  | "CRITICAL";

export type EquipmentCategory =
  | "OSCILLOSCOPES"
  | "POWER_SUPPLIES"
  | "SIGNAL_GENERATORS"
  | "MULTIMETERS"
  | "SPECTRUM_ANALYZERS"
  | "MICROCONTROLLERS"
  | "ROBOTICS"
  | "COMPUTING_AI"
  | "OPTICAL_MICROSCOPES"
  | "SOLDERING_REWORK"
  | "SENSORS_IOT"
  | "OTHER";

export type BorrowStatus =
  | "REQUESTED"
  | "APPROVED"
  | "BORROWED"
  | "RETURNED"
  | "INSPECTED"
  | "REJECTED"
  | "CANCELLED";

export type MaintenanceStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_REPAIR"
  | "TESTING"
  | "RESOLVED"
  | "REJECTED"
  | "CANCELLED";

export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type CalibrationStatus = "CALIBRATED" | "DUE_SOON" | "OVERDUE" | "NOT_REQUIRED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentOrEmployeeId: string;
  avatarUrl?: string;
  phone?: string;
}

export interface Lab {
  id: string;
  name: string;
  code: string;
  building: string;
  roomNumber: string;
  department: string;
  managerId: string;
  managerName: string;
  managerEmail: string;
  totalEquipmentCount: number;
  activeEquipmentCount: number;
  description: string;
}

export interface EquipmentSpecification {
  key: string;
  value: string;
}

export interface EquipmentItem {
  id: string;
  assetId: string; // e.g. "LV-EE-OSC-0104"
  name: string;
  category: EquipmentCategory;
  manufacturer: string;
  model: string;
  serialNumber: string;
  labId: string;
  labName: string;
  location: string; // e.g. "Workbench 4, Shelf B"
  purchaseDate: string;
  purchaseCost?: number;
  warrantyStatus: "IN_WARRANTY" | "EXPIRED" | "EXTENDED" | "LIFETIME";
  warrantyExpiryDate?: string;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  currentCustodianId?: string;
  currentCustodianName?: string;
  currentCustodianEmail?: string;
  currentCustodianRole?: UserRole;
  lastInspectionDate?: string;
  lastInspectionBy?: string;
  lastMaintenanceDate?: string;
  nextCalibrationDate?: string;
  lastCalibrationDate?: string;
  description: string;
  specifications: EquipmentSpecification[];
  imageUrl?: string;
  qrCode?: string;
  requiresTraining: boolean;
  trainingModule?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRequest {
  id: string;
  equipmentId: string;
  equipmentAssetId: string;
  equipmentName: string;
  equipmentCategory: EquipmentCategory;
  labId: string;
  labName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userDept: string;
  purpose: string;
  projectCourseName?: string;
  requestedStartDate: string;
  requestedEndDate: string;
  actualBorrowDate?: string;
  actualReturnDate?: string;
  status: BorrowStatus;
  approvedById?: string;
  approvedByName?: string;
  approvalDate?: string;
  rejectionReason?: string;
  returnCondition?: EquipmentCondition;
  inspectionNotes?: string;
  inspectedById?: string;
  inspectedByName?: string;
  inspectionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string; // e.g. "MNT-2026-089"
  equipmentId: string;
  equipmentAssetId: string;
  equipmentName: string;
  labId: string;
  labName: string;
  reportedById: string;
  reportedByName: string;
  reportedByRole: UserRole;
  reportedDate: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedDate?: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  issueCategory: "HARDWARE_FAULT" | "CALIBRATION_DRIFT" | "PHYSICAL_DAMAGE" | "SOFTWARE_FIRMWARE" | "ROUTINE_SERVICE" | "ACCESSORY_MISSING";
  issueDescription: string;
  workLogs: {
    id: string;
    authorName: string;
    date: string;
    notes: string;
    statusChange?: MaintenanceStatus;
  }[];
  resolutionNotes?: string;
  partsReplaced?: string[];
  repairCost?: number;
  resolvedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalibrationRecord {
  id: string;
  calibrationNumber: string; // e.g. "CAL-2026-041"
  equipmentId: string;
  equipmentAssetId: string;
  equipmentName: string;
  labId: string;
  labName: string;
  standardUsed: string; // e.g. "ISO 17025 Reference Fluke 8508A"
  calibrationDate: string;
  nextDueDate: string;
  technicianId: string;
  technicianName: string;
  technicianCompany?: string;
  result: "PASS" | "ADJUSTED_AND_PASSED" | "FAIL_OUT_OF_TOLERANCE";
  certificateNumber: string;
  toleranceRange: string;
  measuredError: string;
  notes?: string;
  certificateUrl?: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  entityType: "EQUIPMENT" | "BORROW_REQUEST" | "MAINTENANCE" | "CALIBRATION" | "LAB" | "USER";
  entityId: string;
  equipmentAssetId?: string;
  equipmentName?: string;
  eventType:
    | "EQUIPMENT_CREATED"
    | "EQUIPMENT_UPDATED"
    | "STATUS_CHANGED"
    | "LOCATION_CHANGED"
    | "BORROW_REQUESTED"
    | "BORROW_APPROVED"
    | "BORROW_REJECTED"
    | "EQUIPMENT_CHECKED_OUT"
    | "EQUIPMENT_RETURNED"
    | "INSPECTION_RECORDED"
    | "DAMAGE_REPORTED"
    | "MAINTENANCE_SCHEDULED"
    | "MAINTENANCE_STATUS_UPDATED"
    | "MAINTENANCE_COMPLETED"
    | "CALIBRATION_COMPLETED"
    | "EQUIPMENT_RETIRED";
  title: string;
  description: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  totalEquipment: number;
  availableCount: number;
  borrowedCount: number;
  maintenanceCount: number;
  calibrationDueCount: number;
  openMaintenanceTickets: number;
  pendingBorrowRequests: number;
  totalLabs: number;
  equipmentByStatus: { status: EquipmentStatus; count: number }[];
  equipmentByLab: { labName: string; count: number; available: number }[];
  recentActivity: AuditEvent[];
  urgentAttentionList: {
    equipment: EquipmentItem;
    issueType: "MAINTENANCE_URGENT" | "CALIBRATION_OVERDUE" | "OVERDUE_RETURN" | "DAMAGED";
    details: string;
  }[];
}
