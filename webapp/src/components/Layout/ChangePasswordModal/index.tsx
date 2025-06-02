import { zChangePasswordTrpcInput } from '@leisuretask/backend/src/router/auth/changePassword/input';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  zPasswordsMustBeTheSame,
  zStringMin,
} from '../../../../../shared/src/zod';
import { Form } from '../../Form';
import { Field } from '../../Form/Field';
import { Modal } from '../../Modal';

type ChangePasswordModalProps = {
  isChangePasswordModalOpen: boolean;
  setIsChangePasswordModalOpen: (isOpen: boolean) => void;
  changePasswordMutation: any;
};

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isChangePasswordModalOpen,
  setIsChangePasswordModalOpen,
  changePasswordMutation,
}) => {
  const { t } = useTranslation();

  return (
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
        validationSchema={zChangePasswordTrpcInput
          .extend({
            newPasswordAgain: zStringMin(8),
          })
          .superRefine(
            zPasswordsMustBeTheSame('newPassword', 'newPasswordAgain')
          )}
        onSubmit={async ({ newPassword, oldPassword }) => {
          await changePasswordMutation.mutateAsync({
            newPassword,
            oldPassword,
          });
          setIsChangePasswordModalOpen(false);
        }}
        submitButtonText={t('changePassword')}
      >
        <Field
          name="oldPassword"
          label={t('oldPassword')}
          type="password"
          placeholder={t('typeOldPassword')}
          stretch
          marginBottom
        />
        <Field
          name="newPassword"
          label={t('newPassword')}
          type="password"
          placeholder={t('typeNewPassword')}
          stretch
          marginBottom
        />
        <Field
          name="newPasswordAgain"
          label={t('newPasswordAgain')}
          type="password"
          placeholder={t('typeNewPasswordAgain')}
          stretch
          marginBottom
        />
      </Form>
    </Modal>
  );
};
