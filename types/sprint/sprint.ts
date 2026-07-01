import { Task } from "../task/task";

export type Sprint = {
  id: string;
  name: string;
  goal: string | null;

  startDate: string;
  endDate: string;

  status:
    | "PLANNED"
    | "ACTIVE"
    | "COMPLETED";

  teamId: string;
  tasks: Task[];

  createdAt: string;
  updatedAt: string;
};