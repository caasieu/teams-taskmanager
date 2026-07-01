"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavButtonProps {
  label: string;
  path: string;
}

export function NavButton({ label, path }: NavButtonProps) {
  const pathname = usePathname();

  // Checks if the current path matches the item exactly, or if it's a child route of this workspace
  const isActive = pathname === path || pathname.startsWith(`${path}/`);

  return (
    <Link
      href={path}
      className={`group flex items-center justify-between w-full h-[1.8rem] px-2.5 rounded transition-all text-xs font-medium relative ${
        isActive
          ? "bg-app-primary/10 text-app-primary font-semibold"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {/* Visual Workspace Indicator Pin */}
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-[11px] shrink-0 transition-transform group-hover:scale-110 ${
          isActive ? "text-app-primary" : "text-gray-400 group-hover:text-gray-600"
        }`}>
          ⧉
        </span>
        <span className="truncate tracking-wide">{label}</span>
      </div>

      {/* Active State Indicator Dot */}
      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-app-primary animate-pulse shrink-0" />
      )}
    </Link>
  );
}
