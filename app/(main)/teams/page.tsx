"use client";

import { useTeams } from "@/hooks/teams/use-team";
import { AddNewButton } from "@/components/teams/add-new-button";
import { TeamsListContent } from "@/components/teams/teams-list-content";
import { useEffect, useState, useMemo } from "react";
import { NavBackButton } from "@/components/navigation/nav-back-button";
import { NavNextButton } from "@/components/navigation/nav-next-button";

export default function TeamsPage() {
  const { teams, fetchTeams, deleteTeam } = useTeams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialSyncing, setIsInitialSyncing] = useState(false);

  // 1. Optimized background synchronization loop
  useEffect(() => {
    async function syncData() {
      // Only show a loading loop if we literally have zero cache memory records to display
      if (!teams || teams.length === 0) {
        setIsInitialSyncing(true);
      }
      try {
        await fetchTeams();
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitialSyncing(false);
      }
    }
    void syncData();
  }, [fetchTeams, teams?.length]); // Smart length monitoring prevents execution thrashing

  // 2. Filter teams
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    if (!searchQuery.trim()) return teams;
    const query = searchQuery.toLowerCase().trim();
    return teams.filter((team) => team.name.toLowerCase().includes(query));
  }, [teams, searchQuery]);

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full text-xs text-app-text">
      
      {/* Header Panel */}
      <div className="flex flex-col gap-1 p-5 bg-app-surface w-full ">
        
        {/* Navigation Action Buttons Row Group */}
        <div className="flex items-center gap-3 select-none mb-1">
          <NavBackButton />
          <span className="text-app-text/30 text-[10px] font-mono select-none mb-1">|</span>
          <NavNextButton />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full pb-2">
          <h1 className="text-lg font-bold text-app-text tracking-tight">My teams</h1>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Functional Text Search Query Filter Field */}
            <input
              type="text"
              placeholder="Filter teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 sm:flex-none p-1.5 px-3 text-xs border border-app-border rounded outline-none focus:border-app-primary bg-app-surface text-app-text placeholder-app-text/40 transition-colors"
            />
            <AddNewButton linkTo={"teams/create"} />
          </div>
        </div>
        <p className="text-xs text-app-text/50 font-mono">
          A comprehensive list of teams i am part of.
        </p>
      </div>

      {/* Main Table Layout */}
      <div className="flex flex-col border-t border-app-border bg-app-surface shadow-2xs overflow-hidden w-full ">
        <div className="hidden sm:grid grid-cols-3 items-center p-3 px-5 border-b border-app-border bg-app-card font-semibold text-app-text/70 text-xs font-mono uppercase tracking-wider">
          <div className="flex justify-start">Name</div>
          <div className="flex justify-center text-center">Created At</div>
          <div className="flex justify-end text-right">Actions</div>
        </div>

        <div className="w-full">
          {/* Passing false to loading parameters if we already have teams available in state cache memory */}
          <TeamsListContent
            teams={filteredTeams}
            loading={isInitialSyncing}
            onDelete={deleteTeam}
          />
        </div>
      </div>
    </div>

  );
}
