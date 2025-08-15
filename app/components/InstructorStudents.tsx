"use client";

import { useState } from "react";

interface Student {
  id: string;
  name: string;
  registrationId: number;
  registeredAt: Date;
  lessonBookings: Array<{
    id: string;
    lessonDate: Date;
    status: string;
    schedule: {
      dayOfWeek: string;
      instructor: {
        name: string;
      };
    };
  }>;
}

interface InstructorStudentsProps {
  students: Student[];
}

export default function InstructorStudents({
  students,
}: InstructorStudentsProps) {
  const [cancellingBookings, setCancellingBookings] = useState<Set<string>>(
    new Set()
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDayOfWeek = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (
      confirm(
        "Are you sure you want to cancel this lesson? The student will be notified via SMS."
      )
    ) {
      setCancellingBookings((prev) => new Set(prev).add(bookingId));

      try {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
          method: "POST",
        });

        if (response.ok) {
          // Refresh the page to show updated data
          window.location.reload();
        } else {
          const error = await response.json();
          alert(`Failed to cancel booking: ${error.error}`);
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      } finally {
        setCancellingBookings((prev) => {
          const newSet = new Set(prev);
          newSet.delete(bookingId);
          return newSet;
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Scheduled
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border rounded p-4">
      <h2 className="text-xl font-semibold mb-4">Student Lesson Bookings</h2>

      {students.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No students registered yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Reg ID</th>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Registration Date</th>
                <th className="text-left py-2">Scheduled Lessons</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="py-2 font-medium">{student.registrationId}</td>
                  <td className="py-2">{student.name}</td>
                  <td className="py-2">{formatDate(student.registeredAt)}</td>
                  <td className="py-2">
                    {student.lessonBookings.length === 0 ? (
                      <span className="text-gray-400">
                        No lessons scheduled
                      </span>
                    ) : (
                      <div className="space-y-2">
                        {student.lessonBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="text-xs bg-blue-50 px-3 py-2 rounded border"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">
                                {formatDate(booking.lessonDate)} (
                                {getDayOfWeek(booking.lessonDate)})
                              </span>
                              {getStatusBadge(booking.status)}
                            </div>
                            {booking.status === "SCHEDULED" && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancellingBookings.has(booking.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {cancellingBookings.has(booking.id)
                                  ? "Cancelling..."
                                  : "Cancel Lesson"}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-2">
                    <div className="text-xs text-gray-500">
                      {
                        student.lessonBookings.filter(
                          (b) => b.status === "SCHEDULED"
                        ).length
                      }{" "}
                      active
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
