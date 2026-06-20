import { addDays } from 'date-fns';
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clamp,
  createSeedState,
  DEFAULT_LAYOUT,
  DEMO_LAYOUT_STORAGE_KEY,
  DEMO_STORAGE_KEY,
  type DemoLayout,
  type DemoState,
  type DemoTask,
  type DemoTaskStatus,
  getGroupedTasks,
  getNextSelectedTaskId,
  LEFT_PANEL_RANGE,
  readDemoLayout,
  readDemoState,
  reorderTasks,
  RIGHT_PANEL_RANGE,
  sortTasks,
  toDateTimeLocal,
} from './model';

export const useDemoPageState = () => {
  const [state, setState] = useState<DemoState>(() => readDemoState());
  const [layout, setLayout] = useState<DemoLayout>(() => readDemoLayout());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAward, setNewTaskAward] = useState(30);
  const sortedTasks = useMemo(() => sortTasks(state.tasks), [state.tasks]);
  const groupedTasks = useMemo(
    () => getGroupedTasks(state.tasks),
    [state.tasks]
  );
  const selectedTask = useMemo(
    () =>
      sortedTasks.find((task) => task.id === state.selectedTaskId) ??
      sortedTasks[0],
    [sortedTasks, state.selectedTaskId]
  );
  const [draftTitle, setDraftTitle] = useState(selectedTask?.title ?? '');
  const [draftAward, setDraftAward] = useState(
    selectedTask ? Math.round(selectedTask.award / 60) : 30
  );
  const [draftDeadline, setDraftDeadline] = useState(
    toDateTimeLocal(selectedTask?.deadline)
  );

  useEffect(() => {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    window.localStorage.setItem(
      DEMO_LAYOUT_STORAGE_KEY,
      JSON.stringify(layout)
    );
  }, [layout]);

  useEffect(() => {
    if (!state.user.timerActive) {
      return;
    }

    const interval = window.setInterval(() => {
      setState((current) => {
        if (!current.user.timerActive) {
          return current;
        }

        const nextTime = Math.max(0, current.user.avaiableTime - 1);
        return {
          ...current,
          user: {
            ...current.user,
            avaiableTime: nextTime,
            timerActive: nextTime > 0,
            lastTimerUpdate: new Date().toISOString(),
          },
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [state.user.timerActive]);

  useEffect(() => {
    setDraftTitle(selectedTask?.title ?? '');
    setDraftAward(selectedTask ? Math.round(selectedTask.award / 60) : 30);
    setDraftDeadline(toDateTimeLocal(selectedTask?.deadline));
  }, [selectedTask]);

  const updateState = useCallback(
    (updater: (current: DemoState) => DemoState) => {
      setState((current) => updater(current));
    },
    []
  );

  const selectTask = useCallback(
    (taskId: string) => {
      updateState((current) => ({ ...current, selectedTaskId: taskId }));
    },
    [updateState]
  );

  const toggleTimer = useCallback(() => {
    updateState((current) => ({
      ...current,
      user: {
        ...current.user,
        timerActive:
          current.user.avaiableTime > 0 ? !current.user.timerActive : false,
        lastTimerUpdate: new Date().toISOString(),
      },
    }));
  }, [updateState]);

  const toggleComplete = useCallback(
    (taskId: string) => {
      updateState((current) => {
        let timeDelta = 0;
        const tasks = current.tasks.map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          if (task.status === 'COMPLETED') {
            timeDelta = -task.award;
            return { ...task, status: 'IN_PROGRESS' as DemoTaskStatus };
          }

          timeDelta = task.award;
          return { ...task, status: 'COMPLETED' as DemoTaskStatus };
        });

        return {
          ...current,
          tasks,
          selectedTaskId: taskId,
          user: {
            ...current.user,
            avaiableTime: Math.max(0, current.user.avaiableTime + timeDelta),
          },
        };
      });
    },
    [updateState]
  );

  const setTaskStatus = useCallback(
    (taskId: string, status: DemoTaskStatus) => {
      updateState((current) => {
        const tasks = current.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        );

        return { ...current, tasks, selectedTaskId: taskId };
      });
    },
    [updateState]
  );

  const addTask = useCallback(() => {
    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    updateState((current) => {
      const nextSerialNumber =
        Math.max(...current.tasks.map((task) => task.serialNumber), 0) + 1;
      const task: DemoTask = {
        id: `demo-task-${Date.now()}`,
        title,
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString(),
        order: nextSerialNumber,
        serialNumber: nextSerialNumber,
        award: newTaskAward * 60,
        deadline: addDays(new Date(), 1).toISOString(),
        note: 'New demo task. Tune the award and deadline from the detail panel.',
      };

      return {
        ...current,
        tasks: [...current.tasks, task],
        selectedTaskId: task.id,
      };
    });
    setNewTaskTitle('');
  }, [newTaskAward, newTaskTitle, updateState]);

  const saveSelectedTask = useCallback(() => {
    if (!selectedTask || !draftTitle.trim()) {
      return;
    }

    updateState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              title: draftTitle.trim(),
              award: draftAward * 60,
              deadline: draftDeadline
                ? new Date(draftDeadline).toISOString()
                : undefined,
            }
          : task
      ),
    }));
  }, [draftAward, draftDeadline, draftTitle, selectedTask, updateState]);

  const deleteSelectedTask = useCallback(() => {
    if (!selectedTask) {
      return;
    }

    updateState((current) => {
      const tasks = current.tasks.filter((task) => task.id !== selectedTask.id);
      return {
        ...current,
        tasks,
        selectedTaskId: getNextSelectedTaskId(tasks),
      };
    });
  }, [selectedTask, updateState]);

  const moveSelectedTask = useCallback(
    (direction: -1 | 1) => {
      if (!selectedTask) {
        return;
      }

      updateState((current) => {
        const tasks = sortTasks(current.tasks);
        const index = tasks.findIndex((task) => task.id === selectedTask.id);
        const nextTask = tasks[index + direction];

        if (!nextTask) {
          return current;
        }

        return {
          ...current,
          tasks: reorderTasks(current.tasks, selectedTask.id, nextTask.id),
        };
      });
    },
    [selectedTask, updateState]
  );

  const moveTask = useCallback(
    (fromTaskId: string, toTaskId: string) => {
      updateState((current) => ({
        ...current,
        tasks: reorderTasks(current.tasks, fromTaskId, toTaskId),
        selectedTaskId: fromTaskId,
      }));
    },
    [updateState]
  );

  const resetDemo = useCallback(() => {
    setState(createSeedState());
    setNewTaskTitle('');
    setNewTaskAward(30);
    setLayout(DEFAULT_LAYOUT);
  }, []);

  const resizePanel = useCallback((panel: keyof DemoLayout, value: number) => {
    setLayout((current) => ({
      ...current,
      [panel]:
        panel === 'left'
          ? clamp(value, LEFT_PANEL_RANGE.min, LEFT_PANEL_RANGE.max)
          : clamp(value, RIGHT_PANEL_RANGE.min, RIGHT_PANEL_RANGE.max),
    }));
  }, []);

  const startResize = useCallback(
    (panel: keyof DemoLayout, event: ReactPointerEvent<HTMLDivElement>) => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        return;
      }

      event.preventDefault();
      const startX = event.clientX;
      const startLayout = layout;
      const previousCursor = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;

      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';

      const resize = (moveEvent: PointerEvent) => {
        if (panel === 'left') {
          resizePanel('left', startLayout.left + moveEvent.clientX - startX);
          return;
        }

        resizePanel('right', startLayout.right + startX - moveEvent.clientX);
      };

      const stopResize = () => {
        document.body.style.cursor = previousCursor;
        document.body.style.userSelect = previousUserSelect;
        document.removeEventListener('pointermove', resize);
        document.removeEventListener('pointerup', stopResize);
        document.removeEventListener('pointercancel', stopResize);
      };

      document.addEventListener('pointermove', resize);
      document.addEventListener('pointerup', stopResize);
      document.addEventListener('pointercancel', stopResize);
    },
    [layout, resizePanel]
  );

  const handleResizeKeyDown = useCallback(
    (panel: keyof DemoLayout, event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }

      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 16 : -16;
      if (panel === 'left') {
        resizePanel('left', layout.left + delta);
        return;
      }

      resizePanel('right', layout.right - delta);
    },
    [layout, resizePanel]
  );

  const completedCount = groupedTasks.COMPLETED.length;
  const earnedToday = groupedTasks.COMPLETED.reduce(
    (sum, task) => sum + task.award,
    0
  );
  const deadlineCount = groupedTasks.IN_PROGRESS.filter(
    (task) => !!task.deadline
  ).length;
  const pageStyle = {
    '--demo-left-width': `${layout.left}px`,
    '--demo-right-width': `${layout.right}px`,
  } as CSSProperties;

  return {
    state,
    layout,
    pageStyle,
    groupedTasks,
    selectedTask,
    newTaskTitle,
    setNewTaskTitle,
    newTaskAward,
    setNewTaskAward,
    draftTitle,
    setDraftTitle,
    draftAward,
    setDraftAward,
    draftDeadline,
    setDraftDeadline,
    completedCount,
    earnedToday,
    deadlineCount,
    selectTask,
    toggleTimer,
    toggleComplete,
    setTaskStatus,
    addTask,
    saveSelectedTask,
    deleteSelectedTask,
    moveSelectedTask,
    moveTask,
    resetDemo,
    startResize,
    handleResizeKeyDown,
  };
};
