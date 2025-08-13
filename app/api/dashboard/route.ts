import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { REQUIRED_DOC_TYPES } from "@/lib/requiredDocs";

export async function GET() {
  const [students, payments] = await Promise.all([
    prisma.student.findMany({ include: { documents: true, payments: true } }),
    prisma.payment.findMany(),
  ]);

  const totalStudents = students.length;
  const missingDocs = students.filter(
    (s: { documents: Array<{ type: string }> }) =>
      REQUIRED_DOC_TYPES.some(
        (t) => !s.documents.some((d: { type: string }) => d.type === t)
      )
  ).length;
  const totalReceived = payments.reduce(
    (sum: number, p: { amountCents: number }) => sum + p.amountCents,
    0
  );
  const totalOutstanding = students.reduce(
    (
      sum: number,
      s: { payments: Array<{ amountCents: number }>; agreedPriceCents: number }
    ) => {
      const paid = s.payments.reduce(
        (ps: number, p: { amountCents: number }) => ps + p.amountCents,
        0
      );
      return sum + Math.max(s.agreedPriceCents - paid, 0);
    },
    0
  );

  return NextResponse.json({
    totalStudents,
    missingDocs,
    totalReceived,
    totalOutstanding,
  });
}
