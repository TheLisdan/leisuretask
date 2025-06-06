import { useState, useEffect, useCallback } from 'react';
import { trpc } from '../../lib/trpc';
import { TaskType } from '../../lib/trpcTypes';

export const useTodoList = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const trpcUtils = trpc.useUtils();
  const createTaskMutation = trpc.createTask.useMutation();
  const deleteTaskMutation = trpc.deleteTask.useMutation();
  const orderTasksMutation = trpc.orderTasks.useMutation();

  const {
    data: getTasksData,
    error: tasksError,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.getTasks.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
    }
  );

  useEffect(() => {
    if (!getTasksData?.pages) {
      return;
    }

    const allTasks = getTasksData.pages.flatMap((page) => page.tasks);
    setTasks(allTasks);
    setSelectedTask(
      (prev) =>
        allTasks.find((task) => task.id === prev?.id) ?? allTasks[0] ?? null
    );
  }, [getTasksData]);

  const moveTask = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= tasks.length ||
        toIndex >= tasks.length
      ) {
        return;
      }
      const updatedTasks = [...tasks];
      const [movedTask] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, movedTask);

      await orderTasksMutation.mutateAsync({
        tasksIds: updatedTasks.map((task) => task.id),
      });

      setTasks(updatedTasks.map((task, index) => ({ ...task, index })));
    },
    [tasks, orderTasksMutation]
  );

  const handleCreateTask = useCallback(
    async (values: { title: string; award: number }) => {
      try {
        setIsModalOpen(false);
        await createTaskMutation.mutateAsync(values);
        await trpcUtils.getTasks.invalidate();
      } catch (err: any) {
        setError(err.message);
        setTimeout(() => setError(null), 5000);
      }
    },
    [createTaskMutation, trpcUtils.getTasks]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        await deleteTaskMutation.mutateAsync({ taskId });
        await trpcUtils.getTasks.invalidate();
      } catch (err: any) {
        setError(err.message);
        setTimeout(() => setError(null), 5000);
      }
    },
    [deleteTaskMutation, trpcUtils.getTasks]
  );

  return {
    tasks,
    selectedTask,
    isLoading,
    tasksError,
    error: error || (isError ? tasksError?.message : null),
    isModalOpen,
    moveTask,
    selectTask: setSelectedTask,
    handleCreateTask,
    handleDeleteTask,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoadingMore: isFetchingNextPage,
  };
};
