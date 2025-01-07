import { trpc } from '../../lib/trpc';

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
    <div>
      <h2>ToDo list:</h2>
      <ul>
        {data?.tasks.map((task) => {
          return <li key={task.id}>{task.name}</li>;
        })}
      </ul>
    </div>
  );
};
