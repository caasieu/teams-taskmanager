"use client";

import { useSyncExternalStore } from "react";

const subscribeNoOp = () => () => {};
// FIX: Cache the static snapshots in memory to prevent compilation loops
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeNoOp,
    getClientSnapshot,
    getServerSnapshot
  );
}
