"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useTasks } from "@/hooks/tasks/use-tasks";
import { Task } from "@/types/task/task";
import { UpdateTaskForm } from "@/components/tasks/form/update-task-form";
import { NavNextButton } from "@/components/navigation/nav-next-button";
import { NavBackButton } from "@/components/navigation/nav-back-button";

export default function UpdateTaskPage() {
  const searchParams = useSearchParams();

  const taskId = searchParams.get("tId");

  const { fetchTaskById, tasks } = useTasks();

  // FIX: Scan through your local store memory to map matching targets right away
  const cachedTask = useMemo(() => {
    if (!taskId || !tasks) return null;
    return tasks.find((t) => t.id === taskId) || null;
  }, [taskId, tasks]);

  const [task, setTask] = useState<Task | null>(cachedTask);
  // FIX: If the layout has a cached copy, completely bypass the full-screen loader layout
  const [loading, setLoading] = useState(!cachedTask);

  useEffect(() => {
    if (!taskId) return;

    let mounted = true;

    async function loadTask() {
      try {
        const data = await fetchTaskById(taskId as string);
        if (mounted) setTask(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadTask();

    return () => {
      mounted = false;
    };
  }, [taskId, fetchTaskById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-gray-500 font-medium animate-pulse">
        Loading task data...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-12 border border-red-100 bg-red-50 text-red-700 text-sm rounded-sm shadow-sm">
        Task target parameters profile not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 gap-4 max-w-5xl mx-auto w-full text-xs text-app-text">
      {/* 1. Header Information Context Section */}
      <div className="flex flex-col gap-1 pb-2">
        {/* Navigation Action Buttons Row Group */}
        <div className="flex items-center gap-3 select-none mb-1">
          <NavBackButton />
          <span className="text-app-text/30 text-[10px] font-mono select-none mb-1">
            |
          </span>
          <NavNextButton />
        </div>

        <h1 className="text-xl font-bold text-app-text tracking-tight">
          Update Task
        </h1>
        <p className="text-xs text-app-text/50 font-mono">
          Modify tracking metrics, backlog status, or assignments for task ID:{" "}
          {taskId}
        </p>
      </div>

      {/* 2. Form Canvas Layout Container */}
      <div className="w-full">
        <UpdateTaskForm task={task} />
      </div>
    </div>

  );
}
