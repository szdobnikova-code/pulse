import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TaskForm } from '../task-form/task-form';
import { Task, TaskDraft } from '../../data/task.model';
import { NgIcon } from '@ng-icons/core';

@Component({
  imports: [TaskForm, NgIcon],
  selector: 'app-task-dialog',
  styleUrl: './task-dialog.scss',
  templateUrl: './task-dialog.html',
})
export class TaskDialog {
  readonly isOpen = input.required<boolean>();
  readonly closeRequested = output<void>();
  readonly createTask = output<TaskDraft>();
  readonly updateTask = output<{ id: string; draft: TaskDraft }>();
  readonly task = input<Task | null>(null);
  readonly isFormValid = signal(false);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly injector = inject(Injector);

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;

      if (this.isOpen()) {
        if (!dialog.open) {
          dialog.showModal();
          // The close button is the first focusable element, so move focus onto the
          // first form field once it has rendered to keep the "start typing" flow.
          afterNextRender(() => dialog.querySelector<HTMLElement>('.task-form input')?.focus(), {
            injector: this.injector,
          });
        }
      } else {
        if (dialog.open) dialog.close();
        // The form is destroyed with the dialog, so drop its last reported validity:
        // a fresh, empty form is invalid until it says otherwise.
        this.isFormValid.set(false);
      }
    });
  }
}
