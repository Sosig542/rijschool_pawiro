import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getNews() {
  return prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function NewslettersPage() {
  const items = await getNews();
  return (
    <main className="space-y-6">
      <section className="card p-4">
        <h2 className="text-xl font-semibold mb-3">Create Newsletter</h2>
        <form action={createNewsletter} className="space-y-3">
          <div>
            <label>Title</label>
            <input name="title" required />
          </div>
          <div>
            <label>Content</label>
            <textarea name="content" rows={5} required />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save Draft
            </button>
            <button formAction={publishNewsletter} className="btn btn-accent">
              Publish
            </button>
          </div>
        </form>
      </section>

      <section className="card p-4">
        <h3 className="font-semibold mb-3">All Newsletters</h3>
        <ul className="space-y-3">
          {items.map((n: any) => (
            <li
              key={n.id}
              className="border rounded p-3 bg-white flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-gray-600 mb-1">
                  {n.isPublished
                    ? `Published ${
                        n.publishedAt
                          ? new Date(n.publishedAt).toLocaleString()
                          : ""
                      }`
                    : "Draft"}
                </div>
                <p className="text-sm whitespace-pre-wrap">{n.content}</p>
              </div>
              <form
                className="flex items-center gap-2"
                action={togglePublish.bind(null, n.id, !n.isPublished)}
              >
                <button className="btn btn-primary" type="submit">
                  {n.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  className="btn btn-danger"
                  formAction={deleteNewsletter.bind(null, n.id)}
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

async function createNewsletter(formData: FormData) {
  "use server";
  const title = String(formData.get("title"));
  const content = String(formData.get("content"));
  await prisma.newsletter.create({
    data: { title, content, isPublished: false },
  });
  redirect("/newsletters");
}

async function publishNewsletter(formData: FormData) {
  "use server";
  const title = String(formData.get("title"));
  const content = String(formData.get("content"));
  await prisma.newsletter.create({
    data: { title, content, isPublished: true, publishedAt: new Date() },
  });
  redirect("/newsletters");
}

async function togglePublish(id: string, publish: boolean) {
  "use server";
  await prisma.newsletter.update({
    where: { id },
    data: { isPublished: publish, publishedAt: publish ? new Date() : null },
  });
  redirect("/newsletters");
}

async function deleteNewsletter(id: string) {
  "use server";
  await prisma.newsletter.delete({ where: { id } });
  redirect("/newsletters");
}
