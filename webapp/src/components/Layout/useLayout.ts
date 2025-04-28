import { useState } from 'react';
import { trpc } from '../../lib/trpc';

export const useLayout = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const updateUserNameMutation = trpc.updateUserName.useMutation();
  const updateEmailMutation = trpc.updateEmail.useMutation();
  const changePasswordMutation = trpc.changePassword.useMutation();

  return {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isUpdateEmailModalOpen,
    setIsUpdateEmailModalOpen,
    isChangePasswordModalOpen,
    setIsChangePasswordModalOpen,
    updateUserNameMutation,
    updateEmailMutation,
    changePasswordMutation,
  };
};
