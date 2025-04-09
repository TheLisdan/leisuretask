import { zUpdateProfileInput } from '@leisuretask/backend/src/router/auth/updateProfile/input';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useMe } from '../../lib/ctx';
import { getHomeRoute } from '../../lib/routes';
import { getSignOutRoute } from '../../lib/routes';
import { trpc } from '../../lib/trpc';
import { Avatar } from '../Avatar';
import { Dropdown } from '../Dropdown';
import { Form } from '../Form';
import { Field } from '../Form/Field';
import { Modal } from '../Modal';
import { AccountIcon } from './account-icon';
import css from './index.module.scss';
import { SettingsIcon } from './settings-icon';
import { SignOutIcon } from './sign-out-icon';
import { TodoLogo } from './todo-logo';

export const Layout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const me = useMe();

  if (!me) {
    return null;
  }

  const updateProfileMutation = trpc.updateProfile.useMutation();
  const trpcUtils = trpc.useUtils();

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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sidebarItems={[
          {
            label: 'Account',
            icon: <AccountIcon />,
            tabName: 'account',
            content: (
              <div className={css.accountSettings}>
                <Avatar user={me} size="large" />

                <Form
                  validationSchema={zUpdateProfileInput.pick({ name: true })}
                  initialValues={{
                    name: me.name,
                  }}
                  onSubmit={async (values) => {
                    const updatedMe =
                      await updateProfileMutation.mutateAsync(values);
                    trpcUtils.getMe.setData(undefined, { me: updatedMe });
                  }}
                  id="updateNameForm"
                >
                  <Field name="name" mode="inline" />
                </Form>
              </div>
            ),
          },
        ]}
      />

      <Outlet />
    </div>
  );
};
