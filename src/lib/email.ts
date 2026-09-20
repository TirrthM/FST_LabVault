import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { BorrowApprovedEmail } from "@/emails/BorrowApprovedEmail";
import { BorrowRejectedEmail } from "@/emails/BorrowRejectedEmail";
import { EquipmentDueReminderEmail } from "@/emails/EquipmentDueReminderEmail";
import { MaintenanceAssignedEmail } from "@/emails/MaintenanceAssignedEmail";
import { MaintenanceResolvedEmail } from "@/emails/MaintenanceResolvedEmail";
import { CalibrationDueEmail } from "@/emails/CalibrationDueEmail";
import { CriticalIssueEmail } from "@/emails/CriticalIssueEmail";

// Initialize Resend with API key if configured
const resendApiKey = process.env.RESEND_API_KEY;
const isResendConfigured =
  Boolean(resendApiKey) &&
  resendApiKey !== "re_123456789_abcdefghijklmnopqrstuvwxyz" &&
  resendApiKey !== "re_mock_api_key_for_development";

export const resend = isResendConfigured ? new Resend(resendApiKey) : null;

const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL || "LabVault Notifications <notifications@labvault.edu>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Internal helper to record an email event in the Prisma database or fallback log.
 */
async function logEmailEvent(params: {
  providerEventId?: string;
  messageId?: string;
  eventType: "SENT" | "QUEUED" | "DELIVERED" | "BOUNCED" | "FAILED";
  recipient: string;
  subject: string;
  emailType: string;
  payload?: any;
}) {
  try {
    if (process.env.DATABASE_URL) {
      await prisma.emailEvent.create({
        data: {
          providerEventId: params.providerEventId || `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          messageId: params.messageId || `msg_${Date.now()}`,
          eventType: params.eventType as any,
          recipient: params.recipient,
          subject: params.subject,
          emailType: params.emailType,
          payload: params.payload ? JSON.stringify(params.payload) : undefined,
        },
      });
    }
  } catch (error) {
    // If DB is unreachable or in mock mode, non-fatal
    console.warn("[EmailService] Could not persist EmailEvent to database:", error);
  }
}

export const emailService = {
  /**
   * 1. Send Borrow Approved Notification
   */
  async sendBorrowApproved(params: {
    to: string;
    requesterName: string;
    equipmentName: string;
    assetId: string;
    labName: string;
    startDate: string;
    endDate: string;
    approverName: string;
    approvalNotes?: string | null;
    requisitionNumber: string;
  }): Promise<SendEmailResult> {
    const subject = `Requisition Approved: ${params.equipmentName} (${params.requisitionNumber})`;
    const emailType = "BORROW_APPROVED";

    if (!resend) {
      console.log(`[EmailService:SIMULATED] -> To: ${params.to} | Subject: ${subject}`);
      await logEmailEvent({
        eventType: "DELIVERED",
        recipient: params.to,
        subject,
        emailType,
        payload: { simulated: true, params },
      });
      return { success: true, messageId: `sim_msg_${Date.now()}`, simulated: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: params.to,
        subject,
        react: BorrowApprovedEmail({
          ...params,
          appUrl: APP_URL,
        }),
      });

      if (error) {
        await logEmailEvent({
          eventType: "FAILED",
          recipient: params.to,
          subject,
          emailType,
          payload: { error },
        });
        return { success: false, error: error.message };
      }

      await logEmailEvent({
        messageId: data?.id,
        eventType: "SENT",
        recipient: params.to,
        subject,
        emailType,
        payload: { resendId: data?.id },
      });

      return { success: true, messageId: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message || "Unknown email error" };
    }
  },

  /**
   * 2. Send Borrow Rejected Notification
   */
  async sendBorrowRejected(params: {
    to: string;
    requesterName: string;
    equipmentName: string;
    assetId: string;
    rejectionReason: string;
    requisitionNumber: string;
  }): Promise<SendEmailResult> {
    const subject = `Requisition Update: ${params.requisitionNumber}`;
    const emailType = "BORROW_REJECTED";

    if (!resend) {
      console.log(`[EmailService:SIMULATED] -> To: ${params.to} | Subject: ${subject}`);
      await logEmailEvent({
        eventType: "DELIVERED",
        recipient: params.to,
        subject,
        emailType,
        payload: { simulated: true, params },
      });
      return { success: true, messageId: `sim_msg_${Date.now()}`, simulated: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: params.to,
        subject,
        react: BorrowRejectedEmail({
          ...params,
          appUrl: APP_URL,
        }),
      });

      if (error) return { success: false, error: error.message };
      await logEmailEvent({ messageId: data?.id, eventType: "SENT", recipient: params.to, subject, emailType });
      return { success: true, messageId: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * 3. Send Equipment Due Reminder Notification
   */
  async sendEquipmentDueReminder(params: {
    to: string;
    custodianName: string;
    equipmentName: string;
    assetId: string;
    labName: string;
    expectedEndDate: string;
    requisitionNumber: string;
  }): Promise<SendEmailResult> {
    const subject = `Action Required: Return Due for ${params.equipmentName} (${params.assetId})`;
    const emailType = "DUE_REMINDER";

    if (!resend) {
      console.log(`[EmailService:SIMULATED] -> To: ${params.to} | Subject: ${subject}`);
      await logEmailEvent({
        eventType: "DELIVERED",
        recipient: params.to,
        subject,
        emailType,
        payload: { simulated: true, params },
      });
      return { success: true, messageId: `sim_msg_${Date.now()}`, simulated: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: params.to,
        subject,
        react: EquipmentDueReminderEmail({
          ...params,
          appUrl: APP_URL,
        }),
      });

      if (error) return { success: false, error: error.message };
      await logEmailEvent({ messageId: data?.id, eventType: "SENT", recipient: params.to, subject, emailType });
      return { success: true, messageId: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * 4. Send Maintenance Assigned Notification
   */
  async sendMaintenanceAssigned(params: {
    to: string;
    technicianName: string;
    ticketNumber: string;
    equipmentName: string;
    assetId: string;
    priority: string;
    issueDescription: string;
    reportedByName: string;
  }): Promise<SendEmailResult> {
    const subject = `[Work Order Assigned] ${params.ticketNumber} - ${params.equipmentName}`;
    const emailType = "MAINTENANCE_ASSIGNED";

    if (!resend) {
      console.log(`[EmailService:SIMULATED] -> To: ${params.to} | Subject: ${subject}`);
      await logEmailEvent({
        eventType: "DELIVERED",
        recipient: params.to,
        subject,
        emailType,
        payload: { simulated: true, params },
      });
      return { success: true, messageId: `sim_msg_${Date.now()}`, simulated: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: params.to,
        subject,
        react: MaintenanceAssignedEmail({
          ...params,
          appUrl: APP_URL,
        }),
      });

      if (error) return { success: false, error: error.message };
      await logEmailEvent({ messageId: data?.id, eventType: "SENT", recipient: params.to, subject, emailType });
      return { success: true, messageId: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * 5. Send Maintenance Resolved Notification
   */
  async sendMaintenanceResolved(params: {
    to: string;
    reportedByName: string;
    ticketNumber: string;
    equipmentName: string;
    assetId: string;
    resolutionSummary: string;
    technicianName: string;
  }): Promise<SendEmailResult> {
    const subject = `Maintenance Resolved: ${params.equipmentName} (${params.assetId})`;
    const emailType = "MAINTENANCE_RESOLVED";

    if (!resend) {
      console.log(`[EmailService:SIMULATED] -> To: ${params.to} | Subject: ${subject}`);
      await logEmailEvent({
        eventType: "DELIVERED",
        recipient: params.to,
        subject,
        emailType,
        payload: { simulated: true, params },
      });
      return { success: true, messageId: `sim_msg_${Date.now()}`, simulated: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: params.to,
        subject,
        react: MaintenanceResolvedEmail({
          ...params,
          appUrl: APP_URL,
        }),
      });

      if (error) return { success: false, error: error.message };
      await logEmailEvent({ messageId: data?.id, eventType: "SENT", recipient: params.to, subject, emailType });
      return { success: true, messageId: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * 6. Send Calibration Due Alert
   */
  async sendCalibrationDue(params: {
    to: string;
    labManagerName: string;
    equipmentName: string;
    assetId: string;
    labName: string;
    dueDate: string;
    daysRemaining: number;
    lastCertificateNumber: string;
  }): Promise<SendEmailResult> {
    const subject = `[Metrology Alert] ISO-17025 Calibration Due for ${params.assetId}`;
    const emailType = "CALIBRATION_DUE";

    if (!resend) {
      console.log(`[EmailService:SIMULATED] -> To: ${params.to} | Subject: ${subject}`);
      await logEmailEvent({
        eventType: "DELIVERED",
        recipient: params.to,
        subject,
        emailType,
        payload: { simulated: true, params },
      });
      return { success: true, messageId: `sim_msg_${Date.now()}`, simulated: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: params.to,
        subject,
        react: CalibrationDueEmail({
          ...params,
          appUrl: APP_URL,
        }),
      });

      if (error) return { success: false, error: error.message };
      await logEmailEvent({ messageId: data?.id, eventType: "SENT", recipient: params.to, subject, emailType });
      return { success: true, messageId: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * 7. Send Critical Safety & Equipment Issue Alert
   */
  async sendCriticalIssue(params: {
    to: string;
    recipientName: string;
    ticketNumber: string;
    equipmentName: string;
    assetId: string;
    labName: string;
    issueDescription: string;
    reportedByName: string;
  }): Promise<SendEmailResult> {
    const subject = `🚨 [CRITICAL SAFETY ALERT] ${params.assetId} - Immediate Attention Required`;
    const emailType = "CRITICAL_ISSUE";

    if (!resend) {
      console.log(`[EmailService:SIMULATED] -> To: ${params.to} | Subject: ${subject}`);
      await logEmailEvent({
        eventType: "DELIVERED",
        recipient: params.to,
        subject,
        emailType,
        payload: { simulated: true, params },
      });
      return { success: true, messageId: `sim_msg_${Date.now()}`, simulated: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        to: params.to,
        subject,
        react: CriticalIssueEmail({
          ...params,
          appUrl: APP_URL,
        }),
      });

      if (error) return { success: false, error: error.message };
      await logEmailEvent({ messageId: data?.id, eventType: "SENT", recipient: params.to, subject, emailType });
      return { success: true, messageId: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },
};
