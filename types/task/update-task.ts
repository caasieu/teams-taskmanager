import { TaskPriority, TaskStatus } from "./task";

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  sprintId?: string | null;
};