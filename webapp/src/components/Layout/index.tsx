import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useMe } from '../../lib/ctx';
import { getHomeRoute } from '../../lib/routes';
import { getSignOutRoute } from '../../lib/routes';
import { Avatar } from '../Avatar';
import { Dropdown } from '../Dropdown';
import { Modal } from '../Modal';
import css from './index.module.scss';
import { SettingsIcon } from './settings-icon';
import { SignOutIcon } from './sign-out-icon';
import { TodoLogo } from './todo-logo';

export const Layout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const me = useMe();

  return (
    <div className={css.layout}>
      <nav className={css.navigation}>
        <div className={css.routes}>
          <Link to={getHomeRoute()} className={css.link}>
            <TodoLogo className={css.logo} />
          </Link>
        </div>

        <Dropdown
          trigger={
            <button type="button" title="Settings">
              <Avatar user={me} />
            </button>
          }
          align="start"
          items={[
            {
              label: 'Settings',
              icon: <SettingsIcon />,
              onClick: () => {
                setIsModalOpen(true);
              },
            },
            {
              type: 'separator',
            },
            {
              label: 'Sign Out',
              icon: <SignOutIcon />,
              onClick: () => {
                window.location.href = getSignOutRoute();
              },
            },
          ]}
        />
      </nav>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>Settings content will be here</div>
      </Modal>

      <Outlet />
    </div>
  );
};
