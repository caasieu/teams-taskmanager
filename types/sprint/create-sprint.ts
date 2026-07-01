export type CreateSprintRequest = {
  teamId: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
};

export type UpdateSprintRequest = {
  teamId: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status: string
};