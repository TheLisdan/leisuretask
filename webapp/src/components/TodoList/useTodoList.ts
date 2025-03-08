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

  const {
    data: tasksData,
    error: tasksError,
    isLoading,
    isFetching,
  } = trpc.getTasks.useQuery();

  useEffect(() => {
    if (!tasksData?.tasks) {
      return;
    }

    setTasks(tasksData.tasks);
    setSelectedTask(
      (prev) =>
        tasksData.tasks.find((task) => task.id === prev?.id) ??
        tasksData.tasks[0] ??
        null
    );
  }, [tasksData]);

  const moveTask = useCallback((fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length
      ) {
        return prev;
      }

      const updatedTasks = [...prev];
      const [movedTask] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, movedTask);

      return updatedTasks.map((task, index) => ({ ...task, index }));
    });
  }, []);

  const handleCreateTask = useCallback(
    async (values: { title: string }) => {
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
    isLoading: isLoading || isFetching,
    tasksError,
    error,
    isModalOpen,
    moveTask,
    selectTask: setSelectedTask,
    handleCreateTask,
    handleDeleteTask,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
  };
};
