import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  imports: [NgIcon],
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.scss',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  readonly isOpen = input.required<boolean>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Confirm');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly cancelButton = viewChild.required<ElementRef<HTMLButtonElement>>('cancelButton');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;

      if (this.isOpen()) {
        if (!dialog.open) {
          dialog.showModal();
          // Prefer the non-destructive action over the leading close button.
          this.cancelButton().nativeElement.focus();
        }
      } else {
        if (dialog.open) dialog.close();
      }
    });
  }
}
