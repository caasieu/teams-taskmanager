import { NavBackButton } from "@/components/navigation/nav-back-button";
import { NavNextButton } from "@/components/navigation/nav-next-button";
import { CreateTaskForm } from "@/components/tasks/form/create-task-form";

interface PageProps {
  searchParams: Promise<{ spId: string }>;
}

export default async function CreateTasksPage({ searchParams }: PageProps) {
  const { spId } = await searchParams;

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
          Create Task
        </h1>
        <p className="text-xs text-app-text/50 font-mono">
          Add a new action item to sprint tracking ID: {spId}
        </p>
      </div>

      {/* 2. Form Canvas Layout Container */}
      <div className="w-full">
        <CreateTaskForm sprintId={spId} />
      </div>
    </div>
  );
}
