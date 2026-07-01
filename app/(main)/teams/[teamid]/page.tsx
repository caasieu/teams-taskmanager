"use client";

import { useEffect, useState, useMemo, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { DeleteSprintButton } from "@/components/sprints/delete-sprint-button";
import { TeamAddMemberForm } from "@/components/teams/details/team-add-member-form";
import { TeamMemberCard } from "@/components/teams/details/team-member-card";
import { useSprints } from "@/hooks/sprints/use-sprints";
import { useTeams } from "@/hooks/teams/use-team";
import { Team } from "@/types/team/team";
import { SprintList } from "@/components/sprints/sprint-list";
import { NavBackButton } from "@/components/navigation/nav-back-button";
import { NavNextButton } from "@/components/navigation/nav-next-button";
import { useAuth } from "@/hooks/users/use-auth";

const subscribeNoOp = () => () => {};

// Clean layout component for Sprint statuses inside the team list view
function SprintStatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  const styles =
    {
      ACTIVE: "bg-blue-50 text-blue-700 border-blue-100",
      COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
      NOT_STARTED: "bg-gray-100 text-gray-600 border-gray-200",
    }[status] || "bg-gray-50 text-gray-600 border-gray-200";

  const label = status.replace("_", " ").toLowerCase();

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-sm font-mono ${styles}`}
    >
      {label}
    </span>
  );
}

export default function TeamPage() {
  const params = useParams();
  const teamId = (params.teamId || params.teamid) as string;

  const { teams, fetchTeamById, addMember, removeMember } = useTeams();
  const { sprints, fetchSprints } = useSprints();
  const { user } = useAuth(); // Extracted logged-in operator data context
  const [error, setError] = useState<string | null>(null);

  // 1. Core background data initialization loops
  useEffect(() => {
    if (!teamId) return;

    let mounted = true;

    async function load() {
      try {
        await Promise.all([fetchTeamById(teamId), fetchSprints(teamId)]);
      } catch (err) {
        if (mounted) {
          setError("Failed to load team.");
        }
        console.error(err);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [teamId, fetchTeamById, fetchSprints]);

  // 2. Fetch the global hook arrays instantly without triggering hydration faults
  const clientTeams = useSyncExternalStore(
    subscribeNoOp,
    () => teams,
    () => [] as Team[],
  );

  // 3. Match the current workspace record target signature from cache memory state
  const team = useMemo(() => {
    if (!teamId || !clientTeams) return null;
    return clientTeams.find((t) => t.id === teamId) || null;
  }, [clientTeams, teamId]);

  const hasManagementAccess = useMemo(() => {
    if (!team || !user) return false;
    const currentUserProfile = team.members?.find(
      (m) => m.user?.id === user.id || m.user?.username === user.username,
    );
    return (
      currentUserProfile?.role === "OWNER" ||
      currentUserProfile?.role === "ADMIN"
    );
  }, [team, user]);

  const handleAddMember = async (tId: string, username: string) => {
    try {
      await addMember(tId, username);
    } catch (err) {
      console.error(err);
      alert("Failed to add member. Check the username.");
    }
  };

  const handleRemoveMember = async (tId: string, username: string) => {
    try {
      await removeMember(tId, username);
    } catch (err) {
      console.error(err);
      alert("Failed to remove member.");
    }
  };

  // Safe error barrier when there is zero local cache to fall back on
  if (error && !team)
    return <div className="p-6 text-sm text-red-500 font-medium">{error}</div>;

  // Safe temporary skeleton loop that renders ONLY if the item doesn't exist in local cache yet
  if (!team) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-gray-500 font-medium animate-pulse">
        Loading team environment...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full text-xs text-app-text">
      {/* 1. Executive Team Banner Section */}
      <div className="flex flex-col gap-1 p-5 bg-app-surface w-full">
        {/* Navigation Action Buttons Row Group */}
        <div className="flex items-center gap-3 select-none mb-1">
          <NavBackButton />
          <span className="text-app-text/30 text-[10px] font-mono select-none mb-1">
            |
          </span>
          <NavNextButton />
        </div>

        <h1 className="text-xl font-bold text-app-text tracking-tight">
          {team.name}
        </h1>
        <p className="text-xs text-app-text/50 font-mono">
          Created: {new Date(team.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Grid containing Sprints (Left/Main) and Members (Right/Sidebar) */}
      <div className="flex flex-col gap-6 items-start ">
        {/* 2. Sprints Canvas Section (Spans 2 columns on desktop) */}
        <div className="flex flex-col gap-4 border-t border-app-border bg-app-surface p-4 w-full">
          <div className="flex items-center justify-between border-b border-app-border pb-3">
            <h2 className="text-base font-bold text-app-text">
              Active & Planned Sprints
            </h2>

            {hasManagementAccess && (<Link
              href={`/sprints/create?tId=${teamId}`}
              className="text-[11px] font-semibold h-[1.8rem] px-3 bg-app-primary text-white flex items-center rounded shadow-2xs hover:opacity-90 transition"
            >
              + Create Sprint
            </Link>)}
          </div>

          <SprintList sprints={sprints} />
        </div>

        {/* 3. Team Roster Sidebar Section */}
        <div className="flex flex-col gap-4 border-t border-app-border bg-app-surface p-4 w-full">
          <div className="border-b border-app-border pb-3">
            <h2 className="text-base font-bold text-app-text">Team Roster</h2>
          </div>

          {hasManagementAccess && (
            <TeamAddMemberForm team={team} onAdd={handleAddMember} />
          )}

          <ul className="flex flex-col gap-1 mt-1 max-h-[30rem] overflow-y-auto">
            {team.members?.map((member) => (
              <TeamMemberCard
                key={member?.id}
                teamId={team?.id}
                member={member}
                onDelete={handleRemoveMember}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>

  );
}
