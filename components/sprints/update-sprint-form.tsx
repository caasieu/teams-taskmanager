"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSprints } from "@/hooks/sprints/use-sprints";
import { Sprint } from "@/types/sprint/sprint";
import { UpdateSprintRequest } from "@/types/sprint/create-sprint";

import { FormInput } from "../forms/form-input";
import { FormTextarea } from "../forms/form-textarea";
import { FormSubmitButton } from "../forms/form-submit-button";
import { FormDateRange } from "../forms/form-date-range";

type Props = {
  sprint: Sprint;
};

export function UpdateSprintForm({ sprint }: Props) {
  const router = useRouter();
  const { updateSprint } = useSprints();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UpdateSprintRequest>({
    defaultValues: {
      name: sprint?.name,
      goal: sprint?.goal ?? "",
      startDate: sprint?.startDate ? sprint.startDate.slice(0, 10) : "",
      endDate: sprint?.endDate ? sprint.endDate.slice(0, 10) : "",
      status: sprint?.status,
    },
  });

  async function onSubmit(data: UpdateSprintRequest) {
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
      await updateSprint(sprint.id, {
        name: data.name?.trim(),
        goal: data.goal?.trim(),
        status: data.status,
        startDate: data.startDate
          ? new Date(data.startDate).toISOString()
          : undefined,
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : undefined,
      });

      router.push(`/teams/${sprint.teamId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to update sprint. Please check your inputs.");
    }
  }

  return (
    <div className="w-full max-w-xl bg-app-surface border border-app-border rounded p-4 text-xs text-app-text transition-colors">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {/* Reusable Date Range Picker */}
          <FormDateRange
            startName="startDate"
            endName="endDate"
            register={register}
            disabled={isSubmitting}
            required="Date fields are required"
          />

          {/* Responsive Status Radio Deck Container */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-app-card border border-app-border p-3 rounded transition-colors">
            <span className="font-bold text-app-text/50 font-mono uppercase text-[10px] tracking-wider shrink-0 select-none">
              Status:
            </span>

            <div className="flex flex-wrap items-center gap-4 text-app-text">
              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="PLANNED"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("status")}
                />
                <span>Not Started</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="ACTIVE"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("status")}
                />
                <span>Active</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="COMPLETED"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("status")}
                />
                <span>Completed</span>
              </label>
            </div>
          </div>

          {/* Name Field */}
          <FormInput
            name="name"
            type="text"
            placeholder="Sprint name"
            register={register}
            disabled={isSubmitting}
            required="Sprint name is required"
          />

          {/* Goal Textarea */}
          <FormTextarea
            name="goal"
            placeholder="Sprint goal"
            register={register}
            disabled={isSubmitting}
          />

          {/* Error Alert Display Grid */}
          {(errors.name || errors.startDate || errors.endDate || errorMsg) && (
            <div className="flex flex-col gap-0.5 text-[11px] text-danger bg-danger/5 p-2.5 border border-danger/20 rounded font-mono">
              {errors.name && <span>• {errors.name.message}</span>}
              {errors.startDate && <span>• {errors.startDate.message}</span>}
              {errors.endDate && <span>• {errors.endDate.message}</span>}
              {errorMsg && <span>• {errorMsg}</span>}
            </div>
          )}

          {/* Submit Trigger Actions Button */}
          <div className="pt-1">
            <FormSubmitButton
              label={isSubmitting ? "Saving..." : "Save Changes"}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
