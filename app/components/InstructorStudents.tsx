"use client";

interface Student {
  id: string;
  name: string;
  registrationId: number;
  registeredAt: Date;
  lessonBookings: Array<{
    lessonDate: Date;
    schedule: {
      dayOfWeek: string;
    };
  }>;
}

interface InstructorStudentsProps {
  students: Student[];
}

export default function InstructorStudents({
  students,
}: InstructorStudentsProps) {
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

  return (
    <div className="bg-white border rounded p-4">
      <h2 className="text-xl font-semibold mb-4">Registered Students</h2>

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
                      <div className="space-y-1">
                        {student.lessonBookings.map((booking, index) => (
                          <div
                            key={index}
                            className="text-xs bg-blue-50 px-2 py-1 rounded"
                          >
                            {formatDate(booking.lessonDate)} (
                            {getDayOfWeek(booking.lessonDate)})
                          </div>
                        ))}
                      </div>
                    )}
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
