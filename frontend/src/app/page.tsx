"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import FeedbackDrawer from "@/components/FeedbackDrawer";

type Feedback = {
  id: string;
  title: string;
  source: string;
  severity: string;
  productArea: string;
};

export default function InboxPage() {
  const [source, setSource] = useState("");
  const [severity, setSeverity] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["feedback", source, severity],
    queryFn: async () => {
      const res = await api.get("/feedback", {
        params: {
          source: source || undefined,
          severity: severity || undefined,
        },
      });
      return res.data;
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source?.toLowerCase()) {
      case "form":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "support":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "sales":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading feedback...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Unified Feedback Inbox
          </h1>
          <p className="text-gray-600">
            Manage and track all customer feedback in one place
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white backdrop-blur-sm rounded-xl shadow-md border border-blue-100 p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Source
              </label>
              <select
                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="">All Sources</option>
                <option value="form">Form</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Severity
              </label>
              <select
                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {(source || severity) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSource("");
                    setSeverity("");
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-blue-100">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {data?.data.length || 0}
              </span>{" "}
              feedback items
            </p>
          </div>
        </div>

        {/* Feedback List */}
        {!data?.data.length ? (
          <div className="bg-white backdrop-blur-sm rounded-xl shadow-md border border-blue-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No feedback found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or check back later for new feedback.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {data.data.map((item: Feedback) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="bg-white backdrop-blur-sm border border-blue-100 rounded-xl p-5 hover:shadow-lg hover:border-indigo-200 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.productArea}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getSourceColor(
                          item.source
                        )}`}
                      >
                        {item.source}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getSeverityColor(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FeedbackDrawer
        feedbackId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </main>
  );
}