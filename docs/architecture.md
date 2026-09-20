# LabVault — System Architecture & Domain Model

## 1. Architectural Overview

LabVault is built using the **Next.js App Router**, **React Server Components (RSC)**, **TypeScript**, **Tailwind CSS**, and **Radix UI**. The core architectural philosophy is **Separation of Concerns (SoC)**, **Domain-Driven Design (DDD)**, and **Future-Proof Persistence Abstraction**.

```mermaid
graph TD
    Client[Browser Client] -->|HTTP / React Hydration| NextApp[Next.js App Router]
    
    subgraph "Server Layer (Next.js)"
        RSC[React Server Components] -->|Read-Only Data Fetch| Repo[Repository Layer]
        Actions[Server Actions] -->|Double Zod Validation| Repo
        OG[Edge OG Generator] -->|Asset Preview Card| Repo
    end

    subgraph "Data & Persistence Abstraction"
        Repo -->|Assignment 1| MockDB[In-Memory Transactional Mock DB]
        Repo -.->|Assignment 2 (Future)| Prisma[Prisma ORM + PostgreSQL]
    end

    subgraph "Client State Layer"
        Client --> Zustand[Zustand Client Store]
        Zustand --> LocalStorage[(Browser LocalStorage)]
    end
```

---

## 2. Domain Models & Entity Relationships

The domain entities represent the realistic operational requirements of an engineering university:

1. **Equipment (`EquipmentItem`)**: Central asset entity. Tracks commercial name, manufacturer, model, serial number, physical bench location, purchase value, warranty, current status, condition, and NIST calibration schedule.
2. **Laboratory (`Lab`)**: Academic facility hosting assets (e.g., Electronics & Circuit Design, AIML & HPC, Embedded Systems, Robotics).
3. **User (`User`)**: Institutional identity representing Students, Technicians, Managers, or Admins.
4. **Borrow Requisition (`BorrowRequest`)**: Multi-stage loan workflow (`REQUESTED` $\to$ `APPROVED` $\to$ `BORROWED` $\to$ `INSPECTED` $\to$ `AVAILABLE`).
5. **Maintenance Ticket (`MaintenanceTicket`)**: Service record tracking diagnosis, work logs, parts replaced, repair costs, and return-to-service validation.
6. **Calibration Record (`CalibrationRecord`)**: ISO-17025 certificate tracking transfer standards used, max error offsets, and due dates.
7. **Audit Event (`AuditEvent`)**: Immutable timestamped event stream capturing all physical custody handovers, inspections, and lifecycle transitions.

---

## 3. Data Access Layer (Repository Pattern)

To ensure that **Assignment 2** can replace the mock data store with **Prisma ORM** without breaking existing Server Components or Server Actions, all persistence operations are abstracted through `src/data/repository.ts`:

- `equipmentRepository.findMany(filters)`
- `equipmentRepository.findById(id)`
- `equipmentRepository.create(data)`
- `equipmentRepository.update(id, data)`
- `borrowRepository.create(data)`
- `borrowRepository.approve(id, approverId, approverName)`
- `borrowRepository.checkout(id)`
- `borrowRepository.returnAndInspect(params)`
- `maintenanceRepository.create(data)`
- `maintenanceRepository.updateStatus(params)`
- `calibrationRepository.create(data)`
- `auditRepository.findMany(filters)`
- `dashboardRepository.getStats()`

In Assignment 2, each method implementation will simply execute a `prisma.<model>.findMany()` or `prisma.<model>.update()` query.

---

## 4. Multi-Role Capability Matrix

| Feature / Action | Student | Lab Technician | Lab Manager | System Admin |
| :--- | :---: | :---: | :---: | :---: |
| Browse & Search Catalog | ✅ | ✅ | ✅ | ✅ |
| Submit Borrow Requisition | ✅ | ✅ | ✅ | ✅ |
| Report Malfunction / Damage | ✅ | ✅ | ✅ | ✅ |
| View Equipment Custody Timeline | ✅ | ✅ | ✅ | ✅ |
| Approve / Reject Requisitions | ❌ | ❌ | ✅ | ✅ |
| Perform Physical Handover (Checkout) | ❌ | ✅ | ✅ | ✅ |
| Perform Return Inspection & Rating | ❌ | ✅ | ✅ | ✅ |
| Update Maintenance Work Orders | ❌ | ✅ | ❌ | ✅ |
| Record ISO-17025 Metrology Certs | ❌ | ✅ | ✅ | ✅ |
| Commission New Laboratory Assets | ❌ | ❌ | ✅ | ✅ |
| Reset System / Manage Facilities | ❌ | ❌ | ❌ | ✅ |
