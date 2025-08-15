"use client";

import { useState } from "react";

interface Newsletter {
  id: string;
  title: string;
  content: string;
  category: "GENERAL" | "IMPORTANT";
  publishedAt: Date | null;
}

interface MobileNewsModalProps {
  newsletters: Newsletter[];
}

export function MobileNewsModal({ newsletters }: MobileNewsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Notification Icon - Only visible on mobile */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleModal}
          className="relative bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.73 21a2 2 0 0 1-3.46 0"
            />
          </svg>

          {/* Notification Badge */}
          {newsletters.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {newsletters.length > 9 ? "9+" : newsletters.length}
            </span>
          )}
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md max-h-[90vh] bg-white rounded-lg shadow-xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Latest News
                  </h3>
                  <button
                    onClick={toggleModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
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
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  {newsletters.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p>No news yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {newsletters.map((newsletter) => (
                        <div
                          key={newsletter.id}
                          className={`border rounded-lg p-4 ${
                            newsletter.category === "IMPORTANT"
                              ? "border-l-4 border-l-red-500 bg-red-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            {newsletter.category === "IMPORTANT" ? (
                              <div className="flex items-center gap-2 text-red-600">
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-red-700">
                                  Important
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-blue-600">
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-blue-700">
                                  General
                                </span>
                              </div>
                            )}
                          </div>

                          <h4 className="font-semibold text-gray-900 mb-2">
                            {newsletter.title}
                          </h4>

                          <div className="text-sm text-gray-500 mb-3">
                            {newsletter.publishedAt
                              ? new Date(
                                  newsletter.publishedAt
                                ).toLocaleDateString()
                              : ""}
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed">
                            {newsletter.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-4 border-t border-gray-200">
                  <button
                    onClick={toggleModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
