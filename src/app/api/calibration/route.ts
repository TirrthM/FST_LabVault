import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/data/repository";
import { getServerSession, authorizeRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!authorizeRole(session.role, ["LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"])) {
    return NextResponse.json(
      { error: "Forbidden: Calibration data is restricted to technical staff" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const equipmentId = searchParams.get("equipmentId") || undefined;

  const result = await repository.calibration.findMany({
    status: status as any,
    equipmentId,
  });

  return NextResponse.json(result);
}
