"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskSchemaDTO } from "@/schemas/taskSchema";
import { useTasks } from "@/hooks/useTask";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTaskPage() {
  const { createTask } = useTasks();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskSchemaDTO>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskSchemaDTO) => {
    createTask.mutate(data, {
      onSuccess: async () => {
        reset();
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/tasks");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Task</h1>
            <p className="text-gray-600">Add a new task to your list</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-gray-700">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="Enter task description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Error Message */}
            {createTask.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 mb-1">Error creating task</p>
                <p className="text-sm text-red-600">
                  {(createTask.error as any)?.response?.data?.message || 
                   (createTask.error as any)?.response?.data?.error ||
                   (createTask.error as any)?.message || 
                   "Failed to create task. Please try again."}
                </p>
                {(createTask.error as any)?.response?.status === 401 && (
                  <p className="text-xs mt-2 text-red-600">
                    Please <Link href="/login" className="underline font-semibold">login</Link> first
                  </p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/tasks"
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createTask.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
              >
                {createTask.isPending ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
