import { zUpdateAvatarTrpcInput } from '@leisuretask/backend/src/router/auth/updateAvatar/input';
import { zUpdateUserNameTrpcInput } from '@leisuretask/backend/src/router/auth/updateUserName/input';
import { useTranslation } from 'react-i18next';
import { trpc } from '../../../lib/trpc';
import { MeType } from '../../../lib/trpcTypes';
import { Avatar } from '../../Avatar';
import { Form } from '../../Form';
import { Field } from '../../Form/Field';
import { UploadToCloudinary } from '../../Form/UploadToCloudinary';
import { Modal } from '../../Modal';
import { AccountIcon } from './account-icon';
import css from './index.module.scss';

type SettingsModalProps = {
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (isOpen: boolean) => void;
  me: NonNullable<MeType>;
  updateUserNameMutation: any;
  updateAvatarMutation: any;
  setIsUpdateEmailModalOpen: (isOpen: boolean) => void;
  setIsChangePasswordModalOpen: (isOpen: boolean) => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  me,
  updateUserNameMutation,
  updateAvatarMutation,
  setIsUpdateEmailModalOpen,
  setIsChangePasswordModalOpen,
}) => {
  const { t } = useTranslation();
  const trpcUtils = trpc.useUtils();
  return (
    <Modal
      isOpen={isSettingsModalOpen}
      onClose={() => setIsSettingsModalOpen(false)}
      sidebarItems={[
        {
          label: t('account'),
          icon: <AccountIcon />,
          tabName: 'account',
          content: (
            <div className={css.accountSettings}>
              <Form
                validationSchema={zUpdateAvatarTrpcInput}
                initialValues={{ avatar: me.avatar }}
                onSubmit={async (avatar) => {
                  const updatedMe =
                    await updateAvatarMutation.mutateAsync(avatar);
                  trpcUtils.getMe.setData(undefined, { me: updatedMe });
                }}
                id="updateAvatarForm"
              >
                <UploadToCloudinary name="avatar" type="avatar">
                  <Avatar user={me} size="big" />
                </UploadToCloudinary>
              </Form>

              <div className="changeName">
                <Form
                  validationSchema={zUpdateUserNameTrpcInput.pick({
                    name: true,
                  })}
                  initialValues={{ name: me.name }}
                  onSubmit={async (name) => {
                    const updatedMe =
                      await updateUserNameMutation.mutateAsync(name);
                    trpcUtils.getMe.setData(undefined, { me: updatedMe });
                  }}
                  id="updateNameForm"
                >
                  <Field name="name" mode="inline" marginBottom />
                </Form>
              </div>

              <div className={css.changeSetting}>
                <div className={css.changeSettingLeft}>{t('email')}</div>
                <div className={css.changeSettingRight}>
                  <span className={css.changeSettingText}>{me.email}</span>
                  <button
                    type="button"
                    className={css.changeSettingButton}
                    onClick={() => setIsUpdateEmailModalOpen(true)}
                  >
                    {t('changeEmail')}
                  </button>
                </div>
              </div>

              <div className={css.changeSetting}>
                <div className={css.changeSettingLeft}>{t('password')}</div>
                <div className={css.changeSettingRight}>
                  <button
                    type="button"
                    className={css.changeSettingButton}
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    {t('changePassword')}
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
