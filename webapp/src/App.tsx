import { TrpcProvider } from './lib/trpc';
import { TodoListPage } from './pages/TodoListPage';

export const App = () => {
  return (
    <TrpcProvider>
      <TodoListPage />
    </TrpcProvider>
  );
};
