import { Sidebar } from '../../components/Sidebar';
import { Task } from '../../components/Task';
import { trpc } from '../../lib/trpc';
import css from './index.module.scss';

export const TodoListPage = () => {
  const { data, error, isLoading, isFetching, isError } =
    trpc.getTasks.useQuery();
  if (isLoading && isFetching) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <>
      <Sidebar>
        <h2>Tuesday, 14th January</h2>
        <p>There will be a calendar</p>
      </Sidebar>

      <div className={css.content}>
        <h1 className={css.bigText}>
          <b>2 hours</b> of free time remaining
        </h1>
        {data?.tasks.map((task) => <Task task={task} key={task.id} />)}
      </div>
    </>
  );
};
