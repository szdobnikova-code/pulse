import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { TaskForm } from '../task-form/task-form';
import { TaskDraft } from '../../data/task.model';

@Component({
  imports: [TaskForm],
  selector: 'app-task-dialog',
  styleUrl: './task-dialog.scss',
  templateUrl: './task-dialog.html',
})
export class TaskDialog {
  readonly isOpen = input.required<boolean>();
  readonly closeRequested = output<void>();
  readonly createTask = output<TaskDraft>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;

      if (this.isOpen()) {
        if (!dialog.open) dialog.showModal();
      } else {
        if (dialog.open) dialog.close();
      }
    });
  }
}
