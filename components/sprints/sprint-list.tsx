"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/users/use-auth";
import { useTeams } from "@/hooks/teams/use-team";
import { useMemo } from "react";
import { DeleteSprintButton } from "@/components/sprints/delete-sprint-button";

// Type definitions matching your project structure
interface Sprint {
  id: string;
  name: string;
  status: string;
  teamId: string;
  goal?: string | null;
}

interface SprintListProps {
  sprints: Sprint[] | null;
}

// Clean status badge styles
function SprintStatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  const styles =
    {
      ACTIVE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      COMPLETED: "bg-success/10 text-success border-success/20",
      NOT_STARTED: "bg-app-text/5 text-app-text/70 border-app-border",
    }[status] || "bg-app-text/5 text-app-text/60 border-app-border";

  const label = status.replace("_", " ").toLowerCase();

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-sm font-mono whitespace-nowrap ${styles}`}
    >
      {label}
    </span>
  );

}

export function SprintList({ sprints }: SprintListProps) {
  const { user } = useAuth();
  const { teams } = useTeams();

  const showDeleteButtonAndEditMap = useMemo(() => {
    const permissions: Record<string, boolean> = {};
    if (!sprints || !user) return permissions;

    sprints.forEach((sprint) => {
      const activeTeam = teams.find((t) => t.id === sprint.teamId);
      const currentUserRole = activeTeam?.members?.find(
        (m) => m.user?.id === user?.id || m.user?.username === user?.username,
      )?.role;

      // Authorization Check: Must be OWNER or ADMIN of this sprint's parent team
      permissions[sprint.id] =
        currentUserRole === "OWNER" || currentUserRole === "ADMIN";
    });

    return permissions;
  }, [sprints, user, teams]);

  if (!sprints || sprints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded font-medium">
        No active sprints configured.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 w-full text-app-text">
      {sprints.map((sprint) => (
        <div
          key={sprint.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-app-border rounded hover:bg-app-card/40 transition bg-app-surface"
        >
          {/* Main Info Stack */}
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
              <Link
                href={`/sprints/${sprint.id}`}
                className="font-bold text-app-text hover:text-app-primary truncate text-sm sm:text-xs"
              >
                {sprint.name}
              </Link>
              <SprintStatusBadge status={sprint.status} />
            </div>

            {/* Sprint Goal Subsection */}
            {sprint.goal && (
              <p className="text-app-text/60 font-normal leading-relaxed text-[11px] max-w-2xl break-words">
                <span className="font-semibold text-app-text/80 font-mono text-[10px] uppercase tracking-wider mr-1">
                  Goal:
                </span>
                {sprint.goal}
              </p>
            )}
          </div>

          {/* Actions Block (Stacked on Mobile, Row on Desktop) */}
          <div className="flex items-center gap-1.5 justify-end pt-2.5 sm:pt-0 border-t border-app-border sm:border-0 shrink-0">
            {showDeleteButtonAndEditMap[sprint.id] && (
              <Link
                href={`/sprints/update?spId=${sprint.id}`}
                className="flex-1 sm:flex-none"
              >
                <div className="px-2.5 py-1 text-center border border-app-border rounded bg-app-card hover:bg-app-border text-app-text transition text-xs sm:text-[11px] font-medium cursor-pointer">
                  Edit
                </div>
              </Link>
            )}

            {showDeleteButtonAndEditMap[sprint.id] && (
              <div className="flex-1 sm:flex-none flex justify-end">
                <DeleteSprintButton
                  sprintId={sprint.id}
                  teamId={sprint.teamId}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
