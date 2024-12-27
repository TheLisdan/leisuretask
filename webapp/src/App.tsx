export const App = () => {
  const tasks = [
    { id: 1, name: 'Be cool' },
    { id: 2, name: 'Write an app' },
    { id: 3, name: 'Profit' },
  ];
  return (
    <div>
      <h1>LeisureTask</h1>

      <h2>ToDo list:</h2>
      <ul>
        {tasks.map((task) => {
          return <li key={task.id}>{task.name}</li>;
        })}
      </ul>
    </div>
  );
};
