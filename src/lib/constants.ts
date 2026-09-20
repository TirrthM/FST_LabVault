/**
 * Application-wide constants for LabVault.
 * Centralised here to prevent magic strings and improve maintainability.
 */

// ────────────────────────────────────────────────────────────────
// App Metadata
// ────────────────────────────────────────────────────────────────
export const APP_NAME = "LabVault";
export const APP_DESCRIPTION =
  "Laboratory Equipment Lifecycle & Maintenance Platform for educational institutions.";
export const APP_VERSION = "1.0.0";

// ────────────────────────────────────────────────────────────────
// Navigation Routes
// ────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  EQUIPMENT: "/equipment",
  EQUIPMENT_DETAIL: (id: string) => `/equipment/${id}` as const,
  BORROW_REQUESTS: "/borrow-requests",
  MAINTENANCE: "/maintenance",
  CALIBRATION: "/calibration",
  LABS: "/labs",
  ACTIVITY: "/activity",
  SETTINGS: "/settings",
  UI_SANDBOX: "/ui",
} as const;

// ────────────────────────────────────────────────────────────────
// Pagination Defaults
// ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [6, 12, 24, 48] as const;

// ────────────────────────────────────────────────────────────────
// Equipment Categories
// ────────────────────────────────────────────────────────────────
export const EQUIPMENT_CATEGORIES = [
  "ANALYTICAL",
  "MEASURING",
  "COMPUTING",
  "SAFETY",
  "OPTICAL",
  "ELECTRICAL",
  "MECHANICAL",
  "CHEMICAL",
  "BIOLOGICAL",
  "GENERAL",
] as const;

export const EQUIPMENT_STATUSES = [
  "AVAILABLE",
  "RESERVED",
  "BORROWED",
  "UNDER_MAINTENANCE",
  "UNDER_CALIBRATION",
  "LOST",
  "RETIRED",
  "DISPOSED",
] as const;

export const EQUIPMENT_CONDITIONS = [
  "NEW",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
  "NEEDS_REPAIR",
] as const;

// ────────────────────────────────────────────────────────────────
// Borrow Request Statuses
// ────────────────────────────────────────────────────────────────
export const BORROW_STATUSES = [
  "REQUESTED",
  "APPROVED",
  "BORROWED",
  "RETURNED",
  "INSPECTED",
  "REJECTED",
] as const;

// ────────────────────────────────────────────────────────────────
// Maintenance Priorities & Statuses
// ────────────────────────────────────────────────────────────────
export const MAINTENANCE_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

export const MAINTENANCE_STATUSES = [
  "OPEN",
  "ASSIGNED",
  "IN_REPAIR",
  "TESTING",
  "RESOLVED",
] as const;

// ────────────────────────────────────────────────────────────────
// Calibration Statuses
// ────────────────────────────────────────────────────────────────
export const CALIBRATION_STATUSES = [
  "CALIBRATED",
  "DUE_SOON",
  "OVERDUE",
  "NOT_REQUIRED",
] as const;

// ────────────────────────────────────────────────────────────────
// User Roles
// ────────────────────────────────────────────────────────────────
export const USER_ROLES = [
  "STUDENT",
  "LAB_TECHNICIAN",
  "LAB_MANAGER",
  "ADMIN",
] as const;

// ────────────────────────────────────────────────────────────────
// Role Capabilities (defines what each role can do in the UI)
// ────────────────────────────────────────────────────────────────
export const ROLE_CAPABILITIES = {
  STUDENT: {
    canBorrow: true,
    canReturn: false,
    canReportIssue: true,
    canApproveBorrow: false,
    canManageMaintenance: false,
    canManageCalibration: false,
    canManageEquipment: false,
    canViewAuditLog: false,
    canManageLabs: false,
  },
  LAB_TECHNICIAN: {
    canBorrow: true,
    canReturn: true,
    canReportIssue: true,
    canApproveBorrow: false,
    canManageMaintenance: true,
    canManageCalibration: true,
    canManageEquipment: false,
    canViewAuditLog: true,
    canManageLabs: false,
  },
  LAB_MANAGER: {
    canBorrow: true,
    canReturn: true,
    canReportIssue: true,
    canApproveBorrow: true,
    canManageMaintenance: true,
    canManageCalibration: true,
    canManageEquipment: true,
    canViewAuditLog: true,
    canManageLabs: true,
  },
  ADMIN: {
    canBorrow: true,
    canReturn: true,
    canReportIssue: true,
    canApproveBorrow: true,
    canManageMaintenance: true,
    canManageCalibration: true,
    canManageEquipment: true,
    canViewAuditLog: true,
    canManageLabs: true,
  },
} as const;

// ────────────────────────────────────────────────────────────────
// Toast Durations
// ────────────────────────────────────────────────────────────────
export const TOAST_DURATION = {
  SHORT: 3000,
  DEFAULT: 5000,
  LONG: 8000,
} as const;

// ────────────────────────────────────────────────────────────────
// Calibration Interval (days)
// ────────────────────────────────────────────────────────────────
export const CALIBRATION_DUE_SOON_DAYS = 30;
export const DEFAULT_CALIBRATION_INTERVAL_DAYS = 365;

// ────────────────────────────────────────────────────────────────
// Debounce Delays
// ────────────────────────────────────────────────────────────────
export const SEARCH_DEBOUNCE_MS = 300;
