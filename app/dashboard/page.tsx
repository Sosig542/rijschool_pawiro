import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getMetrics(month?: string) {
  try {
    const [students, payments] = await Promise.all([
      prisma.student.findMany({ include: { documents: true, payments: true } }),
      prisma.payment.findMany(),
    ]);
    const totalStudents = students.length;
    const missingDocs = students.filter(
      (s: { documents: Array<{ type: string }> }) => {
        const required = [
          "Pasfoto",
          "Rijbewijsuittreksel",
          "Leges bewijs",
          "Plakzegels",
          "Doktersverklaring",
          "Kopie ID/Rijbewijs",
        ];
        return required.some(
          (t) => !s.documents.some((d: { type: string }) => d.type === t)
        );
      }
    ).length;
    let filteredPayments = payments as Array<{
      amountCents: number;
      paidAt: Date | string;
    }>;
    if (month) {
      const start = new Date(`${month}-01T00:00:00`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filteredPayments = payments.filter((p: any) => {
        const dt = new Date(p.paidAt);
        return dt >= start && dt < end;
      });
    }
    const totalReceived = filteredPayments.reduce(
      (sum: number, p: { amountCents: number }) => sum + p.amountCents,
      0
    );
    const totalOutstanding = students.reduce(
      (
        sum: number,
        s: {
          payments: Array<{ amountCents: number }>;
          agreedPriceCents: number;
        }
      ) => {
        const paid = s.payments.reduce(
          (ps: number, p: { amountCents: number }) => ps + p.amountCents,
          0
        );
        return sum + Math.max(s.agreedPriceCents - paid, 0);
      },
      0
    );
    return { totalStudents, missingDocs, totalReceived, totalOutstanding };
  } catch {
    return {
      totalStudents: 0,
      missingDocs: 0,
      totalReceived: 0,
      totalOutstanding: 0,
    };
  }
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const m = await getMetrics(searchParams.month);
  return (
    <main className="space-y-6">
      <form action="/dashboard" className="flex items-end gap-3">
        <div>
          <label className="block text-sm text-gray-600">Filter month</label>
          <input
            type="month"
            name="month"
            defaultValue={searchParams.month ?? ""}
          />
        </div>
        <button type="submit">Apply</button>
        <a className="text-blue-600 underline" href="/dashboard">
          Clear
        </a>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat">
          <div className="text-sm text-gray-500">Total Students</div>
          <div className="text-2xl font-semibold" id="metric-total-students">
            {m.totalStudents}
          </div>
        </div>
        <div className="stat">
          <div className="text-sm text-gray-500">Missing Documents</div>
          <div className="text-2xl font-semibold" id="metric-missing-docs">
            {m.missingDocs}
          </div>
        </div>
        <div className="stat">
          <div className="text-sm text-gray-500">
            Total Received{" "}
            {searchParams.month ? `(for ${searchParams.month})` : ""}
          </div>
          <div className="text-2xl font-semibold" id="metric-total-received">
            SRD {(m.totalReceived / 100).toFixed(2)}
          </div>
        </div>
        <div className="stat">
          <div className="text-sm text-gray-500">Total Outstanding</div>
          <div className="text-2xl font-semibold" id="metric-total-outstanding">
            SRD {(m.totalOutstanding / 100).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link className="btn btn-secondary" href="/students">
          View Students
        </Link>
        <Link href="/students/new" className="btn btn-accent gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M12 5a7 7 0 1 1-4.95 11.95L4.1 19.9a1 1 0 0 1-1.41-1.41l1.95-1.95A7 7 0 0 1 12 5Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm1 2a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1V10a1 1 0 0 1 1-1Z" />
          </svg>
          Register Student
        </Link>
        <Link className="btn btn-secondary" href="/lessons">
          Manage Lessons
        </Link>
        <Link className="btn btn-secondary" href="/settings">
          Settings
        </Link>
        <Link className="btn btn-secondary" href="/api/export/students">
          Export CSV
        </Link>
      </div>
    </main>
  );
}
