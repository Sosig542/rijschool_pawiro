import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { REQUIRED_DOC_TYPES } from "@/lib/requiredDocs";

async function getData(
  search: string | undefined,
  status: string | undefined,
  from?: string,
  to?: string
) {
  const where: any = {};
  if (search) {
    const or: any[] = [{ name: { contains: search, mode: "insensitive" } }];
    const num = Number(search);
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
  const students = await prisma.student.findMany({
    where,
    include: { payments: true, documents: true },
    orderBy: { registeredAt: "desc" },
  });
  return students
    .map(
      (s: {
        id: string;
        registrationId: number;
        name: string;
        licenseCategory: string;
        agreedPriceCents: number;
        payments: Array<{ amountCents: number }>;
        documents: Array<{ type: string; isSubmitted: boolean }>;
      }) => {
        const paid = s.payments.reduce(
          (sum: number, p: { amountCents: number }) => sum + p.amountCents,
          0
        );
        const balance = s.agreedPriceCents - paid;
        const missingDocs = REQUIRED_DOC_TYPES.filter(
          (t) =>
            !s.documents.some(
              (d: { type: string; isSubmitted: boolean }) =>
                d.type === t && d.isSubmitted
            )
        );
        const paymentStatus = balance <= 0 ? "paid" : "outstanding";
        return { ...s, paid, balance, missingDocs, paymentStatus };
      }
    )
    .filter((s: { balance: number }) =>
      status ? (status === "paid" ? s.balance <= 0 : s.balance > 0) : true
    );
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; from?: string; to?: string };
}) {
  const students = await getData(
    searchParams.q,
    searchParams.status,
    searchParams.from,
    searchParams.to
  );
  return (
    <main className="space-y-4">
      <div className="flex items-center gap-3">
        <form className="flex flex-wrap gap-2" action="/students">
          <input
            name="q"
            placeholder="Search name or registration ID"
            defaultValue={searchParams.q ?? ""}
          />
          <select name="status" defaultValue={searchParams.status ?? ""}>
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="outstanding">Outstanding</option>
          </select>
          <input
            type="date"
            name="from"
            defaultValue={searchParams.from ?? ""}
          />
          <input type="date" name="to" defaultValue={searchParams.to ?? ""} />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <Link href="/students/new" className="ml-auto btn btn-accent">
          Register Student
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Reg ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">License</th>
              <th className="text-left p-2">Agreed Price</th>
              <th className="text-left p-2">Paid</th>
              <th className="text-left p-2">Balance</th>
              <th className="text-left p-2">Documents</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s: any) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.registrationId}</td>
                <td className="p-2">
                  <Link href={`/students/${s.id}`} className="text-blue-600">
                    {s.name}
                  </Link>
                </td>
                <td className="p-2">{s.licenseCategory}</td>
                <td className="p-2">
                  SRD {(s.agreedPriceCents / 100).toFixed(2)}
                </td>
                <td className="p-2">SRD {(s.paid / 100).toFixed(2)}</td>
                <td
                  className={`p-2 ${
                    s.balance > 0 ? "text-red-600" : "text-green-700"
                  }`}
                >
                  SRD {(s.balance / 100).toFixed(2)}
                </td>
                <td className="p-2">
                  {s.missingDocs.length
                    ? `${s.missingDocs.join(", ")} missing`
                    : "Complete"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
