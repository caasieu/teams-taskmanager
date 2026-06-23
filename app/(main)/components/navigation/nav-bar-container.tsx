import { NavBarContent } from "./nav-bar-content";

export function NavBarContainer() {
  return (
    <div className="
    hidden md:block w-[18rem] h-full
    fixed left-0 top-0 bg-app-card
    border-r border-app-border shadow-xs">
      <NavBarContent />
    </div>
  );
}
