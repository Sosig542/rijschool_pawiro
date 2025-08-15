import { prisma } from "@/lib/prisma";
import { REQUIRED_DOC_TYPES } from "@/lib/requiredDocs";

export async function GET() {
  const students = await prisma.student.findMany({
    include: { payments: true, documents: true },
  });
  const rows = [
    [
      "RegistrationId",
      "Name",
      "Contact",
      "Address",
      "License",
      "AgreedPriceSRD",
      "PaidSRD",
      "BalanceSRD",
      "MissingDocuments",
    ],
  ];
  for (const s of students) {
    const paid = s.payments.reduce(
      (sum: number, p: { amountCents: number }) => sum + p.amountCents,
      0
    );
    const balance = s.agreedPriceCents - paid;
    const missing = REQUIRED_DOC_TYPES.filter(
      (t) =>
        !s.documents.some(
          (d: { type: string; isSubmitted: boolean }) =>
            d.type === t && d.isSubmitted
        )
    );
    rows.push([
      String(s.registrationId),
      s.name,
      s.contact,
      s.address,
      s.licenseCategory,
      (s.agreedPriceCents / 100).toFixed(2),
      (paid / 100).toFixed(2),
      (balance / 100).toFixed(2),
      missing.join("; "),
    ]);
  }
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="students.csv"',
    },
  });
}
