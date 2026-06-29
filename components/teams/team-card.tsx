"use client";

import { useAuth } from "@/lib/auth/use-auth";
import { Team } from "@/types/team/team";
import Link from "next/link";
import { useState } from "react";

interface TeamCardProps {
  team: Team;
  onDelete: (id: string) => Promise<void>;
}

export function TeamCard({ team, onDelete }: TeamCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const owner = team?.members?.find((member) => member.role === "OWNER");
  let globalAuthRole: "OWNER" | "ADMIN" | "MEMBER" | null = null;

  // 1. If this card belongs to the logged-in user, capture their team role instantly
  const isMe = owner?.user?.id === user?.id;

  if (isMe && owner?.role && globalAuthRole !== owner.role) {
    globalAuthRole = owner.role;
    // Force a quick sync re-render so other cards capture the role update immediately
  }
  const isViewerAuthorized =
    globalAuthRole === "OWNER" || globalAuthRole === "ADMIN";

  const showDeleteButton = isViewerAuthorized;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${team.name}?`)) return;

    try {
      setIsDeleting(true);
      await onDelete(team.id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete team.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 text-sm border-b border-app-border ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex items-center gap-2 min-w-[18rem] ">
        <div className="flex flex-col">
          <Link href={`/teams/${team?.id}`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold"> {team?.name} </span>
            </div>
          </Link>

          <div className="flex items-center text-xs">
            <span className="font-regular">{owner?.user?.fullName}</span>
          </div>
        </div>
      </div>

      <div className="min-w-[8rem] flex items-center justify-center ">
        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono uppercase">
          {new Date(team?.createdAt).getFullYear()}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2 text-xs min-w-[8rem] ">
        <Link href={`/teams/${team?.id}`}>
          <div className="text-xs font-medium px-3 py-1.5 border border-app-border text-app-text rounded hover:bg-app-primary-50 transition">
            <span className="font-semibold"> View </span>
          </div>
        </Link>

        {showDeleteButton && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs font-medium px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
