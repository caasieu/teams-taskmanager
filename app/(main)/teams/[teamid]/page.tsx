"use client";

import { TeamAddMemberForm } from "@/components/teams/details/team-add-member-form";
import { TeamMemberCard } from "@/components/teams/details/team-member-card";
import { useTeams } from "@/lib/teams/use-team";
import { Team } from "@/types/team/team";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeamPage() {
  const params = useParams();
  const teamId = (params.teamId || params.teamid) as string;

  const { fetchTeamById, addMember, removeMember } = useTeams();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;
    let isMounted = true;

    async function loadTeam() {
      try {
        setLoading(true);
        const data = await fetchTeamById(teamId);
        if (isMounted) setTeam(data);
      } catch (err) {
        if (isMounted) setError("Failed to load team data.");
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadTeam();
    return () => { isMounted = false; };
  }, [teamId, fetchTeamById]);

  // Handle adding the member and updating the local view state instantly
  const handleAddMember = async (tId: string, username: string) => {
    try {
      const newMember = await addMember(tId, username);
      
      // Sync local state array with the newly returned team member
      setTeam((prevTeam) => {
        if (!prevTeam) return null;
        return {
          ...prevTeam,
          members: [...prevTeam.members, newMember],
        };
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add member. Check the username.");
    }
  };

  const handleRemoveMember = async (tId: string, username: string) => {
    try {
      await removeMember(tId, username);

      setTeam((prevTeam) => {
        if (!prevTeam) return null;
        return {
          ...prevTeam,
          members: prevTeam.members.filter((m) => m.user.username !== username),
        };
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove member.");
    }
  };

  if (loading) return <div>Loading team details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!team) return <div>Team not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{team.name}</h1>
      <p className="text-xs text-gray-500">Created at: {team.createdAt}</p>

      <div className="flex flex-col gap-2 mt-4">
        <h2 className="text-lg font-semibold">Members:</h2>

        {/* Use the new tracking wrapper here */}
        <TeamAddMemberForm team={team} onAdd={handleAddMember} />

        <ul className="flex flex-col gap-1 mt-2">
          {team.members?.map((member) => (
            <TeamMemberCard key={member?.id} teamId={team?.id} member={member} onDelete={handleRemoveMember} />
          ))}
        </ul>
      </div>
    </div>
  );
}
