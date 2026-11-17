import { Component, input, output } from '@angular/core';
import {
  SortDirection,
  SortField,
  TaskPriority,
  TaskQuery,
  TaskStatus,
} from '../../data/task.model';

@Component({
  imports: [],
  selector: 'app-task-filters',
  styleUrl: './task-filters.scss',
  templateUrl: './task-filters.html',
})
export class TaskFilters {
  readonly query = input.required<TaskQuery>();
  readonly searchChange = output<string>();
  readonly statusChange = output<TaskStatus | 'all'>();
  readonly priorityChange = output<TaskPriority | 'all'>();
  readonly sortChange = output<{ field: SortField; direction: SortDirection }>();

  onStatusChange(value: string): void {
    if (value === 'all' || value === 'todo' || value === 'in_progress' || value === 'done') {
      this.statusChange.emit(value);
    }
  }

  onPriorityChange(value: string): void {
    if (value === 'all' || value === 'low' || value === 'medium' || value === 'high') {
      this.priorityChange.emit(value);
    }
  }

  onSortChange(field: string, direction: string): void {
    const validField =
      field === 'title' ||
      field === 'status' ||
      field === 'priority' ||
      field === 'dueDate' ||
      field === 'updatedAt';

    const validDirection = direction === 'asc' || direction === 'desc';

    if (validField && validDirection) {
      this.sortChange.emit({
        field,
        direction,
      });
    }
  }
}
