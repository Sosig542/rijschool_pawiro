import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const s = await prisma.setting.findFirst();
  return NextResponse.json(s);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const s = await prisma.setting.upsert({
    where: { id: 1 },
    update: { defaultPriceCents: body.defaultPriceCents },
    create: { id: 1, defaultPriceCents: body.defaultPriceCents },
  });
  return NextResponse.json(s);
}
