"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import MonthFilter from "@/app/components/MonthFilter";
import AdminStats from "@/app/components/AdminStats";
import AdminMobileNavigation from "@/app/components/AdminMobileNavigation";

interface Metrics {
  totalStudents: number;
  totalReceived: number;
  monthFilteredReceived: number;
  totalOutstanding: number;
}

export default function AdminDashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [metrics, setMetrics] = useState<Metrics>({
    totalStudents: 0,
    totalReceived: 0,
    monthFilteredReceived: 0,
    totalOutstanding: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const month = searchParams.get("month");

  const overviewRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

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
      id: "stats",
      label: "Statistics",
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
      id: "actions",
      label: "Quick Actions",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: "activity",
      label: "Recent Activity",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      name: "View Students",
      description: "Browse all registered students",
      href: "/students",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      color: "blue",
    },
    {
      name: "Register Student",
      description: "Add new student to the system",
      href: "/students/new",
      icon: (
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      color: "green",
    },
    {
      name: "Manage Lessons",
      description: "Schedule and organize driving lessons",
      href: "/lessons",
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "purple",
    },
    {
      name: "Settings",
      description: "Configure system preferences",
      href: "/settings",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: "gray",
    },
    {
      name: "Newsletters",
      description: "Manage email communications",
      href: "/newsletters",
      icon: (
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
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "orange",
    },
    {
      name: "Export CSV",
      description: "Download student data",
      href: "/api/export/students",
      icon: (
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "indigo",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      gray: "bg-gray-50 text-gray-600 border-gray-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    let targetRef;

    switch (sectionId) {
      case "overview":
        targetRef = overviewRef;
        break;
      case "stats":
        targetRef = statsRef;
        break;
      case "actions":
        targetRef = actionsRef;
        break;
      case "activity":
        targetRef = activityRef;
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

  useEffect(() => {
    fetchMetrics();
  }, [month]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(
        `/api/dashboard${month ? `?month=${month}` : ""}`
      );
      if (response.ok) {
        const data = await response.json();
        setMetrics({
          totalStudents: data.totalStudents || 0,
          totalReceived: data.totalReceived || 0,
          monthFilteredReceived: data.monthFilteredReceived || 0,
          totalOutstanding: data.totalOutstanding || 0,
        });
      } else {
        console.error("Failed to fetch metrics");
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (newMonth: string) => {
    if (newMonth) {
      router.push(`/dashboard?month=${newMonth}`);
    } else {
      router.push("/dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your driving school operations
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <MonthFilter
                month={month || undefined}
                onChange={handleMonthChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview Section - Key Metrics */}
          <div ref={overviewRef} className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Key Metrics
                </h2>
                <p className="text-sm text-gray-600">
                  Overview of your driving school performance
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 truncate">
                          Total Students
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {metrics.totalStudents}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-blue-50 text-blue-600 border-blue-200">
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
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Registered
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 truncate">
                          Total Received
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          SRD{" "}
                          {(
                            (month
                              ? metrics.monthFilteredReceived
                              : metrics.totalReceived) / 100
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-green-50 text-green-600 border-green-200">
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {month ? month : "All Time"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 truncate">
                          Outstanding
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          SRD {(metrics.totalOutstanding / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-red-50 text-red-600 border-red-200">
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 truncate">
                          Success Rate
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {metrics.totalStudents > 0
                            ? Math.round(
                                (metrics.totalStudents /
                                  (metrics.totalStudents +
                                    metrics.totalOutstanding)) *
                                  100
                              )
                            : 0}
                          %
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-emerald-50 text-emerald-600 border-emerald-200">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Performance
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div ref={statsRef} className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Student Statistics
                </h2>
                <p className="text-sm text-gray-600">
                  Detailed breakdown of student performance and documents
                </p>
              </div>
              <div className="p-6">
                <AdminStats />
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div ref={actionsRef} className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h2>
                <p className="text-sm text-gray-600">
                  Common administrative tasks and shortcuts
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="group block"
                    >
                      <div
                        className={`rounded-lg border-2 p-4 text-center transition-all duration-200 hover:shadow-md hover:scale-105 ${getColorClasses(
                          action.color
                        )}`}
                      >
                        <div className="mx-auto w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                          {action.icon}
                        </div>
                        <h3 className="font-medium text-sm mb-1">
                          {action.name}
                        </h3>
                        <p className="text-xs opacity-75">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div ref={activityRef} className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <p className="text-sm text-gray-600">
                  Latest system activities and updates
                </p>
              </div>
              <div className="p-6">
                {metrics.totalStudents > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Dashboard Overview
                        </p>
                        <p className="text-xs text-gray-500">
                          {metrics.totalStudents} student
                          {metrics.totalStudents !== 1 ? "s" : ""} registered in
                          the system
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">Current</span>
                    </div>

                    {metrics.totalReceived > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Financial Summary
                          </p>
                          <p className="text-xs text-gray-500">
                            SRD{" "}
                            {(
                              (month
                                ? metrics.monthFilteredReceived
                                : metrics.totalReceived) / 100
                            ).toFixed(2)}{" "}
                            received
                            {month && ` for ${month}`}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">Current</span>
                      </div>
                    )}

                    {metrics.totalOutstanding > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-600"
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
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Outstanding Payments
                          </p>
                          <p className="text-xs text-gray-500">
                            SRD {(metrics.totalOutstanding / 100).toFixed(2)}{" "}
                            pending collection
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">Current</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          System Status
                        </p>
                        <p className="text-xs text-gray-500">
                          Dashboard updated with latest metrics and statistics
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">Current</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Recent Activity
                    </h3>
                    <p className="text-gray-500">
                      Activity will appear here as you use the system.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AdminMobileNavigation
        sections={sections}
        activeSection={activeSection}
        onSectionChange={scrollToSection}
      />
    </div>
  );
}
