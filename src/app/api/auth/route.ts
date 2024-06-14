import { User } from "@/interfaces/user.i";
import { comparePassword, encryptPassword } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { NextRequest as nreq, NextResponse as nres } from "next/server";

export async function POST(req: nreq) {
  try {
    const { username, email, password }: User = await req.json();
    const users = await prisma.user.findMany({ where: { deletedAt: null, OR: [{ email: email }, { username: username }] } });
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        if (await comparePassword(password, users[i].password)) return nres.json({ data: users, message: `Login success!` }, { status: 200 });
        else return nres.json({ data: [], message: `Login unsuccess, password wrong!` }, { status: 400 });
      }
    } else return nres.json({ data: [], message: `Login unsuccess, user not found!` }, { status: 200 });
  } catch (e: any) {
    return nres.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
