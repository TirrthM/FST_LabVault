# LabVault — Transactional Email Dispatch & Webhook Delivery Log

## 1. Overview & Testing Policy

This document serves as the testing procedure and verifiable dispatch log for **LabVault's** transactional email subsystem powered by **Resend** and **React Email**.

> [!IMPORTANT]
> **Academic Integrity & Transparency Policy:**
> In accordance with project instructions, this log documents actual executed test procedures and provides a standardized testing verification log. No fabricated delivery IDs, fake timestamps, or synthetic delivery claims are recorded as live external deliveries when running in mock or simulated mode.

---

## 2. Configured Transactional Email Triggers

The following 7 transactional triggers are integrated into LabVault Server Actions:

| Trigger Action | React Email Template | Recipient Role | Triggering Event / Server Action |
| :--- | :--- | :--- | :--- |
| **Borrow Approved** | `BorrowApprovedEmail.tsx` | Student (Requester) | `approveBorrowRequestAction` executed by Lab Manager |
| **Borrow Rejected** | `BorrowRejectedEmail.tsx` | Student (Requester) | `rejectBorrowRequestAction` executed by Lab Manager |
| **Return Due Reminder** | `EquipmentDueReminderEmail.tsx` | Custodian Student | Scheduled automated check (1 day before loan expiration) |
| **Maintenance Assigned** | `MaintenanceAssignedEmail.tsx` | Technician | Work order assigned to technician in service bay |
| **Maintenance Resolved** | `MaintenanceResolvedEmail.tsx` | Faculty / Reporter | `updateMaintenanceStatusAction` with status `RESOLVED` |
| **Calibration Due** | `CalibrationDueEmail.tsx` | Lab Manager | Metrology check detects calibration expiration ≤ 14 days |
| **Critical Safety Alert**| `CriticalIssueEmail.tsx` | Dean / Admin | `reportEquipmentIssueAction` with `CRITICAL` or hazard flagged |

---

## 3. Environment Modes & Execution Behavior

### Mode A: Live Production Dispatch (`RESEND_API_KEY` configured)
When a valid Resend API key is supplied in `.env.local`:
1. The Server Action renders the React Email JSX template to HTML via `@react-email/components`.
2. The payload is sent via HTTPS POST to `https://api.resend.com/emails`.
3. Resend dispatches to the recipient's mail exchanger and returns a unique message ID (e.g. `msg_01HZX...`).
4. Webhooks sent to `/api/webhooks/resend` record `DELIVERED`, `OPENED`, or `BOUNCED` events in the `EmailEvent` table.

### Mode B: Local Development / Simulated Dispatch (Default)
When running without external API credentials or in offline development:
1. The `emailService` in [`src/lib/email.ts`](file:///d:/LabVault/src/lib/email.ts) detects the placeholder key.
2. It logs the structured dispatch event directly to the development console:
   ```
   [EmailService:SIMULATED] -> To: alex.rivera@student.labvault.edu | Subject: Requisition Approved: FE-SEM (REQ-2026-0042)
   ```
3. It creates an `EmailEvent` record in the database with status `DELIVERED` and payload `simulated: true`, allowing complete testing of the workflow without external internet dependencies or API costs.

---

## 4. Verification & Testing Procedure

To test live delivery:
1. Register a free account at [resend.com](https://resend.com) and generate an API key.
2. Add your verified email to `.env.local`:
   ```bash
   RESEND_API_KEY="re_live_your_actual_key"
   RESEND_FROM_EMAIL="LabVault <onboarding@resend.dev>"
   ```
3. Switch role to **Lab Manager** in the header.
4. Navigate to `/borrow-requests` and click **Approve** on a requisition.
5. Check your recipient inbox and observe the formatted React Email with dark-theme branding and equipment metadata.
