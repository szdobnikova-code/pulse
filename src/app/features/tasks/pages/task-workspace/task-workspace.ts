import { Component, inject, signal } from '@angular/core';
import { TaskStore } from '../../../../tasks/task-store';
import { TaskList } from '../../ui/task-list/task-list';
import { TaskFilters } from '../../ui/task-filters/task-filters';
import { TaskDialog } from '../../ui/task-dialog/task-dialog';
import { Task, TaskDraft } from '../../data/task.model';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';

@Component({
  imports: [TaskList, TaskFilters, TaskDialog, ConfirmDialog],
  selector: 'app-task-workspace',
  styleUrl: './task-workspace.scss',
  templateUrl: './task-workspace.html',
})
export class TaskWorkspace {
  readonly taskStore = inject(TaskStore);
  readonly isTaskDialogOpen = signal(false);
  readonly selectedTask = signal<Task | null>(null);
  readonly taskToDelete = signal<Task | null>(null);

  openCreateTaskDialog(): void {
    this.selectedTask.set(null);
    this.isTaskDialogOpen.set(true);
  }

  closeTaskDialog(): void {
    this.isTaskDialogOpen.set(false);
    this.selectedTask.set(null);
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

  openEditTaskDialog(id: string): void {
    const task = this.taskStore.tasks().find((t) => t.id === id);

    if (!task) {
      return;
    }

    this.selectedTask.set(task);
    this.isTaskDialogOpen.set(true);
  }

  onUpdateTask(event: { id: string; draft: TaskDraft }): void {
    this.taskStore.updateTask(event.id, event.draft);
    this.closeTaskDialog();
  }

  requestDeleteTask(id: string): void {
    const task = this.taskStore.tasks().find((t) => t.id === id);

    if (!task) {
      return;
    }
    this.taskToDelete.set(task);
  }

  confirmDeleteTask(): void {
    const task = this.taskToDelete();
    if (task) {
      this.taskStore.deleteTask(task.id);
    }
    this.taskToDelete.set(null);
  }

  cancelDeleteTask(): void {
    this.taskToDelete.set(null);
  }
}
