"use client";

import { useState } from "react";
import { REQUIRED_DOC_TYPES } from "@/lib/requiredDocs";

interface Student {
  id: string;
  name: string;
  registrationId: number;
  registeredAt: Date;
  theoryStatus: string;
  practicalStatus: string;
  theoryExamAt: Date | null;
  practicalExamAt: Date | null;
  lessonBookings: Array<{
    lessonDate: Date;
    schedule: {
      dayOfWeek: string;
    };
  }>;
  documents: Array<{
    type: string;
    isSubmitted: boolean;
  }>;
}

interface InstructorStatsProps {
  students: Student[];
}

export default function InstructorStats({ students }: InstructorStatsProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const calculateStats = () => {
    const totalStudents = students.length;

    const theoryPassed = students.filter(
      (s) => s.theoryStatus === "GESLAAGD"
    ).length;
    const practicalPassed = students.filter(
      (s) => s.practicalStatus === "GESLAAGD"
    ).length;

    const missingDocs = students.filter((s) => {
      const submittedDocs = s.documents
        .filter((d) => d.isSubmitted)
        .map((d) => d.type);
      return REQUIRED_DOC_TYPES.some(
        (required) => !submittedDocs.includes(required)
      );
    }).length;

    return { totalStudents, theoryPassed, practicalPassed, missingDocs };
  };

  const handleStatClick = (filterType: string) => {
    if (selectedFilter === filterType) {
      setSelectedFilter(null);
      setFilteredStudents([]);
      return;
    }

    setSelectedFilter(filterType);

    let filtered: Student[] = [];

    switch (filterType) {
      case "theory":
        filtered = students.filter((s) => s.theoryStatus === "GESLAAGD");
        break;
      case "practical":
        filtered = students.filter((s) => s.practicalStatus === "GESLAAGD");
        break;
      case "missingDocs":
        filtered = students.filter((s) => {
          const submittedDocs = s.documents
            .filter((d) => d.isSubmitted)
            .map((d) => d.type);
          return REQUIRED_DOC_TYPES.some(
            (required) => !submittedDocs.includes(required)
          );
        });
        break;
      default:
        filtered = [];
    }

    setFilteredStudents(filtered);
  };

  const stats = calculateStats();
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className={`stat cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFilter === "total" ? "ring-2 ring-blue-500 bg-blue-50" : ""
          }`}
          onClick={() => handleStatClick("total")}
        >
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalStudents}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>

        <div
          className={`stat cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFilter === "theory"
              ? "ring-2 ring-green-500 bg-green-50"
              : ""
          }`}
          onClick={() => handleStatClick("theory")}
        >
          <div className="text-2xl font-bold text-green-600">
            {stats.theoryPassed}
          </div>
          <div className="text-sm text-gray-600">Theory Passed</div>
        </div>

        <div
          className={`stat cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFilter === "practical"
              ? "ring-2 ring-purple-500 bg-purple-50"
              : ""
          }`}
          onClick={() => handleStatClick("practical")}
        >
          <div className="text-2xl font-bold text-purple-600">
            {stats.practicalPassed}
          </div>
          <div className="text-sm text-gray-600">Practical Passed</div>
        </div>

        <div
          className={`stat cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFilter === "missingDocs"
              ? "ring-2 ring-red-500 bg-red-50"
              : ""
          }`}
          onClick={() => handleStatClick("missingDocs")}
        >
          <div className="text-2xl font-bold text-red-600">
            {stats.missingDocs}
          </div>
          <div className="text-sm text-gray-600">Missing Documents</div>
        </div>
      </div>

      {/* Filtered Students List */}
      {selectedFilter && filteredStudents.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedFilter === "theory" && "Students with Theory Passed"}
              {selectedFilter === "practical" &&
                "Students with Practical Passed"}
              {selectedFilter === "missingDocs" &&
                "Students with Missing Documents"}
            </h3>
            <button
              onClick={() => {
                setSelectedFilter(null);
                setFilteredStudents([]);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Reg ID</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Registration Date</th>
                  <th className="text-left py-2">Theory</th>
                  <th className="text-left py-2">Practical</th>
                  {selectedFilter === "missingDocs" && (
                    <th className="text-left py-2">Missing Docs</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">
                      {student.registrationId}
                    </td>
                    <td className="py-2">{student.name}</td>
                    <td className="py-2">{formatDate(student.registeredAt)}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          student.theoryStatus === "GESLAAGD"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.theoryStatus === "GESLAAGD"
                          ? "Passed"
                          : "Not Passed"}
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          student.practicalStatus === "GESLAAGD"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.practicalStatus === "GESLAAGD"
                          ? "Passed"
                          : "Not Passed"}
                      </span>
                    </td>
                    {selectedFilter === "missingDocs" && (
                      <td className="py-2">
                        <div className="text-xs">
                          {REQUIRED_DOC_TYPES.filter(
                            (required) =>
                              !student.documents.some(
                                (d) => d.type === required && d.isSubmitted
                              )
                          ).join(", ")}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedFilter && filteredStudents.length === 0 && (
        <div className="card p-4 text-center text-gray-500">
          No students found for this filter.
        </div>
      )}
    </div>
  );
}
