import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getLandingRoute, getTodoListRoute } from './lib/routes';
import { TrpcProvider } from './lib/trpc';
import { LandingPage } from './pages/LandingPage';
import { TodoListPage } from './pages/TodoListPage';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={getLandingRoute()} element={<LandingPage />} />
          <Route path={getTodoListRoute()} element={<TodoListPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
