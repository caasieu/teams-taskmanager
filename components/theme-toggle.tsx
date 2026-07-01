"use client";

import { useTheme } from "@teispace/next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-2 py-1 h-7 border border-app-border rounded bg-app-card hover:bg-app-border text-app-text font-semibold cursor-pointer text-[11px] uppercase tracking-wider font-mono transition-all select-none shrink-0"
      aria-label="Toggle theme display configuration"
    >
      <span className="text-xs">{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
