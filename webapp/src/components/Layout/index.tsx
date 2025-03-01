import { Link, Outlet } from 'react-router-dom';
import { getHomeRoute } from '../../lib/routes';
import css from './index.module.scss';
import { TodoLogo } from './todo-logo';

export const Layout = () => {
  // Layout component
  return (
    <div className={css.layout}>
      <nav className={css.navigation}>
        <Link to={getHomeRoute()} className={css.link}>
          <TodoLogo className={css.logo} />
        </Link>
      </nav>

      <Outlet />
    </div>
  );
};
