# LabVault — Authentication & Role-Based Authorization Flow

This document details the multi-layered security and server-side authorization architecture of **LabVault** (Assignment 2).

---

## 🔒 Layered Defense Model

LabVault enforces security across **three distinct defensive barriers**:

```
1. Client-Side UI Layer (Visual context & role simulation)
       ↓
2. Next.js Edge Middleware Layer (Route-level protection & cookie verification)
       ↓
3. Server Actions & Route Handlers (Mandatory cryptographic session validation & business authorization)
       ↓
4. Prisma Transactional Database & Immutable Audit Log
```

> [!CAUTION]
> **Zero Trust on Client State:**
> Client-side role selection (Zustand) is strictly for UI presentation and previewing. All Server Actions and API Route Handlers cryptographically decode the `labvault_session` signed JWT cookie on the server. Client-supplied role parameters are discarded and never trusted for permissions.

---

## 🔄 End-to-End Authorization Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Technician / Manager
    participant Browser as Client Browser (Next.js)
    participant MW as Middleware (middleware.ts)
    participant SA as Server Action (e.g. approveBorrowRequest)
    participant Auth as Auth Service (lib/auth.ts)
    participant Zod as Zod Schema Validator
    participant DB as Prisma PostgreSQL Transaction
    participant Email as Resend Email Service
    participant Audit as Immutable AuditLog

    User->>Browser: Triggers Action (e.g., "Approve Requisition")
    Browser->>MW: HTTP POST / Server Action Request (with cookie)
    
    rect rgb(240, 249, 255)
    Note over MW: Barrier 1: Edge Middleware
    MW->>MW: Verify JWT cookie signature (HS256)
    alt Invalid or Expired Token
        MW-->>Browser: Redirect to /dashboard or Return 401 Unauthorized
    else Valid Token
        MW->>MW: Attach x-user-role & x-user-id headers
        MW->>SA: Forward Request to Server Action
    end
    end

    rect rgb(255, 247, 237)
    Note over SA,Auth: Barrier 2: Server-Side RBAC Enforcement
    SA->>Auth: getServerSession()
    Auth-->>SA: Return { user, role, isAuthenticated }
    SA->>Auth: authorizeRole(session.role, ["LAB_MANAGER", "ADMIN"])
    alt Role Unauthorized (e.g., STUDENT trying to approve)
        SA-->>Browser: Return { success: false, error: "Forbidden: 403" }
    end
    end

    rect rgb(240, 253, 244)
    Note over SA,Zod: Barrier 3: Input Validation
    SA->>Zod: safeParse(input)
    alt Validation Failed
        SA-->>Browser: Return { success: false, fieldErrors }
    end
    end

    rect rgb(248, 250, 252)
    Note over SA,DB: Barrier 4: Transaction & Notifications
    SA->>DB: prisma.$transaction([updateBorrow, updateEquipment, createAudit])
    DB-->>SA: Transaction Committed
    SA->>Email: emailService.sendBorrowApproved(...)
    Email-->>SA: Dispatch OK
    SA->>SA: revalidatePath(/borrow-requests)
    SA-->>Browser: Return { success: true, data }
    end

    Browser->>User: UI Updates & Displays Success Toast Notification
```

---

## 👥 Role Capability Matrix

| Feature / Action | STUDENT | TECHNICIAN | LAB_MANAGER | ADMIN |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Equipment Catalog** | ✅ | ✅ | ✅ | ✅ |
| **View Equipment Details & Specs** | ✅ | ✅ | ✅ | ✅ |
| **Submit Borrow Requisition** | ✅ | ✅ | ✅ | ✅ |
| **Report Equipment Fault / Issue** | ✅ | ✅ | ✅ | ✅ |
| **Approve / Reject Borrow Requisitions** | ❌ | ❌ | ✅ | ✅ |
| **Physical Handover / Check-Out** | ❌ | ✅ | ✅ | ✅ |
| **Post-Return Inspection & Check-In** | ❌ | ✅ | ✅ | ✅ |
| **Update Maintenance Work Orders** | ❌ | ✅ | ✅ | ✅ |
| **Record ISO-17025 Calibrations** | ❌ | ✅ | ✅ | ✅ |
| **Commission New Equipment Asset** | ❌ | ❌ | ✅ | ✅ |
| **View System-Wide Audit Log Stream** | ❌ | ✅ | ✅ | ✅ |
| **System Settings & User Administration**| ❌ | ❌ | ❌ | ✅ |

---

## 🚫 Handling Authorization Failures

When authorization fails:
1. **Edge Middleware**: Blocks unauthorized navigation to restricted URL segments (e.g. `/calibration` for Students) and issues an instant 307 redirect to `/dashboard?error=unauthorized_calibration_access`.
2. **Server Actions**: Returns structured `{ success: false, error: "Forbidden: You do not have permission to perform this action." }` without performing mutations.
3. **Route Handlers (`/api/*`)**: Returns an HTTP `403 Forbidden` response with a JSON error payload.
4. **Audit Logging**: Unauthorized tampering attempts are logged to server telemetry.
