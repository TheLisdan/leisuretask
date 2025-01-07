import { TrpcProvider } from './lib/trpc';
import { LandingPage } from './pages/LandingPage';
import { TodoListPage } from './pages/TodoListPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getLandingRoute, getTodoListRoute } from './lib/routes';
import { Layout } from './components/Layout';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={Layout()}>
            <Route path={getLandingRoute()} element={<LandingPage />} />
            <Route path={getTodoListRoute()} element={<TodoListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
