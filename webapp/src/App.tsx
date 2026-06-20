import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppContextProvider } from './lib/ctx';
import { MixpanelUser } from './lib/mixpanel';
import { routes } from './lib/routes';
import { SentryUser } from './lib/sentry';
import { TrpcProvider } from './lib/trpc';
import { SignInPage } from './pages/auth/SignInPage';
import { SignOutPage } from './pages/auth/SignOutPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { DemoPage } from './pages/demo/DemoPage';
import { LandingPage } from './pages/other/LandingPage';
import { NotFoundPage } from './pages/other/NotFoundPage';
import { TodoListPage } from './pages/todolist/TodoListPage';
import './styles/global.scss';
import './i18n/config';

const FullstackProviders = () => (
  <TrpcProvider>
    <AppContextProvider>
      <SentryUser />
      <MixpanelUser />
      <Outlet />
    </AppContextProvider>
  </TrpcProvider>
);

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.getLandingRoute()} element={<LandingPage />} />
        <Route path={routes.getDemoRoute()} element={<DemoPage />} />
        <Route element={<FullstackProviders />}>
          <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
          <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
          <Route path={routes.getSignInRoute()} element={<SignInPage />} />
          <Route element={<Layout />}>
            <Route path={routes.getHomeRoute()} element={<TodoListPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
