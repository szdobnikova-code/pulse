import { TestBed } from '@angular/core/testing';
import { TaskStore } from './task-store';
import { Task } from '../features/tasks/data/task.model';

/**
 * Sentinel due dates. `stats` reads the real clock via `getTodayISO()`, so these are
 * deliberately far outside any plausible run date -- do not "modernise" them into
 * current-year dates or the `overdue` assertions start depending on when they run.
 */
const OVERDUE_DATE = '2000-01-01';
const FUTURE_DATE = '2999-12-31';

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

/**
 * Shared by reference -- safe because neither the store nor the query utils ever mutate a
 * task. If a test ever needs to mutate one, switch to a factory called per test.
 */
const ALPHA = createTask({
  id: '1',
  title: 'Alpha',
  description: 'first',
  status: 'todo',
  priority: 'low',
  dueDate: OVERDUE_DATE,
  updatedAt: '2026-11-01T00:00:00.000Z',
});

const BRAVO = createTask({
  id: '2',
  title: 'Bravo',
  description: 'second',
  status: 'in_progress',
  priority: 'medium',
  dueDate: FUTURE_DATE,
  updatedAt: '2026-11-02T00:00:00.000Z',
});

const CHARLIE = createTask({
  id: '3',
  title: 'Charlie',
  description: 'third',
  status: 'done',
  priority: 'high',
  dueDate: OVERDUE_DATE,
  updatedAt: '2026-11-03T00:00:00.000Z',
});

const DELTA = createTask({
  id: '4',
  title: 'Delta',
  description: 'fourth',
  status: 'todo',
  priority: 'high',
  dueDate: null,
  updatedAt: '2026-11-04T00:00:00.000Z',
});

function seed(store: TaskStore): void {
  [ALPHA, BRAVO, CHARLIE, DELTA].forEach((task) => store.addTask(task));
}

function titles(tasks: readonly Task[]): string[] {
  return tasks.map((t) => t.title);
}

function ids(tasks: readonly Task[]): string[] {
  return tasks.map((t) => t.id);
}

describe('TaskStore', () => {
  let store: TaskStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(TaskStore);
  });

  describe('initial state', () => {
    it('should start with no tasks', () => {
      expect(store.tasks()).toEqual([]);
      expect(store.visibleTasks()).toEqual([]);
    });

    it('should start with the default query', () => {
      expect(store.taskQuery()).toEqual({
        search: '',
        status: 'all',
        priority: 'all',
        sort: { field: 'updatedAt', direction: 'desc' },
      });
    });

    it('should start with zeroed stats', () => {
      expect(store.stats()).toEqual({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        overdue: 0,
        completionRate: 0,
      });
    });
  });

  describe('addTask and deleteTask', () => {
    it('should append added tasks in insertion order', () => {
      store.addTask(ALPHA);
      expect(store.tasks()).toEqual([ALPHA]);

      store.addTask(DELTA);
      expect(ids(store.tasks())).toEqual(['1', '4']);
    });

    it('should remove a task by id', () => {
      seed(store);

      store.deleteTask('2');

      expect(ids(store.tasks())).toEqual(['1', '3', '4']);
    });

    it('should leave the list unchanged when deleting an unknown id', () => {
      seed(store);

      store.deleteTask('does-not-exist');

      expect(ids(store.tasks())).toEqual(['1', '2', '3', '4']);
    });
  });

  describe('query setters', () => {
    it('should set the search term', () => {
      store.setSearch('bravo');
      expect(store.taskQuery().search).toBe('bravo');
    });

    it('should set the status filter', () => {
      store.setStatus('done');
      expect(store.taskQuery().status).toBe('done');
    });

    it('should set the priority filter', () => {
      store.setPriority('high');
      expect(store.taskQuery().priority).toBe('high');
    });

    it('should set the sort field and direction', () => {
      store.setSort('title', 'asc');
      expect(store.taskQuery().sort).toEqual({ field: 'title', direction: 'asc' });
    });

    it('should keep the other query fields when one setter runs', () => {
      store.setSearch('bravo');
      store.setStatus('todo');

      expect(store.taskQuery()).toEqual({
        search: 'bravo',
        status: 'todo',
        priority: 'all',
        sort: { field: 'updatedAt', direction: 'desc' },
      });
    });
  });

  describe('derived state', () => {
    it('should recompute visible tasks when a task is added', () => {
      store.addTask(ALPHA);
      store.addTask(BRAVO);
      expect(ids(store.visibleTasks())).toEqual(['2', '1']);

      store.addTask(DELTA);

      expect(ids(store.visibleTasks())).toEqual(['4', '2', '1']);
    });

    it('should recompute visible tasks when the search term changes', () => {
      seed(store);
      expect(titles(store.visibleTasks())).toEqual(['Delta', 'Charlie', 'Bravo', 'Alpha']);

      store.setSearch('bravo');

      expect(titles(store.visibleTasks())).toEqual(['Bravo']);
    });

    it('should recompute visible tasks when the status filter changes', () => {
      seed(store);
      expect(titles(store.visibleTasks())).toEqual(['Delta', 'Charlie', 'Bravo', 'Alpha']);

      store.setStatus('todo');

      expect(titles(store.visibleTasks())).toEqual(['Delta', 'Alpha']);
    });

    it('should recompute visible tasks when the sort changes', () => {
      seed(store);
      expect(titles(store.visibleTasks())).toEqual(['Delta', 'Charlie', 'Bravo', 'Alpha']);
      const previousSort = store.taskQuery().sort;

      store.setSort('title', 'asc');

      expect(titles(store.visibleTasks())).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
      expect(previousSort).toEqual({ field: 'updatedAt', direction: 'desc' });
      expect(store.taskQuery().sort).not.toBe(previousSort);
    });

    it('should recompute stats when tasks change', () => {
      expect(store.stats().total).toBe(0);

      store.addTask(ALPHA);
      store.addTask(CHARLIE);
      expect(store.stats()).toEqual({
        total: 2,
        todo: 1,
        inProgress: 0,
        done: 1,
        overdue: 1,
        completionRate: 50,
      });

      store.deleteTask('1');

      expect(store.stats()).toEqual({
        total: 1,
        todo: 0,
        inProgress: 0,
        done: 1,
        overdue: 0,
        completionRate: 100,
      });
    });

    it('should compute stats for the full task list', () => {
      seed(store);

      expect(store.stats()).toEqual({
        total: 4,
        todo: 2,
        inProgress: 1,
        done: 1,
        overdue: 1,
        completionRate: 25,
      });
    });

    it('should not change stats when only the query changes', () => {
      seed(store);
      const before = store.stats();

      store.setStatus('done');
      store.setSearch('bravo');

      expect(store.visibleTasks()).toEqual([]);
      expect(store.stats()).toEqual(before);
    });
  });

  describe('immutability', () => {
    it('should not mutate the previous tasks array when adding', () => {
      store.addTask(ALPHA);
      const before = store.tasks();

      store.addTask(DELTA);

      expect(before).toEqual([ALPHA]);
      expect(store.tasks()).not.toBe(before);
    });

    it('should not mutate the previous tasks array when deleting', () => {
      seed(store);
      const before = store.tasks();

      store.deleteTask('1');

      expect(ids(before)).toEqual(['1', '2', '3', '4']);
      expect(store.tasks()).not.toBe(before);
    });

    it('should not mutate the previous query object when a setter runs', () => {
      const before = store.taskQuery();

      store.setSearch('bravo');

      expect(before.search).toBe('');
      expect(store.taskQuery()).not.toBe(before);
      expect(store.taskQuery().search).toBe('bravo');
    });

    it('should expose visible tasks as a separate array from the task list', () => {
      seed(store);

      expect(store.visibleTasks()).not.toBe(store.tasks());
      expect(ids(store.visibleTasks())).toEqual(['4', '3', '2', '1']);
      expect(ids(store.tasks())).toEqual(['1', '2', '3', '4']);
    });
  });
});
