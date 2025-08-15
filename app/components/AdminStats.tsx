"use client";

import { useState, useEffect } from "react";
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
  documents: Array<{
    type: string;
    isSubmitted: boolean;
  }>;
}

interface AdminStatsProps {}

export default function AdminStats({}: AdminStatsProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      if (response.ok) {
        const data = await response.json();
        // The API returns students directly as an array, not wrapped in an object
        setStudents(Array.isArray(data) ? data : []);
      } else {
        console.error("AdminStats: API response not ok:", response.status);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    if (!students || students.length === 0) {
      return { theoryPassed: 0, practicalPassed: 0, missingDocs: 0 };
    }

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

    return { theoryPassed, practicalPassed, missingDocs };
  };

  const handleStatClick = (filterType: string) => {
    if (!students || students.length === 0) return;

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="stat animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          className={`stat cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFilter === "theory"
              ? "ring-2 ring-green-500 bg-green-50"
              : ""
          }`}
          onClick={() => handleStatClick("theory")}
        >
          <div className="text-xl sm:text-2xl font-bold text-green-600">
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
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {stats.practicalPassed}
          </div>
          <div className="text-sm text-gray-600">Practical Passed</div>
        </div>

        <div
          className={`stat cursor-pointer transition-all duration-200 hover:shadow-md sm:col-span-2 lg:col-span-1 ${
            selectedFilter === "missingDocs"
              ? "ring-2 ring-red-500 bg-red-50"
              : ""
          }`}
          onClick={() => handleStatClick("missingDocs")}
        >
          <div className="text-xl sm:text-2xl font-bold text-red-600">
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

          {/* Mobile view - Cards */}
          <div className="lg:hidden space-y-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm">
                    #{student.registrationId}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(student.registeredAt)}
                  </div>
                </div>
                <div className="font-medium mb-2">{student.name}</div>
                <div className="flex gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      student.theoryStatus === "GESLAAGD"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Theory:{" "}
                    {student.theoryStatus === "GESLAAGD"
                      ? "Passed"
                      : "Not Passed"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      student.practicalStatus === "GESLAAGD"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Practical:{" "}
                    {student.practicalStatus === "GESLAAGD"
                      ? "Passed"
                      : "Not Passed"}
                  </span>
                </div>
                {selectedFilter === "missingDocs" && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Missing:</span>{" "}
                    {REQUIRED_DOC_TYPES.filter(
                      (required) =>
                        !student.documents.some(
                          (d) => d.type === required && d.isSubmitted
                        )
                    ).join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden lg:block overflow-x-auto">
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
