import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { getLandingRoute, getHomeRoute, getSignUpRoute } from './lib/routes';
import { TrpcProvider } from './lib/trpc';
import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { TodoListPage } from './pages/TodoListPage';
import './styles/global.scss';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={getLandingRoute()} element={<LandingPage />} />
          <Route path={getSignUpRoute()} element={<SignUpPage />} />
          <Route element={<Layout />}>
            <Route path={getHomeRoute()} element={<TodoListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
