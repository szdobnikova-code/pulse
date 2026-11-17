import { Task, TaskQuery } from './task.model';
import {
  applyTaskQuery,
  computeStats,
  filterTasksByPriority,
  filterTasksBySearch,
  filterTasksByStatus,
  sortTasks,
} from './task.query';
import { getTodayISO, isOverdue } from './task-date.utils';

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Test task',
    description: '',
    status: 'todo',
    priority: 'low',
    dueDate: null,
    createdAt: '2026-11-01T00:00:00.000Z',
    updatedAt: '2026-11-01T00:00:00.000Z',
    ...overrides,
  };
}

const testTasks = [
  createTask({ id: '1', title: 'Charlie', dueDate: null }),
  createTask({ id: '2', title: 'Alice', dueDate: '2026-11-20', priority: 'high' }),
  createTask({ id: '3', title: 'Bob', dueDate: '2026-11-10' }),
];

const query: TaskQuery = {
  search: '',
  status: 'todo',
  priority: 'low',
  sort: {
    field: 'title',
    direction: 'asc',
  },
};

/** Passed explicitly to `computeStats` / `isOverdue`, so these tests never read the clock. */
const TODAY = '2026-11-15';

/** One task per status and per priority, covering all four `isOverdue` branches against TODAY. */
const mixedTasks = [
  createTask({
    id: '1',
    title: 'Write docs',
    description: 'API reference',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-11-10',
    updatedAt: '2026-11-01T00:00:00.000Z',
  }),
  createTask({
    id: '2',
    title: 'Fix bug',
    description: 'Urgent crash',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-20',
    updatedAt: '2026-11-02T00:00:00.000Z',
  }),
  createTask({
    id: '3',
    title: 'Ship release',
    description: 'Tag and publish',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-11-05',
    updatedAt: '2026-11-03T00:00:00.000Z',
  }),
  createTask({
    id: '4',
    title: 'Plan sprint',
    description: '',
    status: 'todo',
    priority: 'high',
    dueDate: null,
    updatedAt: '2026-11-04T00:00:00.000Z',
  }),
];

describe('task query', () => {
  it('should sort tasks by title ascending', () => {
    const sorted = sortTasks(testTasks, 'title', 'asc');
    const result = sorted.map((t) => t.title);
    expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('should sort tasks by dueDate ascending', () => {
    const sorted = sortTasks(testTasks, 'dueDate', 'asc');
    const result = sorted.map((t) => t.title);
    expect(result).toEqual(['Bob', 'Alice', 'Charlie']);
  });

  it('should sort tasks by dueDate descending', () => {
    const sorted = sortTasks(testTasks, 'dueDate', 'desc');
    const result = sorted.map((t) => t.title);
    expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('should not mutate the original tasks array', () => {
    const ids = testTasks.map((t) => t.id);

    sortTasks(testTasks, 'title', 'asc');

    expect(testTasks.map((t) => t.id)).toEqual(ids);
  });

  it('should apply task query', () => {
    const sorted = applyTaskQuery(testTasks, query);
    const result = sorted.map((t) => t.title);
    expect(result).toEqual(['Bob', 'Charlie']);
  });

  it('should sort tasks by priority ascending', () => {
    const sorted = sortTasks(mixedTasks, 'priority', 'asc');
    const result = sorted.map((t) => t.priority);
    expect(result).toEqual(['low', 'medium', 'high', 'high']);
  });

  it('should sort tasks by status ascending', () => {
    const sorted = sortTasks(mixedTasks, 'status', 'asc');
    const result = sorted.map((t) => t.status);
    expect(result).toEqual(['todo', 'todo', 'in_progress', 'done']);
  });

  it('should sort tasks by updatedAt descending', () => {
    const sorted = sortTasks(mixedTasks, 'updatedAt', 'desc');
    const result = sorted.map((t) => t.id);
    expect(result).toEqual(['4', '3', '2', '1']);
  });
});

describe('filterTasksBySearch', () => {
  it('should match on title', () => {
    const result = filterTasksBySearch(mixedTasks, 'bug').map((t) => t.title);
    expect(result).toEqual(['Fix bug']);
  });

  it('should match on description', () => {
    const result = filterTasksBySearch(mixedTasks, 'reference').map((t) => t.title);
    expect(result).toEqual(['Write docs']);
  });

  it('should ignore case', () => {
    const result = filterTasksBySearch(mixedTasks, 'BUG').map((t) => t.title);
    expect(result).toEqual(['Fix bug']);
  });

  it('should trim the search term', () => {
    const result = filterTasksBySearch(mixedTasks, '   bug   ').map((t) => t.title);
    expect(result).toEqual(['Fix bug']);
  });

  it('should return every task for an empty search term', () => {
    const result = filterTasksBySearch(mixedTasks, '').map((t) => t.id);
    expect(result).toEqual(['1', '2', '3', '4']);
  });

  it('should return no tasks when nothing matches', () => {
    expect(filterTasksBySearch(mixedTasks, 'nothing matches this')).toEqual([]);
  });

  it('should return a new array', () => {
    expect(filterTasksBySearch(mixedTasks, '')).not.toBe(mixedTasks);
  });
});

describe('filterTasksByStatus', () => {
  it('should keep only tasks with the given status', () => {
    const result = filterTasksByStatus(mixedTasks, 'todo').map((t) => t.id);
    expect(result).toEqual(['1', '4']);
  });

  it('should keep every task for "all"', () => {
    const result = filterTasksByStatus(mixedTasks, 'all').map((t) => t.id);
    expect(result).toEqual(['1', '2', '3', '4']);
  });

  it('should return a new array for "all"', () => {
    expect(filterTasksByStatus(mixedTasks, 'all')).not.toBe(mixedTasks);
  });
});

describe('filterTasksByPriority', () => {
  it('should keep only tasks with the given priority', () => {
    const result = filterTasksByPriority(mixedTasks, 'high').map((t) => t.id);
    expect(result).toEqual(['2', '4']);
  });

  it('should keep every task for "all"', () => {
    const result = filterTasksByPriority(mixedTasks, 'all').map((t) => t.id);
    expect(result).toEqual(['1', '2', '3', '4']);
  });

  it('should return a new array for "all"', () => {
    expect(filterTasksByPriority(mixedTasks, 'all')).not.toBe(mixedTasks);
  });
});

describe('computeStats', () => {
  it('should count tasks by status, overdue tasks and the completion rate', () => {
    expect(computeStats(mixedTasks, TODAY)).toEqual({
      total: 4,
      todo: 2,
      inProgress: 1,
      done: 1,
      overdue: 1,
      completionRate: 25,
    });
  });

  it('should return a zero completion rate for an empty list rather than NaN', () => {
    expect(computeStats([], TODAY)).toEqual({
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      overdue: 0,
      completionRate: 0,
    });
  });

  it('should report a completion rate of 100 when every task is done', () => {
    const tasks = [
      createTask({ id: '1', status: 'done' }),
      createTask({ id: '2', status: 'done' }),
    ];

    expect(computeStats(tasks, TODAY).completionRate).toBe(100);
  });

  it('should express the completion rate as a percentage', () => {
    const tasks = [
      createTask({ id: '1', status: 'done' }),
      createTask({ id: '2', status: 'todo' }),
      createTask({ id: '3', status: 'todo' }),
      createTask({ id: '4', status: 'todo' }),
    ];

    expect(computeStats(tasks, TODAY).completionRate).toBe(25);
  });

  it('should not count done tasks as overdue', () => {
    const tasks = [createTask({ id: '1', status: 'done', dueDate: '2026-11-05' })];

    expect(computeStats(tasks, TODAY).overdue).toBe(0);
  });
});

describe('isOverdue', () => {
  it('should be true for a past due date on an unfinished task', () => {
    expect(isOverdue('2026-11-10', 'todo', TODAY)).toBe(true);
    expect(isOverdue('2026-11-10', 'in_progress', TODAY)).toBe(true);
  });

  it('should be false for a done task', () => {
    expect(isOverdue('2026-11-10', 'done', TODAY)).toBe(false);
  });

  it('should be false for a future due date', () => {
    expect(isOverdue('2026-11-20', 'todo', TODAY)).toBe(false);
  });

  it('should be false without a due date', () => {
    expect(isOverdue(null, 'todo', TODAY)).toBe(false);
  });

  it('should be false when the due date is today', () => {
    expect(isOverdue(TODAY, 'todo', TODAY)).toBe(false);
  });
});

describe('getTodayISO', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should pad single digit months and days', () => {
    // Built from local date parts, so the expected value holds in any timezone.
    vi.setSystemTime(new Date(2026, 0, 5, 12, 0, 0));

    expect(getTodayISO()).toBe('2026-01-05');
  });

  it('should format two digit months and days', () => {
    vi.setSystemTime(new Date(2026, 10, 15, 12, 0, 0));

    expect(getTodayISO()).toBe('2026-11-15');
  });
});
