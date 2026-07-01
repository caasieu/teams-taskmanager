"use client";

import { useSyncExternalStore } from "react";

// Safe no-op subscription block for static props arrays
const subscribeNoOp = () => () => {};

export function useClientRoutes<T>(routes: T[]): T[] {
  return useSyncExternalStore(
    subscribeNoOp,
    () => routes,      // Client snapshot: reads your instant cache entries
    () => []           // Server snapshot: stays an empty array to match SSR shells
  );
}
