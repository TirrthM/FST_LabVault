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

interface EquipmentDueReminderEmailProps {
  custodianName: string;
  equipmentName: string;
  assetId: string;
  labName: string;
  expectedEndDate: string;
  requisitionNumber: string;
  appUrl?: string;
}

export const EquipmentDueReminderEmail = ({
  custodianName = "Alex Rivera",
  equipmentName = "Digital Storage Oscilloscope (4-Channel 1 GHz)",
  assetId = "LV-VLS-1004",
  labName = "VLSI, FPGA & Embedded Systems Lab",
  expectedEndDate = "Tomorrow at 5:00 PM",
  requisitionNumber = "REQ-2026-0038",
  appUrl = "http://localhost:3000",
}: EquipmentDueReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Action Required: Return Due for {assetId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>🔬 LabVault</Text>
            <Text style={headerSubtitle}>Laboratory Equipment Lifecycle Platform</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Reminder: Equipment Return Due ⏰</Heading>
            <Text style={paragraph}>Dear {custodianName},</Text>
            <Text style={paragraph}>
              This is a courtesy reminder that your borrowed laboratory asset is scheduled for return and check-in inspection:
            </Text>

            <Section style={card}>
              <Text style={cardItem}><strong>Requisition:</strong> {requisitionNumber}</Text>
              <Text style={cardItem}><strong>Asset:</strong> {equipmentName}</Text>
              <Text style={cardItem}><strong>Asset ID:</strong> {assetId}</Text>
              <Text style={cardItem}><strong>Return Location:</strong> {labName}</Text>
              <Text style={cardItem}><strong>Scheduled Return:</strong> <span style={dueBadge}>{expectedEndDate}</span></Text>
            </Section>

            <Text style={paragraph}>
              Please ensure all probe leads, power adapters, and calibration covers are returned in good working order. The duty technician will perform an optical and electrical check-in inspection upon handover.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/equipment`}>
                View Asset in LabVault
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

export default EquipmentDueReminderEmail;

const main = { backgroundColor: "#f8fafc", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px", maxWidth: "600px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const header = { padding: "24px 32px 16px", backgroundColor: "#0f172a", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" };
const brand = { color: "#38bdf8", fontSize: "22px", fontWeight: "bold", margin: "0 0 4px" };
const headerSubtitle = { color: "#94a3b8", fontSize: "12px", margin: 0 };
const content = { padding: "32px" };
const h1 = { color: "#b45309", fontSize: "20px", fontWeight: "700", margin: "0 0 20px" };
const paragraph = { color: "#334155", fontSize: "14px", lineHeight: "24px", margin: "0 0 16px" };
const dueBadge = { color: "#b45309", fontWeight: "bold" };
const card = { backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", padding: "16px", margin: "20px 0" };
const cardItem = { color: "#78350f", fontSize: "13px", lineHeight: "22px", margin: "4px 0" };
const buttonContainer = { textAlign: "center" as const, margin: "28px 0 16px" };
const button = { backgroundColor: "#d97706", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontWeight: "600", textDecoration: "none", padding: "12px 24px", display: "inline-block" };
const footerDivider = { borderColor: "#e2e8f0", margin: "0 32px" };
const footer = { padding: "20px 32px 0" };
const footerText = { color: "#94a3b8", fontSize: "11px", lineHeight: "18px", margin: "4px 0", textAlign: "center" as const };
