"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTasks } from "@/hooks/tasks/use-tasks";
import { Task } from "@/types/task/task";
import { UpdateTaskRequest } from "@/types/task/update-task";

import { FormInput } from "../../forms/form-input";
import { FormTextarea } from "../../forms/form-textarea";
import { FormSubmitButton } from "../../forms/form-submit-button";

type Props = {
  task: Task;
};

export function UpdateTaskForm({ task }: Props) {
  const router = useRouter();
  const { updateTask } = useTasks();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UpdateTaskRequest>({
    defaultValues: {
      title: task?.title,
      description: task?.description ?? "",
      status: task?.status,
      priority: task?.priority,
      assigneeId: task?.assigneeId ?? "",
      sprintId: task?.sprintId ?? "",
    },
  });

  async function onSubmit(data: UpdateTaskRequest) {
    if (!task?.id) return;
    setErrorMsg(null);

    try {
      await updateTask(task.id, {
        title: data.title?.trim(),
        description: data.description?.trim(),
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId || null,
        sprintId: data.sprintId || null,
      });

      // Redirect user cleanly to the active sprint board interface
      if (task.sprintId) {
        router.push(`/sprints/${task.sprintId}`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to update task records. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-xl bg-app-surface border border-app-border rounded p-4 text-xs text-app-text transition-colors">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {/* 1. Status Selection Panel Segment */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-app-card border border-app-border p-3 rounded transition-colors">
            <span className="font-bold text-app-text/50 font-mono uppercase text-[10px] tracking-wider shrink-0 select-none w-14 sm:w-auto">
              Status:
            </span>
            <div className="flex flex-wrap items-center gap-4 text-app-text">
              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="TODO"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("status")}
                />
                <span>Todo</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="IN_PROGRESS"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("status")}
                />
                <span>In Progress</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
                <input
                  type="radio"
                  value="DONE"
                  disabled={isSubmitting}
                  className="accent-app-primary h-3.5 w-3.5"
                  {...register("status")}
                />
                <span>Done</span>
              </label>
            </div>
          </div>

          {/* 2. Priority Selection Panel Segment */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-app-card border border-app-border p-3 rounded transition-colors">
            <span className="font-bold text-app-text/50 font-mono uppercase text-[10px] tracking-wider shrink-0 select-none w-14 sm:w-auto">
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

          {/* 3. Text & Details Inputs Fields Grouping */}
          <FormInput
            name="title"
            type="text"
            placeholder="Task title"
            register={register}
            disabled={isSubmitting}
            required="Task title is required"
          />

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
              label={isSubmitting ? "Saving..." : "Save Changes"}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
