"use client";

import { useAuth } from "@/hooks/users/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AppLogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = async () => {
    const confirmed = confirm(
      "Are you sure you want to sign out of your session?",
    );
    if (!confirmed) return;

    try {
      setIsLoggingOut(true);
      await logout();

      // Force clean reload and push back to home / login landing gate paths
      router.push("/auth/signin");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      if (typeof window !== "undefined") {
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogoutClick}
      disabled={isLoggingOut}
      className="px-2.5 py-1 h-7 border border-danger/30 rounded bg-danger/5 hover:bg-danger/10 text-danger font-semibold cursor-pointer text-[11px] uppercase tracking-wider font-mono transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap select-none shrink-0"
    >
      {isLoggingOut ? "Leaving..." : "Log Out"}
    </button>
  );
}
