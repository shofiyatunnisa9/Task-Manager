"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTasks } from "@/hooks/useTask";
import { useAuth } from "@/hooks/useAuth";

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:border-blue-800";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-100 dark:border-yellow-800";
    case "DONE":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-100 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/60 dark:text-gray-100 dark:border-gray-700";
  }
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { tasksById: getTask, deleteTask } = useTasks();
  const { logout } = useAuth();
  const { data: task, isLoading, isError } = getTask(id);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(id, {
        onSuccess: () => {
          router.push("/tasks");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center text-gray-900 dark:text-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading task...</p>
        </div>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6 text-gray-900 dark:text-gray-100">
        <div className="max-w-md w-full bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Task not found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The task you're looking for doesn't exist.</p>
          <Link
            href="/tasks"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-8 px-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/tasks"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-4 transition"
          >
            <span className="mr-2">←</span>
            <span>Back to Tasks</span>
          </Link>
        </div>

        {/* Task Detail Card */}
        <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Status and Date */}
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(task.status || "OPEN")}`}>
                {task.status || "OPEN"}
              </span>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(task.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">{task.title}</h1>

            {/* Description */}
            {task.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Description</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {/* Task Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{task.status || "OPEN"}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Link
                href={`/tasks/${task.id}/edit`}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition font-medium"
              >
                Edit Task
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition font-medium"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

