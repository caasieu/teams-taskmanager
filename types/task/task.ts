export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type Task = {
  id: string;

  title: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  teamId: string;
  sprintId: string | null;

  assigneeId: string | null;

  createdById: string;

  createdAt: string;
  updatedAt: string;
};