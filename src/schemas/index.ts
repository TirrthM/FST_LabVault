import { z } from "zod";

export const borrowEquipmentSchema = z.object({
  equipmentId: z.string().min(1, "Equipment ID is required"),
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userEmail: z.string().email("Valid institutional email is required"),
  userRole: z.enum(["STUDENT", "LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"]),
  purpose: z
    .string()
    .min(10, "Purpose must be at least 10 characters detailing the academic or project use")
    .max(500, "Purpose cannot exceed 500 characters"),
  projectCourseName: z
    .string()
    .min(2, "Course or Project identifier is required (e.g. EE304 Senior Capstone)")
    .max(100, "Course/Project name cannot exceed 100 characters"),
  requestedStartDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid start date is required",
  }),
  requestedEndDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid return date is required",
  }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge custody liability and laboratory safety protocols",
  }),
}).refine(
  (data) => {
    const start = new Date(data.requestedStartDate);
    const end = new Date(data.requestedEndDate);
    return end >= start;
  },
  {
    message: "Return date must be on or after the start date",
    path: ["requestedEndDate"],
  }
);

export type BorrowEquipmentInput = z.infer<typeof borrowEquipmentSchema>;

export const reportIssueSchema = z.object({
  equipmentId: z.string().min(1, "Equipment ID is required"),
  reportedById: z.string().min(1, "Reporter ID is required"),
  reportedByName: z.string().min(2, "Reporter name is required"),
  issueCategory: z.enum([
    "HARDWARE_FAULT",
    "CALIBRATION_DRIFT",
    "PHYSICAL_DAMAGE",
    "SOFTWARE_FIRMWARE",
    "ROUTINE_SERVICE",
    "ACCESSORY_MISSING",
  ], {
    required_error: "Please select an issue category",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
    required_error: "Please select a priority level",
  }),
  issueDescription: z
    .string()
    .min(15, "Please provide a detailed description (at least 15 characters) of the symptoms or damage")
    .max(1000, "Description cannot exceed 1000 characters"),
  observedCondition: z.enum(["GOOD", "FAIR", "DAMAGED", "CRITICAL"], {
    required_error: "Please select the observed physical condition",
  }),
  immediateSafetyHazard: z.boolean().default(false),
});

export type ReportIssueInput = z.infer<typeof reportIssueSchema>;

export const maintenanceRequestSchema = z.object({
  equipmentId: z.string().min(1, "Equipment ID is required"),
  reportedById: z.string().min(1, "Reporter ID is required"),
  reportedByName: z.string().min(2, "Reporter name is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  issueCategory: z.enum([
    "HARDWARE_FAULT",
    "CALIBRATION_DRIFT",
    "PHYSICAL_DAMAGE",
    "SOFTWARE_FIRMWARE",
    "ROUTINE_SERVICE",
    "ACCESSORY_MISSING",
  ]),
  issueDescription: z.string().min(10, "Description must be at least 10 characters"),
  assignedTechnicianId: z.string().optional(),
  assignedTechnicianName: z.string().optional(),
});

export type MaintenanceRequestInput = z.infer<typeof maintenanceRequestSchema>;

export const updateMaintenanceStatusSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  status: z.enum(["OPEN", "ASSIGNED", "IN_REPAIR", "TESTING", "RESOLVED", "REJECTED", "CANCELLED"]),
  technicianNotes: z.string().min(5, "Technician notes must be at least 5 characters"),
  technicianName: z.string().min(2, "Technician name is required"),
  partsReplaced: z.string().optional(),
  repairCost: z.number().min(0).optional(),
  returnToServiceCondition: z.enum(["EXCELLENT", "GOOD", "FAIR"]).optional(),
});

export type UpdateMaintenanceStatusInput = z.infer<typeof updateMaintenanceStatusSchema>;

export const inspectReturnSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  equipmentId: z.string().min(1, "Equipment ID is required"),
  inspectedById: z.string().min(1, "Inspector ID is required"),
  inspectedByName: z.string().min(2, "Inspector name is required"),
  returnCondition: z.enum(["EXCELLENT", "GOOD", "FAIR", "DAMAGED", "CRITICAL"]),
  inspectionNotes: z.string().min(5, "Inspection notes are required (at least 5 characters)"),
  requiresMaintenance: z.boolean().default(false),
  maintenanceReason: z.string().optional(),
});

export type InspectReturnInput = z.infer<typeof inspectReturnSchema>;

export const scheduleCalibrationSchema = z.object({
  equipmentId: z.string().min(1, "Equipment ID is required"),
  standardUsed: z.string().min(3, "Standard / Reference equipment used is required"),
  calibrationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid calibration date is required",
  }),
  nextDueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid next due date is required",
  }),
  technicianName: z.string().min(2, "Technician name is required"),
  technicianCompany: z.string().optional(),
  result: z.enum(["PASS", "ADJUSTED_AND_PASSED", "FAIL_OUT_OF_TOLERANCE"]),
  certificateNumber: z.string().min(3, "Certificate or Traceability Number is required"),
  toleranceRange: z.string().min(2, "Tolerance range is required (e.g. ±0.05% FS)"),
  measuredError: z.string().min(1, "Measured error is required (e.g. +0.012%)"),
  notes: z.string().optional(),
});

export type ScheduleCalibrationInput = z.infer<typeof scheduleCalibrationSchema>;

export const equipmentSchema = z.object({
  assetId: z.string().min(3, "Asset ID is required (e.g. LV-EE-OSC-0104)"),
  name: z.string().min(3, "Equipment name must be at least 3 characters"),
  category: z.enum([
    "OSCILLOSCOPES",
    "POWER_SUPPLIES",
    "SIGNAL_GENERATORS",
    "MULTIMETERS",
    "SPECTRUM_ANALYZERS",
    "MICROCONTROLLERS",
    "ROBOTICS",
    "COMPUTING_AI",
    "OPTICAL_MICROSCOPES",
    "SOLDERING_REWORK",
    "SENSORS_IOT",
    "OTHER",
  ]),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(2, "Serial number is required"),
  labId: z.string().min(1, "Lab assignment is required"),
  location: z.string().min(2, "Location within lab is required (e.g. Bench 3, Rack A)"),
  purchaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid purchase date is required",
  }),
  purchaseCost: z.number().min(0, "Purchase cost must be positive").optional(),
  warrantyStatus: z.enum(["IN_WARRANTY", "EXPIRED", "EXTENDED", "LIFETIME"]),
  warrantyExpiryDate: z.string().optional(),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "DAMAGED", "CRITICAL"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requiresTraining: z.boolean().default(false),
  trainingModule: z.string().optional(),
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;
