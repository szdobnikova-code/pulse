import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskWorkspace } from './task-workspace';
import { provideAppIcons } from '../../../../icons';

describe('TaskWorkspace', () => {
  let component: TaskWorkspace;
  let fixture: ComponentFixture<TaskWorkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskWorkspace],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskWorkspace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
