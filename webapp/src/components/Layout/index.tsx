import { Link, Outlet } from 'react-router-dom';
import { getLandingRoute, getTodoListRoute } from '../../lib/routes';

export const Layout = () => {
  return (
    <div>
      <h1>LeisureTask</h1>
      <nav>
        <ul>
          <li>
            <Link to={getLandingRoute()}>Home</Link>
          </li>
          <li>
            <Link to={getTodoListRoute()}>Todo</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
};
