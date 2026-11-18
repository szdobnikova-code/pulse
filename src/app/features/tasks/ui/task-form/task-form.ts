import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskDraft, TaskPriority, TaskStatus } from '../../data/task.model';
import { trimmedRequired } from '../../validators/trimmed-required.validator';
import { NgIcon } from '@ng-icons/core';

@Component({
  imports: [ReactiveFormsModule, NgIcon],
  selector: 'app-task-form',
  styleUrl: './task-form.scss',
  templateUrl: './task-form.html',
})
export class TaskForm {
  readonly createTask = output<TaskDraft>();
  readonly updateTask = output<{ id: string; draft: TaskDraft }>();
  readonly task = input<Task | null>(null);
  readonly validityChange = output<boolean>();

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [trimmedRequired],
    }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<TaskStatus>('todo', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<TaskPriority>('low', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dueDate: new FormControl<string | null>(null),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, status, priority, dueDate } = this.form.getRawValue();
    const draft: TaskDraft = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
    };

    const task = this.task();

    if (task) {
      this.updateTask.emit({ id: task.id, draft });
    } else {
      this.createTask.emit(draft);
    }

    this.form.reset();
  }

  constructor() {
    effect(() => {
      const task = this.task();

      if (!task) {
        return;
      }

      this.form.patchValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      });
    });

    this.form.statusChanges.subscribe(() => {
      this.validityChange.emit(this.form.valid);
    });
  }
}
