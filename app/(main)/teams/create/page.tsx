import { CreateTeamForm } from "@/components/teams/create-team-form";

export default function CreateTeamsPage() {
  return (
    <div className="flex flex-col p-6 gap-4">
      <span> Create Team </span>

      <CreateTeamForm />
    </div>
  );
}
