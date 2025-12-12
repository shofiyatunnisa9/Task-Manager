"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import {
  loginSchema,
  LoginSchemaDTO,
  registerSchema,
  RegisterSchemaDTO,
} from "@/schemas/authSchema";
import Link from "next/link";

export default function LoginPage() {
  const { registerForm } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaDTO>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchemaDTO) => registerForm.mutate(data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center py-12 px-4 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Welcome
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Register to manage your tasks
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 text-gray-700 dark:text-gray-200"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                type="name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {registerForm.isError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                  Register failed
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {(registerForm.error as any)?.response?.data?.message ||
                    (registerForm.error as any)?.response?.data?.error ||
                    "Invalid email or password. Please try again."}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={registerForm.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
            >
              {registerForm.isPending ? "Register..." : "Register"}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 font-semibold"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
