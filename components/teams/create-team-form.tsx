"use client";

import { useTeams } from "@/lib/teams/use-team";
import { CreateTeamRequest } from "@/types/team/create-team";
import { useForm } from "react-hook-form";
import { CreateTeamInput } from "./create-team-input";
import { CreateTeamTextarea } from "./create-team-textarea";
import { CreateTeamSubmitButton } from "./create-team-submit-button";

export function CreateTeamForm() {
  const { register, handleSubmit, reset } = useForm<CreateTeamRequest>();
  const { createTeam } = useTeams();

  async function onSubmit(data: CreateTeamRequest) {
    const team = await createTeam({
      name: data?.name,
      description: data?.description,
    });

    console.log(team);
    reset();
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <CreateTeamInput
            name="name"
            type="text"
            placeholder="Your team name"
            register={register}
          />

          <CreateTeamTextarea
            name="description"
            placeholder="Place your description here"
            register={register}
          />

          <CreateTeamSubmitButton label="Create new!" />
        </div>
      </form>
    </div>
  );
}
