"use client";

import { useCallback, useRef, useState } from "react";

type User = {
  id: string;
  email: string;
  username: string;
  fullName: string;
} | null;

// 🔥 module-level cache (persists across components)
let cachedUser: User = null;
let promise: Promise<User | null> | null = null;

export function useAuth() {
  const [user, setUser] = useState<User>(cachedUser);
  const [loading, setLoading] = useState(!cachedUser);

  const isMounted = useRef(true);

  const fetchUser = useCallback(async () => {
    // if already cached → return it
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
      return cachedUser;
    }

    // if request already running → reuse it
    if (promise) {
      const data = await promise;
      if (isMounted.current) {
        setUser(data);
        setLoading(false);
      }
      return data;
    }

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
        return user;
      })
      .finally(() => {
        promise = null;
      });

    const data = await promise;

    if (isMounted.current) {
      setUser(data);
      setLoading(false);
    }

    return data;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    cachedUser = null; // 🔥 clear cache
    setUser(null);
  }, []);

  return {
    user,
    loading,
    fetchUser,
    logout,
  };
}
