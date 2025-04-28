import { zChangePasswordTrpcInput } from '@leisuretask/backend/src/router/auth/changePassword/input';
import React from 'react';
import { z } from 'zod';
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
}) => (
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
);
