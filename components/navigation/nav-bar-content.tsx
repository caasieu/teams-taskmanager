"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useTeams } from "@/hooks/teams/use-team";
import { AccountCard } from "../users/account-card";
import { AppLogo } from "@/components/app-logo";
import { AppLogoutButton } from "@/components/app-logout-button";

// 1. Dynamic safe import with SSR disabled entirely to isolate local storage changes
const NavBarLinksSection = dynamic(
  () => import("./nav-bar-links-section").then((mod) => mod.NavBarLinksSection),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-2 px-4 py-3 animate-pulse">
        <div className="h-3.5 bg-app-border/70 rounded-sm w-20" />
        <div className="h-6 bg-app-border/40 rounded-sm w-full" />
      </div>
    ),
  },
);

// Dynamic import for ThemeToggle as we configured earlier
const ThemeToggle = dynamic(
  () => import("@/components/theme-toggle").then((mod) => mod.ThemeToggle),
  { ssr: false },
);

export function NavBarContent() {
  const { teams, fetchTeams } = useTeams();

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    function handleGlobalTeamSync() {
      void fetchTeams(true);
    }
    window.addEventListener("teams-updated", handleGlobalTeamSync);
    return () =>
      window.removeEventListener("teams-updated", handleGlobalTeamSync);
  }, [fetchTeams]);

  const transformedTeamRoutes = useMemo(() => {
    if (!teams) return [];
    return teams.map((team) => ({
      id: team.id,
      label: team.name,
      path: `/teams/${team.id}`,
    }));
  }, [teams]);

  return (
    <nav className="hidden md:flex flex-col h-full w-64 bg-app-surface border-r border-app-border text-xs select-none text-app-text transition-colors">
      <div className="flex items-center px-4 min-h-[3.5rem] border-b border-app-border">
        <AppLogo />
      </div>

      <div className="w-full">
        <AccountCard />
      </div>

      <div className="flex-1 flex flex-col gap-1 py-4 overflow-y-auto min-h-0">
        {/* Renders completely safe client side from local storage without cascading render triggers */}
        <NavBarLinksSection
          label="Teams"
          path="/teams"
          routes={transformedTeamRoutes}
        />
      </div>

      <div className="flex flex-col gap-2 p-4 border-t border-app-border bg-app-card shrink-0 transition-colors">
        <div className="flex items-center justify-between text-app-text/40 font-mono text-[10px] uppercase tracking-wider font-bold">
          <span>System Utilities</span>
        </div>

        <div className="flex items-center justify-between gap-3 bg-app-surface border border-app-border p-2.5 rounded shadow-2xs w-full transition-colors">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-app-text/70 font-medium tracking-wide">
              Theme
            </span>
          </div>
          <div className="shrink-0">
            <AppLogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
