import { Link, Outlet } from 'react-router-dom';
import { TimerLogo } from '../../../assets/timer-logo';
import { useMe } from '../../lib/ctx';
import { getHomeRoute } from '../../lib/routes';
import { ChangePasswordModal } from './ChangePasswordModal';
import { LayoutDropdown } from './LayoutDropdown';
import { SettingsModal } from './SettingsModal';
import { UpdateEmailModal } from './UpdateEmailModal';
import css from './index.module.scss';
import { useLayout } from './useLayout';

export const Layout = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isUpdateEmailModalOpen,
    setIsUpdateEmailModalOpen,
    isChangePasswordModalOpen,
    setIsChangePasswordModalOpen,
    updateUserNameMutation,
    updateEmailMutation,
    updateAvatarMutation,
    changePasswordMutation,
  } = useLayout();

  const me = useMe();

  if (!me) {
    return null;
  }

  return (
    <div className={css.layout}>
      <nav className={css.navigation}>
        <div className={css.routes}>
          <Link to={getHomeRoute()} className={css.link}>
            <TimerLogo className={css.logo} />
          </Link>
        </div>

        <LayoutDropdown
          me={me}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        />
      </nav>

      <SettingsModal
        isSettingsModalOpen={isSettingsModalOpen}
        me={me}
        setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
        setIsUpdateEmailModalOpen={setIsUpdateEmailModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        updateUserNameMutation={updateUserNameMutation}
        updateAvatarMutation={updateAvatarMutation}
      />

      <UpdateEmailModal
        isUpdateEmailModalOpen={isUpdateEmailModalOpen}
        setIsUpdateEmailModalOpen={setIsUpdateEmailModalOpen}
        updateEmailMutation={updateEmailMutation}
      />

      <ChangePasswordModal
        changePasswordMutation={changePasswordMutation}
        isChangePasswordModalOpen={isChangePasswordModalOpen}
        setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
      />

      <Outlet />
    </div>
  );
};
