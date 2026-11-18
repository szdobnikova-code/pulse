import { Component, input, output } from '@angular/core';
import { Task } from '../../data/task.model';
import { DatePipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  imports: [DatePipe, NgIcon],
  selector: 'app-task-list',
  styleUrl: './task-list.scss',
  templateUrl: './task-list.html',
})
export class TaskList {
  readonly tasks = input.required<Task[]>();
  readonly deleteTask = output<string>();
  readonly editTask = output<string>();
}
