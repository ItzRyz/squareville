import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "@/interfaces/user.i";
import { comparePassword, encryptPassword } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ data: users, message: `Fetched ${users.length} users` }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const data: User = await req.json();
    const { username, email, password } = data;
    const newUser = await prisma.user.create({ data: { username: username, email: email, password: await encryptPassword(password) } });
    return newUser.id ? NextResponse.json({ data: newUser, message: "Successfuly created new user" }, { status: 200 }) : NextResponse.json({ data: newUser, message: "Unsuccessfuly create new user" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const data: User = await req.json();
    const { id, username, email, password } = data;
    const user = await prisma.user.findFirst({ where: { id: id } });
    if (await comparePassword(password, user?.password)) {
      const updatedUser = await prisma.user.update({ data: { username: username, email: email }, where: { id: id } });
      return updatedUser.id ? NextResponse.json({ data: updatedUser, message: "Successfuly updated a user" }, { status: 200 }) : NextResponse.json({ data: updatedUser, message: "Unsuccessfuly update a user" }, { status: 400 });
    } else return NextResponse.json({ data: [], message: "Unsuccessfuly update a user, password does not match." }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
  } catch (e: any) {}
}
