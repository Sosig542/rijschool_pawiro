"use client";

import { useState } from "react";

interface Schedule {
  id: string;
  dayOfWeek: string;
  isAvailable: boolean;
  maxStudents: number;
  startTime: string;
  endTime: string;
}

interface InstructorScheduleProps {
  instructorId: string;
  initialSchedules: Schedule[];
}

export default function InstructorSchedule({
  instructorId,
  initialSchedules,
}: InstructorScheduleProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Schedule>>({});

  const dayNames = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
  };

  const dayColors = {
    MONDAY: "bg-blue-50 border-blue-200 text-blue-800",
    TUESDAY: "bg-green-50 border-green-200 text-green-800",
    WEDNESDAY: "bg-purple-50 border-purple-200 text-purple-800",
    THURSDAY: "bg-orange-50 border-orange-200 text-orange-800",
    FRIDAY: "bg-pink-50 border-pink-200 text-pink-800",
  };

  const handleToggleAvailability = async (scheduleId: string) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/instructor/${instructorId}/schedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduleId,
          isAvailable: !schedule.isAvailable,
        }),
      });

      if (response.ok) {
        setSchedules((prev) =>
          prev.map((s) =>
            s.id === scheduleId ? { ...s, isAvailable: !s.isAvailable } : s
          )
        );
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateSchedule = async (
    scheduleId: string,
    updates: Partial<Schedule>
  ) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/instructor/${instructorId}/schedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduleId,
          ...updates,
        }),
      });

      if (response.ok) {
        setSchedules((prev) =>
          prev.map((s) => (s.id === scheduleId ? { ...s, ...updates } : s))
        );
        setEditingSchedule(null);
        setEditForm({});
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (schedule: Schedule) => {
    setEditingSchedule(schedule.id);
    setEditForm({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      maxStudents: schedule.maxStudents,
    });
  };

  const handleSaveEdit = () => {
    if (editingSchedule && editForm) {
      handleUpdateSchedule(editingSchedule, editForm);
    }
  };

  const handleCancelEdit = () => {
    setEditingSchedule(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      {/* Mobile-friendly grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={`relative rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
              schedule.isAvailable
                ? dayColors[schedule.dayOfWeek as keyof typeof dayColors]
                : "bg-gray-50 border-gray-200 text-gray-500"
            }`}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                {dayNames[schedule.dayOfWeek as keyof typeof dayNames]}
              </h3>
              <div className="flex items-center space-x-2">
                {/* Availability Toggle */}
                <button
                  onClick={() => handleToggleAvailability(schedule.id)}
                  disabled={isUpdating}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    schedule.isAvailable
                      ? "bg-blue-500 focus:ring-blue-400"
                      : "bg-gray-300 focus:ring-gray-400"
                  } ${
                    isUpdating
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-80"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                      schedule.isAvailable ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="space-y-3">
              {/* Time Range */}
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Time Range
                </div>
                <div className="text-lg font-bold">
                  {schedule.startTime} - {schedule.endTime}
                </div>
              </div>

              {/* Max Students */}
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Max Students
                </div>
                <div className="text-lg font-bold">{schedule.maxStudents}</div>
              </div>

              {/* Status Badge */}
              <div className="text-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    schedule.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {schedule.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-3 border-t border-current border-opacity-20">
              <button
                onClick={() => handleEditClick(schedule)}
                className="w-full text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Edit Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Schedule Modal */}
      {editingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Schedule
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editForm.startTime || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editForm.endTime || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Max Students */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Students
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editForm.maxStudents || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      maxStudents: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum number of students that can book this time slot
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {schedules.filter((s) => s.isAvailable).length}
            </div>
            <div className="text-sm text-gray-600">Available Days</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {schedules.reduce((sum, s) => sum + s.maxStudents, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Capacity</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {schedules.filter((s) => s.isAvailable).length * 5}
            </div>
            <div className="text-sm text-gray-600">Weekly Slots</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {schedules.filter((s) => s.isAvailable).length > 0
                ? "Active"
                : "Inactive"}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>
      </div>

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
              d="M13 16h-1v-4h-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Schedule Management Tips:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Toggle availability for each day using the switch</li>
              <li>• Click "Edit Schedule" to modify time and capacity</li>
              <li>• Set maximum students per day (1-10 students)</li>
              <li>
                • Students can only book when days are marked as available
              </li>
              <li>• Changes take effect immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
