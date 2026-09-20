import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Resend Webhook Event Handler
 * Receives real-time delivery, bounce, open, and click notifications from Resend.
 * Verifies webhook signatures with Svix.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Verify signature with svix if secret configured
    if (webhookSecret && webhookSecret !== "whsec_mock_webhook_secret_development") {
      const svixId = req.headers.get("svix-id");
      const svixTimestamp = req.headers.get("svix-timestamp");
      const svixSignature = req.headers.get("svix-signature");

      if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json(
          { error: "Missing required svix headers for signature verification" },
          { status: 400 }
        );
      }

      const wh = new Webhook(webhookSecret);
      try {
        wh.verify(rawBody, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch (err: any) {
        console.error("[Webhook:Resend] Signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { type, data } = payload;

    console.log(`[Webhook:Resend] Received event: ${type}`, data);

    // Map Resend event type to internal enum
    let eventType: "DELIVERED" | "BOUNCED" | "COMPLAINED" | "FAILED" | "OPENED" | "CLICKED" | "SENT" = "SENT";
    if (type === "email.delivered") eventType = "DELIVERED";
    else if (type === "email.bounced") eventType = "BOUNCED";
    else if (type === "email.complained") eventType = "COMPLAINED";
    else if (type === "email.failed") eventType = "FAILED";
    else if (type === "email.opened") eventType = "OPENED";
    else if (type === "email.clicked") eventType = "CLICKED";

    // Persist to Prisma EmailEvent table if database configured
    if (process.env.DATABASE_URL && data) {
      try {
        await prisma.emailEvent.create({
          data: {
            providerEventId: data.email_id || `resend_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            messageId: data.email_id || `msg_${Date.now()}`,
            eventType,
            recipient: Array.isArray(data.to) ? data.to.join(", ") : data.to || "unknown@recipient.edu",
            subject: data.subject || `Notification (${type})`,
            emailType: type,
            payload: JSON.stringify(payload),
            timestamp: data.created_at ? new Date(data.created_at) : new Date(),
          },
        });
      } catch (dbErr) {
        console.warn("[Webhook:Resend] Could not write event to database:", dbErr);
      }
    }

    return NextResponse.json({ received: true, eventType });
  } catch (error: any) {
    console.error("[Webhook:Resend] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing error", message: error.message },
      { status: 500 }
    );
  }
}
