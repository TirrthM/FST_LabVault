import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface BorrowRejectedEmailProps {
  requesterName: string;
  equipmentName: string;
  assetId: string;
  rejectionReason: string;
  requisitionNumber: string;
  appUrl?: string;
}

export const BorrowRejectedEmail = ({
  requesterName = "Maya Patel",
  equipmentName = "Universal Mechanical Testing System (50 kN)",
  assetId = "LV-MAT-1008",
  rejectionReason = "Scheduling priority reserved for ECE-512 Departmental Lab Exam.",
  requisitionNumber = "REQ-2026-0043",
  appUrl = "http://localhost:3000",
}: BorrowRejectedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Update regarding your Requisition {requisitionNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>🔬 LabVault</Text>
            <Text style={headerSubtitle}>Laboratory Equipment Lifecycle Platform</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Requisition Update: Not Approved</Heading>
            <Text style={paragraph}>Dear {requesterName},</Text>
            <Text style={paragraph}>
              We are writing to notify you that your equipment requisition <strong>{requisitionNumber}</strong> for{" "}
              <strong>{equipmentName} ({assetId})</strong> could not be approved at this time.
            </Text>

            <Section style={card}>
              <Text style={cardTitle}>Reason for Decision</Text>
              <Hr style={cardDivider} />
              <Text style={reasonText}>&ldquo;{rejectionReason}&rdquo;</Text>
            </Section>

            <Text style={paragraph}>
              You are welcome to submit an alternative requisition for a different time window or consult your Lab Manager for equivalent equipment alternatives.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/equipment`}>
                Browse Available Equipment
              </Button>
            </Section>
          </Section>

          <Hr style={footerDivider} />
          <Section style={footer}>
            <Text style={footerText}>
              LabVault Metrology & Equipment Management • Department of Engineering & Sciences
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BorrowRejectedEmail;

const main = { backgroundColor: "#f8fafc", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px", maxWidth: "600px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const header = { padding: "24px 32px 16px", backgroundColor: "#0f172a", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" };
const brand = { color: "#38bdf8", fontSize: "22px", fontWeight: "bold", margin: "0 0 4px" };
const headerSubtitle = { color: "#94a3b8", fontSize: "12px", margin: 0 };
const content = { padding: "32px" };
const h1 = { color: "#991b1b", fontSize: "20px", fontWeight: "700", margin: "0 0 20px" };
const paragraph = { color: "#334155", fontSize: "14px", lineHeight: "24px", margin: "0 0 16px" };
const card = { backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "16px", margin: "20px 0" };
const cardTitle = { color: "#991b1b", fontSize: "13px", fontWeight: "600", margin: "0 0 8px" };
const cardDivider = { borderColor: "#fca5a5", margin: "8px 0 12px" };
const reasonText = { color: "#7f1d1d", fontSize: "13px", fontStyle: "italic", margin: 0 };
const buttonContainer = { textAlign: "center" as const, margin: "28px 0 16px" };
const button = { backgroundColor: "#475569", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontWeight: "600", textDecoration: "none", padding: "12px 24px", display: "inline-block" };
const footerDivider = { borderColor: "#e2e8f0", margin: "0 32px" };
const footer = { padding: "20px 32px 0" };
const footerText = { color: "#94a3b8", fontSize: "11px", lineHeight: "18px", margin: "4px 0", textAlign: "center" as const };
