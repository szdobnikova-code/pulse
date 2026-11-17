import { Component, input, output } from '@angular/core';
import { Task } from '../../data/task.model';

@Component({
  imports: [],
  selector: 'app-task-list',
  styleUrl: './task-list.scss',
  templateUrl: './task-list.html',
})
export class TaskList {
  readonly tasks = input.required<Task[]>();
  readonly deleteTask = output<string>();
}
