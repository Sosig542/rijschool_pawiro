"use client";

import { useState, useEffect } from "react";
import { useToast } from "./Toast";

interface LessonSchedule {
  id: string;
  dayOfWeek: string;
  isAvailable: boolean;
  maxStudents: number;
  startTime: string;
  endTime: string;
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
  const [selectedDate, setSelectedDate] = useState("");
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
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
      error("Failed to load available schedules");
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableSlots = (date: string) => {
    if (!date) return [];

    const dayOfWeek = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    const schedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);

    if (!schedule || !schedule.isAvailable) return [];

    // For now, return a simple time slot - in a real app, this would be more sophisticated
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
        }),
      });

      if (response.ok) {
        success("Lesson booked successfully!");
        setSelectedDate("");
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

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Only include Monday-Friday (1-5, where 0 is Sunday)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip Sunday (0) and Saturday (6)

      const dayName = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();
      const schedule = schedules.find((s) => s.dayOfWeek === dayName);

      if (schedule && schedule.isAvailable) {
        dates.push(date.toISOString().split("T")[0]);
      }
    }

    return dates;
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

  const availableDates = getNextAvailableDates();

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Book Practical Lesson</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          You need to complete {8 - completedLessons} more lessons. Select an
          available date to book your next lesson.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date (Mon-Fri only)
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="">Choose a date...</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Times
              </label>
              <div className="text-sm text-gray-600">
                {getAvailableSlots(selectedDate).map((time, index) => (
                  <div key={index}>{time}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedDate && (
        <button
          onClick={handleBooking}
          disabled={isBooking}
          className="btn btn-primary"
        >
          {isBooking ? "Booking..." : "Book Lesson"}
        </button>
      )}

      {availableDates.length === 0 && (
        <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
          No available lesson slots in the next 2 weeks. Please check back
          later.
        </div>
      )}
    </div>
  );
}
