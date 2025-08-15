import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PracticalLessonProgress from "@/app/components/PracticalLessonProgress";
import LessonBooking from "@/app/components/LessonBooking";

async function findStudentById(id?: string) {
  if (!id) return null;
  const s = await prisma.student.findFirst({
    where: { idCardNumber: id },
    select: {
      id: true,
      registrationId: true,
      name: true,
      agreedPriceCents: true,
      payments: { select: { amountCents: true } },
      theoryStatus: true,
      practicalStatus: true,
      theoryExamAt: true,
      practicalExamAt: true,
      lessonBookings: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
    },
  });
  if (!s) return null;
  const paid = s.payments.reduce(
    (sum: number, p: { amountCents: number }) => sum + p.amountCents,
    0
  );
  const completedLessons = s.lessonBookings.length;
  return { ...s, paid, completedLessons } as any;
}

async function getNews() {
  return prisma.newsletter.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function Portal({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const [student, news] = await Promise.all([
    findStudentById(searchParams.id),
    getNews(),
  ]);
  return (
    <main className="space-y-6">
      <div className="card p-4">
        <h2 className="text-xl font-semibold mb-2">Student Portal</h2>
        <form action="/portal" className="flex gap-2">
          <input
            name="id"
            placeholder="ID Card Number"
            defaultValue={searchParams.id ?? ""}
            required
          />
          <button className="btn btn-primary">Search</button>
        </form>
      </div>

      {searchParams.id && !student && (
        <div className="card p-4 text-sm text-gray-600">
          No student found for that ID Card Number.
        </div>
      )}

      {student && (
        <>
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-gray-500 text-sm">Name</span>
                <div>{(student as any).name}</div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Reg ID</span>
                <div>{(student as any).registrationId}</div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Balance (SRD)</span>
                <div
                  className={
                    (student as any).agreedPriceCents - (student as any).paid >
                    0
                      ? "text-red-600"
                      : "text-green-700"
                  }
                >
                  {(
                    ((student as any).agreedPriceCents -
                      (student as any).paid) /
                    100
                  ).toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Theory</span>
                <div>
                  {(student as any).theoryStatus === "GESLAAGD"
                    ? "Geslaagd"
                    : "Niet gehaald"}
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Theory Date</span>
                <div>
                  {(student as any).theoryExamAt
                    ? new Date((student as any).theoryExamAt).toLocaleString()
                    : "-"}
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Practical</span>
                <div>
                  {(student as any).practicalStatus === "GESLAAGD"
                    ? "Geslaagd"
                    : "Niet gehaald"}
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Practical Date</span>
                <div>
                  {(student as any).practicalExamAt
                    ? new Date(
                        (student as any).practicalExamAt
                      ).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Practical Lesson Progress - Only show if theory is passed */}
          {(student as any).theoryStatus === "GESLAAGD" && (
            <PracticalLessonProgress
              completedLessons={(student as any).completedLessons}
              studentId={(student as any).id}
            />
          )}

          {/* Lesson Booking - Only show if theory is passed and less than 8 lessons completed */}
          {(student as any).theoryStatus === "GESLAAGD" &&
            (student as any).completedLessons < 8 && (
              <LessonBooking
                studentId={(student as any).id}
                completedLessons={(student as any).completedLessons}
              />
            )}
        </>
      )}

      <section className="card p-4">
        <h3 className="font-semibold mb-3">Nieuws</h3>
        {news.length === 0 && (
          <div className="text-sm text-gray-600">No news yet.</div>
        )}
        <ul className="space-y-3">
          {news.map((n: any) => (
            <li key={n.id} className="border rounded p-3 bg-white">
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-gray-600 mb-1">
                {n.publishedAt ? new Date(n.publishedAt).toLocaleString() : ""}
              </div>
              <p className="text-sm">{n.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
