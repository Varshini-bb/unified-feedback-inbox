"use client";

import { Dialog } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";

type Props = {
  feedbackId: string | null;
  onClose: () => void;
};

export default function FeedbackDrawer({ feedbackId, onClose }: Props) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [tag, setTag] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["feedback", feedbackId],
    enabled: !!feedbackId,
    queryFn: async () => {
      const res = await api.get(`/feedback/${feedbackId}`);
      return res.data;
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/feedback/${feedbackId}/notes`, {
        content: note,
      });
    },
    onSuccess: () => {
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["feedback", feedbackId] });
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/feedback/${feedbackId}/tags`, {
        name: tag,
      });
    },
    onSuccess: () => {
      setTag("");
      queryClient.invalidateQueries({ queryKey: ["feedback", feedbackId] });
    },
  });

  if (!feedbackId) return null;

  return (
    <Dialog open={!!feedbackId} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">{data.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {data.source} • {data.severity}
            </p>

            <p className="mb-6">{data.description}</p>

            {/* Notes */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Notes</h3>
              <ul className="mb-2 space-y-1">
                {data.notes.map((n: any) => (
                  <li key={n.id} className="text-sm text-gray-700">
                    • {n.content}
                  </li>
                ))}
              </ul>

              <input
                className="border p-2 w-full rounded"
                placeholder="Add note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                onClick={() => addNoteMutation.mutate()}
                className="mt-2 bg-black text-white px-3 py-1 rounded"
              >
                Add Note
              </button>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex gap-2 mb-2 flex-wrap">
                {data.tags?.map((t: any) => (
                  <span
                    key={t.id}
                    className="bg-gray-200 text-sm px-2 py-1 rounded"
                  >
                    {t.name}
                  </span>
                ))}
              </div>

              <input
                className="border p-2 w-full rounded"
                placeholder="Add tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
              <button
                onClick={() => addTagMutation.mutate()}
                className="mt-2 bg-black text-white px-3 py-1 rounded"
              >
                Add Tag
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
