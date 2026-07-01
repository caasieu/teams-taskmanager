"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NavBackButton() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkHistoryState = () => {
      setCanGoBack(window.history.length > 1);
    };

    checkHistoryState();
    
    window.addEventListener("popstate", checkHistoryState);
    return () => window.removeEventListener("popstate", checkHistoryState);
  }, []);

  return (
    <button
      type="button"
      onClick={() => canGoBack && router.back()}
      disabled={!canGoBack}
      suppressHydrationWarning
      className="flex items-center gap-1 text-gray-400 hover:text-app-primary disabled:opacity-30 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors text-[11px] font-medium font-mono select-none w-fit cursor-pointer mb-1"
      aria-label="Go back to previous page"
    >
      &larr; back
    </button>
  );
}
