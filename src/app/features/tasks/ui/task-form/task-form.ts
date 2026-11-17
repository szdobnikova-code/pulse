import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskDraft, TaskPriority, TaskStatus } from '../../data/task.model';
import { trimmedRequired } from '../../validators/trimmed-required.validator';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-task-form',
  styleUrl: './task-form.scss',
  templateUrl: './task-form.html',
})
export class TaskForm {
  readonly createTask = output<TaskDraft>();

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

    this.createTask.emit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
    });

    this.form.reset();
  }
}
