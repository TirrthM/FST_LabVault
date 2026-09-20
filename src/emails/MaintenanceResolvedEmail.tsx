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

interface MaintenanceResolvedEmailProps {
  reportedByName: string;
  ticketNumber: string;
  equipmentName: string;
  assetId: string;
  resolutionSummary: string;
  technicianName: string;
  appUrl?: string;
}

export const MaintenanceResolvedEmail = ({
  reportedByName = "Dr. Marcus Sterling",
  ticketNumber = "TKT-2026-0012",
  equipmentName = "Fourier Transform Infrared Spectrometer (FTIR)",
  assetId = "LV-CHE-1006",
  resolutionSummary = "Replaced damaged SMA connector, cleaned optical flow cell with HPLC-grade methanol, and calibrated baseline.",
  technicianName = "Dave Chen",
  appUrl = "http://localhost:3000",
}: MaintenanceResolvedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Maintenance Resolved: {equipmentName} ({assetId})</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>🔬 LabVault</Text>
            <Text style={headerSubtitle}>Laboratory Equipment Lifecycle Platform</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Equipment Restored to Service 🛠️</Heading>
            <Text style={paragraph}>Dear {reportedByName},</Text>
            <Text style={paragraph}>
              The maintenance ticket <strong>{ticketNumber}</strong> you reported has been resolved by {technicianName}. The equipment is now verified and restored to <span style={badgeAvailable}>AVAILABLE</span> status.
            </Text>

            <Section style={card}>
              <Text style={cardItem}><strong>Asset:</strong> {equipmentName}</Text>
              <Text style={cardItem}><strong>Asset ID:</strong> {assetId}</Text>
              <Text style={cardItem}><strong>Servicing Technician:</strong> {technicianName}</Text>
              <Hr style={cardDivider} />
              <Text style={cardItem}><strong>Resolution Notes:</strong></Text>
              <Text style={resolutionText}>&ldquo;{resolutionSummary}&rdquo;</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/equipment`}>
                View Asset Status
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

export default MaintenanceResolvedEmail;

const main = { backgroundColor: "#f8fafc", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px", maxWidth: "600px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const header = { padding: "24px 32px 16px", backgroundColor: "#0f172a", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" };
const brand = { color: "#38bdf8", fontSize: "22px", fontWeight: "bold", margin: "0 0 4px" };
const headerSubtitle = { color: "#94a3b8", fontSize: "12px", margin: 0 };
const content = { padding: "32px" };
const h1 = { color: "#15803d", fontSize: "20px", fontWeight: "700", margin: "0 0 20px" };
const paragraph = { color: "#334155", fontSize: "14px", lineHeight: "24px", margin: "0 0 16px" };
const badgeAvailable = { backgroundColor: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold" };
const card = { backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", padding: "16px", margin: "20px 0" };
const cardItem = { color: "#14532d", fontSize: "13px", lineHeight: "20px", margin: "4px 0" };
const cardDivider = { borderColor: "#86efac", margin: "10px 0" };
const resolutionText = { color: "#166534", fontSize: "12px", fontStyle: "italic", margin: "4px 0 0" };
const buttonContainer = { textAlign: "center" as const, margin: "28px 0 16px" };
const button = { backgroundColor: "#15803d", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontWeight: "600", textDecoration: "none", padding: "12px 24px", display: "inline-block" };
const footerDivider = { borderColor: "#e2e8f0", margin: "0 32px" };
const footer = { padding: "20px 32px 0" };
const footerText = { color: "#94a3b8", fontSize: "11px", lineHeight: "18px", margin: "4px 0", textAlign: "center" as const };
