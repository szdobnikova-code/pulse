import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFilters } from './task-filters';
import { provideAppIcons } from '../../../../icons';

describe('TaskFilters', () => {
  let component: TaskFilters;
  let fixture: ComponentFixture<TaskFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFilters],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFilters);
    fixture.componentRef.setInput('query', {
      search: '',
      status: 'all',
      priority: 'all',
      sort: {
        field: 'updatedAt',
        direction: 'desc',
      },
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
