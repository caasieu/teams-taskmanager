"use client";

import { useAuth } from "@/hooks/users/use-auth";
import { useEffect } from "react";

// Clean layout loading placeholder to match active container heights
function AccountCardSkeleton() {
  return (
    <div className="flex items-center justify-between min-h-[4rem] w-full px-3.5 py-2 border-b border-app-border bg-white animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded-md shrink-0" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>
      <div className="h-7 bg-gray-100 rounded w-12" />
    </div>
  );
}

export function AccountCard() {
  const { user, loading, fetchUser } = useAuth();

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  if (loading) return <AccountCardSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[4rem] w-full p-4 border border-dashed border-red-200 bg-red-50/30 text-red-600 font-medium text-xs rounded">
        Session expired. Not logged in.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[4rem] w-full px-3.5 py-2 text-xs bg-app-surface border-b border-app-border transition-colors hover:bg-app-card/40 text-app-text">
  
  {/* Identity Group Container */}
  <div className="flex items-center gap-3 min-w-0">
    {/* Avatar Square Icon Deck Block */}
    <div className="shrink-0 border border-app-border h-10 w-10 rounded-md bg-app-bg flex items-center justify-center font-bold text-xs text-app-text/60 uppercase tracking-wider font-mono shadow-2xs">
      {user.fullName?.substring(0, 2) || "TM"}
    </div>

    {/* Text Details Stack Block */}
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-bold text-app-text truncate text-sm sm:text-xs">
        {user.fullName}
      </span>
      <span className="text-app-text/40 font-mono text-[11px]">
        @{user.username}
      </span>
    </div>
  </div>

  {/* Account Settings Action Control Deck */}
  <div className="flex justify-end pt-1 sm:pt-0 shrink-0">
    {/*<button
      type="button"
      onClick={() => console.log("Navigate or open edit profile panel modal")}
      className="w-full sm:w-auto text-center px-2.5 py-1 text-xs sm:text-[11px] font-semibold border border-app-border rounded bg-app-card hover:bg-app-border text-app-text transition shadow-2xs cursor-pointer whitespace-nowrap"
    >
      Edit Profile
    </button>*/}
  </div>

</div>

  );
}
