"use client";

import { usePathname } from "next/navigation";

export function DynamicTips() {
  const pathname = usePathname();

  // Hide tips on landing page and public pages
  if (
    pathname === "/" ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/instructor/login")
  ) {
    return null;
  }

  const getTipsForPage = () => {
    if (pathname.startsWith("/dashboard")) {
      return [
        "Use the month filter to view SRD totals for specific periods",
        "Click on AdminStats cards to see detailed student lists",
        "Monitor outstanding payments and missing documents",
        "Export student data to CSV for external analysis",
      ];
    }

    if (pathname.startsWith("/students")) {
      if (pathname.includes("/new")) {
        return [
          "Capture the agreed price as a snapshot for accurate billing",
          "Enter the ID Card Number for student portal access",
          "Select the appropriate license category for the student",
          "Upload required documents to avoid delays in exam scheduling",
        ];
      }

      // Check if it's a specific student page (has ID parameter)
      if (pathname.match(/\/students\/[^\/]+$/)) {
        return [
          "Update exam statuses as students progress through their course",
          "Use the document manager to track required document submissions",
          "Record payments promptly to maintain accurate balance tracking",
          "Add notes for important student-specific information",
        ];
      }

      return [
        "Use search and filters to quickly find specific students",
        "Click on student names to view detailed information",
        "Update exam statuses as students progress",
        "Track document submissions and payment history",
      ];
    }

    if (pathname.startsWith("/newsletters")) {
      return [
        "Draft newsletters before publishing to review content",
        "Use clear, engaging titles to increase readership",
        "Include relevant updates about exam schedules and policies",
        "Unpublish outdated newsletters to keep content fresh",
      ];
    }

    if (pathname.startsWith("/settings")) {
      return [
        "Update default registration price for new students",
        "Changes only affect new registrations, not existing students",
        "Keep pricing competitive with market rates",
        "Review and adjust settings quarterly",
      ];
    }

    if (pathname.startsWith("/instructor")) {
      if (pathname.includes("/login")) {
        return null; // No tips on login page
      }
      return [
        "Set your weekly availability for student lesson bookings",
        "Maximum 5 students per day ensures quality instruction",
        "Review your schedule regularly for any conflicts",
        "Update availability if your schedule changes",
      ];
    }

    if (pathname.startsWith("/lessons")) {
      return [
        "Set instructor availability for each day of the week",
        "Maximum 5 students per day for quality instruction",
        "Track lesson completion status for student progress",
        "Use notes field for special instructions or requirements",
      ];
    }

    // Default tips for other admin pages
    return [
      "Keep student records up to date for accurate reporting",
      "Regularly review payment statuses and outstanding balances",
      "Monitor exam pass rates to identify areas for improvement",
      "Use the dashboard to track overall school performance",
    ];
  };

  const tips = getTipsForPage();

  // If no tips for this page, don't render anything
  if (!tips) {
    return null;
  }

  return (
    <div className="card p-4 sticky top-6">
      <h3 className="font-semibold mb-2 text-sky-700">Quick Tips</h3>
      <ul className="text-sm text-gray-600 list-disc ml-5 space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="leading-relaxed">
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
