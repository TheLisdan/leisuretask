import { Link } from 'react-router-dom';
import { getTodoListRoute } from '../../lib/routes';

export const LandingPage = () => {
  return (
    <div>
      <h1>LeisureTask</h1>
      <h2>Manage your tasks with ease</h2>
      <p>
        LeisureTask is a task management app that helps you keep track of your
        tasks and manage them with ease.
      </p>
      <p>
        Get started by creating an account or logging in to an existing one. Or
        click a <Link to={getTodoListRoute()}>link</Link>
      </p>
    </div>
  );
};
