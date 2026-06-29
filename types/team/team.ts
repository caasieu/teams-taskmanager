export type TeamDto = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTeamMember = {
  username: string;
};

export type TeamMember = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";

  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
  };
};

export type Team = {
  id: string;
  name: string;
  description: string | null;

  createdAt: string;
  updatedAt: string;

  members: TeamMember[];
};