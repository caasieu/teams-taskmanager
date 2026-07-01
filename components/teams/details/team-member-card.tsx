"use client";

import { useAuth } from "@/hooks/users/use-auth";
import { TeamMember, Team } from "@/types/team/team";
import { useState, useMemo } from "react";
import { useTeams } from "@/hooks/teams/use-team";

export function TeamMemberCard({
  onDelete,
  member,
  teamId
}: {
  teamId: string;
  member: TeamMember;
  onDelete: (teamId: string, username: string) => Promise<void>;
}) {
  const { user } = useAuth();
  const { teams } = useTeams();
  const [isRemoving, setIsRemoving] = useState(false);

  // 1. Safe contextual matching flags evaluated smoothly using active cache states
  const { isMe, showDeleteButton } = useMemo(() => {
    const isCurrentUserMe = member?.user?.id === user?.id;
    
    // Look up the full matching team model out of local hook state cache to locate current user's role
    const activeTeam = teams.find((t) => t.id === teamId);
    const currentUserRole = activeTeam?.members?.find((m) => m.user?.id === user?.id)?.role;
    
    // Authorization Check: Must be OWNER or ADMIN of this team, and cannot delete yourself
    const isOperatorAuthorized = currentUserRole === "OWNER" || currentUserRole === "ADMIN";
    const canDelete = isOperatorAuthorized && !isCurrentUserMe && !!member?.user?.username;

    return { isMe: isCurrentUserMe, showDeleteButton: canDelete };
  }, [member, user, teams, teamId]);

  const handleRemoveMember = async () => {
    const username = member?.user?.username;
    if (!username) return;

    const confirmed = confirm(`Remove ${member?.user?.fullName || "this user"} from the team?`);
    if (!confirmed) return;

    try {
      setIsRemoving(true);
      await onDelete(teamId, username);
      window.dispatchEvent(new Event("teams-updated"));
    } catch (error) {
      console.error(error);
      alert("Error removing user from team.");
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border-b border-app-border w-full bg-app-surface hover:bg-app-card/40 transition-colors text-app-text">
      
      {/* Identity Info Segment */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Responsive Scaled Avatar Circle */}
        <div className="shrink-0 border border-app-border h-11 w-11 sm:h-10 sm:w-10 rounded-full bg-app-card flex items-center justify-center font-bold text-xs text-app-text/60 uppercase tracking-wider font-mono">
          {member?.user?.fullName?.substring(0, 2) || "TM"}
        </div>

        {/* Text Block Stack */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-app-text text-sm sm:text-xs truncate">
              {member?.user?.fullName}
            </span>
            <span className="text-[10px] font-bold bg-app-card text-app-text/70 border border-app-border px-1.5 py-0.5 rounded-sm font-mono uppercase tracking-wide">
              {member?.role}
            </span>
          </div>
          <span className="text-app-text/40 font-mono text-[11px]">
            @{member?.user?.username}
          </span>
        </div>
      </div>

      {/* Action Deck Trigger Button */}
      {showDeleteButton && (
        <div className="flex justify-end pt-1 sm:pt-0 shrink-0">
          <button
            onClick={handleRemoveMember}
            disabled={isRemoving}
            className="w-full sm:w-auto text-center px-2.5 py-1 text-xs sm:text-[11px] font-medium border border-danger/30 text-danger bg-danger/5 rounded hover:bg-danger/10 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      )}
    </div>

  );
}
