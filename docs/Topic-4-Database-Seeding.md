# Topic 4 Technical Note — Database Seeding & Automated Mock Data with Faker.js & Prisma

## 1. Executive Summary

In enterprise full-stack development, developing against empty or hand-coded placeholder databases leads to fragile integration, unrealistic UI layouts, and untested relational boundary conditions. **Topic 4** explores the automated generation of realistic, relational mock datasets using **Prisma ORM** and **Faker.js (`@faker-js/faker`)**.

This document examines relational seeding patterns, foreign-key dependency ordering, weighted distribution modeling, deterministic seeding, and the migration-reset workflow implemented in **LabVault**.

---

## 2. Core Challenges in Relational Seeding

Relational database seeding differs fundamentally from generating isolated JSON mock files due to strict SQL constraints:

1. **Foreign-Key Dependency Ordering**: A child record (e.g., `BorrowRequest`) cannot be inserted before both parent records (`User` and `Equipment`) exist.
2. **Cascading Deletion during Reset**: Wiping existing data must occur in the exact reverse dependency order to avoid foreign-key constraint violations (`23503` in PostgreSQL).
3. **Realistic Relational Graphs**: Randomly pairing records produces meaningless scenarios (e.g., a high-vacuum electron microscope assigned as a portable loan to an introductory freshman biology lab). Believable domain models require category-lab mapping and role-appropriate assignments.
4. **Temporal Consistency**: Timestamps across related events must follow strict chronological causality:
   $$\text{Equipment Acquisition} \le \text{Requisition Creation} \le \text{Approval} \le \text{Handover} \le \text{Inspection} \le \text{Return}$$

---

## 3. Faker.js Architectural Implementation in LabVault

### 3.1 Deterministic Seeding via Pseudo-Random Number Generation (PRNG)

Faker.js defaults to non-deterministic output. In LabVault, the seed engine is initialized with a constant seed:

```typescript
import { faker } from "@faker-js/faker";
faker.seed(123456);
```

This guarantees:
- Identical IDs, names, and relationships across fresh team checkouts.
- Reproducible automated testing environments in CI/CD pipelines.

### 3.2 Weighted Distribution Modeling

Rather than uniform random distribution, LabVault uses `faker.helpers.weightedArrayElement` to mirror realistic academic lab statistics:

```typescript
// Role distribution: 65% Students, 20% Technicians, 10% Managers, 5% Admins
const role = faker.helpers.weightedArrayElement([
  { weight: 65, value: UserRole.STUDENT },
  { weight: 20, value: UserRole.TECHNICIAN },
  { weight: 10, value: UserRole.LAB_MANAGER },
  { weight: 5, value: UserRole.ADMIN },
]);

// Equipment status: Majority Available, subset borrowed or in service
const status = faker.helpers.weightedArrayElement([
  { weight: 55, value: EquipmentStatus.AVAILABLE },
  { weight: 20, value: EquipmentStatus.BORROWED },
  { weight: 10, value: EquipmentStatus.UNDER_MAINTENANCE },
  { weight: 10, value: EquipmentStatus.UNDER_CALIBRATION },
  { weight: 5, value: EquipmentStatus.RESERVED },
]);
```

### 3.3 Domain-Specific Lexicons

To avoid generic lorem ipsum placeholder text, LabVault combines Faker modules (`faker.science`, `faker.person`, `faker.number`) with curated engineering equipment catalog templates:

- Real scientific manufacturers: *Thermo Fisher Scientific, Keysight Technologies, Agilent, Instron, PerkinElmer*.
- Realistic fault logs: *"Turbo-molecular vacuum pump exhibiting abnormal harmonic vibration at 1500 Hz."*
- NIST standards: *"NIST Traceable Class E2 Precision Mass Standard Set (Cert #NIST-98214)."*

---

## 4. Reverse Dependency Clean-Up & Insertion Pipeline

LabVault executes seeding through a multi-stage transactional pipeline:

```typescript
// 1. Teardown: Reverse Dependency Order
await prisma.emailEvent.deleteMany({});
await prisma.auditLog.deleteMany({});
await prisma.calibrationRecord.deleteMany({});
await prisma.maintenanceWorkLog.deleteMany({});
await prisma.maintenanceTicket.deleteMany({});
await prisma.borrowRequest.deleteMany({});
await prisma.equipment.deleteMany({});
await prisma.lab.deleteMany({});
await prisma.user.deleteMany({});

// 2. Build Pipeline: Top-Down Dependency Insertion
// Stage 1: Deterministic Core Users + 25 Faker Users
// Stage 2: 6 Specialized Academic Facilities (Labs)
// Stage 3: 65+ Equipment Assets (mapped to Labs & Custodians)
// Stage 4: 90 Borrow Requisitions (with approvals & inspections)
// Stage 5: 35 Maintenance Tickets + 60+ Work Logs
// Stage 6: 35 ISO-17025 Calibration Records
// Stage 7: 130 Immutable Chain-of-Custody Audit Logs
// Stage 8: 25 Transactional Email Delivery Event Logs
```

---

## 5. Migration, Reset & Seeding Commands

The complete developer workflow is codified in [`package.json`](file:///d:/LabVault/package.json):

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset --force",
    "db:seed": "tsx prisma/seed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

- **`npm run db:generate`**: Generates full TypeScript types in `@prisma/client`.
- **`npm run db:migrate`**: Applies schema changes and updates Prisma migration lockfile.
- **`npm run db:reset`**: Wipes the database, re-executes all migrations from scratch, and triggers `prisma.seed` automatically.
- **`npm run db:seed`**: Directly populates the database using `tsx prisma/seed.ts`.

---

## 6. Lessons Learned & Best Practices

1. **Decouple Faker from UI components**: The seed script belongs exclusively in `prisma/seed.ts` and should never be bundled into client-side JS bundles.
2. **Always seed deterministic IDs for demo logins**: Grade review and manual testing depend on known account logins (`usr_student_01`, `usr_tech_01`, `usr_mgr_01`).
3. **Use JSON fields for extensible metadata**: Storing detailed equipment specifications and audit telemetry as JSON strings (`@db.Text`) allows rich UI formatting without over-normalizing peripheral attributes.
