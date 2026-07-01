"use client";

import { CreateTeamRequest } from "@/types/team/create-team";
import { Team } from "@/types/team/team";
import { useCallback, useState, useEffect } from "react";

// Safe dynamic browser verification utility function
const getInitialTeamsCache = (): Team[] => {
  if (typeof window === "undefined") return [];
  try {
    const savedData = localStorage.getItem("scrum_manager_teams_cache");
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error("Local storage error profile readout fault:", error);
    return [];
  }
};

// Global memory cache layer definitions
let cachedTeams: Team[] = getInitialTeamsCache();
let fetchPromise: Promise<Team[]> | null = null;
const stateSetters = new Set<(teams: Team[]) => void>();

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>(cachedTeams);
  // If we already have stored items in local storage, lock loading out to 'false' to render instantly
  const [loading, setLoading] = useState(cachedTeams.length === 0);

  // 1. Keep track of all hook instance state setters to update them concurrently across separate pages
  useEffect(() => {
    stateSetters.add(setTeams);
    return () => {
      stateSetters.delete(setTeams);
    };
  }, []);

  // 2. CRUCIAL MULTI-USER FIX: Listen for global logout signals to wipe out running in-memory cache instantly
  useEffect(() => {
    const handleGlobalTeamsReset = () => {
      cachedTeams = [];
      setTeams([]);
    };

    window.addEventListener("teams-updated", handleGlobalTeamsReset);
    return () => {
      window.removeEventListener("teams-updated", handleGlobalTeamsReset);
    };
  }, []);

  const updateCacheState = (newTeams: Team[]) => {
    cachedTeams = newTeams;
    // Broadcast the fresh data array instantly to all component state instances currently mounted
    stateSetters.forEach((setter) => setter(newTeams));
    
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("scrum_manager_teams_cache", JSON.stringify(newTeams));
      } catch (error) {
        console.error("Cache serialization block save failure:", error);
      }
    }
  };

  const fetchTeams = useCallback(
    async (forceRefresh = false): Promise<Team[]> => {
      // If data is already cached and no refresh is forced, serve it instantly
      if (!forceRefresh && cachedTeams.length > 0) {
        setLoading(false);
        return cachedTeams;
      }

      if (!forceRefresh && fetchPromise) {
        return fetchPromise;
      }

      // Only force an opaque background loading screen if there are no teams to show
      if (cachedTeams.length === 0) {
        setLoading(true);
      }

      fetchPromise = fetch("/api/teams", { credentials: "include" })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch teams.");
          return (await res.json()) as Team[];
        })
        .then((data) => {
          updateCacheState(data);
          return data;
        })
        .finally(() => {
          fetchPromise = null;
          setLoading(false);
        });

      return fetchPromise;
    },
    [],
  );

  const fetchTeamById = useCallback(async (id: string): Promise<Team> => {
    const res = await fetch(`/api/teams/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch team with ID: ${id}`);
    const team = (await res.json()) as Team;

    const currentCache = [...cachedTeams];
    const index = currentCache.findIndex((t) => t.id === team.id);
    if (index >= 0) {
      currentCache[index] = team;
    } else {
      currentCache.push(team);
    }
    updateCacheState(currentCache);

    return team;
  }, []);

  const createTeam = useCallback(async (body: CreateTeamRequest) => {
    const res = await fetch("/api/teams", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create team.");
    const created = (await res.json()) as Team;

    updateCacheState([created, ...cachedTeams]);
    return created;
  }, []);

  const deleteTeam = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete team.");

      const filtered = cachedTeams.filter((team) => team.id !== id);
      updateCacheState(filtered);

      // Silently refresh data in the background
      void fetchTeams(true);
    },
    [fetchTeams],
  );

  const addMember = useCallback(async (teamId: string, username: string) => {
    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error("Failed to add member.");
    const member = await res.json();

    const updated = cachedTeams.map((team) =>
      team.id === teamId ? { ...team, members: [...team.members, member] } : team
    );
    updateCacheState(updated);

    return member;
  }, []);

  const removeMember = useCallback(async (teamId: string, username: string) => {
    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error("Failed to remove member.");

    const updated = cachedTeams.map((team) => {
      if (team.id !== teamId) return team;
      return {
        ...team,
        members: team.members.filter((member) => member.user.username !== username),
      };
    });
    updateCacheState(updated);
  }, []);

  const clearCache = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("scrum_manager_teams_cache");
      } catch (error) {
        console.error("Cache clean execution crash:", error);
      }
    }
    cachedTeams = [];
    stateSetters.forEach((setter) => setter([]));
  }, []);

  return {
    teams,
    loading,
    fetchTeams,
    fetchTeamById,
    createTeam,
    deleteTeam,
    addMember,
    removeMember,
    clearCache,
  };
}
