import { prisma } from "@/lib/prisma";
import { REQUIRED_DOC_TYPES } from "@/lib/requiredDocs";
import { notFound, redirect } from "next/navigation";
import DocumentManager from "@/app/components/DocumentManager";

async function getStudent(id: string) {
  const s = await prisma.student.findUnique({
    where: { id },
    include: { payments: { orderBy: { paidAt: "desc" } }, documents: true },
  });
  if (!s) return null;
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
  return { ...s, paid, balance, missing };
}

export default async function StudentDetail({
  params,
}: {
  params: { id: string };
}) {
  const s = await getStudent(params.id);
  if (!s) return notFound();
  return (
    <main className="space-y-6">
      <div className="bg-white border rounded p-4">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <div className="text-sm text-gray-600">
              Reg ID: {s.registrationId}
            </div>
            <div className="text-sm">
              {s.contact} • {s.address} • Cat {s.licenseCategory}
            </div>
          </div>
          <div className="text-right">
            <div>Agreed: SRD {(s.agreedPriceCents / 100).toFixed(2)}</div>
            <div>Paid: SRD {(s.paid / 100).toFixed(2)}</div>
            <div
              className={`${s.balance > 0 ? "text-red-600" : "text-green-700"}`}
            >
              Balance: SRD {(s.balance / 100).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white border rounded p-4">
        <h3 className="font-semibold mb-3">Exam Status</h3>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          action={updateExamStatus.bind(null, s.id)}
        >
          <div>
            <label>Theory</label>
            <select name="theory" defaultValue={s.theoryStatus}>
              <option value="GESLAAGD">Geslaagd</option>
              <option value="NIET_GEHAALD">Niet gehaald</option>
            </select>
          </div>
          <div>
            <label>Praktijk</label>
            <select
              name="practical"
              defaultValue={s.practicalStatus}
              disabled={
                s.theoryStatus !== "GESLAAGD" &&
                s.practicalStatus !== "GESLAAGD"
              }
            >
              <option value="GESLAAGD">Geslaagd</option>
              <option value="NIET_GEHAALD">Niet gehaald</option>
            </select>
          </div>
          <div>
            <label>Theory Exam Date</label>
            <input
              type="datetime-local"
              name="theoryExamAt"
              defaultValue={
                (s as any).theoryExamAt
                  ? new Date((s as any).theoryExamAt).toISOString().slice(0, 16)
                  : ""
              }
            />
          </div>
          <div>
            <label>Practical Exam Date</label>
            <input
              type="datetime-local"
              name="practicalExamAt"
              defaultValue={
                (s as any).practicalExamAt
                  ? new Date((s as any).practicalExamAt)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Praktijk can only be set to Geslaagd if Theory is Geslaagd.
        </p>
      </section>

      <section className="bg-white border rounded p-4">
        <h3 className="font-semibold mb-3">Edit Student</h3>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          action={updateStudent.bind(null, s.id)}
        >
          <div>
            <label>Name</label>
            <input name="name" defaultValue={s.name} required />
          </div>
          <div>
            <label>ID Card Number</label>
            <input
              name="idCardNumber"
              defaultValue={(s as any).idCardNumber ?? ""}
              required
            />
          </div>
          <div>
            <label>Contact</label>
            <input name="contact" defaultValue={s.contact} required />
          </div>
          <div className="md:col-span-2">
            <label>Address</label>
            <input name="address" defaultValue={s.address} required />
          </div>
          <div>
            <label>License Category</label>
            <select
              name="licenseCategory"
              defaultValue={s.licenseCategory}
              required
            >
              <option value="A">A</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="BE">BE</option>
            </select>
          </div>
          <div>
            <label>Agreed Price (SRD)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={(s.agreedPriceCents / 100).toFixed(2)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-3">Payments</h3>
          <form
            className="flex gap-2 mb-3"
            action={addPayment.bind(null, s.id)}
          >
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Amount (SRD)"
              required
            />
            <select name="method" required>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="card">Card</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </form>
          <ul className="space-y-2">
            {s.payments.map(
              (p: {
                id: string;
                amountCents: number;
                method: string;
                paidAt: Date | string;
              }) => (
                <li
                  key={p.id}
                  className="flex justify-between border rounded p-2"
                >
                  <span>
                    SRD {(p.amountCents / 100).toFixed(2)} via {p.method}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(p.paidAt).toLocaleString()}
                  </span>
                </li>
              )
            )}
          </ul>
        </section>

        <section className="bg-white border rounded p-4">
          <DocumentManager studentId={s.id} documents={s.documents} />
          {s.missing.length > 0 && (
            <div className="text-sm text-red-600 mt-2">
              Missing: {s.missing.join(", ")}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

async function addPayment(studentId: string, formData: FormData) {
  "use server";
  const amount = Math.round(parseFloat(String(formData.get("amount"))) * 100);
  const method = String(formData.get("method"));
  await prisma.payment.create({
    data: { studentId, amountCents: amount, method },
  });
  redirect(`/students/${studentId}`);
}

async function updateStudent(studentId: string, formData: FormData) {
  "use server";
  const name = String(formData.get("name"));
  const idCardNumber = String(formData.get("idCardNumber"));
  const contact = String(formData.get("contact"));
  const address = String(formData.get("address"));
  const licenseCategory = String(formData.get("licenseCategory"));
  const price = Math.round(
    parseFloat(String(formData.get("price") ?? "0")) * 100
  );
  await prisma.student.update({
    where: { id: studentId },
    data: {
      name,
      idCardNumber,
      contact,
      address,
      licenseCategory,
      agreedPriceCents: price,
    },
  });
  redirect(`/students/${studentId}`);
}

async function updateExamStatus(studentId: string, formData: FormData) {
  "use server";
  const theory = String(formData.get("theory") ?? "NIET_GEHAALD");
  let practical = String(formData.get("practical") ?? "NIET_GEHAALD");
  const theoryExamAtRaw = formData.get("theoryExamAt");
  const practicalExamAtRaw = formData.get("practicalExamAt");
  const theoryExamAt = theoryExamAtRaw
    ? new Date(String(theoryExamAtRaw))
    : null;
  const practicalExamAt = practicalExamAtRaw
    ? new Date(String(practicalExamAtRaw))
    : null;
  if (theory !== "GESLAAGD" && practical === "GESLAAGD") {
    practical = "NIET_GEHAALD";
  }
  await prisma.student.update({
    where: { id: studentId },
    data: {
      theoryStatus: theory,
      practicalStatus: practical,
      theoryExamAt,
      practicalExamAt,
    },
  });
  redirect(`/students/${studentId}`);
}
