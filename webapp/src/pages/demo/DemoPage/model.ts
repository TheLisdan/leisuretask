import { addDays, addHours, format } from 'date-fns';

export type DemoTaskStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export type DemoTask = {
  id: string;
  title: string;
  status: DemoTaskStatus;
  createdAt: string;
  order: number;
  serialNumber: number;
  award: number;
  deadline?: string;
  note: string;
};

export type DemoState = {
  version: 1;
  user: {
    name: string;
    email: string;
    avaiableTime: number;
    timerActive: boolean;
    lastTimerUpdate: string;
  };
  selectedTaskId: string;
  tasks: DemoTask[];
};

export type DemoLayout = {
  left: number;
  right: number;
};

export type DemoDragItem = {
  id: string;
  index: number;
  status: DemoTaskStatus;
};

export const DEMO_STORAGE_KEY = 'leisuretask.demo.v1';
export const DEMO_LAYOUT_STORAGE_KEY = 'leisuretask.demo.layout.v1';
export const DEMO_TASK_DND_TYPE = 'DEMO_TASK';
export const TIME_OPTIONS = [5, 10, 15, 30, 45, 60, 90, 120];
export const DEFAULT_LAYOUT: DemoLayout = { left: 292, right: 360 };
export const LEFT_PANEL_RANGE = { min: 220, max: 360 };
export const RIGHT_PANEL_RANGE = { min: 300, max: 480 };

export const statusLabels: Record<DemoTaskStatus, string> = {
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export const formatTime = (seconds: number) => {
  const validSeconds = Math.max(0, seconds);
  const hours = Math.floor(validSeconds / 3600);
  const minutes = Math.floor((validSeconds % 3600) / 60);
  const remainingSeconds = validSeconds % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

export const toDateTimeLocal = (value?: string) => {
  if (!value) {
    return '';
  }

  return format(new Date(value), "yyyy-MM-dd'T'HH:mm");
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const sortTasks = (tasks: DemoTask[]) =>
  [...tasks].sort(
    (a, b) => a.order - b.order || a.serialNumber - b.serialNumber
  );

export const getGroupedTasks = (tasks: DemoTask[]) => ({
  IN_PROGRESS: sortTasks(tasks).filter((task) => task.status === 'IN_PROGRESS'),
  COMPLETED: sortTasks(tasks).filter((task) => task.status === 'COMPLETED'),
  FAILED: sortTasks(tasks).filter((task) => task.status === 'FAILED'),
});

export const getNextSelectedTaskId = (
  tasks: DemoTask[],
  preferredId?: string
) => tasks.find((task) => task.id === preferredId)?.id ?? tasks[0]?.id ?? '';

export const reorderTasks = (
  tasks: DemoTask[],
  fromTaskId: string,
  toTaskId: string
) => {
  const sortedTasks = sortTasks(tasks);
  const fromIndex = sortedTasks.findIndex((task) => task.id === fromTaskId);
  const toIndex = sortedTasks.findIndex((task) => task.id === toTaskId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return tasks;
  }

  const reordered = [...sortedTasks];
  const [movedTask] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, movedTask);

  return reordered.map((task, order) => ({ ...task, order }));
};

export const createSeedState = (): DemoState => {
  const now = new Date();
  const tasks: DemoTask[] = [
    {
      id: 'case-study',
      title: 'Ship product case study',
      status: 'IN_PROGRESS',
      createdAt: now.toISOString(),
      order: 0,
      serialNumber: 1,
      award: 45 * 60,
      deadline: addHours(now, 4).toISOString(),
      note: 'Turn the strongest technical work into a crisp public story.',
    },
    {
      id: 'ui-polish',
      title: 'Polish dashboard empty states',
      status: 'IN_PROGRESS',
      createdAt: now.toISOString(),
      order: 1,
      serialNumber: 2,
      award: 30 * 60,
      deadline: addDays(now, 1).toISOString(),
      note: 'Make the product feel intentional even before the user has data.',
    },
    {
      id: 'deploy-docs',
      title: 'Write zero-cost deploy guide',
      status: 'IN_PROGRESS',
      createdAt: now.toISOString(),
      order: 2,
      serialNumber: 3,
      award: 20 * 60,
      deadline: addDays(now, 2).toISOString(),
      note: 'Document the exact static deploy path for a frontend-only build.',
    },
    {
      id: 'trpc-tests',
      title: 'Verify tRPC route contracts',
      status: 'COMPLETED',
      createdAt: addDays(now, -2).toISOString(),
      order: 3,
      serialNumber: 4,
      award: 35 * 60,
      deadline: addDays(now, -1).toISOString(),
      note: 'Backend remains part of the architecture story, even in demo mode.',
    },
    {
      id: 'legacy-container-deploy',
      title: 'Retire legacy container deploy',
      status: 'FAILED',
      createdAt: addDays(now, -4).toISOString(),
      order: 4,
      serialNumber: 5,
      award: 15 * 60,
      deadline: addDays(now, -2).toISOString(),
      note: 'Static hosting is a calmer fit for a lightweight public demo.',
    },
  ];

  return {
    version: 1,
    user: {
      name: 'Lisdan',
      email: 'demo@leisuretask.app',
      avaiableTime: 2 * 3600 + 45 * 60,
      timerActive: false,
      lastTimerUpdate: now.toISOString(),
    },
    selectedTaskId: tasks[0].id,
    tasks,
  };
};

export const readDemoLayout = (): DemoLayout => {
  try {
    const rawLayout = window.localStorage.getItem(DEMO_LAYOUT_STORAGE_KEY);
    if (!rawLayout) {
      return DEFAULT_LAYOUT;
    }

    const parsed = JSON.parse(rawLayout) as Partial<DemoLayout>;
    return {
      left: clamp(
        Number(parsed.left) || DEFAULT_LAYOUT.left,
        LEFT_PANEL_RANGE.min,
        LEFT_PANEL_RANGE.max
      ),
      right: clamp(
        Number(parsed.right) || DEFAULT_LAYOUT.right,
        RIGHT_PANEL_RANGE.min,
        RIGHT_PANEL_RANGE.max
      ),
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
};

export const readDemoState = (): DemoState => {
  try {
    const rawState = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!rawState) {
      return createSeedState();
    }

    const parsed = JSON.parse(rawState) as DemoState;
    if (parsed.version !== 1 || !Array.isArray(parsed.tasks)) {
      return createSeedState();
    }

    return parsed;
  } catch {
    return createSeedState();
  }
};
