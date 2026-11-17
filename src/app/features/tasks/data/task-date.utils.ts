import { TaskStatus } from './task.model';

export function getTodayISO(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isOverdue(dueDate: string | null, status: TaskStatus, today: string): boolean {
  return dueDate !== null && dueDate < today && status !== 'done';
}
