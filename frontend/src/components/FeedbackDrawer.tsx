"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Fragment, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (!feedbackId) return null;

  return (
    <Transition show={!!feedbackId} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Drawer */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  Feedback Details
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Title and metadata */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {data.title}
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
                          {data.source}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getSeverityColor(
                            data.severity
                          )}`}
                        >
                          {data.severity}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                      <p className="text-gray-700 leading-relaxed">
                        {data.description}
                      </p>
                    </div>

                    {/* Notes Section */}
                    <div className="border border-gray-200 rounded-lg p-4 shadow-md bg-white">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                        Notes
                      </h4>
                      {data.notes && data.notes.length > 0 ? (
                        <ul className="space-y-2 mb-4">
                          {data.notes.map((n: any) => (
                            <li
                              key={n.id}
                              className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 shadow-sm"
                            >
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>{n.content}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 mb-4 italic">
                          No notes yet
                        </p>
                      )}

                      <div className="space-y-2">
                        <input
                          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:shadow-md transition-all placeholder:text-gray-400"
                          placeholder="Add a note..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && note.trim()) {
                              addNoteMutation.mutate();
                            }
                          }}
                        />
                        <button
                          onClick={() => addNoteMutation.mutate()}
                          disabled={!note.trim() || addNoteMutation.isPending}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-sm"
                        >
                          {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                        </button>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="border border-gray-200 rounded-lg p-4 shadow-md bg-white">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                        Tags
                      </h4>
                      {data.tags && data.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {data.tags.map((t: any) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                            >
                              {t.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-4 italic">
                          No tags yet
                        </p>
                      )}

                      <div className="space-y-2">
                        <input
                          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:shadow-md transition-all placeholder:text-gray-400"
                          placeholder="Add a tag..."
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && tag.trim()) {
                              addTagMutation.mutate();
                            }
                          }}
                        />
                        <button
                          onClick={() => addTagMutation.mutate()}
                          disabled={!tag.trim() || addTagMutation.isPending}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-sm"
                        >
                          {addTagMutation.isPending ? "Adding..." : "Add Tag"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}