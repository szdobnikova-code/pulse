import { Component, inject, signal } from '@angular/core';
import { TaskStore } from '../../../../tasks/task-store';
import { TaskList } from '../../ui/task-list/task-list';
import { TaskFilters } from '../../ui/task-filters/task-filters';
import { TaskDialog } from '../../ui/task-dialog/task-dialog';
import { TaskDraft } from '../../data/task.model';

@Component({
  imports: [TaskList, TaskFilters, TaskDialog],
  selector: 'app-task-workspace',
  styleUrl: './task-workspace.scss',
  templateUrl: './task-workspace.html',
})
export class TaskWorkspace {
  readonly taskStore = inject(TaskStore);
  readonly isTaskDialogOpen = signal(false);

  openTaskDialog(): void {
    this.isTaskDialogOpen.set(true);
  }

  closeTaskDialog(): void {
    this.isTaskDialogOpen.set(false);
  }

  onCreateTask(draft: TaskDraft): void {
    const now = new Date().toISOString();

    this.taskStore.addTask({
      ...draft,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });

    this.closeTaskDialog();
  }
}
