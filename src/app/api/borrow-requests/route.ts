import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/data/repository";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const equipmentId = searchParams.get("equipmentId") || undefined;

  // If student, filter to only own requests unless specific query
  const userId = session.role === "STUDENT" ? session.user.id : searchParams.get("userId") || undefined;

  const result = await repository.borrowRequests.findMany({
    status: status as any,
    userId,
    equipmentId,
  });

  return NextResponse.json(result);
}
