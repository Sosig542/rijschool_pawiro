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
        setStudents(Array.isArray(data) ? data : []);
      } else {
        console.error("AdminStats: API response not ok:", response.status);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
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
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "GESLAAGD":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "GESLAAGD":
        return "Passed";
      default:
        return "Not Passed";
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
            selectedFilter === "theory"
              ? "ring-2 ring-green-500 bg-green-50 border-green-200"
              : "border-gray-200 hover:border-green-300"
          }`}
          onClick={() => handleStatClick("theory")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.theoryPassed}
              </div>
              <div className="text-sm font-medium text-gray-700">
                Theory Passed
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {students.length > 0
              ? Math.round((stats.theoryPassed / students.length) * 100)
              : 0}
            % of total students
          </div>
        </div>

        <div
          className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
            selectedFilter === "practical"
              ? "ring-2 ring-purple-500 bg-purple-50 border-purple-200"
              : "border-gray-200 hover:border-purple-300"
          }`}
          onClick={() => handleStatClick("practical")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.practicalPassed}
              </div>
              <div className="text-sm font-medium text-gray-700">
                Practical Passed
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {students.length > 0
              ? Math.round((stats.practicalPassed / students.length) * 100)
              : 0}
            % of total students
          </div>
        </div>

        <div
          className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 sm:col-span-2 lg:col-span-1 ${
            selectedFilter === "missingDocs"
              ? "ring-2 ring-red-500 bg-red-50 border-red-200"
              : "border-gray-200 hover:border-red-300"
          }`}
          onClick={() => handleStatClick("missingDocs")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {stats.missingDocs}
              </div>
              <div className="text-sm font-medium text-gray-700">
                Missing Documents
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {students.length > 0
              ? Math.round((stats.missingDocs / students.length) * 100)
              : 0}
            % need attention
          </div>
        </div>
      </div>

      {/* Filtered Students List */}
      {selectedFilter && filteredStudents.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedFilter === "theory" && "Students with Theory Passed"}
                  {selectedFilter === "practical" &&
                    "Students with Practical Passed"}
                  {selectedFilter === "missingDocs" &&
                    "Students with Missing Documents"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredStudents.length} student
                  {filteredStudents.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedFilter(null);
                  setFilteredStudents([]);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Close
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Mobile view - Cards */}
            <div className="lg:hidden space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          #{student.registrationId}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {formatDate(student.registeredAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        student.theoryStatus
                      )}`}
                    >
                      Theory: {getStatusText(student.theoryStatus)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        student.practicalStatus
                      )}`}
                    >
                      Practical: {getStatusText(student.practicalStatus)}
                    </span>
                  </div>

                  {selectedFilter === "missingDocs" && (
                    <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                      <span className="font-medium">Missing Documents:</span>{" "}
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
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Student
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Registration Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Theory
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Practical
                    </th>
                    {selectedFilter === "missingDocs" && (
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Missing Documents
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              #{student.registrationId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(student.registeredAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            student.theoryStatus
                          )}`}
                        >
                          {getStatusText(student.theoryStatus)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            student.practicalStatus
                          )}`}
                        >
                          {getStatusText(student.practicalStatus)}
                        </span>
                      </td>
                      {selectedFilter === "missingDocs" && (
                        <td className="py-3 px-4">
                          <div className="text-xs text-gray-600">
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
        </div>
      )}

      {selectedFilter && filteredStudents.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No students found
          </h3>
          <p className="text-gray-500">
            No students match the selected filter criteria.
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0"
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
          <div className="text-sm text-indigo-800">
            <p className="font-medium mb-1">Statistics Management Tips:</p>
            <ul className="space-y-1 text-indigo-700">
              <li>
                • Click on any statistic card to view detailed student
                information
              </li>
              <li>• Monitor theory and practical exam success rates</li>
              <li>• Track missing documents to ensure compliance</li>
              <li>• Use the month filter to analyze trends over time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
