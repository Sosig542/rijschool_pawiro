"use client";

import { useState } from "react";
import { useToast } from "./Toast";

interface LessonSchedule {
  id: string;
  dayOfWeek: string;
  isAvailable: boolean;
  maxStudents: number;
  startTime: string;
  endTime: string;
}

interface InstructorScheduleProps {
  instructorId: string;
  initialSchedules: LessonSchedule[];
}

export default function InstructorSchedule({
  instructorId,
  initialSchedules,
}: InstructorScheduleProps) {
  const [schedules, setSchedules] =
    useState<LessonSchedule[]>(initialSchedules);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleScheduleChange = (
    scheduleId: string,
    field: keyof LessonSchedule,
    value: any
  ) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/instructor/${instructorId}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules }),
      });

      if (response.ok) {
        success("Schedule updated successfully!");
      } else {
        console.error("Failed to update schedule");
        error("Failed to update schedule");
      }
    } catch (err) {
      console.error("Error updating schedule:", err);
      error("Error updating schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayLabels = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
  };

  return (
    <div className="bg-white border rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lesson Schedule</h2>
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="border rounded p-4">
            <div className="flex items-center gap-4 mb-3">
              <h3 className="font-medium w-24">
                {dayLabels[schedule.dayOfWeek as keyof typeof dayLabels]}
              </h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={schedule.isAvailable}
                  onChange={(e) =>
                    handleScheduleChange(
                      schedule.id,
                      "isAvailable",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm">Available</span>
              </label>
            </div>

            {schedule.isAvailable && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleScheduleChange(
                        schedule.id,
                        "startTime",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleScheduleChange(
                        schedule.id,
                        "endTime",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Students
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={schedule.maxStudents}
                    onChange={(e) =>
                      handleScheduleChange(
                        schedule.id,
                        "maxStudents",
                        parseInt(e.target.value)
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
