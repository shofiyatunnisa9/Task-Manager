"use client";

import Link from "next/link";
import { useTasks } from "@/hooks/useTask";

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "DONE":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function TaskListPage() {
  const { tasks, deleteTask } = useTasks();

  const { data, isLoading, isError, error } = tasks;

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      (error as any)?.response?.data?.message ||
      (error as any)?.response?.data?.error ||
      (error as any)?.message ||
      "Unknown error";
    const statusCode = (error as any)?.response?.status;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error loading tasks
          </h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          {statusCode === 401 && (
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h1>
            <p className="text-gray-600">Manage your tasks efficiently</p>
          </div>
          <div className="flex gap-5">
            <Link
              href="/tasks/create"
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>New Task</span>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {(!data || !Array.isArray(data) || data.length === 0) && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No tasks yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by creating your first task!
            </p>
            {!isLoggedIn && (
              <p className="text-sm text-red-500 mb-4">
                You are not logged in. Please{" "}
                <Link href="/login" className="underline font-semibold">
                  login
                </Link>{" "}
                first.
              </p>
            )}
            <Link
              href="/tasks/create"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Task
            </Link>
          </div>
        )}

        {/* Task Cards Grid */}
        {Array.isArray(data) && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((task: any) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        task.status || "OPEN"
                      )}`}
                    >
                      {task.status || "OPEN"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {task.title}
                  </h2>

                  {/* Description */}
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {task.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium text-sm"
                    >
                      View
                    </Link>
                    <Link
                      href={`/tasks/${task.id}/edit`}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition font-medium text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this task?")
                        ) {
                          deleteTask.mutate(task.id);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
