import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDialog } from './task-dialog';
import { provideAppIcons } from '../../../../icons';

describe('TaskDialog', () => {
  let component: TaskDialog;
  let fixture: ComponentFixture<TaskDialog>;

  beforeEach(async () => {
    // jsdom does not implement the modal dialog API the component relies on.
    const dialogProto = HTMLDialogElement.prototype as unknown as Record<string, unknown>;
    if (typeof dialogProto['showModal'] !== 'function') {
      dialogProto['showModal'] = function (this: HTMLDialogElement) {
        this.open = true;
      };
    }
    if (typeof dialogProto['close'] !== 'function') {
      dialogProto['close'] = function (this: HTMLDialogElement) {
        this.open = false;
      };
    }

    await TestBed.configureTestingModule({
      imports: [TaskDialog],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDialog);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isOpen', false);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marks the submit button aria-disabled while the form is invalid', async () => {
    fixture.componentRef.setInput('isOpen', true);
    await fixture.whenStable();

    const submit = fixture.nativeElement.querySelector('.task-dialog__submit') as HTMLElement;
    expect(submit.getAttribute('aria-disabled')).toBe('true');

    const title = fixture.nativeElement.querySelector('#title') as HTMLInputElement;
    title.value = 'Write the README';
    title.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(submit.getAttribute('aria-disabled')).toBe('false');
  });
});
