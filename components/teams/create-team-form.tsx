"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTeams } from "@/hooks/teams/use-team";
import { CreateTeamRequest } from "@/types/team/create-team";
import { FormInput } from "../forms/form-input";
import { FormTextarea } from "../forms/form-textarea";
import { FormSubmitButton } from "../forms/form-submit-button";

export function CreateTeamForm() {
  const router = useRouter();
  const { createTeam } = useTeams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { isSubmitting, errors } 
  } = useForm<CreateTeamRequest>();

  async function onSubmit(data: CreateTeamRequest) {
    setErrorMsg(null);

    try {
      const team = await createTeam({
        name: data.name?.trim(),
        description: data.description?.trim(),
      });

      reset();
      
      // Safe navigation check assuming your backend hook returns the concrete created team entity object
      if (team?.id) {
        router.push(`/teams/${team.id}`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to establish new team profile. Please check your data fields.");
    }
  }

  return (
    <div className="w-full max-w-xl bg-app-surface border border-app-border rounded p-4 text-xs text-app-text transition-colors">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          
          {/* Team Name Input Field Node */}
          <FormInput
            name="name"
            type="text"
            placeholder="Your team name"
            register={register}
            disabled={isSubmitting}
            required="Team name is highly required"
          />

          {/* Team Overview Description Field Node */}
          <FormTextarea
            name="description"
            placeholder="Place your description here"
            register={register}
            disabled={isSubmitting}
          />

          {/* Dynamic Interactive Validation Error Message Banners */}
          {(errors.name || errorMsg) && (
            <div className="flex flex-col gap-0.5 text-[11px] text-danger bg-danger/5 p-2.5 border border-danger/20 rounded font-mono">
              {errors.name && <span>• {errors.name.message}</span>}
              {errorMsg && <span>• {errorMsg}</span>}
            </div>
          )}

          {/* Core Submission Processor Trigger Node */}
          <div className="pt-1">
            <FormSubmitButton 
              label={isSubmitting ? "Creating Workspace..." : "Create new!"} 
              disabled={isSubmitting} 
            />
          </div>
          
        </div>
      </form>
    </div>

  );
}
