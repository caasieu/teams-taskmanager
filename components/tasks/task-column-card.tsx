"use client";

import { Task } from "@/types/task/task";
import Link from "next/link";
import { useTasks } from "@/hooks/tasks/use-tasks";
import { TaskPriorityBadge, TaskStatusBadge } from "./task-badges"; // Update to your badge file location

export function TaskColumnCard({
  task,
  hasManagementAccess,
}: {
  task: Task;
  hasManagementAccess: boolean; // FIX 1: Corrected typing from string to boolean
}) {
  const { deleteTask } = useTasks();

  const handleRemoveTask = async () => {
    if (!confirm(`Delete task: "${task.title}"?`)) return;

    try {
      // Execute the hook method using explicit task identifiers context parameters
      await deleteTask(task.id, task.sprintId);
    } catch (error) {
      console.error(error);
      alert("Failed to remove task from sprint board.");
    }
  };

  return (
    <div className="flex flex-col justify-between gap-3 border border-app-border bg-app-surface p-3 rounded shadow-xs text-xs w-full text-app-text transition-colors">
      {/* Meta Row: Priority and Status indicators */}
      <div className="flex items-center justify-between gap-2 w-full">
        <TaskPriorityBadge priority={task?.priority} />
        <TaskStatusBadge status={task?.status} />
      </div>

      {/* Task Heading/Title if present, followed by Description */}
      <div className="w-full flex flex-col gap-1">
        {task?.title && (
          <h4 className="font-semibold text-app-text text-xs break-words">
            {task.title}
          </h4>
        )}
        <p className="font-normal text-app-text/70 text-xs break-words whitespace-pre-wrap leading-relaxed">
          {task?.description}
        </p>
      </div>

      {/* Action Row */}
      {/* FIX 2: Wrapped the entire row container or sub-elements inside the unified accessor boolean rule */}
      {hasManagementAccess && (
        <div className="flex items-center gap-1.5 w-full pt-2 border-t border-app-border mt-1">
          <Link href={`/tasks/update?tId=${task?.id}`} className="flex-1 sm:flex-none">
            <div className="px-2 py-1 text-center border border-app-border rounded bg-app-card hover:bg-app-border text-app-text transition text-[11px] font-medium cursor-pointer">
              Edit
            </div>
          </Link>
          <button
            onClick={handleRemoveTask}
            className="flex-1 sm:flex-none px-2 py-1 border border-danger/30 text-danger rounded bg-danger/5 hover:bg-danger/10 transition text-[11px] font-medium cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
