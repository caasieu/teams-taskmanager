"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormInput } from "../forms/form-input";
import { FormTextarea } from "../forms/form-textarea";
import { FormSubmitButton } from "../forms/form-submit-button";
import { useSprints } from "@/hooks/sprints/use-sprints";
import { CreateSprintRequest } from "@/types/sprint/create-sprint";
import { FormDateRange } from "../forms/form-date-range";

export function CreateSprintForm({ teamId }: { teamId: string }) {
  const router = useRouter();
  const { createSprint } = useSprints();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateSprintRequest>();

  async function onSubmit(data: CreateSprintRequest) {
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) > new Date(data.endDate)
    ) {
      setErrorMsg("The start date cannot be later than the end date.");
      return;
    }
    setErrorMsg(null);

    try {
      await createSprint({
        teamId: teamId,
        name: data.name?.trim(),
        goal: data.goal?.trim(),
        startDate: data.startDate,
        endDate: data.endDate,
      });

      reset();
      // Redirect back to the team view page to show the newly added sprint
      router.push(`/teams/${teamId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to create sprint. Please check your inputs.");
    }
  }

  return (
    <div className="w-full max-w-xl bg-app-surface border border-app-border rounded p-4 text-xs text-app-text transition-colors">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {/* Responsive Styled Date Picker Row */}
          <FormDateRange
            startName="startDate"
            endName="endDate"
            register={register}
            disabled={isSubmitting}
            required="Date fields are required"
          />

          {/* Form Input fields */}
          <div className="flex flex-col gap-1 w-full">
            <FormInput
              name="name"
              type="text"
              placeholder="Your Sprint name"
              register={register}
              disabled={isSubmitting}
              required="Sprint name is required"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <FormTextarea
              name="goal"
              placeholder="Place your goal with the Sprint here"
              register={register}
              disabled={isSubmitting}
            />
          </div>

          {/* Dynamic validation error alerts */}
          {(errors.name || errors.startDate || errors.endDate || errorMsg) && (
            <div className="flex flex-col gap-0.5 text-[11px] text-danger bg-danger/5 p-2.5 border border-danger/20 rounded font-mono">
              {errors.name && <span>• {errors.name.message}</span>}
              {errors.startDate && <span>• {errors.startDate.message}</span>}
              {errors.endDate && <span>• {errors.endDate.message}</span>}
              {errorMsg && <span>• {errorMsg}</span>}
            </div>
          )}

          {/* Submit Action Button Wrapper */}
          <div className="pt-1">
            <FormSubmitButton
              label={isSubmitting ? "Creating..." : "Create new!"}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
