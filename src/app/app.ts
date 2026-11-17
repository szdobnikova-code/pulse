import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskWorkspace } from './features/tasks/pages/task-workspace/task-workspace';

@Component({
  imports: [RouterOutlet, TaskWorkspace],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
