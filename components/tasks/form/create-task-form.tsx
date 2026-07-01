"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

import { useTasks } from "@/hooks/tasks/use-tasks";
import { CreateTaskRequest } from "@/types/task/create-task";

import { FormInput } from "../../forms/form-input";
import { FormTextarea } from "../../forms/form-textarea";
import { FormSubmitButton } from "../../forms/form-submit-button";

export function CreateTaskForm({ sprintId }: { sprintId: string }) {
  const { createTask } = useTasks();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateTaskRequest>({
    defaultValues: {
      priority: "MEDIUM", // Sets an ergonomic default value for new tasks
    },
  });

  async function onSubmit(data: CreateTaskRequest) {
    if (!sprintId) {
      setErrorMsg("Missing valid Sprint identifier mapping.");
      return;
    }
    setErrorMsg(null);

    try {
      await createTask(sprintId, {
        title: data.title?.trim(),
        description: data.description?.trim(),
        priority: data.priority,
        assigneeId: data.assigneeId,
      });

      reset();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to build task. Please review your configurations.");
    }
  }

  return (
    <div className="w-full max-w-xl bg-app-surface border border-app-border rounded p-4 text-xs text-app-text transition-colors">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {/* Responsive Priority Radio Level Selection Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-app-card border border-app-border p-3 rounded transition-colors">
            <span className="font-bold text-app-text/50 font-mono uppercase text-[10px] tracking-wider shrink-0 select-none">
              Priority:
            </span>

            <div className="flex flex-wrap items-center gap-4 text-app-text">
              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="LOW"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("priority")}
                />
                <span>Low</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="MEDIUM"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("priority")}
                />
                <span>Medium</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="HIGH"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("priority")}
                />
                <span>High</span>
              </label>
            </div>
          </div>

          {/* Title Field Input Block */}
          <FormInput
            name="title"
            type="text"
            placeholder="Task title"
            register={register}
            disabled={isSubmitting}
            required="Task title is required"
          />

          {/* Description Textarea Block */}
          <FormTextarea
            name="description"
            placeholder="Task description"
            register={register}
            disabled={isSubmitting}
          />

          {/* Diagnostic Failure Banner Display Panel */}
          {(errors.title || errorMsg) && (
            <div className="flex flex-col gap-0.5 text-[11px] text-danger bg-danger/5 p-2.5 border border-danger/20 rounded font-mono">
              {errors.title && <span>• {errors.title.message}</span>}
              {errorMsg && <span>• {errorMsg}</span>}
            </div>
          )}

          {/* Form Processing Submit Button */}
          <div className="pt-1">
            <FormSubmitButton
              label={isSubmitting ? "Creating..." : "Create Task"}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
