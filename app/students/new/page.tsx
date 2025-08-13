import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getDefaultPrice() {
  const s = await prisma.setting.findFirst();
  return s?.defaultPriceCents ?? 0;
}

export default async function NewStudentPage() {
  const defaultPrice = await getDefaultPrice();
  return (
    <main className="max-w-2xl bg-white border rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Register Student</h2>
      <form className="space-y-4" action={createStudent}>
        <div>
          <label>Name</label>
          <input name="name" required />
        </div>
        <div>
          <label>ID Card Number</label>
          <input name="idCardNumber" required />
        </div>
        <div>
          <label>Contact</label>
          <input name="contact" required />
        </div>
        <div>
          <label>Address</label>
          <input name="address" required />
        </div>
        <div>
          <label>License Category</label>
          <select name="licenseCategory" required>
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
            defaultValue={(defaultPrice / 100).toFixed(2)}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}

async function createStudent(formData: FormData) {
  "use server";
  const name = String(formData.get("name"));
  const idCardNumber = String(formData.get("idCardNumber"));
  const contact = String(formData.get("contact"));
  const address = String(formData.get("address"));
  const licenseCategory = String(formData.get("licenseCategory"));
  const price = Math.round(
    parseFloat(String(formData.get("price") ?? "0")) * 100
  );
  await prisma.student.create({
    data: {
      name,
      idCardNumber,
      contact,
      address,
      licenseCategory,
      agreedPriceCents: price,
    },
  });
  redirect("/students");
}
