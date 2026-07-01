import { NavBackButton } from "@/components/navigation/nav-back-button";
import { NavNextButton } from "@/components/navigation/nav-next-button";
import { CreateTeamForm } from "@/components/teams/create-team-form";

export default function CreateTeamsPage() {
  return (
    <div className="flex flex-col p-6 gap-4 max-w-5xl mx-auto w-full text-xs text-app-text bg-app-bg transition-colors">
      {/* 1. Header Information Context Section */}
      <div className="flex flex-col gap-1 pb-2">
        {/* Navigation Action Buttons Row Group */}
        <div className="flex items-center gap-3 select-none mb-1">
          <NavBackButton />
          <span className="text-app-text/30 text-[10px] font-mono select-none mb-1">
            |
          </span>
          <NavNextButton />
        </div>

        <h1 className="text-xl font-bold text-app-text tracking-tight">
          Create Team
        </h1>
        <p className="text-xs text-app-text/50 font-mono">
          Initialize a new agile workspace, assign a roster, and begin planning
          sprints.
        </p>
      </div>

      {/* 2. Form Canvas Layout Container */}
      <div className="w-full">
        <CreateTeamForm />
      </div>
    </div>
  );
}
