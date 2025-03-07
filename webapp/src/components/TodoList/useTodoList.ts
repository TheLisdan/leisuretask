import { useState, useEffect, useCallback } from 'react';
import { trpc } from '../../lib/trpc';
import { TaskType } from '../../lib/trpcTypes';

export const useTodoList = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const createTaskMutation = trpc.createTask.useMutation();
  const trpcUtils = trpc.useUtils();

  const {
    data: tasksData,
    error: tasksError,
    isLoading,
    isFetching,
  } = trpc.getTasks.useQuery();

  useEffect(() => {
    if (tasksData?.tasks) {
      setTasks(tasksData.tasks);
      if (tasksData.tasks.length > 0 && !selectedTask) {
        setSelectedTask(tasksData.tasks[0]);
      }
    }
  }, [tasksData, selectedTask]);

  const moveTask = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return;
    }

    setTasks((prevTasks) => {
      if (fromIndex >= prevTasks.length || toIndex >= prevTasks.length) {
        return prevTasks;
      }

      const updatedTasks = [...prevTasks];
      const [movedTask] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, movedTask);

      return updatedTasks.map((task, index) => ({ ...task, index }));
    });
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCreateTask = useCallback(
    async (values: { title: string }) => {
      try {
        closeModal();
        await createTaskMutation.mutateAsync(values);
        await trpcUtils.getTasks.invalidate();
      } catch (err: any) {
        setError(err.message);
        setTimeout(() => setError(null), 5000);
        throw err;
      }
    },
    [createTaskMutation, trpcUtils.getTasks]
  );

  const selectTask = useCallback((task: TaskType) => {
    setSelectedTask(task);
  }, []);

  return {
    tasks,
    selectedTask,
    isLoading: isLoading || isFetching,
    tasksError,
    error,
    isModalOpen,
    moveTask,
    selectTask,
    handleCreateTask,
    openModal,
    closeModal,
  };
};
