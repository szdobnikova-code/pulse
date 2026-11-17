import { AbstractControl, ValidationErrors } from '@angular/forms';

export function trimmedRequired(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  return typeof value === 'string' && value.trim().length > 0 ? null : { required: true };
}
