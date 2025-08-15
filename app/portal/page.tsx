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
        select: {
          id: true,
          lessonDate: true,
          status: true,
          notes: true,
          schedule: {
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              instructor: {
                select: {
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { lessonDate: "asc" },
      },
    },
  });
  if (!s) return null;

  const paid = s.payments.reduce(
    (sum: number, p: { amountCents: number }) => sum + p.amountCents,
    0
  );

  // Filter lessons by status
  const completedLessons = s.lessonBookings.filter(
    (booking: any) => booking.status === "COMPLETED"
  );
  const upcomingLessons = s.lessonBookings.filter(
    (booking: any) =>
      booking.status === "SCHEDULED" &&
      new Date(booking.lessonDate) >= new Date()
  );

  return {
    ...s,
    paid,
    completedLessons: completedLessons.length,
    upcomingLessons,
  } as any;
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
    <main className="space-y-4 sm:space-y-6">
      <div className="card p-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Student Portal
        </h2>
        <form action="/portal" className="flex flex-col sm:flex-row gap-2">
          <input
            name="id"
            placeholder="ID Card Number"
            defaultValue={searchParams.id ?? ""}
            required
            className="flex-1"
          />
          <button className="btn btn-primary w-full sm:w-auto">Search</button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* Lesson Status Overview */}
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Lesson Status Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(student as any).completedLessons}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(student as any).upcomingLessons
                    ? (student as any).upcomingLessons.length
                    : 0}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {8 - (student as any).completedLessons}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      ((student as any).completedLessons / 8) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {Math.round(((student as any).completedLessons / 8) * 100)}%
                Complete
              </div>
            </div>
          </div>

          {/* Current Booked Lessons */}
          {(student as any).upcomingLessons &&
          (student as any).upcomingLessons.length > 0 ? (
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Your Upcoming Lessons</h3>
              <div className="space-y-3">
                {(student as any).upcomingLessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className="border rounded-lg p-3 bg-blue-50"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">
                          {new Date(lesson.lessonDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-sm text-blue-700">
                          Time: {lesson.schedule.startTime} -{" "}
                          {lesson.schedule.endTime}
                        </div>
                        <div className="text-sm text-blue-700">
                          Instructor: {lesson.schedule.instructor.name}
                        </div>
                        {lesson.schedule.instructor.phone && (
                          <div className="text-sm text-blue-700">
                            Phone: {lesson.schedule.instructor.phone}
                          </div>
                        )}
                        {lesson.notes && (
                          <div className="text-sm text-blue-600 mt-1 italic">
                            Note: {lesson.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {lesson.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Your Upcoming Lessons</h3>
              <div className="text-sm text-gray-600 text-center py-4">
                No upcoming lessons booked yet.
                {(student as any).theoryStatus === "GESLAAGD" &&
                  (student as any).completedLessons < 8 && (
                    <div className="mt-2">
                      You can book lessons below once you've passed your theory
                      exam.
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Completed Lessons History */}
          {(student as any).lessonBookings &&
          (student as any).lessonBookings.filter(
            (l: any) => l.status === "COMPLETED"
          ).length > 0 ? (
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Completed Lessons History</h3>
              <div className="text-sm text-gray-600 mb-2">
                You have completed {(student as any).completedLessons} out of 8
                required practical lessons.
              </div>
              <div className="space-y-2">
                {(student as any).lessonBookings
                  .filter((l: any) => l.status === "COMPLETED")
                  .map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Lesson #{lesson.id.slice(-4)} - Completed
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Completed Lessons History</h3>
              <div className="text-sm text-gray-600 text-center py-4">
                No completed lessons yet.
                {(student as any).theoryStatus === "GESLAAGD" && (
                  <div className="mt-2">
                    Start booking lessons below to begin your practical
                    training!
                  </div>
                )}
                {(student as any).theoryStatus !== "GESLAAGD" && (
                  <div className="mt-2">
                    You need to pass your theory exam first before you can start
                    practical lessons.
                  </div>
                )}
              </div>
            </div>
          )}

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
