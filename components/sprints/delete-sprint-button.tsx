"use client";

import { useSprints } from "@/hooks/sprints/use-sprints";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  sprintId: string;
  teamId: string;
};

export function DeleteSprintButton({
  sprintId,
  teamId,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const { deleteSprint } = useSprints();
  const [isDeleting, setIsDeleting] = useState(false);

  // Parse if button is mounted directly inside the Sprint detail page context
  const currentSprintPageId = params.sprintId || params.sprintid;

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this sprint?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteSprint(sprintId, teamId);

      // Programmatic route redirection guard
      if (currentSprintPageId === sprintId) {
        router.push(`/teams/${teamId}`);
      }
      
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete sprint.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full sm:w-auto text-center px-2.5 py-1 border border-danger/30 rounded bg-danger/5 hover:bg-danger/10 text-danger font-semibold cursor-pointer transition text-xs disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap select-none"
    >
      {isDeleting ? "Deleting..." : "Delete Sprint"}
    </button>
  );
}
