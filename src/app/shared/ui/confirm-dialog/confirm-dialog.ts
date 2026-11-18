import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { TaskForm } from '../../../features/tasks/ui/task-form/task-form';

@Component({
  imports: [TaskForm],
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.scss',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  readonly isOpen = input.required<boolean>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

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
