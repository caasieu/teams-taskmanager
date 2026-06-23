import { ThemeToggle } from "@/components/theme-toggle";
import { AccountCard } from "../users/account-card";
import { NavButton } from "./nav-button";
import { AppLogo } from "@/components/app-logo";
import { AppLogoutButton } from "@/components/app-logout-button";
import { NavBarLinksSection } from "./nav-bar-links-section";

export function NavBarContent() {
  const mocks = {
    teams: [
      { label: "Team 1", path: "/teams/1" },
      { label: "Team 2", path: "/teams/2" },
    ],

    tasks: [
      { label: "Task 1", path: "/teams/1/tasks/2" },
      { label: "Task 2", path: "/teams/2/tasks/3" },
    ],
  };

  return (
    <nav className="hidden md:block h-full text-sm">
      <div className="flex flex-col">
        <div className="flex items-center px-3 min-h-[3rem]">
          <AppLogo />
        </div>

        <div className="border-b border-app-border">
          <AccountCard />
        </div>

        <NavBarLinksSection label="Teams" path="/teams" routes={mocks?.teams} />
        <NavBarLinksSection label="Tasks" path="/tasks" routes={mocks?.tasks} />

        <div className="flex flex-col gap-2 px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Utils</span>
            <span> [icon] </span>
          </div>

          <div className="flex flex-col gap-2 text-xs ">
            <ThemeToggle />
            <AppLogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
