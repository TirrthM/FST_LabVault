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

interface CriticalIssueEmailProps {
  recipientName: string;
  ticketNumber: string;
  equipmentName: string;
  assetId: string;
  labName: string;
  issueDescription: string;
  reportedByName: string;
  appUrl?: string;
}

export const CriticalIssueEmail = ({
  recipientName = "Dr. Eleanor Vance",
  ticketNumber = "TKT-2026-0008",
  equipmentName = "Field Emission Scanning Electron Microscope (FE-SEM)",
  assetId = "LV-MIC-1001",
  labName = "Advanced Microscopy & Nanoscale Imaging Lab",
  issueDescription = "Turbo-molecular vacuum pump exhibiting abnormal harmonic vibration at 1500 Hz. Potential rotor failure risk.",
  reportedByName = "Dave Chen",
  appUrl = "http://localhost:3000",
}: CriticalIssueEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>🚨 [CRITICAL SAFETY ALERT] {assetId} - Immediate Attention Required</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>⚠️ LabVault Safety Dispatch</Text>
            <Text style={headerSubtitle}>Laboratory Equipment Lifecycle Platform</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>CRITICAL Equipment Fault Reported 🚨</Heading>
            <Text style={paragraph}>Attention: {recipientName},</Text>
            <Text style={paragraph}>
              A <strong>CRITICAL PRIORITY</strong> hardware fault has been logged on a high-value asset. The instrument has been automatically locked and placed into <span style={badgeMaintenance}>UNDER_MAINTENANCE</span> status to prevent damage or safety hazards:
            </Text>

            <Section style={card}>
              <Text style={cardItem}><strong>Ticket Number:</strong> {ticketNumber}</Text>
              <Text style={cardItem}><strong>Asset:</strong> {equipmentName}</Text>
              <Text style={cardItem}><strong>Asset ID:</strong> {assetId}</Text>
              <Text style={cardItem}><strong>Facility:</strong> {labName}</Text>
              <Text style={cardItem}><strong>Reported By:</strong> {reportedByName}</Text>
              <Hr style={cardDivider} />
              <Text style={cardItem}><strong>Safety & Fault Description:</strong></Text>
              <Text style={criticalText}>&ldquo;{issueDescription}&rdquo;</Text>
            </Section>

            <Text style={paragraph}>
              <strong>Required Immediate Action:</strong> Please assign a senior technician and inspect the physical safety interlocks immediately.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/maintenance`}>
                View Work Order in Service Bay
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

export default CriticalIssueEmail;

const main = { backgroundColor: "#f8fafc", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px", maxWidth: "600px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const header = { padding: "24px 32px 16px", backgroundColor: "#7f1d1d", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" };
const brand = { color: "#fca5a5", fontSize: "22px", fontWeight: "bold", margin: "0 0 4px" };
const headerSubtitle = { color: "#fecaca", fontSize: "12px", margin: 0 };
const content = { padding: "32px" };
const h1 = { color: "#991b1b", fontSize: "20px", fontWeight: "700", margin: "0 0 20px" };
const paragraph = { color: "#334155", fontSize: "14px", lineHeight: "24px", margin: "0 0 16px" };
const badgeMaintenance = { backgroundColor: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold" };
const card = { backgroundColor: "#fef2f2", border: "1px solid #f87171", borderRadius: "6px", padding: "16px", margin: "20px 0" };
const cardItem = { color: "#7f1d1d", fontSize: "13px", lineHeight: "20px", margin: "4px 0" };
const cardDivider = { borderColor: "#fca5a5", margin: "10px 0" };
const criticalText = { color: "#991b1b", fontSize: "13px", fontWeight: "600", margin: "4px 0 0" };
const buttonContainer = { textAlign: "center" as const, margin: "28px 0 16px" };
const button = { backgroundColor: "#dc2626", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontWeight: "600", textDecoration: "none", padding: "12px 24px", display: "inline-block" };
const footerDivider = { borderColor: "#e2e8f0", margin: "0 32px" };
const footer = { padding: "20px 32px 0" };
const footerText = { color: "#94a3b8", fontSize: "11px", lineHeight: "18px", margin: "4px 0", textAlign: "center" as const };
