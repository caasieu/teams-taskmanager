import Link from "next/link";
import { NavButton } from "./nav-button";

interface RouteLinkType {
  label: string;
  path: string;
}

export function NavBarLinksSection({
  label,
  path,
  routes,
}: {
  label: string;
  path: string;
  routes: Array<RouteLinkType>;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-app-border px-3 py-3">
      <Link href={path}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{label}</span>
          <span> [icon] </span>
        </div>
      </Link>

      <div className="flex flex-col gap-2 text-xs">
        {routes?.map((value, index) => (
          <NavButton key={index} label={value.label} path={value.path} />
        ))}
      </div>
    </div>
  );
}
