import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskQuery,
  SortField,
  SortDirection,
  TaskStats,
} from './task.model';
import { isOverdue } from './task-date.utils';

export function filterTasksBySearch(tasks: readonly Task[], search: string): Task[] {
  const searchString = search.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchString) ||
      t.description.toLowerCase().includes(searchString),
  );
}

export function filterTasksByStatus(tasks: readonly Task[], status: TaskStatus | 'all'): Task[] {
  return status === 'all' ? [...tasks] : tasks.filter((t) => t.status === status);
}

export function filterTasksByPriority(
  tasks: readonly Task[],
  priority: TaskPriority | 'all',
): Task[] {
  return priority === 'all' ? [...tasks] : tasks.filter((t) => t.priority === priority);
}

const priorityOrder: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const statusOrder: Record<TaskStatus, number> = {
  todo: 1,
  in_progress: 2,
  done: 3,
};

export function sortTasks(
  tasks: readonly Task[],
  field: SortField,
  direction: SortDirection,
): Task[] {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    if (field === 'dueDate') {
      if (a.dueDate === null && b.dueDate !== null) return 1;
      if (a.dueDate !== null && b.dueDate === null) return -1;
      if (a.dueDate === null && b.dueDate === null) return 0;
    }

    switch (field) {
      case 'title':
        comparison = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        break;

      case 'priority':
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;

      case 'status':
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;

      case 'updatedAt':
        comparison = a.updatedAt.localeCompare(b.updatedAt);
        break;

      case 'dueDate':
        comparison = a.dueDate!.localeCompare(b.dueDate!);
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

export function applyTaskQuery(tasks: readonly Task[], query: TaskQuery): Task[] {
  let result = filterTasksBySearch(tasks, query.search);
  result = filterTasksByStatus(result, query.status);
  result = filterTasksByPriority(result, query.priority);
  result = sortTasks(result, query.sort.field, query.sort.direction);

  return result;
}

export function computeStats(tasks: readonly Task[], today: string): TaskStats {
  const stats = tasks.reduce<TaskStats>(
    (acc, t) => {
      acc.total += 1;
      if (t.status === 'todo') {
        acc.todo += 1;
      }
      if (t.status === 'in_progress') {
        acc.inProgress += 1;
      }
      if (t.status === 'done') {
        acc.done += 1;
      }

      if (isOverdue(t.dueDate, t.status, today)) {
        acc.overdue += 1;
      }

      return acc;
    },
    {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      overdue: 0,
      completionRate: 0,
    },
  );

  stats.completionRate = stats.total === 0 ? 0 : (stats.done / stats.total) * 100;

  return stats;
}
