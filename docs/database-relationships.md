# LabVault — Database Relationships & Relational ER Model

This document outlines the normalized relational database architecture of **LabVault** (Assignment 2), built with **Prisma ORM** and **PostgreSQL**.

---

## 📊 Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ LAB : "manages"
    USER ||--o{ EQUIPMENT : "custody_holds"
    USER ||--o{ BORROW_REQUEST : "requests"
    USER ||--o{ BORROW_REQUEST : "approves"
    USER ||--o{ BORROW_REQUEST : "inspects"
    USER ||--o{ MAINTENANCE_TICKET : "reports"
    USER ||--o{ MAINTENANCE_TICKET : "assigned_to"
    USER ||--o{ MAINTENANCE_WORK_LOG : "logs_work"
    USER ||--o{ CALIBRATION_RECORD : "calibrates"
    USER ||--o{ AUDIT_LOG : "performs"

    LAB ||--o{ EQUIPMENT : "houses"

    EQUIPMENT ||--o{ BORROW_REQUEST : "requisitioned_for"
    EQUIPMENT ||--o{ MAINTENANCE_TICKET : "serviced_under"
    EQUIPMENT ||--o{ CALIBRATION_RECORD : "calibrated_under"
    EQUIPMENT ||--o{ AUDIT_LOG : "audited_under"

    MAINTENANCE_TICKET ||--o{ MAINTENANCE_WORK_LOG : "contains"

    USER {
        string id PK
        string name
        string email UK
        enum role "STUDENT, TECHNICIAN, LAB_MANAGER, ADMIN"
        string department
        string avatarUrl
        datetime createdAt
        datetime updatedAt
    }

    LAB {
        string id PK
        string code UK
        string name
        string location
        string department
        int capacity
        string managerId FK
        datetime createdAt
        datetime updatedAt
    }

    EQUIPMENT {
        string id PK
        string assetId UK "LV-LAB-####"
        string name
        enum category "ANALYTICAL, OPTICAL, ELECTRICAL, etc."
        string manufacturer
        string model
        string serialNumber UK
        enum status "AVAILABLE, BORROWED, UNDER_MAINTENANCE, etc."
        enum condition "NEW, GOOD, FAIR, POOR, DAMAGED, NEEDS_REPAIR"
        string labId FK
        string currentCustodianId FK
        datetime purchaseDate
        float purchaseCost
        datetime warrantyExpiry
        datetime lastInspectionAt
        string specifications "JSON"
        datetime createdAt
        datetime updatedAt
    }

    BORROW_REQUEST {
        string id PK
        string requisitionNumber UK "REQ-YYYY-####"
        string equipmentId FK
        string userId FK "Requester"
        string purpose
        string projectCourseName
        datetime requestedStartDate
        datetime requestedEndDate
        datetime actualReturnDate
        enum status "REQUESTED, APPROVED, BORROWED, RETURNED, INSPECTED, REJECTED"
        string approvedById FK
        string approvalNotes
        enum returnCondition
        string inspectionNotes
        string inspectedById FK
        datetime createdAt
        datetime updatedAt
    }

    MAINTENANCE_TICKET {
        string id PK
        string ticketNumber UK "TKT-YYYY-####"
        string equipmentId FK
        string reportedById FK
        string assignedTechnicianId FK
        string issue
        enum priority "LOW, MEDIUM, HIGH, CRITICAL"
        enum status "OPEN, ASSIGNED, IN_REPAIR, TESTING, RESOLVED"
        string resolution
        datetime resolvedAt
        float estimatedCost
        float actualCost
        datetime createdAt
        datetime updatedAt
    }

    MAINTENANCE_WORK_LOG {
        string id PK
        string ticketId FK
        string technicianId FK
        string notes
        string partsReplaced
        float timeSpentHours
        datetime loggedAt
        datetime createdAt
    }

    CALIBRATION_RECORD {
        string id PK
        string certificateNumber UK "NIST-CAL-YYYY-####"
        string equipmentId FK
        string technicianId FK
        datetime calibrationDate
        datetime nextDueDate
        string standardUsed
        string accuracyReading
        enum calibrationStatus "CALIBRATED, DUE_SOON, OVERDUE"
        string certificateUrl
        string notes
        datetime createdAt
        datetime updatedAt
    }

    AUDIT_LOG {
        string id PK
        enum action "EQUIPMENT_CREATED, BORROW_APPROVED, etc."
        string entity "Equipment, BorrowRequest, etc."
        string entityId FK
        string actorId FK
        string details "JSON"
        string ipAddress
        datetime timestamp
    }

    EMAIL_EVENT {
        string id PK
        string providerEventId UK
        string messageId
        enum eventType "SENT, DELIVERED, OPENED, BOUNCED, FAILED"
        string recipient
        string subject
        string emailType "BORROW_APPROVED, CRITICAL_ISSUE, etc."
        string payload "JSON"
        datetime timestamp
        datetime createdAt
    }
```

---

## 🔗 Relational Rules & Foreign-Key Integrity

### 1. User & Laboratory Relationships
- A `Lab` has a single `managerId` referencing a `User` with `LAB_MANAGER` or `ADMIN` role.
- If a user is deleted, `managerId` is set to `SetNull` to preserve lab records.

### 2. Equipment Custody & Facility Allocation
- Every `Equipment` item MUST belong to a valid `Lab` (`onDelete: Restrict`).
- An equipment item may optionally have a `currentCustodianId` referencing an active borrowing student or technician (`onDelete: SetNull`).
- When a borrow request progresses to `BORROWED`, `currentCustodianId` is updated atomically to the borrower's ID.

### 3. Borrowing & Chain of Custody
- A `BorrowRequest` links a `User` (requester) and an `Equipment` item.
- It tracks two additional user relationships: `approvedById` (the Lab Manager who approved the loan) and `inspectedById` (the Technician who completed the post-return check-in).
- If the equipment is deleted, historical borrow requisitions cascade delete (`onDelete: Cascade`).

### 4. Maintenance Work Orders & Work Logs
- A `MaintenanceTicket` is linked to the faulty `Equipment` and the reporting `User`.
- `assignedTechnicianId` references the active duty technician.
- Each ticket can contain multiple `MaintenanceWorkLog` entries (`1:N`), recording technician timestamps, diagnostic notes, and replaced components.

### 5. Metrology & ISO-17025 Calibrations
- `CalibrationRecord` references `Equipment` and the certified `technicianId` who performed the calibration procedure with NIST-traceable standards.

### 6. Audit Trail & Chain of Custody
- Every status transition across equipment, loans, work orders, and calibrations writes an immutable record to `AuditLog`.
- `AuditLog.actorId` links directly to the authenticated `User` who performed the mutation.
