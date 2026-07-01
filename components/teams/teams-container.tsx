"use client";

import { useTeams } from "@/hooks/teams/use-team";
import { AddNewButton } from "./add-new-button";
import { TeamsListContent } from "./teams-list-content";
import { useEffect } from "react";

export function TeamsContainer() {
  const { teams, loading, fetchTeams, deleteTeam } = useTeams();

  // SAFEGUARD: The layout list effect should only execute if explicitly required
  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">
          <h1> My teams </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <AddNewButton linkTo={"teams/create"} />
          
          <div className="flex items-center justify-center p-1.5 px-3 border border-app-border rounded">
            Filter
          </div>
        </div>
      </div>

      <div className="flex flex-col border border-app-border">
        <div className="flex items-center justify-between p-3 border-b border-app-border overflow-x-scroll">
          <div className="flex items-center gap-2 min-w-[18rem] ">
            <div className="flex justify-start ">
              <span className="font-semibold text-sm"> Name </span>
            </div>
          </div>

          <div className="flex items-center justify-center min-w-[8rem]">
            <span className="font-semibold text-sm">
              Created at
            </span>
          </div>

          <div className="min-w-[8rem] flex justify-end">
            <span className="font-semibold text-sm"> Actions</span>
          </div>
        </div>

        <TeamsListContent
          teams={teams}
          loading={loading}
          onDelete={deleteTeam}
        />
      </div>
    </div>
  );
}
