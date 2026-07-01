"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

type User = {
  id: string;
  email: string;
  username: string;
  fullName: string;
} | null;

// Global module-level cache and event subscribers
let cachedUser: User = null;
let promise: Promise<User | null> | null = null;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emitChange() {
  listeners.forEach((callback) => callback());
}

export function useAuth() {
  const user = useSyncExternalStore(
    subscribe,
    () => cachedUser,
    () => null // Server fallback
  );

  const [loading, setLoading] = useState(!cachedUser);

  const fetchUser = useCallback(async () => {
    if (cachedUser) {
      setLoading(false);
      return cachedUser;
    }

    if (promise) {
      const data = await promise;
      setLoading(false);
      return data;
    }

    setLoading(true);
    promise = fetch("/api/users/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data.user as User;
      })
      .then((user) => {
        cachedUser = user;
        emitChange();
        return user;
      })
      .finally(() => {
        promise = null;
        setLoading(false);
      });

    return promise;
  }, []);

  const logout = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Backend rejection during logout session request.");
    } catch (error) {
      console.error("Logout failed to clean session cookie:", error);
    } finally {
      // 1. Wipe out local module variables immediately
      cachedUser = null; 
      promise = null;
      emitChange(); 

      // 2. CRUCIAL FIX: Purge physical localStorage cache blocks completely to prevent cross-account leak loops
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("scrum_manager_teams_cache");
          localStorage.removeItem("scrum_manager_sprints_cache");
          
          // Force active cache references inside running hook memory pools to flush completely
          window.dispatchEvent(new Event("teams-updated"));
          window.dispatchEvent(new Event("sprints-updated"));
        } catch (storageErr) {
          console.error("Failed to clean up client storage indices:", storageErr);
        }
      }
    }
  }, []);

  return {
    user,
    loading,
    fetchUser,
    logout,
  };
}
