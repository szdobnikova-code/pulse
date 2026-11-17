import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskStore } from './tasks/task-store';
import { TaskList } from './features/tasks/ui/task-list/task-list';

@Component({
  imports: [RouterOutlet, TaskList],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly taskStore = inject(TaskStore);

  addDemoTask(): void {
    this.taskStore.addTask({
      id: crypto.randomUUID(),
      title: 'Learn Angular Signals',
      description: 'Connect TaskStore to the UI',
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
