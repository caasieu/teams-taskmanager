"use client";
import { TeamCard } from "./team-card";
import { useEffect } from "react";
import { Team } from "@/types/team/team";


interface TeamListProps {
  teams: Team[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function TeamsListContent({teams, loading, onDelete}: TeamListProps) {
  
  console.log(teams, loading);

  useEffect(() => {
    console.log("isLoading? ", loading);
  }, [loading]);

  return (
    <div className="flex flex-col h-[18rem] overflow-y-scroll overflow-x-scroll">
      {teams?.map((team, index) => (
        <TeamCard key={index} team={team} onDelete={onDelete} />
      ))}
    </div>
  );
}
