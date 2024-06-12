import { prisma } from "@/lib/prisma";
import { NextRequest as nreq, NextResponse as nres } from "next/server";
import type { User } from "@/interfaces/user.i";
import { comparePassword, encryptPassword } from "@/lib/crypto";

export async function GET(req: nreq) {
  try {
    const users = await prisma.user.findMany({ where: { deletedAt: null } });
    return nres.json({ data: users, message: `Fetched ${users.length} users` }, { status: 200 });
  } catch (e: any) {
    return nres.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
export async function POST(req: nreq) {
  try {
    const { username, email, password } = await req.json();
    const newUser = await prisma.user.create({ data: { username: username, email: email, password: await encryptPassword(password) } });
    return newUser.id ? nres.json({ data: newUser, message: "Successfuly created new user" }, { status: 200 }) : nres.json({ data: newUser, message: "Unsuccessfuly create new user" }, { status: 400 });
  } catch (e: any) {
    return nres.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
export async function PUT(req: nreq) {
  try {
    const { id, username, email, password }: User = await req.json();
    const user = await prisma.user.findFirst({ where: { id: id } });
    if (user?.deletedAt !== null) return nres.json({ data: [], message: "Unsuccessfuly update a user" }, { status: 400 });
    if (await comparePassword(password, user?.password)) {
      const updatedUser = await prisma.user.update({ data: { username: username, email: email }, where: { id: id } });
      return updatedUser.id ? nres.json({ data: updatedUser, message: "Successfuly updated a user" }, { status: 200 }) : nres.json({ data: updatedUser, message: "Unsuccessfuly update a user" }, { status: 400 });
    } else return nres.json({ data: [], message: "Unsuccessfuly update a user, password does not match." }, { status: 400 });
  } catch (e: any) {
    return nres.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
export async function DELETE(req: nreq) {
  try {
    const { id }: User = await req.json();
    const user = await prisma.user.findFirst({ where: { id: id } });
    if (user?.deletedAt !== null) return nres.json({ data: [], message: "Unsuccessfuly delete a user" }, { status: 400 });
    const deletedUser = await prisma.user.update({ data: { deletedAt: new Date() }, where: { id: id } });
    return deletedUser.deletedAt !== null ? nres.json({ deletedUser }, { status: 200 }) : nres.json({ message: "Unsucessfuly delete user, user not found" }, { status: 400 });
  } catch (e: any) {
    return nres.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}
