"use client";

import { TeamCard } from "./team-card";
import { Team } from "@/types/team/team";
import { useIsClient } from "@/hooks/utils/use-is-client";

interface TeamListProps {
  teams: Team[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

// Clean loading placeholder skeleton to prevent layout shifting
function TeamCardSkeleton() {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-3 items-center justify-between gap-3 p-4 border-b border-app-border w-full animate-pulse bg-app-surface">
      <div className="h-4 bg-app-border rounded w-2/3 sm:w-1/2 justify-self-start opacity-80" />
      <div className="h-4 bg-app-border rounded w-1/3 sm:w-1/4 justify-self-center hidden sm:block opacity-50" />
      <div className="h-7 bg-app-border rounded w-16 justify-self-end self-end sm:self-auto opacity-50" />
    </div>
  );
}

export function TeamsListContent({ teams, loading, onDelete }: TeamListProps) {
  // 1. Safe hydration sync: Reads a stable reference store layer to bypass SSR desyncs cleanly
  const isClient = useIsClient();

  // 2. Loading UI state loop matches your main dashboard views
  if (loading) {
    return (
      <div className="flex flex-col w-full divide-y divide-app-border">
        {Array.from({ length: 3 }).map((_, idx) => (
          <TeamCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

  // 3. Fallback loader profile prevents server vs client data tree desyncs during hydration
  if (!isClient) {
    return (
      <div className="flex flex-col w-full divide-y divide-app-border">
        {Array.from({ length: 3 }).map((_, idx) => (
          <TeamCardSkeleton key={`skeleton-mount-${idx}`} />
        ))}
      </div>
    );
  }

  // 4. Empty UI state indicator handler
  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 font-medium bg-white w-full border-b border-app-border">
        No teams found matching your workspace.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full divide-y divide-app-border bg-app-surface min-h-[12rem]">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} onDelete={onDelete} />
      ))}
    </div>
  );
}
