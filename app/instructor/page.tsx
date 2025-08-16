"use client";

import { useState, useRef, useEffect } from "react";
import InstructorSchedule from "@/app/components/InstructorSchedule";
import InstructorStudents from "@/app/components/InstructorStudents";
import InstructorStats from "@/app/components/InstructorStats";
import MobileNavigation from "@/app/components/MobileNavigation";

export default function InstructorPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [instructor, setInstructor] = useState({
    id: "default",
    name: "Default Instructor",
    email: "instructor@rijschool.com",
    phone: "+597-123-4567",
    schedules: [],
  });
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    thisWeekBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
  });

  const overviewRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const studentsRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "students",
      label: "Students",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    let targetRef;

    switch (sectionId) {
      case "overview":
        targetRef = overviewRef;
        break;
      case "schedule":
        targetRef = scheduleRef;
        break;
      case "students":
        targetRef = studentsRef;
        break;
      default:
        targetRef = overviewRef;
    }

    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/instructor/data");
        if (response.ok) {
          const data = await response.json();
          setInstructor(data.instructor);
          setStudents(data.students);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch instructor data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Instructor Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your schedule and students
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-blue-800">
                  <p className="font-medium">{instructor.name}</p>
                  <p className="text-blue-600">{instructor.email}</p>
                  {instructor.phone && (
                    <p className="text-blue-600">{instructor.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview Section */}
          <div ref={overviewRef} className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Overview & Statistics
                </h2>
                <p className="text-sm text-gray-600">
                  Quick overview of your lesson bookings and performance
                </p>
              </div>
              <div className="p-6">
                <InstructorStats stats={stats} />
              </div>
            </div>
          </div>

          {/* Schedule Management Section */}
          <div ref={scheduleRef} className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Weekly Schedule
                </h2>
                <p className="text-sm text-gray-600">
                  Set your availability for student bookings
                </p>
              </div>
              <div className="p-6">
                <InstructorSchedule
                  instructorId={instructor.id}
                  initialSchedules={instructor.schedules}
                />
              </div>
            </div>
          </div>

          {/* Student Bookings Section */}
          <div ref={studentsRef} className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Student Lesson Bookings
                </h2>
                <p className="text-sm text-gray-600">
                  Manage and cancel student appointments
                </p>
              </div>
              <div className="p-6">
                <InstructorStudents students={students} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        sections={sections}
        activeSection={activeSection}
        onSectionChange={scrollToSection}
      />
    </div>
  );
}
