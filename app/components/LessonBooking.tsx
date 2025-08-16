"use client";

import { useState, useEffect } from "react";
import { useToast } from "./Toast";

interface Instructor {
  id: string;
  name: string;
  phone: string | null;
}

interface LessonSchedule {
  id: string;
  dayOfWeek: string;
  isAvailable: boolean;
  maxStudents: number;
  startTime: string;
  endTime: string;
  instructor: Instructor;
}

interface LessonBookingProps {
  studentId: string;
  completedLessons: number;
}

export default function LessonBooking({
  studentId,
  completedLessons,
}: LessonBookingProps) {
  const [schedules, setSchedules] = useState<LessonSchedule[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/instructor/schedules");
      if (response.ok) {
        const data = await response.json();
        setSchedules(data.schedules);
        setInstructors(data.instructors);
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
      error("Failed to load available schedules");
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableSlots = (date: string, instructorId?: string) => {
    if (!date) return [];

    const dayOfWeek = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    let filteredSchedules = schedules;
    if (instructorId) {
      filteredSchedules = schedules.filter(
        (s) => s.instructor.id === instructorId
      );
    }

    const schedule = filteredSchedules.find((s) => s.dayOfWeek === dayOfWeek);

    if (!schedule || !schedule.isAvailable) return [];

    return [schedule.startTime, schedule.endTime];
  };

  const handleBooking = async () => {
    if (!selectedDate) return;

    setIsBooking(true);
    try {
      const response = await fetch("/api/lessons/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          lessonDate: selectedDate,
          instructorId: selectedInstructor || undefined,
        }),
      });

      if (response.ok) {
        success("Lesson booked successfully!");
        setSelectedDate("");
        setSelectedInstructor("");
        // Refresh the page to update progress
        window.location.reload();
      } else {
        const errorData = await response.json();
        error(`Failed to book lesson: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error booking lesson:", err);
      error("Error booking lesson");
    } finally {
      setIsBooking(false);
    }
  };

  const getNextAvailableDates = (instructorId?: string) => {
    const dates = [];
    const today = new Date();

    // Set to start of day to avoid timezone issues
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Ensure we're working with the start of the day
      date.setHours(0, 0, 0, 0);

      // Only include Monday-Friday (1-5, where 0 is Sunday)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.log(
          `Skipping weekend: ${date.toDateString()} (day ${dayOfWeek})`
        );
        continue; // Skip Sunday (0) and Saturday (6)
      }

      // Double-check: ensure we only process weekdays
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      if (dayName === "Sunday" || dayName === "Saturday") {
        console.log(
          `Double-check skipping weekend: ${date.toDateString()} (${dayName})`
        );
        continue; // Extra safety check
      }

      const dayNameUpper = dayName.toUpperCase();
      console.log(
        `Processing weekday: ${date.toDateString()} (${dayNameUpper})`
      );

      let filteredSchedules = schedules;
      if (instructorId) {
        filteredSchedules = schedules.filter(
          (s) => s.instructor.id === instructorId
        );
      }

      const schedule = filteredSchedules.find(
        (s) => s.dayOfWeek === dayNameUpper
      );

      if (schedule && schedule.isAvailable) {
        console.log(
          `Adding available date: ${date.toDateString()} (${dayNameUpper})`
        );
        dates.push(date.toISOString().split("T")[0]);
      }
    }

    console.log("Final available dates:", dates);
    return dates;
  };

  const getDayColor = (dayOfWeek: string) => {
    const colors = {
      MONDAY: "bg-blue-50 border-blue-200 text-blue-800",
      TUESDAY: "bg-green-50 border-green-200 text-green-800",
      WEDNESDAY: "bg-purple-50 border-purple-200 text-purple-800",
      THURSDAY: "bg-orange-50 border-orange-200 text-orange-800",
      FRIDAY: "bg-pink-50 border-pink-200 text-pink-800",
    };
    return (
      colors[dayOfWeek as keyof typeof colors] ||
      "bg-gray-50 border-gray-200 text-gray-800"
    );
  };

  if (isLoading) {
    return (
      <div className="card p-4">
        <h3 className="font-semibold mb-3">Book Practical Lesson</h3>
        <div className="text-sm text-gray-600">
          Loading available schedules...
        </div>
      </div>
    );
  }

  const availableDates = getNextAvailableDates(selectedInstructor);

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Book Practical Lesson</h3>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          You need to complete {8 - completedLessons} more lessons. Select an
          available date and instructor to book your next lesson.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instructor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Instructor (Optional)
            </label>
            <select
              value={selectedInstructor}
              onChange={(e) => {
                setSelectedInstructor(e.target.value);
                setSelectedDate(""); // Reset date when instructor changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Available Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                  {instructor.phone && ` (${instructor.phone})`}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose a specific instructor or let the system assign one
            </p>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date (Mon-Fri only)
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a date...</option>
              {availableDates
                .map((date) => {
                  const dateObj = new Date(date);
                  const dayName = dateObj.toLocaleDateString("en-US", {
                    weekday: "long",
                  });

                  // Extra safety check - don't show weekend dates
                  if (dayName === "Sunday" || dayName === "Saturday") {
                    console.log(
                      `Warning: Weekend date found in dropdown: ${date} (${dayName})`
                    );
                    return null;
                  }

                  return (
                    <option key={date} value={date}>
                      {dateObj.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </option>
                  );
                })
                .filter(Boolean)}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Available dates for{" "}
              {selectedInstructor ? "selected instructor" : "any instructor"}
            </p>
          </div>
        </div>

        {/* Available Time Slots */}
        {selectedDate && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Available Time Slots
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {schedules
                .filter((s) => {
                  const dayName = new Date(selectedDate)
                    .toLocaleDateString("en-US", { weekday: "long" })
                    .toUpperCase();

                  // Ensure we only show weekday schedules
                  if (dayName === "SUNDAY" || dayName === "SATURDAY") {
                    return false;
                  }

                  return s.dayOfWeek === dayName && s.isAvailable;
                })
                .filter(
                  (s) =>
                    !selectedInstructor ||
                    s.instructor.id === selectedInstructor
                )
                .map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-3 rounded-lg border-2 ${getDayColor(
                      schedule.dayOfWeek
                    )}`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-sm mb-1">
                        {schedule.instructor.name}
                      </div>
                      <div className="text-lg font-bold">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                      <div className="text-xs opacity-75">
                        Max: {schedule.maxStudents} students
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Button */}
      {selectedDate && (
        <div className="flex justify-end">
          <button
            onClick={handleBooking}
            disabled={isBooking}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isBooking ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Booking...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book Lesson
              </>
            )}
          </button>
        </div>
      )}

      {/* No Available Dates */}
      {availableDates.length === 0 && (
        <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <svg
            className="w-8 h-8 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="font-medium mb-1">No Available Lesson Slots</p>
          <p>
            No available lesson slots in the next 2 weeks for{" "}
            {selectedInstructor ? "the selected instructor" : "any instructor"}.
            Please check back later or try selecting a different instructor.
          </p>
        </div>
      )}
    </div>
  );
}
