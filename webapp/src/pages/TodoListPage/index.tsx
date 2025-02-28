import { useState } from 'react';
import { PersistentSidebar } from '../../components/PersistentSidebar';
import { Task } from '../../components/Task';
import { TaskSidebar } from '../../components/TaskSidebar';
import { trpc } from '../../lib/trpc';
import { TaskType } from '../../lib/trpcTypes';
import css from './index.module.scss';

export const TodoListPage = () => {
  const { data, error, isLoading, isFetching, isError } =
    trpc.getTasks.useQuery();
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  if (isLoading && isFetching) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <>
      <PersistentSidebar>
        <h2>Tuesday, 14th January</h2>
        <p>There will be a calendar</p>
      </PersistentSidebar>

      <div className={css.content}>
        <h1 className={css.bigText}>
          <b>2 hours</b> of free time remaining
        </h1>
        {data?.tasks.map((task) => (
          <Task
            task={task}
            key={task.id}
            onClick={() => {
              setSelectedTask(task);
            }}
          />
        ))}
      </div>

      <TaskSidebar task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  );
};
