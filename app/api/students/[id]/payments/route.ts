import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const studentId = params.id;
  const body = await request.json();
  const created = await prisma.payment.create({
    data: { studentId, amountCents: body.amountCents, method: body.method },
  });
  return NextResponse.json(created);
}
