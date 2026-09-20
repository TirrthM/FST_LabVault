import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/data/repository";
import { getServerSession, authorizeRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!authorizeRole(session.role, ["LAB_TECHNICIAN", "LAB_MANAGER", "ADMIN"])) {
    return NextResponse.json(
      { error: "Forbidden: Audit stream is restricted to authorized personnel" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || undefined;
  const entity = searchParams.get("entity") || undefined;
  const entityId = searchParams.get("entityId") || undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

  const result = await repository.auditLogs.findMany({
    action,
    entity,
    entityId,
    limit,
  });

  return NextResponse.json(result);
}
