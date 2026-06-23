import { TasksContainer } from "@/components/tasks/tasks-container";
import { TeamsContainer } from "@/components/teams/teams-container";

export default function TeamsPage() {
  return (
    <div className="flex flex-col p-6 gap-4">
      <TeamsContainer />
      <div />
      <TasksContainer />
    </div>
  );
}
