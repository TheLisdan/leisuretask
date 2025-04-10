import { zChangePasswordInput } from '@leisuretask/backend/src/router/auth/changePassword/input';
import { zUpdateProfileInput } from '@leisuretask/backend/src/router/auth/updateProfile/input';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { z } from 'zod';
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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const me = useMe();

  if (!me) {
    return null;
  }

  const updateProfileMutation = trpc.updateProfile.useMutation();
  const changePasswordMutation = trpc.changePassword.useMutation();
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
                setIsSettingsModalOpen(true);
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
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        sidebarItems={[
          {
            label: 'Account',
            icon: <AccountIcon />,
            tabName: 'account',
            content: (
              <div className={css.accountSettings}>
                <Avatar user={me} size="large" />

                <div className="changeName">
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

                <div className={css.changeSetting}>
                  <div className={css.changeSettingLeft}>Password</div>
                  <div className={css.changeSettingRight}>
                    <button
                      type="button"
                      className={css.changeSettingButton}
                      onClick={() => setIsChangePasswordModalOpen(true)}
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />

      <Modal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      >
        <Form
          id="changePasswordForm"
          initialValues={{
            oldPassword: '',
            newPassword: '',
            newPasswordAgain: '',
          }}
          validationSchema={zChangePasswordInput
            .extend({
              newPasswordAgain: z
                .string()
                .min(8, 'Password must be at least 8 characters long'),
            })
            .superRefine((val, ctx) => {
              if (val.newPassword !== val.newPasswordAgain) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Passwords do not match',
                  path: ['newPasswordAgain'],
                });
              }
            })}
          onSubmit={async ({ newPassword, oldPassword }) => {
            await changePasswordMutation.mutateAsync({
              newPassword,
              oldPassword,
            });
            setIsChangePasswordModalOpen(false);
          }}
          submitButtonText="Change password"
        >
          <Field
            name="oldPassword"
            label="Old password"
            type="password"
            placeholder="Type your old password"
            stretch
          />
          <Field
            name="newPassword"
            label="New password"
            type="password"
            placeholder="Type your new password"
            stretch
          />
          <Field
            name="newPasswordAgain"
            label="New password again"
            type="password"
            placeholder="Type your new password again"
            stretch
          />
        </Form>
      </Modal>

      <Outlet />
    </div>
  );
};
