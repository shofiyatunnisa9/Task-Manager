"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    // Check auth on storage change (for login/logout)
    window.addEventListener("storage", checkAuth);
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/tasks" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
              Task Manager
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/tasks"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  My Tasks
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

