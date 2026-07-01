"use client";

export function TaskPriorityBadge({ priority }: { priority?: "LOW" | "MEDIUM" | "HIGH" | string }) {
  if (!priority) return null;

  const styles = {
    HIGH: "bg-danger/10 text-danger border-danger/20",
    MEDIUM: "bg-warning/10 text-warning border-warning/20",
    LOW: "bg-success/10 text-success border-success/20",
  }[priority] || "bg-app-text/5 text-app-text/60 border-app-border";

  return (
    <span className={`text-[10px] font-medium font-mono uppercase px-2 py-0.5 border rounded-full select-none ${styles}`}>
      {priority}
    </span>
  );
}


export function TaskStatusBadge({ status }: { status?: "TODO" | "IN_PROGRESS" | "DONE" | string }) {
  if (!status) return null;

  const styles = {
    TODO: "bg-app-text/5 text-app-text/70 border-app-border",
    IN_PROGRESS: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    DONE: "bg-success/10 text-success border-success/20",
  }[status] || "bg-app-text/5 text-app-text/60 border-app-border";

  // Re-format clean label strings (e.g., IN_PROGRESS -> In Progress)
  const label = status.replace("_", " ").toLowerCase();

  return (
    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 border rounded-sm tracking-wide select-none ${styles}`}>
      {label}
    </span>
  );
}
