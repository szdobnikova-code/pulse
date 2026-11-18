// features/tasks/data/task.model.ts
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string; // crypto.randomUUID()
  title: string; // 3–120 chars, trimmed
  description: string; // optional in UI, '' when empty, max 1000
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // 'YYYY-MM-DD' local date, NOT a full ISO timestamp
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/** What the form produces and the repository accepts for create/update. */
export type TaskDraft = Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'dueDate'>;

export type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface TaskQuery {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  sort: { field: SortField; direction: SortDirection };
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number; // not done and dueDate < today
  completionRate: number; // percentage 0..100, 0 when total = 0
}
