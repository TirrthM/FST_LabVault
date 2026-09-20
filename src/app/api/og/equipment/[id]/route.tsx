import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { db } from "@/data/mock-db";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const item = db.getEquipmentById(id);

    const assetId = item?.assetId || "LV-ASSET-UNKNOWN";
    const name = item?.name || "Laboratory Equipment Asset";
    const labName = item?.labName || "Engineering Core Facility";
    const status = item?.status || "AVAILABLE";
    const condition = item?.condition || "GOOD";
    const manufacturer = item?.manufacturer || "University Laboratory";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#090d16",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "60px 80px",
            color: "#f8fafc",
            fontFamily: "sans-serif",
          }}
        >
          {/* Top Brand & Asset ID */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                LV
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: "800",
                    letterSpacing: "-0.5px",
                    color: "#ffffff",
                  }}
                >
                  LabVault
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Laboratory Equipment Platform
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                padding: "8px 20px",
                borderRadius: "9999px",
                fontSize: "18px",
                fontWeight: "700",
                fontFamily: "monospace",
                color: "#60a5fa",
              }}
            >
              {assetId}
            </div>
          </div>

          {/* Main Equipment Detail Box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1000px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                color: "#38bdf8",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {manufacturer}
            </span>

            <h1
              style={{
                fontSize: "44px",
                fontWeight: "800",
                lineHeight: "1.15",
                color: "#ffffff",
                margin: "0",
              }}
            >
              {name}
            </h1>

            <p
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                margin: "0",
              }}
            >
              Assigned to {labName}
            </p>
          </div>

          {/* Bottom Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #1e293b",
              paddingTop: "28px",
            }}
          >
            <div style={{ display: "flex", gap: "16px" }}>
              <div
                style={{
                  backgroundColor:
                    status === "AVAILABLE"
                      ? "rgba(16, 185, 129, 0.2)"
                      : status === "BORROWED"
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(245, 158, 11, 0.2)",
                  border: `1px solid ${
                    status === "AVAILABLE"
                      ? "#10b981"
                      : status === "BORROWED"
                      ? "#3b82f6"
                      : "#f59e0b"
                  }`,
                  color:
                    status === "AVAILABLE"
                      ? "#34d399"
                      : status === "BORROWED"
                      ? "#60a5fa"
                      : "#fbbf24",
                  padding: "6px 16px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Status: {status}
              </div>

              <div
                style={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  color: "#cbd5e1",
                  padding: "6px 16px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Condition: {condition}
              </div>
            </div>

            <span
              style={{
                fontSize: "16px",
                color: "#64748b",
              }}
            >
              NIST ISO-17025 Tracked Asset
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image: ${e.message}`, {
      status: 500,
    });
  }
}
