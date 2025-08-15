"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { REQUIRED_DOC_TYPES } from "@/lib/requiredDocs";
import MonthFilter from "@/app/components/MonthFilter";
import AdminStats from "@/app/components/AdminStats";

interface Metrics {
  totalStudents: number;
  totalReceived: number;
  monthFilteredReceived: number;
  totalOutstanding: number;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics>({
    totalStudents: 0,
    totalReceived: 0,
    monthFilteredReceived: 0,
    totalOutstanding: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const month = searchParams.get("month");

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
        // Keep default values on error
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      // Keep default values on error
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
      <main className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="stat animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <MonthFilter
            month={month || undefined}
            onChange={handleMonthChange}
          />
        </div>
      </div>

      <AdminStats />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="stat">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {metrics.totalStudents}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="stat">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            SRD{" "}
            {(
              (month ? metrics.monthFilteredReceived : metrics.totalReceived) /
              100
            ).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            Total Received {month ? `(${month})` : ""}
          </div>
        </div>
        <div className="stat sm:col-span-2 lg:col-span-1">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">
            SRD {(metrics.totalOutstanding / 100).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Outstanding Payments</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link className="btn btn-secondary" href="/students">
          View Students
        </Link>
        <Link href="/students/new" className="btn btn-accent gap-2">
          <svg
            className="w-4 h-4"
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
          Register Student
        </Link>
        <Link className="btn btn-secondary" href="/lessons">
          Manage Lessons
        </Link>
        <Link className="btn btn-secondary" href="/settings">
          Settings
        </Link>
        <Link className="btn btn-secondary" href="/newsletters">
          Newsletters
        </Link>
        <Link className="btn btn-secondary" href="/api/export/students">
          Export CSV
        </Link>
      </div>
    </main>
  );
}
