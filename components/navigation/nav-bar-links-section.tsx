"use client";

import Link from "next/link";
import { NavButton } from "./nav-button";

interface RouteLinkType {
  id?: string;
  label: string;
  path: string;
}

interface NavBarLinksSectionProps {
  label: string;
  path: string;
  routes: Array<RouteLinkType>;
}

export function NavBarLinksSection({
  label,
  path,
  routes,
}: NavBarLinksSectionProps) {
  const itemCount = routes?.length ?? 0;

  return (
    <div className="flex flex-col gap-1.5 px-3 py-2.5 text-app-text">
      {/* Scrum Board-Style Header Row */}
      <div className="flex items-center justify-between group px-1 pb-1.5 select-none">
        {/* Category Label and Dynamic Aggregator Counter Badge */}
        <Link
          href={path}
          className="flex items-center gap-2 text-app-text/50 hover:text-app-text transition-colors font-bold font-mono uppercase text-[10px] tracking-wider"
        >
          <span>{label}</span>
          {/* FIX: Suppresses the server '0' vs client 'cached count' text mismatch error seamlessly */}
          {itemCount > 0 && (
            <span
              suppressHydrationWarning
              className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-sm bg-app-card border border-app-border text-app-text/70 transition-colors group-hover:bg-app-border"
            >
              {itemCount}
            </span>
          )}
        </Link>

        {/* Agile Quick Action: Create Workspace Trigger Shortcut */}
        <Link
          href={`${path}/create`}
          title={`Create new ${label.toLowerCase().slice(0, -1)}`}
          className="text-xs text-app-text/40 hover:text-app-primary hover:bg-app-card h-5 w-5 flex items-center justify-center rounded transition-all active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          ＋
        </Link>
      </div>

      {/* Child Workspaces Navigation Stack Container */}
      {/* FIX: Suppresses the container child block variance mismatch when local cache mounts lists immediately */}
      <div suppressHydrationWarning className="flex flex-col gap-0.5 w-full">
        {itemCount > 0 ? (
          routes.map((route) => (
            <NavButton
              key={route.id || route.path}
              label={route.label}
              path={route.path}
            />
          ))
        ) : (
          <div className="text-[11px] text-app-text/40 border border-dashed border-app-border rounded-sm bg-app-surface p-2.5 text-center font-medium">
            No active {label.toLowerCase()} configured
          </div>
        )}
      </div>
    </div>
  );
}
