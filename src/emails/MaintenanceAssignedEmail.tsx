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

interface MaintenanceAssignedEmailProps {
  technicianName: string;
  ticketNumber: string;
  equipmentName: string;
  assetId: string;
  priority: string;
  issueDescription: string;
  reportedByName: string;
  appUrl?: string;
}

export const MaintenanceAssignedEmail = ({
  technicianName = "Dave Chen",
  ticketNumber = "TKT-2026-0012",
  equipmentName = "Fourier Transform Infrared Spectrometer (FTIR)",
  assetId = "LV-CHE-1006",
  priority = "HIGH",
  issueDescription = "Optical detector baseline drift exceeding ±0.05 AU/hr during solvent gradient elution.",
  reportedByName = "Dr. Marcus Sterling",
  appUrl = "http://localhost:3000",
}: MaintenanceAssignedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>[Work Order Assigned] {ticketNumber} - {equipmentName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>🔬 LabVault Service Bay</Text>
            <Text style={headerSubtitle}>Laboratory Equipment Lifecycle Platform</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Work Order Assigned 🔧</Heading>
            <Text style={paragraph}>Hello {technicianName},</Text>
            <Text style={paragraph}>
              You have been assigned to service order <strong>{ticketNumber}</strong> for the following instrument:
            </Text>

            <Section style={card}>
              <Text style={cardItem}><strong>Ticket Number:</strong> {ticketNumber}</Text>
              <Text style={cardItem}><strong>Asset:</strong> {equipmentName}</Text>
              <Text style={cardItem}><strong>Asset ID:</strong> {assetId}</Text>
              <Text style={cardItem}><strong>Priority:</strong> <span style={priorityBadge}>{priority}</span></Text>
              <Text style={cardItem}><strong>Reported By:</strong> {reportedByName}</Text>
              <Hr style={cardDivider} />
              <Text style={cardItem}><strong>Reported Fault:</strong></Text>
              <Text style={issueText}>&ldquo;{issueDescription}&rdquo;</Text>
            </Section>

            <Text style={paragraph}>
              Please perform initial diagnostics and update the work log entries in the technician queue.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/maintenance`}>
                Open Technician Service Bay
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

export default MaintenanceAssignedEmail;

const main = { backgroundColor: "#f8fafc", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px", maxWidth: "600px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const header = { padding: "24px 32px 16px", backgroundColor: "#0f172a", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" };
const brand = { color: "#38bdf8", fontSize: "22px", fontWeight: "bold", margin: "0 0 4px" };
const headerSubtitle = { color: "#94a3b8", fontSize: "12px", margin: 0 };
const content = { padding: "32px" };
const h1 = { color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 20px" };
const paragraph = { color: "#334155", fontSize: "14px", lineHeight: "24px", margin: "0 0 16px" };
const priorityBadge = { backgroundColor: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "11px" };
const card = { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "16px", margin: "20px 0" };
const cardItem = { color: "#334155", fontSize: "13px", lineHeight: "20px", margin: "4px 0" };
const cardDivider = { borderColor: "#e2e8f0", margin: "10px 0" };
const issueText = { color: "#64748b", fontSize: "12px", fontStyle: "italic", margin: "4px 0 0" };
const buttonContainer = { textAlign: "center" as const, margin: "28px 0 16px" };
const button = { backgroundColor: "#0284c7", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontWeight: "600", textDecoration: "none", padding: "12px 24px", display: "inline-block" };
const footerDivider = { borderColor: "#e2e8f0", margin: "0 32px" };
const footer = { padding: "20px 32px 0" };
const footerText = { color: "#94a3b8", fontSize: "11px", lineHeight: "18px", margin: "4px 0", textAlign: "center" as const };
