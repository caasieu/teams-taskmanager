"use client";

import { useEffect, useState, useMemo, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";

import { UpdateSprintForm } from "@/components/sprints/update-sprint-form";
import { useSprints } from "@/hooks/sprints/use-sprints";
import { Sprint } from "@/types/sprint/sprint";
import { NavBackButton } from "@/components/navigation/nav-back-button";
import { NavNextButton } from "@/components/navigation/nav-next-button";

const subscribeNoOp = () => () => {};

export default function UpdateSprintPage() {
  const searchParams = useSearchParams();

  const sprintId = searchParams.get("spId");

  const { fetchSprintById, sprints, findSprintInCache } = useSprints();

  // 1. Safely bind your local client memory cache store to avoid SSR desync crashes
  const clientSprints = useSyncExternalStore(
    subscribeNoOp,
    () => sprints,
    () => [] as Sprint[],
  );

  // FIX: Look inside your application memory cache map instantly on component initialization
  const sprint = useMemo(() => {
    if (!sprintId) return null;
    return findSprintInCache(sprintId);
  }, [sprintId, clientSprints, findSprintInCache]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sprintId) return;

    let mounted = true;

    async function loadSprint() {
      try {
        await fetchSprintById(sprintId as string);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadSprint();

    return () => {
      mounted = false;
    };
  }, [sprintId, fetchSprintById]);

  // FIX: Bypass the full-screen loader layout if a matching item is found in cache memory
  if (loading && !sprint) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-gray-500 font-medium animate-pulse">
        Loading sprint data...
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-12 border border-red-100 bg-red-50 text-red-700 text-sm rounded-sm shadow-sm">
        Sprint target parameters profile not found.
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
          Update Sprint
        </h1>
        <p className="text-xs text-app-text/50 font-mono">
          Modify tracking metrics, timeline targets, or goals for sprint ID:{" "}
          {sprintId}
        </p>
      </div>

      {/* 2. Form Canvas Layout Container */}
      <div className="w-full">
        <UpdateSprintForm sprint={sprint} />
      </div>
    </div>

  );
}
