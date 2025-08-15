"use client";

interface PracticalLessonProgressProps {
  completedLessons: number;
  studentId: string;
}

export default function PracticalLessonProgress({
  completedLessons,
  studentId,
}: PracticalLessonProgressProps) {
  const totalLessons = 8;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Practical Lesson Progress</h3>

      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Progress: {completedLessons}/{totalLessons} lessons completed
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: totalLessons }, (_, index) => {
          const isCompleted = index < completedLessons;
          return (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>
          );
        })}
      </div>

      {completedLessons === totalLessons && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          🎉 Congratulations! You've completed all practical lessons and are
          ready for your practical exam.
        </div>
      )}
    </div>
  );
}
