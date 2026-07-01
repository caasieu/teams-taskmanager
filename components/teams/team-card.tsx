"use client";

import { useAuth } from "@/hooks/users/use-auth";
import { Team } from "@/types/team/team";
import Link from "next/link";
import { useState, useMemo } from "react";

interface TeamCardProps {
  team: Team;
  onDelete: (id: string) => Promise<void>;
}

export function TeamCard({ team, onDelete }: TeamCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Memoized calculation to look up owner and check user authorization levels safely
  const { owner, showDeleteButton } = useMemo(() => {
    const teamOwner = team?.members?.find((m) => m.role === "OWNER");

    // Strict Owner Enforcement matching your requirements
    const isOwner = teamOwner && user && teamOwner.user?.id === user.id;

    return { owner: teamOwner, showDeleteButton: !!isOwner };
  }, [team, user]);

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
      className={`flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:items-center p-3.5 px-5 text-xs transition-colors bg-app-surface hover:bg-app-card/40 w-full text-app-text ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Column 1: Identity Profile Card Grouping */}
      <div className="flex flex-col min-w-0 justify-self-start">
        <Link
          href={`/teams/${team.id}`}
          className="font-bold text-app-text hover:text-app-primary text-sm sm:text-xs truncate max-w-xs"
        >
          {team.name}
        </Link>
        {owner?.user?.fullName && (
          <span className="text-app-text/50 font-medium text-[11px] mt-0.5">
            Owner: {owner.user.fullName}
          </span>
        )}
      </div>

      {/* Column 2: Created at Timestamp Badge (Centered on Desktop) */}
      <div className="flex items-center sm:justify-center justify-self-start sm:justify-self-center">
        <span className="text-[10px] font-bold bg-app-card text-app-text/70 border border-app-border px-2 py-0.5 rounded-sm font-mono uppercase tracking-wide">
          {new Date(team.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Column 3: Contextual View & Management Action Deck Buttons */}
      <div className="flex items-center gap-1.5 justify-end justify-self-stretch sm:justify-self-end pt-2 sm:pt-0 border-t border-app-border sm:border-0 shrink-0">
        <Link href={`/teams/${team.id}`} className="flex-1 sm:flex-none">
          <div className="px-2.5 py-1 text-center border border-app-border rounded bg-app-card hover:bg-app-border font-semibold text-app-text transition text-xs sm:text-[11px] cursor-pointer">
            See More
          </div>
        </Link>

        {showDeleteButton && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 sm:flex-none text-center px-2.5 py-1 text-xs sm:text-[11px] font-medium border border-danger/30 text-danger bg-danger/5 rounded hover:bg-danger/10 transition disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
