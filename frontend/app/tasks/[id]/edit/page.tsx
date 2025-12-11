"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskSchemaDTO } from "@/schemas/taskSchema";
import { useEffect } from "react";
import { useTasks } from "@/hooks/useTask";
import Link from "next/link";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { tasksById: getTask, updateTask } = useTasks();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskSchemaDTO>({
    resolver: zodResolver(taskSchema),
  });

  const { data, isLoading } = getTask(id);

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        description: data.description || "",
        status: data.status || "OPEN",
      });
    }
  }, [data, reset]);

  const onSubmit = (values: TaskSchemaDTO) => {
    const payload: TaskSchemaDTO = {
      title: values.title,
      ...(values.description && { description: values.description }),
      ...(values.status && { status: values.status }),
    };
    
    updateTask.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          router.push("/tasks");
        },
      }
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center py-12 px-4 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Edit Task</h1>
            <p className="text-gray-600 dark:text-gray-300">Update your task details</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-gray-700 dark:text-gray-200">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="Enter task description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Error Message */}
            {updateTask.isError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">Error updating task</p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {(updateTask.error as any)?.response?.data?.message || 
                   (updateTask.error as any)?.response?.data?.error ||
                   "Failed to update task. Please try again."}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/tasks"
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-center font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateTask.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
              >
                {updateTask.isPending ? "Updating..." : "Update Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
