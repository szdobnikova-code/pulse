import { Service } from '@angular/core';
import { Task } from '../features/tasks/data/task.model';

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const task = value as Record<string, unknown>;

  const stringFields = ['id', 'title', 'description', 'createdAt', 'updatedAt'];

  const hasValidStrings = stringFields.every((field) => typeof task[field] === 'string');

  const hasValidStatus = ['todo', 'in_progress', 'done'].includes(task['status'] as string);

  const hasValidPriority = ['low', 'medium', 'high'].includes(task['priority'] as string);

  const hasValidDueDate = typeof task['dueDate'] === 'string' || task['dueDate'] === null;

  return hasValidStrings && hasValidStatus && hasValidPriority && hasValidDueDate;
}

@Service()
export class TaskStorage {
  loadTasks(): Task[] {
    const item = localStorage.getItem('pulse.tasks');

    if (!item) {
      return [];
    }

    try {
      const tasks = JSON.parse(item);
      if (Array.isArray(tasks) && tasks.every(isTask)) {
        return tasks;
      }
      return [];
    } catch {
      return [];
    }
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem('pulse.tasks', JSON.stringify(tasks));
  }
}
