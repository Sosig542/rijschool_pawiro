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
            <label>Category</label>
            <select name="category" required className="w-full">
              <option value="GENERAL">General</option>
              <option value="IMPORTANT">Important</option>
            </select>
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
              className={`border rounded p-3 bg-white flex items-start justify-between gap-3 ${
                n.category === "IMPORTANT" ? "border-l-4 border-l-red-500" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {n.category === "IMPORTANT" ? (
                    <div className="flex items-center gap-1 text-red-600">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-red-700">
                        Important
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-blue-600">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-blue-700">General</span>
                    </div>
                  )}
                </div>
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
  const category = String(formData.get("category"));
  await prisma.newsletter.create({
    data: { title, content, category, isPublished: false },
  });
  redirect("/newsletters");
}

async function publishNewsletter(formData: FormData) {
  "use server";
  const title = String(formData.get("title"));
  const content = String(formData.get("content"));
  const category = String(formData.get("category"));
  await prisma.newsletter.create({
    data: {
      title,
      content,
      category,
      isPublished: true,
      publishedAt: new Date(),
    },
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
