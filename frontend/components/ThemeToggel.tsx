"use client";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const systemPrefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = saved ? saved === "dark" : systemPrefersDark;

    setDark(useDark);
    document.documentElement.classList.toggle("dark", useDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);

    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 hover:opacity-80 transition"
    >
      {dark ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
    </button>
  );
}
