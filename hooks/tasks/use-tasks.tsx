"use client";

import { useCallback, useState, useSyncExternalStore, useEffect } from "react";
import { Task } from "@/types/task/task";
import { CreateTaskRequest } from "@/types/task/create-task";
import { UpdateTaskRequest } from "@/types/task/update-task";

// FIX: Declared as const because the dictionary object references are never reassigned
const cachedTasks: Record<string, Task[]> = {};
const fetchPromises: Record<string, Promise<Task[]> | null> = {};
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emitChange() {
  listeners.forEach((callback) => callback());
}

// FIX: Stable cached constant array reference to prevent loops inside the server snapshot
const SERVER_FALLBACK_ARRAY: Task[] = [];
let cachedFlatTasks: Task[] = [];

export function useTasks() {
  // Sync a flattened array list globally across all components cleanly
  const tasks = useSyncExternalStore(
    subscribe,
    () => cachedFlatTasks,
    () => SERVER_FALLBACK_ARRAY
  );

  const [loading, setLoading] = useState(false);

  // CRUCIAL MULTI-USER FIX: Listen for global logout signals to wipe out task in-memory cache records instantly
  useEffect(() => {
    const handleGlobalTasksReset = () => {
      // Clear out all keys inside the global memory structures immediately
      for (const key in cachedTasks) {
        delete cachedTasks[key];
      }
      for (const key in fetchPromises) {
        delete fetchPromises[key];
      }
      cachedFlatTasks = [];
      emitChange(); // Force all active Kanban components to flush immediately
    };

    window.addEventListener("sprints-updated", handleGlobalTasksReset);
    return () => {
      window.removeEventListener("sprints-updated", handleGlobalTasksReset);
    };
  }, []);

  const updateCacheState = (sprintId: string, updatedSprintTasks: Task[]) => {
    cachedTasks[sprintId] = updatedSprintTasks;
    cachedFlatTasks = Object.values(cachedTasks).flat();
    emitChange(); // Broadcast changes cleanly to all components
  };

  const fetchTaskById = useCallback(async (id: string): Promise<Task> => {
    const res = await fetch(`/api/tasks/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch task.");
    }

    return (await res.json()) as Task;
  }, []);

  /**
   * SEED tasks directly from sprint payload without network roundtrips
   */
  const seedTasksFromSprint = useCallback((sprintId: string, sprintTasks: Task[]) => {
    updateCacheState(sprintId, sprintTasks);
  }, []);

  /**
   * GET tasks by sprintId (Fallback background handler)
   */
  const fetchTasks = useCallback(
    async (sprintId: string, forceRefresh = false) => {
      if (!forceRefresh && cachedTasks[sprintId]) {
        return cachedTasks[sprintId];
      }

      if (!forceRefresh && fetchPromises[sprintId]) {
        return fetchPromises[sprintId]!;
      }

      fetchPromises[sprintId] = fetch(`/api/sprints/${sprintId}`, {
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch tasks");
          const sprintData = await res.json();
          return (sprintData.tasks ?? []) as Task[];
        })
        .then((data) => {
          updateCacheState(sprintId, data);
          return data;
        })
        .finally(() => {
          fetchPromises[sprintId] = null;
        });

      return fetchPromises[sprintId]!;
    },
    [],
  );

  /**
   * CREATE task inside sprint
   */
  const createTask = useCallback(
    async (sprintId: string, body: CreateTaskRequest) => {
      const res = await fetch(`/api/sprints/${sprintId}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      const task = (await res.json()) as Task;

      const updatedList = cachedTasks[sprintId]
        ? [task, ...cachedTasks[sprintId]]
        : [task];

      updateCacheState(sprintId, updatedList);
      return task;
    },
    [],
  );

  const updateTask = useCallback(
    async (id: string, body: UpdateTaskRequest) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to update task.");
      }

      const updated = (await res.json()) as Task;
      const sprintId = updated.sprintId!;

      const updatedList = (cachedTasks[sprintId] ?? []).map((task) =>
        task.id === updated.id ? updated : task
      );

      updateCacheState(sprintId, updatedList);
      return updated;
    },
    [],
  );

  const deleteTask = useCallback(async (id: string, sprintId?: string | null) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete task.");
    }

    if (sprintId && cachedTasks[sprintId]) {
      const updatedList = cachedTasks[sprintId].filter((task) => task.id !== id);
      updateCacheState(sprintId, updatedList);
    } else {
      for (const sId in cachedTasks) {
        cachedTasks[sId] = cachedTasks[sId].filter((task) => task.id !== id);
      }
      cachedFlatTasks = Object.values(cachedTasks).flat();
      emitChange();
    }
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    seedTasksFromSprint,
    createTask,
    fetchTaskById,
    updateTask,
    deleteTask,
  };
}
