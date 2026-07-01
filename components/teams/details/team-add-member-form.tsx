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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTeamMember>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function onSubmit(data: CreateTeamMember) {
    if (!team?.id || !data.username) return;
    setSubmitError(null);

    try {
      setSubmitting(true);
      await onAdd(team.id, data.username.trim());
      reset();
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to add user. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 justify-start w-full max-w-sm text-app-text">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`flex items-center text-xs border rounded overflow-hidden transition-colors bg-app-surface ${
            errors.username
              ? "border-danger focus-within:border-danger"
              : "border-app-border"
          }`}
        >
          <input
            type="text"
            placeholder="Username (ex: johndoe1, kaio)"
            className="pl-2 h-[2rem] outline-none flex-1 bg-transparent text-app-text placeholder-app-text/40 disabled:bg-app-card"
            disabled={submitting}
            {...register("username", {
              required: "Username is required",
              setValueAs: (v: string) => v.trim(),
            })}
          />
          <button
            type="submit"
            disabled={submitting}
            className="h-[2rem] px-3 bg-app-primary text-white font-medium disabled:opacity-50 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            {submitting ? "adding..." : "add member"}
          </button>
        </div>
      </form>

      {/* Dynamic Error Status Alerts */}
      {errors.username && (
        <span className="text-[11px] text-danger">
          {errors.username.message}
        </span>
      )}
      {submitError && (
        <span className="text-[11px] text-danger">{submitError}</span>
      )}
    </div>
  );
}
