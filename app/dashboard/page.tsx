import { Suspense } from "react";
import AdminDashboardClient from "@/app/dashboard/AdminDashboardClient";

export default function Dashboard() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardClient />
    </Suspense>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
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
            <div className="mt-4 sm:mt-0">
              <div className="h-12 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Recent Activity Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
