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

interface CalibrationDueEmailProps {
  labManagerName: string;
  equipmentName: string;
  assetId: string;
  labName: string;
  dueDate: string;
  daysRemaining: number;
  lastCertificateNumber: string;
  appUrl?: string;
}

export const CalibrationDueEmail = ({
  labManagerName = "Dr. Sophia Lin",
  equipmentName = "High-Precision Analytical Balance (0.01 mg)",
  assetId = "LV-CHE-1011",
  labName = "Synthetic Chemistry & Chromatography Core",
  dueDate = "2026-10-05",
  daysRemaining = 14,
  lastCertificateNumber = "NIST-CAL-2025-0812",
  appUrl = "http://localhost:3000",
}: CalibrationDueEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>[Metrology Alert] ISO-17025 Calibration Due for {assetId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>🔬 LabVault Metrology Hub</Text>
            <Text style={headerSubtitle}>Laboratory Equipment Lifecycle Platform</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>ISO-17025 Calibration Due Soon ⚖️</Heading>
            <Text style={paragraph}>Dear {labManagerName},</Text>
            <Text style={paragraph}>
              According to institutional quality compliance standards (ISO/IEC 17025:2017), the following instrument is due for NIST-traceable calibration within <strong>{daysRemaining} days</strong>:
            </Text>

            <Section style={card}>
              <Text style={cardItem}><strong>Instrument:</strong> {equipmentName}</Text>
              <Text style={cardItem}><strong>Asset ID:</strong> {assetId}</Text>
              <Text style={cardItem}><strong>Location:</strong> {labName}</Text>
              <Text style={cardItem}><strong>Calibration Expiry:</strong> <span style={dueBadge}>{dueDate}</span></Text>
              <Text style={cardItem}><strong>Previous Certificate:</strong> {lastCertificateNumber}</Text>
            </Section>

            <Text style={paragraph}>
              To maintain academic accreditation and research data integrity, please schedule a certified calibration with the Central Metrology Facility or an external accredited calibration vendor.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/calibration`}>
                Schedule Calibration in LabVault
              </Button>
            </Section>
          </Section>

          <Hr style={footerDivider} />
          <Section style={footer}>
            <Text style={footerText}>
              LabVault Metrology & Quality Assurance • Department of Engineering & Sciences
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CalibrationDueEmail;

const main = { backgroundColor: "#f8fafc", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px", maxWidth: "600px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const header = { padding: "24px 32px 16px", backgroundColor: "#0f172a", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" };
const brand = { color: "#38bdf8", fontSize: "22px", fontWeight: "bold", margin: "0 0 4px" };
const headerSubtitle = { color: "#94a3b8", fontSize: "12px", margin: 0 };
const content = { padding: "32px" };
const h1 = { color: "#ea580c", fontSize: "20px", fontWeight: "700", margin: "0 0 20px" };
const paragraph = { color: "#334155", fontSize: "14px", lineHeight: "24px", margin: "0 0 16px" };
const dueBadge = { color: "#ea580c", fontWeight: "bold" };
const card = { backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "6px", padding: "16px", margin: "20px 0" };
const cardItem = { color: "#7c2d12", fontSize: "13px", lineHeight: "22px", margin: "4px 0" };
const buttonContainer = { textAlign: "center" as const, margin: "28px 0 16px" };
const button = { backgroundColor: "#ea580c", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontWeight: "600", textDecoration: "none", padding: "12px 24px", display: "inline-block" };
const footerDivider = { borderColor: "#e2e8f0", margin: "0 32px" };
const footer = { padding: "20px 32px 0" };
const footerText = { color: "#94a3b8", fontSize: "11px", lineHeight: "18px", margin: "4px 0", textAlign: "center" as const };
