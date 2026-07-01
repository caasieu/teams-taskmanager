"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Explicit type narrowing interface matching the modern browser Navigation API specification
interface ModernNavigationTimeline {
  canGoForward: boolean;
}

export function NavNextButton() {
  const router = useRouter();
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkForwardState = () => {
      // Modern standard API compatibility check for forward tracking layers using safe unknown casting
      if ("navigation" in window && typeof (window as unknown as { navigation: ModernNavigationTimeline }).navigation === "object") {
        const navStore = (window as unknown as { navigation: ModernNavigationTimeline }).navigation;
        setCanGoForward(navStore?.canGoForward ?? false);
        return;
      }

      // Fallback evaluation parameters matching Next.js runtime state objects
      const state = window.history.state as Record<string, unknown> | null;
      const hasForwardTrack = state && typeof state === "object" && (
        "forward" in state || 
        (state.unstable_isv2 && window.history.length > 1)
      );
      setCanGoForward(!!hasForwardTrack);
    };

    // Run verification instantly upon component loading phases
    checkForwardState();

    window.addEventListener("popstate", checkForwardState);
    return () => window.removeEventListener("popstate", checkForwardState);
  }, []);

  return (
    <button
      type="button"
      onClick={() => canGoForward && router.forward()}
      disabled={!canGoForward}
      suppressHydrationWarning
      className="flex items-center gap-1 text-gray-400 hover:text-app-primary disabled:opacity-30 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors text-[11px] font-medium font-mono select-none w-fit cursor-pointer mb-1"
      aria-label="Go forward to next page"
    >
      next &rarr;
    </button>
  );
}
