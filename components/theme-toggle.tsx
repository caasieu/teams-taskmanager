"use client";

import { useTheme } from "@teispace/next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      className="border border-app-primary/30 w-full
      text-app-primary text-xs px-3 py-1.5 rounded-sm
      min-h-[2rem]"
      onClick={toggleTheme}
      suppressHydrationWarning
    >
      Tema {resolvedTheme === 'dark' ? 'Escuro' : 'Claro'}
    </button>
  );
}
