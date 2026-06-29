"use client";
import { Team, CreateTeamMember } from "@/types/team/team";
import { useForm } from "react-hook-form";
import { useState } from "react";

export function TeamAddMemberForm({
  team,
  onAdd,
}: {
  team: Team;
  onAdd: (teamId: string, username: string) => Promise<void>;
}) {
  const { register, handleSubmit, reset } = useForm<CreateTeamMember>();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data: CreateTeamMember) {
    const teamId = team?.id;
    const username = data?.username;
    if (!username) return;

    try {
      setSubmitting(true);
      await onAdd(teamId, username);
      reset(); // Clears the username text input layout on success
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-start">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center text-xs border border-app-border rounded overflow-hidden">
          <input
            type="text"
            placeholder="Username (ex: johndoe1, kaio)"
            className="pl-2 h-[2rem] outline-none"
            disabled={submitting}
            {...register("username", { required: true })}
          />
          <button
            type="submit"
            disabled={submitting}
            className="h-[2rem] px-3 bg-app-primary text-white font-medium disabled:opacity-50"
          >
            {submitting ? "adding..." : "add member"}
          </button>
        </div>
      </form>
    </div>
  );
}
