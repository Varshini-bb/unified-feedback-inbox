"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";

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

  if (isLoading) {
    return <p className="p-6">Loading inbox...</p>;
  }

  if (!data?.data.length) {
    return <p className="p-6">No feedback found.</p>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Unified Feedback Inbox</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">All Sources</option>
          <option value="form">Form</option>
          <option value="support">Support</option>
          <option value="sales">Sales</option>
        </select>

        <select
          className="border p-2 rounded"
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

      {/* Feedback List */}
      <ul className="space-y-3">
        {data.data.map((item: Feedback) => (
          <li
            key={item.id}
            className="border p-4 rounded hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <h2 className="font-semibold">{item.title}</h2>
              <span className="text-sm text-gray-500">
                {item.source} • {item.severity}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {item.productArea}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
