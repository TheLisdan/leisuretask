import { Link } from 'react-router-dom';
import { useMe } from '../../lib/ctx';
import {
  getHomeRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from '../../lib/routes';

export const LandingPage = () => {
  const me = useMe();
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
      {me ? (
        <>
          <Link to={getHomeRoute()}>ToDo list (home)</Link>
          <Link to={getSignOutRoute()}>Sign Out ({me.name})</Link>
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
