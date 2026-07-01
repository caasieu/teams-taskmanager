"use client";

import { useCallback, useState, useSyncExternalStore, useEffect } from "react";
import { Sprint } from "@/types/sprint/sprint";
import { CreateSprintRequest, UpdateSprintRequest } from "@/types/sprint/create-sprint";

// Safe dynamic browser initialization for the scoped key-value cache store map
const getInitialSprintsCache = (): Record<string, Sprint[]> => {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem("scrum_manager_sprints_cache");
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Local storage error profile readout fault:", error);
    return {};
  }
};

// Global cache variables and event subscribers matrix hooks
let cachedSprints: Record<string, Sprint[]> = getInitialSprintsCache();
let fetchPromises: Record<string, Promise<Sprint[]> | null> = {};
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emitChange() {
  listeners.forEach((callback) => callback());
}

// FIX: Permanent constant fallbacks maintain perfect reference stability for server snapshots
const SERVER_FALLBACK_ARRAY: Sprint[] = [];

export function useSprints() {
  // Local state container tracking which team is currently open to slice cache layers accurately
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);

  // FIX: Instead of a flat global array, query a reference-stable selector scoped to the active team.
  // This satisfies React 19 store rules while completely stopping cross-team data leaks!
  const sprints = useSyncExternalStore(
    subscribe,
    () => {
      if (!activeTeamId) return SERVER_FALLBACK_ARRAY;
      return cachedSprints[activeTeamId] ?? SERVER_FALLBACK_ARRAY;
    },
    () => SERVER_FALLBACK_ARRAY
  );

  const [loading, setLoading] = useState(false);

  // CRUCIAL MULTI-USER FIX: Listen for global logout broadcast signals to clear in-memory pools instantly
  useEffect(() => {
    const handleGlobalSprintsReset = () => {
      cachedSprints = {};
      fetchPromises = {};
      setActiveTeamId(null);
      emitChange();
    };

    window.addEventListener("sprints-updated", handleGlobalSprintsReset);
    return () => {
      window.removeEventListener("sprints-updated", handleGlobalSprintsReset);
    };
  }, []);

  const updateCacheState = (teamId: string, updatedTeamSprints: Sprint[]) => {
    cachedSprints[teamId] = updatedTeamSprints;
    
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("scrum_manager_sprints_cache", JSON.stringify(cachedSprints));
      } catch (error) {
        console.error("Cache serialization block save failure:", error);
      }
    }
    emitChange(); // Broadcast state changes cleanly to all listeners
  };

  const fetchSprints = useCallback(
    async (teamId: string, forceRefresh = false): Promise<Sprint[]> => {
      // Set the active team scope right away so the store returns only this team's cached array
      setActiveTeamId(teamId);

      if (!forceRefresh && cachedSprints[teamId]) {
        emitChange();
        return cachedSprints[teamId];
      }

      if (!forceRefresh && fetchPromises[teamId]) {
        return fetchPromises[teamId]!;
      }

      if (!cachedSprints[teamId] || cachedSprints[teamId].length === 0) {
        setLoading(true);
      }

      fetchPromises[teamId] = fetch(`/api/teams/${teamId}/sprints`, {
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch sprints.");
          }
          return (await res.json()) as Sprint[];
        })
        .then((data) => {
          updateCacheState(teamId, data);
          return data;
        })
        .finally(() => {
          fetchPromises[teamId] = null;
          setLoading(false);
        });

      return fetchPromises[teamId]!;
    },
    [],
  );

  const createSprint = useCallback(async (body: CreateSprintRequest) => {
    const res = await fetch("/api/sprints", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Failed to create sprint.");
    }

    const sprint = (await res.json()) as Sprint;
    const teamId = sprint.teamId;
    const updatedList = cachedSprints[teamId] ? [sprint, ...cachedSprints[teamId]] : [sprint];

    updateCacheState(teamId, updatedList);
    return sprint;
  }, []);

  const fetchSprintById = useCallback(async (id: string): Promise<Sprint> => {
    const res = await fetch(`/api/sprints/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch sprint.");
    }

    const sprint = (await res.json()) as Sprint;
    const teamId = sprint.teamId;

    const teamList = cachedSprints[teamId] ? [...cachedSprints[teamId]] : [];
    const index = teamList.findIndex((s) => s.id === sprint.id);

    if (index >= 0) {
      teamList[index] = sprint;
    } else {
      teamList.push(sprint);
    }

    updateCacheState(teamId, teamList);
    return sprint;
  }, []);

  const updateSprint = useCallback(
    async (id: string, body: Partial<UpdateSprintRequest>) => {
      const res = await fetch(`/api/sprints/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to update sprint.");
      }

      const updated = (await res.json()) as Sprint;
      const teamId = updated.teamId;

      const updatedList = (cachedSprints[teamId] ?? []).map((sprint) =>
        sprint.id === updated.id ? updated : sprint
      );

      updateCacheState(teamId, updatedList);
      return updated;
    },
    [],
  );

  const deleteSprint = useCallback(async (id: string, teamId: string) => {
    const res = await fetch(`/api/sprints/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete sprint.");
    }

    const updatedList = (cachedSprints[teamId] ?? []).filter(
      (sprint) => sprint.id !== id
    );

    updateCacheState(teamId, updatedList);
  }, []);

  const clearCache = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("scrum_manager_sprints_cache");
      } catch (err) {
        console.error(err);
      }
    }
    cachedSprints = {};
    fetchPromises = {};
    emitChange();
  }, []);

  const findSprintInCache = useCallback((id: string): Sprint | null => {
    const allSprints = Object.values(cachedSprints).flat();
    return allSprints.find((s) => s.id === id) || null;
  }, []);

  const getSprintsByTeamId = useCallback((teamId: string): Sprint[] => {
    return cachedSprints[teamId] ?? [];
  }, []);

  return {
    sprints,
    loading,
    fetchSprints,
    createSprint,
    fetchSprintById,
    updateSprint,
    deleteSprint,
    clearCache,
    findSprintInCache,
    getSprintsByTeamId,
  };
}
