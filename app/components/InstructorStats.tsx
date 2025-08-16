"use client";

interface StatsProps {
  stats: {
    totalBookings: number;
    thisWeekBookings: number;
    cancelledBookings: number;
    completedBookings: number;
  };
}

export default function InstructorStats({ stats }: StatsProps) {
  const statCards = [
    {
      name: "Total Bookings",
      value: stats.totalBookings,
      change: "+12%",
      changeType: "increase",
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
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      color: "blue",
    },
    {
      name: "This Week",
      value: stats.thisWeekBookings,
      change: "Active",
      changeType: "active",
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
      color: "green",
    },
    {
      name: "Cancelled",
      value: stats.cancelledBookings,
      change: "This month",
      changeType: "neutral",
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      color: "red",
    },
    {
      name: "Completed",
      value: stats.completedBookings,
      change: "+8%",
      changeType: "increase",
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "emerald",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      red: "bg-red-50 text-red-600 border-red-200",
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getChangeColor = (changeType: string) => {
    const colors = {
      increase: "text-green-600 bg-green-50",
      decrease: "text-red-600 bg-red-50",
      active: "text-blue-600 bg-blue-50",
      neutral: "text-gray-600 bg-gray-50",
    };
    return colors[changeType as keyof typeof colors] || colors.neutral;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 truncate">
                {stat.name}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getColorClasses(
                stat.color
              )}`}
            >
              {stat.icon}
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeColor(
                stat.changeType
              )}`}
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
