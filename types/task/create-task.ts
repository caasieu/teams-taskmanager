import { TaskPriority } from "./task";

export type CreateTaskRequest = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
};