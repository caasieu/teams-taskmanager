import { CreateSprintForm } from "@/components/sprints/create-sprint-form";
import { NavBackButton } from "@/components/navigation/nav-back-button";
import { NavNextButton } from "@/components/navigation/nav-next-button";

interface PageProps {
  searchParams: Promise<{ tId: string }>;
}

export default async function CreateSprintsPage({ searchParams }: PageProps) {
  const { tId } = await searchParams;

  return (
    <div className="flex flex-col p-6 gap-4 max-w-5xl mx-auto w-full text-xs text-app-text">
      
      {/* 1. Header Information Context Section */}
      <div className="flex flex-col gap-1 pb-2">
        
        {/* Navigation Action Buttons Row Group */}
        <div className="flex items-center gap-3 select-none mb-1">
          <NavBackButton />
          <span className="text-app-text/30 text-[10px] font-mono select-none mb-1">|</span>
          <NavNextButton />
        </div>

        <h1 className="text-xl font-bold text-app-text tracking-tight">Create Sprint</h1>
        <p className="text-xs text-app-text/50 font-mono">
          Initialize a new multi-week cycle for team workspace ID: {tId}
        </p>
      </div>

      {/* 2. Form Canvas Layout Container */}
      <div className="w-full">
        <CreateSprintForm teamId={tId} />
      </div>
      
    </div>

  );
}
