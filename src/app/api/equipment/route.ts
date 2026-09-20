import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/data/repository";
import { getServerSession, authorizeRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const labId = searchParams.get("labId") || undefined;
  const category = searchParams.get("category") || undefined;
  const status = searchParams.get("status") || undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
  const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!, 10) : undefined;

  const result = await repository.equipment.findMany({
    search,
    labId,
    category: category as any,
    status: status as any,
    limit,
    offset,
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!authorizeRole(session.role, ["LAB_MANAGER", "ADMIN"])) {
    return NextResponse.json(
      { error: "Forbidden: Only Lab Managers and Admins can commission new equipment" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const created = await repository.equipment.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
