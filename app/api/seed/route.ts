import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function doSeed() {
  const existing = await prisma.user.findFirst();
  if (!existing) {
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin",
        password: await hash("password", 10),
      },
    });
  }

  const setting = await prisma.setting.findFirst();
  if (!setting) {
    await prisma.setting.create({ data: { id: 1, defaultPriceCents: 250000 } });
  }
  return { ok: true };
}

export async function POST() {
  return NextResponse.json(await doSeed());
}

export async function GET() {
  return NextResponse.json(await doSeed());
}
