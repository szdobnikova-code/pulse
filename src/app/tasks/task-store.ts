import { computed, Service, signal } from '@angular/core';
import {
  Task,
  TaskQuery,
  TaskStatus,
  TaskPriority,
  SortField,
  SortDirection,
  TaskDraft,
} from '../features/tasks/data/task.model';
import { applyTaskQuery, computeStats } from '../features/tasks/data/task.query';
import { getTodayISO } from '../features/tasks/data/task-date.utils';

@Service()
export class TaskStore {
  private readonly _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();
  private readonly _taskQuery = signal<TaskQuery>({
    search: '',
    status: 'all',
    priority: 'all',
    sort: {
      field: 'updatedAt',
      direction: 'desc',
    },
  });
  readonly taskQuery = this._taskQuery.asReadonly();
  readonly stats = computed(() => computeStats(this._tasks(), getTodayISO()));
  readonly visibleTasks = computed(() => applyTaskQuery(this._tasks(), this._taskQuery()));

  addTask(task: Task): void {
    this._tasks.update((arr) => [...arr, task]);
  }

  updateTask(id: string, draft: TaskDraft): void {
    this._tasks.update((arr) =>
      arr.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            title: draft.title,
            description: draft.description,
            status: draft.status,
            priority: draft.priority,
            dueDate: draft.dueDate,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      }),
    );
  }

  deleteTask(id: string): void {
    this._tasks.update((arr) => arr.filter((t) => t.id !== id));
  }

  setSearch(search: string): void {
    this._taskQuery.update((query) => ({ ...query, search }));
  }

  setStatus(status: TaskStatus | 'all'): void {
    this._taskQuery.update((query) => ({ ...query, status }));
  }

  setPriority(priority: TaskPriority | 'all'): void {
    this._taskQuery.update((query) => ({ ...query, priority }));
  }

  setSort(field: SortField, direction: SortDirection): void {
    this._taskQuery.update((query) => ({ ...query, sort: { field, direction } }));
  }
}
