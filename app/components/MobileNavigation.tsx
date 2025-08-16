"use client";

import { useState } from "react";

interface MobileNavigationProps {
  sections: {
    id: string;
    label: string;
    icon: React.ReactNode;
  }[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export default function MobileNavigation({
  sections,
  activeSection,
  onSectionChange,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed bottom-24 right-6 w-64 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      onSectionChange(section.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-5 h-5">{section.icon}</div>
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
