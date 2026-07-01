"use client";

import { useEffect, useState, useMemo, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { useSprints } from "@/hooks/sprints/use-sprints";
import { useTasks } from "@/hooks/tasks/use-tasks";
import { Sprint } from "@/types/sprint/sprint";
import { TaskColumnCard } from "@/components/tasks/task-column-card";
import { DeleteSprintButton } from "@/components/sprints/delete-sprint-button";
import { NavBackButton } from "@/components/navigation/nav-back-button";
import { NavNextButton } from "@/components/navigation/nav-next-button";
import { useIsClient } from "@/hooks/utils/use-is-client";
import { useAuth } from "@/hooks/users/use-auth";
import { useTeams } from "@/hooks/teams/use-team";

const subscribeNoOp = () => () => {};
const SERVER_FALLBACK_ARRAY: Sprint[] = [];

// Reusable styled component for Sprint Status
function SprintStatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  const label = status.replace("_", " ").toLowerCase();
  const styles =
    {
      ACTIVE:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      COMPLETED: "bg-success/10 text-success border-success/20",
      PLANNED: "bg-app-text/5 text-app-text/70 border-app-border",
    }[status] || "bg-app-text/5 text-app-text/60 border-app-border";

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded font-mono select-none whitespace-nowrap ${styles}`}
    >
      {label}
    </span>
  );
}

export default function SprintPage() {
  const params = useParams();

  // Robust case parsing for dynamic router path directories [sprintId] vs [sprintid]
  const sprintId = (params.sprintId || params.sprintid) as string;

  const { fetchSprintById, sprints, findSprintInCache } = useSprints();
  const { tasks, seedTasksFromSprint } = useTasks();
  const { teams } = useTeams();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const isClient = useIsClient();

  useEffect(() => {
    if (!sprintId) return;

    let mounted = true;

    async function loadSprint() {
      try {
        const sprintData = await fetchSprintById(sprintId);

        // FIX: Seed the global useTasks hook with the tasks already included in the sprint payload.
        // This avoids the broken 405 endpoint completely while keeping deletions perfectly reactive!
        if (mounted && sprintData?.tasks) {
          seedTasksFromSprint(sprintId, sprintData.tasks);
        }
      } catch (err) {
        if (mounted) {
          setError("Sprint workspace target profile not found.");
        }
        console.error(err);
      }
    }

    void loadSprint();

    return () => {
      mounted = false;
    };
  }, [sprintId, fetchSprintById, seedTasksFromSprint]);

  // Safely bind your local client storage metrics stream instantly
  const clientSprints = useSyncExternalStore(
    subscribeNoOp,
    () => sprints,
    () => SERVER_FALLBACK_ARRAY,
  );

  // Match exact target profile entity out of our local state storage snapshot maps using the teamId-scoped locator helper
  const sprint = useMemo(() => {
    if (!sprintId) return null;
    return findSprintInCache(sprintId);
  }, [clientSprints, sprintId, findSprintInCache]);

  const hasManagementAccess = useMemo(() => {
    if (!sprint || !user || !teams) return false;
    const activeTeam = teams.find((t) => t.id === sprint.teamId);
    const currentUserRole = activeTeam?.members?.find(
      (m) => m.user?.id === user?.id || m.user?.username === user?.username,
    )?.role;
    return currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  }, [sprint, user, teams]);

  // Read tasks from the active reactive stream if modifications occurred, otherwise use the prisma embedded relation snapshot safely
  const activeTasksList =
    tasks.length > 0
      ? tasks.filter((t) => t.sprintId === sprintId)
      : (sprint?.tasks ?? []);

  const todoTasks = activeTasksList.filter((task) => task.status === "TODO");
  const inProgressTasks = activeTasksList.filter(
    (task) => task.status === "IN_PROGRESS",
  );
  const doneTasks = activeTasksList.filter((task) => task.status === "DONE");

  if (error && !sprint) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-12 border border-red-100 bg-red-50 text-red-700 text-sm rounded-sm shadow-sm">
        Sprint workspace target profile not found.
      </div>
    );
  }

  // Check layout status via isClient store variable to fulfill server payload schema validation cleanly
  if (!isClient || !sprint) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-gray-500 font-medium animate-pulse">
        Loading sprint environment...
      </div>
    );
  }

  // Formatting strings safely for human-scannable interface layouts (YYYY-MM-DD)
  const formattedStart = sprint.startDate
    ? new Date(sprint.startDate).toLocaleDateString()
    : "";
  const formattedEnd = sprint.endDate
    ? new Date(sprint.endDate).toLocaleDateString()
    : "";

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full text-xs text-app-text">
      {/* 1. Header Information Dashboard Card Banner */}
      <div className="flex flex-col gap-3 p-5 bg-app-surface border-b border-app-border  transition-colors">
        {/* Navigation Action Buttons Row Group */}
        <div className="flex items-center gap-3 select-none mb-1">
          <NavBackButton />
          <span className="text-app-text/30 tensor-[10px] font-mono select-none mb-1">
            |
          </span>
          <NavNextButton />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Identity Title and Metadata Stack */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 min-w-0">
            <h1 className="text-xl font-bold text-app-text tracking-tight truncate">
              {sprint.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <SprintStatusBadge status={sprint?.status} />
              <div className="text-xs font-medium text-app-text/60 font-mono bg-app-card px-2.5 py-1 border border-app-border rounded whitespace-nowrap">
                📅 {formattedStart} &rarr; {formattedEnd}
              </div>
            </div>
          </div>

          {/* Core Management Action Controls (Edit & Delete Deck) */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 w-full sm:w-auto">
            {hasManagementAccess && (
              <>
                <Link
                  href={`/sprints/update?spId=${sprint.id}`}
                  className="flex-1 sm:flex-none"
                >
                  <div className="px-3 py-1 text-center border border-app-border rounded bg-app-card hover:bg-app-border text-app-text font-semibold transition text-xs whitespace-nowrap cursor-pointer">
                    Edit Sprint
                  </div>
                </Link>

                <div className="flex-1 sm:flex-none">
                  <DeleteSprintButton
                    sprintId={sprint.id}
                    teamId={sprint.teamId}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {sprint.goal && (
          <div className="pt-3 mt-1 border-t border-app-border">
            <h3 className="text-xs font-semibold text-app-text/50 uppercase tracking-wider mb-1">
              Sprint Goal
            </h3>
            <p className="text-sm text-app-text/80 leading-relaxed max-w-3xl whitespace-pre-wrap">
              {sprint.goal}
            </p>
          </div>
        )}
      </div>

      {/* 2. Tasks Kanban Board Section Canvas */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-app-border px-5 pb-3">
          <h2 className="text-base font-bold text-app-text tracking-tight">
            Sprint Tasks Dashboard
          </h2>

          {hasManagementAccess && (
            <Link href={`/tasks/create?spId=${sprintId}`}>
              <div className="text-xs font-semibold h-[2rem] px-3.5 bg-app-primary text-white flex items-center rounded shadow-xs hover:opacity-90 active:scale-95 transition cursor-pointer whitespace-nowrap">
                + Create Task
              </div>
            </Link>
          )}
        </div>

        {/* 3. Responsive Kanban Grid Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start px-5">
          {/* Column 1: TODO */}
          <div className="flex flex-col gap-2.5 bg-app-card p-3.5 border border-app-border rounded-sm min-h-[30rem] transition-colors">
            <div className="flex justify-between items-center border-b border-app-border pb-2 mb-1">
              <span className="font-bold text-xs text-app-text/80 uppercase tracking-wider">
                To Do
              </span>
              <span className="text-[11px] font-bold font-mono bg-app-surface text-app-text/70 border border-app-border px-2 py-0.5 rounded-full shadow-2xs">
                {todoTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[40rem]">
              {todoTasks.map((task) => (
                <TaskColumnCard
                  key={task.id}
                  task={task}
                  hasManagementAccess={hasManagementAccess}
                />
              ))}
            </div>
          </div>

          {/* Column 2: IN_PROGRESS */}
          <div className="flex flex-col gap-2.5 bg-app-card p-3.5 border border-app-border rounded-sm min-h-[30rem] transition-colors">
            <div className="flex justify-between items-center border-b border-app-border pb-2 mb-1">
              <span className="font-bold text-xs text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                In Progress
              </span>
              <span className="text-[11px] font-bold font-mono bg-app-surface text-blue-600 dark:text-blue-300 border border-app-border px-2 py-0.5 rounded-full shadow-2xs">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[40rem]">
              {inProgressTasks.map((task) => (
                <TaskColumnCard
                  key={task.id}
                  task={task}
                  hasManagementAccess={hasManagementAccess}
                />
              ))}
            </div>
          </div>

          {/* Column 3: DONE */}
          <div className="flex flex-col gap-2.5 bg-app-card p-3.5 border border-app-border rounded-sm min-h-[30rem] transition-colors">
            <div className="flex justify-between items-center border-b border-app-border pb-2 mb-1">
              <span className="font-bold text-xs text-success uppercase tracking-wider">
                Done
              </span>
              <span className="text-[11px] font-bold font-mono bg-app-surface text-success border border-app-border px-2 py-0.5 rounded-full shadow-2xs">
                {doneTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[40rem]">
              {doneTasks.map((task) => (
                <TaskColumnCard
                  key={task.id}
                  task={task}
                  hasManagementAccess={hasManagementAccess}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
