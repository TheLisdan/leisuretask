import { zUpdateUserNameTrpcInput } from '@leisuretask/backend/src/router/auth/updateUserName/input';
import { trpc } from '../../../lib/trpc';
import { MeType } from '../../../lib/trpcTypes';
import { Avatar } from '../../Avatar';
import { Form } from '../../Form';
import { Field } from '../../Form/Field';
import { Modal } from '../../Modal';
import { AccountIcon } from './account-icon';
import css from './index.module.scss';

type SettingsModalProps = {
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (isOpen: boolean) => void;
  me: NonNullable<MeType>;
  updateUserNameMutation: any;
  setIsUpdateEmailModalOpen: (isOpen: boolean) => void;
  setIsChangePasswordModalOpen: (isOpen: boolean) => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  me,
  updateUserNameMutation,
  setIsUpdateEmailModalOpen,
  setIsChangePasswordModalOpen,
}) => {
  const trpcUtils = trpc.useUtils();
  return (
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
                  validationSchema={zUpdateUserNameTrpcInput.pick({
                    name: true,
                  })}
                  initialValues={{
                    name: me.name,
                  }}
                  onSubmit={async (name) => {
                    const updatedMe =
                      await updateUserNameMutation.mutateAsync(name);
                    trpcUtils.getMe.setData(undefined, { me: updatedMe });
                  }}
                  id="updateNameForm"
                >
                  <Field name="name" mode="inline" />
                </Form>
              </div>

              <div className={css.changeSetting}>
                <div className={css.changeSettingLeft}>E-Mail</div>
                <div className={css.changeSettingRight}>
                  <span className={css.changeSettingText}>{me.email}</span>
                  <button
                    type="button"
                    className={css.changeSettingButton}
                    onClick={() => setIsUpdateEmailModalOpen(true)}
                  >
                    Change E-Mail
                  </button>
                </div>
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
  );
};
