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
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Scheduled
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "border-l-green-500";
      case "CANCELLED":
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getActiveBookingsCount = (student: Student) => {
    return student.lessonBookings.filter((b) => b.status === "SCHEDULED")
      .length;
  };

  return (
    <div className="space-y-6">
      {/* Mobile-friendly student cards */}
      <div className="grid grid-cols-1 gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Student Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ID: {student.registrationId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {formatDate(student.registeredAt)}
                  </div>
                  <div className="text-xs text-gray-400">Registered</div>
                </div>
              </div>
            </div>

            {/* Bookings Summary */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Lesson Bookings</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {getActiveBookingsCount(student)} active
                  </span>
                  <button
                    onClick={() =>
                      setSelectedStudent(
                        selectedStudent === student.id ? null : student.id
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {selectedStudent === student.id ? "Hide" : "View All"}
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {
                      student.lessonBookings.filter(
                        (b) => b.status === "SCHEDULED"
                      ).length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Scheduled</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {
                      student.lessonBookings.filter(
                        (b) => b.status === "CANCELLED"
                      ).length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Cancelled</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {student.lessonBookings.length}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>

              {/* Expanded Bookings View */}
              {selectedStudent === student.id && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  {student.lessonBookings.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No lessons scheduled
                    </div>
                  ) : (
                    student.lessonBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={`bg-gray-50 rounded-lg p-3 border-l-4 ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {formatDate(booking.lessonDate)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {getDayOfWeek(booking.lessonDate)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(booking.status)}
                            {booking.status === "SCHEDULED" && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancellingBookings.has(booking.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded hover:bg-red-50"
                              >
                                {cancellingBookings.has(booking.id)
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No students registered
          </h3>
          <p className="text-gray-500">
            Students will appear here once they register for lessons.
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Student Management Tips:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Click "View All" to see detailed lesson information</li>
              <li>
                • Cancel lessons when needed - students receive SMS
                notifications
              </li>
              <li>• Monitor active vs. cancelled lesson counts</li>
              <li>• All changes are reflected immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
