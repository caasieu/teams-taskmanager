"use client";

import { CreateTeamRequest } from "@/types/team/create-team";
import { Team } from "@/types/team/team";
import { useCallback, useState, startTransition } from "react";

let cachedTeams: Team[] | undefined;
let fetchPromise: Promise<Team[]> | null = null;

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>(cachedTeams ?? []);
  const [loading, setLoading] = useState(cachedTeams === undefined);

  const fetchTeams = useCallback(
    async (forceRefresh = false): Promise<Team[]> => {
      if (!forceRefresh && cachedTeams !== undefined) {
        return cachedTeams;
      }

      if (!forceRefresh && fetchPromise) {
        return fetchPromise;
      }

      startTransition(() => {
        setLoading(true);
      });

      fetchPromise = fetch("/api/teams", {
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch teams.");
          return (await res.json()) as Team[];
        })
        .then((data) => {
          cachedTeams = data;
          setTeams(data);
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
    // Crucial: Makes sure we map to your backend parameter config correctly
    const res = await fetch(`/api/teams/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch team with ID: ${id}`);
    }

    const team = (await res.json()) as Team;

    if (cachedTeams) {
      const index = cachedTeams.findIndex((t) => t.id === team.id);
      if (index >= 0) {
        cachedTeams[index] = team;
      } else {
        cachedTeams.push(team);
      }
      setTeams([...cachedTeams]);
    }

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
    cachedTeams = cachedTeams ? [created, ...cachedTeams] : [created];
    setTeams(cachedTeams);
    return created;
  }, []);

  const deleteTeam = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete team.");

      if (cachedTeams) {
        cachedTeams = cachedTeams.filter((team) => team.id !== id);
        setTeams(cachedTeams);
      }

      await fetchTeams(true);
    },
    [fetchTeams],
  );

  const addMember = useCallback(async (teamId: string, username: string) => {
    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      throw new Error("Failed to add member.");
    }

    const member = await res.json();

    if (cachedTeams) {
      cachedTeams = cachedTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: [...team.members, member],
            }
          : team,
      );

      setTeams([...cachedTeams]);
    }

    return member;
  }, []);

  const removeMember = useCallback(async (teamId: string, username: string) => {
    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      throw new Error("Failed to remove member.");
    }

    if (cachedTeams) {
      cachedTeams = cachedTeams.map((team) => {
        if (team.id !== teamId) return team;

        return {
          ...team,
          members: team.members.filter(
            (member) => member.user.username !== username,
          ),
        };
      });

      setTeams([...cachedTeams]);
    }
  }, []);

  const clearCache = useCallback(() => {
    cachedTeams = undefined;
    setTeams([]);
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
