import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getLessonData() {
  const [bookings, schedules] = await Promise.all([
    prisma.lessonBooking.findMany({
      include: {
        student: {
          select: { name: true, registrationId: true },
        },
        schedule: {
          select: { dayOfWeek: true, startTime: true, endTime: true },
        },
      },
      orderBy: { lessonDate: "asc" },
    }),
    prisma.lessonSchedule.findMany({
      where: { isAvailable: true },
      orderBy: { dayOfWeek: "asc" },
    }),
  ]);

  return { bookings, schedules };
}

export default async function LessonsPage() {
  const { bookings, schedules } = await getLessonData();

  const upcomingBookings = bookings.filter(
    (b: any) => new Date(b.lessonDate) >= new Date()
  );

  const completedBookings = bookings.filter(
    (b: any) => b.status === "COMPLETED"
  );

  const pendingBookings = bookings.filter(
    (b: any) => b.status === "SCHEDULED" && new Date(b.lessonDate) >= new Date()
  );

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Lesson Management</h1>
        <Link href="/instructor" className="btn btn-accent">
          Instructor Schedule
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat">
          <div className="text-sm text-gray-500">Upcoming Lessons</div>
          <div className="text-2xl font-semibold text-blue-600">
            {upcomingBookings.length}
          </div>
        </div>
        <div className="stat">
          <div className="text-sm text-gray-500">Completed Lessons</div>
          <div className="text-2xl font-semibold text-green-600">
            {completedBookings.length}
          </div>
        </div>
        <div className="stat">
          <div className="text-sm text-gray-500">Available Days</div>
          <div className="text-2xl font-semibold text-amber-600">
            {schedules.length}
          </div>
        </div>
      </div>

      {/* Upcoming Lessons */}
      <div className="card p-4">
        <h2 className="text-xl font-semibold mb-4">Upcoming Lessons</h2>
        {pendingBookings.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No upcoming lessons scheduled
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Day</th>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Student</th>
                  <th className="text-left py-2">Reg ID</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b">
                    <td className="py-2">
                      {new Date(booking.lessonDate).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      {new Date(booking.lessonDate).toLocaleDateString(
                        "en-US",
                        { weekday: "long" }
                      )}
                    </td>
                    <td className="py-2">
                      {booking.schedule.startTime} - {booking.schedule.endTime}
                    </td>
                    <td className="py-2">{booking.student.name}</td>
                    <td className="py-2">{booking.student.registrationId}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <form
                        action={`/api/lessons/${booking.id}/complete`}
                        method="POST"
                      >
                        <button
                          type="submit"
                          className="btn btn-primary text-xs px-2 py-1"
                        >
                          Mark Complete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instructor Schedule Summary */}
      <div className="card p-4">
        <h2 className="text-xl font-semibold mb-4">Instructor Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map(
            (day) => {
              const schedule = schedules.find((s: any) => s.dayOfWeek === day);
              return (
                <div key={day} className="text-center p-3 border rounded">
                  <div className="font-medium text-sm">{day.slice(0, 3)}</div>
                  {schedule ? (
                    <div className="text-xs text-gray-600">
                      <div>
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                      <div>Max: {schedule.maxStudents}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">Not Available</div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}
