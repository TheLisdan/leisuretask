import { Link } from 'react-router-dom';
import {
  getHomeRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from '../../lib/routes';
import { trpc } from '../../lib/trpc';

export const LandingPage = () => {
  const { data, isLoading, isFetching, isError } = trpc.getMe.useQuery();
  return (
    <>
      <h2>Manage your tasks with ease</h2>
      <p>
        LeisureTask is a task management app that helps you keep track of your
        tasks and manage them with ease.
      </p>
      <p>
        Get started by creating an account or logging in to an existing one.
      </p>
      {isLoading || isFetching || isError ? null : data.me ? (
        <>
          <Link to={getHomeRoute()}>ToDo list (home)</Link>
          <Link to={getSignOutRoute()}>Sign Out ({data.me.name})</Link>
        </>
      ) : (
        <>
          <Link to={getSignUpRoute()}>Sign Up</Link>
          <Link to={getSignInRoute()}>Sign In</Link>
        </>
      )}
    </>
  );
};
