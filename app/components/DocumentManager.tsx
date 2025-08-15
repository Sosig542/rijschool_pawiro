"use client";

import { useState } from "react";
import { REQUIRED_DOC_TYPES } from "@/lib/requiredDocs";

interface Document {
  id: string;
  type: string;
  isSubmitted: boolean;
  submittedAt?: Date;
}

interface DocumentManagerProps {
  studentId: string;
  documents: Document[];
}

export default function DocumentManager({
  studentId,
  documents,
}: DocumentManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDocuments, setTempDocuments] = useState<Document[]>(documents);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (docType: string, checked: boolean) => {
    setTempDocuments((prev) => {
      const existing = prev.find((d) => d.type === docType);
      if (existing) {
        // Update existing document
        return prev.map((d) =>
          d.type === docType
            ? {
                ...d,
                isSubmitted: checked,
                submittedAt: checked ? new Date() : undefined,
              }
            : d
        );
      } else {
        // Create new document
        const newDoc: Document = {
          id: `temp-${Date.now()}-${docType}`,
          type: docType,
          isSubmitted: checked,
          submittedAt: checked ? new Date() : undefined,
        };
        return [...prev, newDoc];
      }
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("documents", JSON.stringify(tempDocuments));

      const response = await fetch(`/api/students/${studentId}/documents`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        // Close modal and refresh page to show updated data
        setIsModalOpen(false);
        window.location.reload();
      } else {
        console.error("Failed to update documents");
      }
    } catch (error) {
      console.error("Error updating documents:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTempDocuments(documents);
    setIsModalOpen(false);
  };

  const getDocumentStatus = (docType: string) => {
    const doc = documents.find((d) => d.type === docType);
    return doc?.isSubmitted || false;
  };

  const submittedCount = documents.filter((d) => d.isSubmitted).length;
  const totalCount = REQUIRED_DOC_TYPES.length;

  return (
    <>
      <div className="bg-white border rounded p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Documents</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            Manage Documents
          </button>
        </div>

        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-2">
            Progress: {submittedCount}/{totalCount} documents submitted
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(submittedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {REQUIRED_DOC_TYPES.map((docType) => {
            const isSubmitted = getDocumentStatus(docType);
            return (
              <div
                key={docType}
                className={`flex items-center gap-2 p-2 rounded ${
                  isSubmitted
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isSubmitted ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span
                  className={isSubmitted ? "text-green-700" : "text-gray-600"}
                >
                  {docType}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Manage Documents</h3>

            <div className="space-y-3 mb-6">
              {REQUIRED_DOC_TYPES.map((docType) => {
                const isSubmitted =
                  tempDocuments.find((d) => d.type === docType)?.isSubmitted ||
                  false;
                return (
                  <label
                    key={docType}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSubmitted}
                      onChange={(e) =>
                        handleCheckboxChange(docType, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm">{docType}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
