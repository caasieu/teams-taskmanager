"use client";

import { useAuth } from "@/lib/auth/use-auth";
import { TeamMember } from "@/types/team/team";

export function TeamMemberCard({
  onDelete,
  member,
  teamId
}: {
  teamId: string,
  member: TeamMember;
  onDelete: (teamId: string, username: string) => Promise<void>;
}) {
  const { user } = useAuth();

  // 1. Is this card representing the currently logged-in user?
  const isMe = member?.user?.id === user?.id;

  // 2. Simply show the button for every card that is NOT the authenticated user
  // If the logged-in user is an OWNER or ADMIN, they can click "remove" on any other member row
  const showDeleteButton = !isMe;

  const handleRemoveMember = async () => {
    if (!confirm(`Remove ${member?.user?.fullName} from the team?`)) return;

    try {
      onDelete(teamId, member?.user?.username);
      window.dispatchEvent(new Event("teams-updated"));
    } catch (error) {
      console.error(error);
      alert("Error removing user from team.");
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-app-border w-full">
      <div className="flex items-center gap-2">
        <div className="border border-app-border p-3 h-[4rem] w-[4rem] rounded-full bg-gray-50 flex items-center justify-center font-bold text-xs uppercase">
          {member?.user?.fullName?.substring(0, 2) || "TM"}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold"> {member?.user?.fullName} </span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono uppercase">
              {member?.role}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {" "}
            @{member?.user?.username}{" "}
          </span>
        </div>
      </div>

      {showDeleteButton && (
        <div>
          <button
            onClick={handleRemoveMember}
            className="text-xs font-medium px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 transition"
          >
            remove
          </button>
        </div>
      )}
    </div>
  );
}
