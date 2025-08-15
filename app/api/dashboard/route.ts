import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  const students = await prisma.student.findMany({
    include: {
      documents: true,
      payments: true,
    },
  });

  const totalStudents = students.length;

  const totalReceived = students.reduce((sum: number, s: any) => {
    const studentPayments = s.payments.reduce(
      (pSum: number, p: any) => pSum + p.amountCents,
      0
    );
    return sum + studentPayments;
  }, 0);

  const totalOutstanding = students.reduce((sum: number, s: any) => {
    const studentPayments = s.payments.reduce(
      (pSum: number, p: any) => pSum + p.amountCents,
      0
    );
    const outstanding = s.agreedPriceCents - studentPayments;
    return sum + Math.max(0, outstanding);
  }, 0);

  // Filter by month if specified
  let monthFilteredReceived = totalReceived;
  if (month) {
    const [year, monthNum] = month.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    monthFilteredReceived = students.reduce((sum: number, s: any) => {
      const monthPayments = s.payments
        .filter((p: any) => {
          const paymentDate = new Date(p.paymentDate);
          return paymentDate >= startDate && paymentDate <= endDate;
        })
        .reduce((pSum: number, p: any) => pSum + p.amountCents, 0);
      return sum + monthPayments;
    }, 0);
  }

  return NextResponse.json({
    totalStudents,
    totalReceived,
    monthFilteredReceived,
    totalOutstanding,
  });
}
