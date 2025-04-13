"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch, useMantineColorScheme } from "@mantine/core";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");

  // Sync with Mantine's color scheme
  useEffect(() => {
    setDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  const handleToggle = () => {
    toggleColorScheme();
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex items-center space-x-2 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
      {/* Sun Icon */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-700 ${
          darkMode
            ? "text-[#A1A1AA] scale-75 rotate-12"
            : "text-[var(--color-heading)] scale-100 rotate-0"
        }`}
      />

      {/* Mantine Switch */}
      <Switch
        checked={darkMode}
        onChange={handleToggle}
        aria-label="Toggle theme"
        size="md"
        classNames={{
          track: "bg-[var(--color-heading)]",
          thumb: darkMode ? "bg-dark-800" : "bg-white",
        }}
        className="transition-all duration-700 cursor-pointer ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110"
      />

      {/* Moon Icon */}
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