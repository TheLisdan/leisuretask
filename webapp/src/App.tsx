import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import {
  getLandingRoute,
  getHomeRoute,
  getSignUpRoute,
  getSignInRoute,
} from './lib/routes';
import { TrpcProvider } from './lib/trpc';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
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
          <Route path={getSignInRoute()} element={<SignInPage />} />
          <Route element={<Layout />}>
            <Route path={getHomeRoute()} element={<TodoListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
