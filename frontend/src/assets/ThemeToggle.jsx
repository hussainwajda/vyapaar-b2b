"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../components/ui/switch"; // Adjust path as needed

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply theme on mount & when toggling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="flex items-center space-x-2 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
      {/* Sun Icon */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-700 ${
          darkMode
            ? "text-[#A1A1AA] scale-75 rotate-12"
            : "text-[var(--color-heading)] scale-100 rotate-0"
        }`}
      />

      {/* Theme Switch */}
      <Switch
        checked={darkMode}
        onCheckedChange={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
        className="transition-all duration-700 cursor-pointer ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 bg-[var(--color-heading)]"
      />

      {/* Moon Icon (Fixes Display Issue) */}
      <Moon
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-700 ${
          darkMode
            ? "text-[var(--color-heading)] scale-100 rotate-0"
            : "text-[#A1A1AA] scale-75 rotate-12"
        }`}
      />
    </div>
  );
}
