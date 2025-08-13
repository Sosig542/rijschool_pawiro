import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getSettings() {
  let s = await prisma.setting.findFirst();
  if (!s)
    s = await prisma.setting.create({
      data: { id: 1, defaultPriceCents: 250000 },
    });
  return s;
}

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <main className="max-w-md bg-white border rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <form action={updateSettings} className="space-y-4">
        <div>
          <label>Default Registration Price (SRD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={(s.defaultPriceCents / 100).toFixed(2)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </main>
  );
}

async function updateSettings(formData: FormData) {
  "use server";
  const price = Math.round(parseFloat(String(formData.get("price"))) * 100);
  await prisma.setting.upsert({
    where: { id: 1 },
    update: { defaultPriceCents: price },
    create: { id: 1, defaultPriceCents: price },
  });
  redirect("/settings");
}
