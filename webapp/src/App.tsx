import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { getLandingRoute, getHomeRoute } from './lib/routes';
import { TrpcProvider } from './lib/trpc';
import { LandingPage } from './pages/LandingPage';
import { TodoListPage } from './pages/TodoListPage';
import './styles/global.scss';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={getLandingRoute()} element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path={getHomeRoute()} element={<TodoListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
