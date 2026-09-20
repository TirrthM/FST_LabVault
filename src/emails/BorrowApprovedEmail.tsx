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

interface BorrowApprovedEmailProps {
  requesterName: string;
  equipmentName: string;
  assetId: string;
  labName: string;
  startDate: string;
  endDate: string;
  approverName: string;
  approvalNotes?: string | null;
  requisitionNumber: string;
  appUrl?: string;
}

export const BorrowApprovedEmail = ({
  requesterName = "Alex Rivera",
  equipmentName = "Field Emission Scanning Electron Microscope",
  assetId = "LV-MIC-1002",
  labName = "Advanced Microscopy & Nanoscale Imaging Lab",
  startDate = "2026-09-22",
  endDate = "2026-09-29",
  approverName = "Dr. Sophia Lin",
  approvalNotes = "Approved for graduate thesis imaging. Please check in with the duty technician before power-up.",
  requisitionNumber = "REQ-2026-0042",
  appUrl = "http://localhost:3000",
}: BorrowApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your LabVault Requisition {requisitionNumber} has been Approved</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>🔬 LabVault</Text>
            <Text style={headerSubtitle}>Laboratory Equipment Lifecycle Platform</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Requisition Approved ✅</Heading>
            <Text style={paragraph}>Dear {requesterName},</Text>
            <Text style={paragraph}>
              Your equipment requisition <strong>{requisitionNumber}</strong> has been{" "}
              <span style={badgeApproved}>APPROVED</span> by {approverName}.
            </Text>

            <Section style={card}>
              <Text style={cardTitle}>Equipment Details</Text>
              <Hr style={cardDivider} />
              <Text style={cardItem}><strong>Asset:</strong> {equipmentName}</Text>
              <Text style={cardItem}><strong>Asset ID:</strong> {assetId}</Text>
              <Text style={cardItem}><strong>Location:</strong> {labName}</Text>
              <Text style={cardItem}><strong>Access Period:</strong> {startDate} to {endDate}</Text>
              {approvalNotes && (
                <Text style={cardItem}><strong>Approval Notes:</strong> {approvalNotes}</Text>
              )}
            </Section>

            <Text style={paragraph}>
              <strong>Next Steps:</strong> Present this notification to the lab technician at{" "}
              {labName} during your scheduled start time to receive the physical custody key and complete the handover inspection.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/borrow-requests`}>
                View Requisition in LabVault
              </Button>
            </Section>
          </Section>

          <Hr style={footerDivider} />
          <Section style={footer}>
            <Text style={footerText}>
              LabVault Metrology & Equipment Management • Department of Engineering & Sciences
            </Text>
            <Text style={footerText}>
              This is an automated institutional notification. Please do not reply directly to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BorrowApprovedEmail;

const main = {
  backgroundColor: "#f8fafc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const header = {
  padding: "24px 32px 16px",
  backgroundColor: "#0f172a",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
};

const brand = {
  color: "#38bdf8",
  fontSize: "22px",
  fontWeight: "bold",
  margin: "0 0 4px",
};

const headerSubtitle = {
  color: "#94a3b8",
  fontSize: "12px",
  margin: 0,
};

const content = {
  padding: "32px",
};

const h1 = {
  color: "#0f172a",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 20px",
};

const paragraph = {
  color: "#334155",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const badgeApproved = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "2px 8px",
  borderRadius: "4px",
  fontWeight: "600",
};

const card = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "16px",
  margin: "20px 0",
};

const cardTitle = {
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 8px",
};

const cardDivider = {
  borderColor: "#cbd5e1",
  margin: "8px 0 12px",
};

const cardItem = {
  color: "#475569",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "4px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "28px 0 16px",
};

const button = {
  backgroundColor: "#0284c7",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footerDivider = {
  borderColor: "#e2e8f0",
  margin: "0 32px",
};

const footer = {
  padding: "20px 32px 0",
};

const footerText = {
  color: "#94a3b8",
  fontSize: "11px",
  lineHeight: "18px",
  margin: "4px 0",
  textAlign: "center" as const,
};
