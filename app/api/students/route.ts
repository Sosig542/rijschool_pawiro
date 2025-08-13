import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { REQUIRED_DOC_TYPES } from "@/lib/requiredDocs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const status = searchParams.get("status") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const where: any = {};
  if (q) {
    const or: any[] = [{ name: { contains: q, mode: "insensitive" } }];
    const num = Number(q);
    if (!Number.isNaN(num)) {
      or.push({ registrationId: num });
    }
    where.OR = or;
  }
  if (from || to) {
    where.registeredAt = {};
    if (from) where.registeredAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.registeredAt.lte = end;
    }
  }
  const many = await prisma.student.findMany({
    include: { documents: true, payments: true },
    where,
  });
  const data = many
    .map(
      (s: {
        payments: Array<{ amountCents: number }>;
        agreedPriceCents: number;
        documents: Array<{ type: string }>;
      }) => {
        const paid = s.payments.reduce(
          (sum: number, p: { amountCents: number }) => sum + p.amountCents,
          0
        );
        const balance = s.agreedPriceCents - paid;
        const paymentStatus = balance <= 0 ? "paid" : "outstanding";
        const missingDocs = REQUIRED_DOC_TYPES.filter(
          (t) => !s.documents.some((d) => d.type === t)
        );
        return { ...s, paid, balance, paymentStatus, missingDocs };
      }
    )
    .filter((s: { balance: number }) =>
      status ? (status === "paid" ? s.balance <= 0 : s.balance > 0) : true
    );
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const created = await prisma.student.create({ data: body });
  return NextResponse.json(created);
}
