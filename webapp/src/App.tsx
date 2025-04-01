import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppContextProvider } from './lib/ctx';
import { routes } from './lib/routes';
import { TrpcProvider } from './lib/trpc';
import { SignInPage } from './pages/auth/SignInPage';
import { SignOutPage } from './pages/auth/SignOutPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { LandingPage } from './pages/other/LandingPage/index.tsx';
import { NotFoundPage } from './pages/other/NotFoundPage/index.tsx';
import { TodoListPage } from './pages/todolist/TodoListPage';
import './styles/global.scss';

export const App = () => {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
            <Route path={routes.getLandingRoute()} element={<LandingPage />} />
            <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
            <Route path={routes.getSignInRoute()} element={<SignInPage />} />
            <Route element={<Layout />}>
              <Route path={routes.getHomeRoute()} element={<TodoListPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  );
};
