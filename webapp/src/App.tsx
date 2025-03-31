import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppContextProvider } from './lib/ctx';
import {
  getLandingRoute,
  getHomeRoute,
  getSignUpRoute,
  getSignInRoute,
  getSignOutRoute,
} from './lib/routes';
import { TrpcProvider } from './lib/trpc';
import { LandingPage } from './pages/LandingPage';
import { NotFoundPage } from './pages/NotFoundPage/index.tsx';
import { SignInPage } from './pages/SignInPage';
import { SignOutPage } from './pages/SignOutPage';
import { SignUpPage } from './pages/SignUpPage';
import { TodoListPage } from './pages/TodoListPage';
import './styles/global.scss';

export const App = () => {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={getSignOutRoute()} element={<SignOutPage />} />
            <Route path={getLandingRoute()} element={<LandingPage />} />
            <Route path={getSignUpRoute()} element={<SignUpPage />} />
            <Route path={getSignInRoute()} element={<SignInPage />} />
            <Route element={<Layout />}>
              <Route path={getHomeRoute()} element={<TodoListPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  );
};
