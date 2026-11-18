import { Task, TaskPriority, TaskStatus } from './task.model';

type DemoTaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
};

const demoTasks: DemoTaskInput[] = [
  {
    title: 'Implement user authentication',
    description: 'Add login, logout, and session persistence.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-20',
  },
  {
    title: 'Fix dashboard layout on mobile',
    description: 'Resolve overflow and spacing issues on smaller screens.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-11-19',
  },
  {
    title: 'Optimize API response caching',
    description: 'Reduce duplicate requests and improve loading performance.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-11-24',
  },
  {
    title: 'Add dark mode support',
    description: 'Implement theme switching and persist user preferences.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-12-04',
  },
  {
    title: 'Write unit tests for TaskStore',
    description: 'Cover CRUD operations, filtering, and sorting.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-11-12',
  },
  {
    title: 'Improve form validation',
    description: 'Add clear validation messages and prevent invalid submissions.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-11-10',
  },
  {
    title: 'Add keyboard shortcuts',
    description: 'Support common actions using keyboard combinations.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-12-08',
  },
  {
    title: 'Review accessibility issues',
    description: 'Check keyboard navigation, focus management, and ARIA labels.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-11-23',
  },
  {
    title: 'Implement notification center',
    description: 'Display notifications and unread indicators.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-11-27',
  },
  {
    title: 'Fix task sorting by due date',
    description: 'Handle null dates and ensure consistent ordering.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-11-09',
  },
  {
    title: 'Add loading skeletons',
    description: 'Improve perceived performance during data loading.',
    status: 'in_progress',
    priority: 'low',
    dueDate: '2026-11-26',
  },
  {
    title: 'Refactor shared UI components',
    description: 'Extract reusable buttons, inputs, and dialog styles.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-12-02',
  },
  {
    title: 'Investigate slow search performance',
    description: 'Profile filtering on larger task collections.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-14',
  },
  {
    title: 'Add empty state illustrations',
    description: 'Improve the interface when no tasks match the filters.',
    status: 'todo',
    priority: 'low',
    dueDate: null,
  },
  {
    title: 'Update project documentation',
    description: 'Document setup instructions and application architecture.',
    status: 'done',
    priority: 'low',
    dueDate: '2026-11-06',
  },
  {
    title: 'Implement task status transitions',
    description: 'Improve task status updates and validation.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-11-25',
  },
  {
    title: 'Fix modal focus behavior',
    description: 'Ensure focus returns to the triggering element.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-11-13',
  },
  {
    title: 'Add task export functionality',
    description: 'Allow exporting tasks to a CSV file.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-12-10',
  },
  {
    title: 'Improve responsive table',
    description: 'Make task actions accessible on narrow screens.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-17',
  },
  {
    title: 'Add error handling for storage',
    description: 'Handle unavailable or corrupted localStorage data.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-21',
  },
  {
    title: 'Implement task duplication',
    description: 'Allow users to create copies of existing tasks.',
    status: 'in_progress',
    priority: 'low',
    dueDate: '2026-12-01',
  },
  {
    title: 'Improve task search UX',
    description: 'Add a clear button and improve search interactions.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-11-28',
  },
  {
    title: 'Set up CI checks',
    description: 'Run linting, tests, and production builds automatically.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-11-11',
  },
  {
    title: 'Add task activity history',
    description: 'Track important task changes for future display.',
    status: 'todo',
    priority: 'low',
    dueDate: null,
  },
];

export function createDemoTasks(): Task[] {
  const now = new Date();

  return demoTasks.map((task, index) => {
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - (24 - index));

    const updatedAt = new Date(createdAt);
    updatedAt.setDate(updatedAt.getDate() + Math.min(3, index % 4));

    return {
      ...task,
      id: crypto.randomUUID(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  });
}
