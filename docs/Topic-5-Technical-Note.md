# Topic 5 Technical Note — Transactional Email Integration with Resend & React Email

## 1. Executive Summary

Transactional email is a mission-critical subsystem in laboratory management platforms. When a high-value piece of equipment is damaged, overdue for return, or due for safety-critical calibration, immediate notifications must reach researchers and compliance officers.

**Topic 5** documents the architectural design, implementation, and security controls of the transactional email pipeline in **LabVault**, built using **Resend**, **React Email (`@react-email/components`)**, and secure **Webhook Event Logging**.

---

## 2. Architecture of the Email Dispatch & Lifecycle Pipeline

```
  User / Scheduled Trigger
            ↓
  Next.js Server Action
  (Role & Zod Validation)
            ↓
  Prisma Database Transaction (Commit)
            ↓
  Email Service (`src/lib/email.ts`)
            ↓
  React Email JSX Template (`src/emails/*.tsx`)
            ↓
  Resend REST API (HTTPS Dispatch)
            ↓
  Recipient Inbox (e.g., student@labvault.edu)
            ↓
  Resend Webhook Event (`email.delivered`, `email.bounced`, etc.)
            ↓
  Next.js Route Handler (`/api/webhooks/resend`)
  (Svix Cryptographic Signature Verification)
            ↓
  Prisma `EmailEvent` Database Record
```

---

## 3. Componentized Email Design with React Email

Traditional transactional emails rely on fragile HTML string concatenation or cumbersome template engines (Handlebars/Mustache). React Email transforms email development into standard React components:

### 3.1 Type-Safe Reusable Templates

LabVault implements **7 distinct, modular React Email templates** in [`src/emails/`](file:///d:/LabVault/src/emails/):

1. **`BorrowApprovedEmail.tsx`**: Requisition approval with pickup instructions and scheduled handover times.
2. **`BorrowRejectedEmail.tsx`**: Clear reason for rejection and links to alternative available assets.
3. **`EquipmentDueReminderEmail.tsx`**: Timely reminder before loan expiration to prevent overdue penalties.
4. **`MaintenanceAssignedEmail.tsx`**: Technician work order notification with fault description and priority badge.
5. **`MaintenanceResolvedEmail.tsx`**: Equipment restoration notice sent to the reporting researcher.
6. **`CalibrationDueEmail.tsx`**: Metrology alert for NIST-traceable calibration expiration (ISO-17025).
7. **`CriticalIssueEmail.tsx`**: High-urgency alert for immediate safety hazards and hardware faults.

### 3.2 HTML Email Compatibility & Inlining

React Email compiles JSX down to email-client-compatible HTML with inline CSS:
- Tables for bulletproof cross-client layout rendering (Outlook, Apple Mail, Gmail).
- CSS custom styling conforming to email client styling constraints.
- Semantic header with brand banner and mobile-responsive container sizing (max 600px width).

---

## 4. Resend Integration & Server-Side Security

### 4.1 Strict Environment Variable Isolation

API keys are restricted to server execution only:

```typescript
// src/lib/email.ts
const resendApiKey = process.env.RESEND_API_KEY;
const isResendConfigured =
  Boolean(resendApiKey) &&
  resendApiKey !== "re_123456789_abcdefghijklmnopqrstuvwxyz" &&
  resendApiKey !== "re_mock_api_key_for_development";

export const resend = isResendConfigured ? new Resend(resendApiKey) : null;
```

- If `RESEND_API_KEY` is present and valid, live emails are dispatched via the Resend API.
- In local development or test mode without credentials, the service **gracefully simulates dispatch**, logging the structured event payload to the console and the `EmailEvent` database table without throwing exceptions or blocking user workflows.

---

## 5. Webhook Architecture & Svix Signature Verification

To maintain delivery visibility and track bounces or compliance issues, LabVault exposes a dedicated webhook endpoint at:
```
/api/webhooks/resend
```

### 5.1 Webhook Signature Verification

To protect against spoofing and replay attacks, incoming webhook requests are cryptographically verified using **Svix** against `RESEND_WEBHOOK_SECRET`:

```typescript
// src/app/api/webhooks/resend/route.ts
const svixId = req.headers.get("svix-id");
const svixTimestamp = req.headers.get("svix-timestamp");
const svixSignature = req.headers.get("svix-signature");

const wh = new Webhook(webhookSecret);
wh.verify(rawBody, {
  "svix-id": svixId,
  "svix-timestamp": svixTimestamp,
  "svix-signature": svixSignature,
});
```

### 5.2 Persisting Delivery Events

Verified webhook events are stored in the `EmailEvent` model:

```prisma
model EmailEvent {
  id              String         @id @default(cuid())
  providerEventId String?        @unique
  messageId       String?
  eventType       EmailEventType @default(SENT)
  recipient       String
  subject         String
  emailType       String
  payload         String?        @db.Text
  timestamp       DateTime       @default(now())
}
```

This provides lab managers with a clear audit log of delivered vs. bounced messages.

---

## 6. Findings & Production Best Practices

1. **Non-Blocking Email Dispatch**: Email delivery should occur after the database transaction commits. An email failure must not roll back a successful equipment return or calibration.
2. **Dynamic Preview Cards**: Using `<Preview>` in React Email ensures subject line context is legible in notification shade popups.
3. **Institutional DKIM/SPF Compliance**: For live institutional deployments, verify DNS records (DKIM, SPF, DMARC) on the sending domain (`labvault.edu`) to ensure 99%+ deliverability.
