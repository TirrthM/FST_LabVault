import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/data/repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const priority = searchParams.get("priority") || undefined;
  const equipmentId = searchParams.get("equipmentId") || undefined;

  const result = await repository.maintenance.findMany({
    status: status as any,
    priority: priority as any,
    equipmentId,
  });

  return NextResponse.json(result);
}
