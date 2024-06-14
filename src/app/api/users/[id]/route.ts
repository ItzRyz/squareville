import { prisma } from "@/lib/prisma";
import { NextRequest as nreq, NextResponse as nres } from "next/server";

export async function GET(req: nreq, { params }: { params: { id: number } }) {
  try {
    const users = await prisma.user.findFirst({ where: { deletedAt: null, id: Number.parseInt(params.id as any) } });
    return users ? nres.json({ data: users, message: `Successfully fetched user` }, { status: 200 }) : nres.json({ data: users, message: `Unsuccessfully fetch user` }, { status: 400 });
  } catch (e: any) {
    return nres.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
