import { useTranslation } from 'react-i18next';
import { getSignOutRoute } from '../../../lib/routes';
import { MeType } from '../../../lib/trpcTypes';
import { Avatar } from '../../Avatar';
import { Dropdown } from '../../Dropdown';
import { SettingsIcon } from './settings-icon';
import { SignOutIcon } from './sign-out-icon';

type LayoutDropdownProps = {
  me: MeType;
  setIsSettingsModalOpen: (isOpen: boolean) => void;
};

export const LayoutDropdown: React.FC<LayoutDropdownProps> = ({
  me,
  setIsSettingsModalOpen,
}) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      trigger={
        <button type="button" title="Settings">
          <Avatar user={me} />
        </button>
      }
      align="start"
      items={[
        {
          label: t('settings'),
          icon: <SettingsIcon />,
          onClick: () => {
            setIsSettingsModalOpen(true);
          },
        },
        {
          type: 'separator',
        },
        {
          label: t('signOut'),
          icon: <SignOutIcon />,
          onClick: () => {
            window.location.href = getSignOutRoute();
          },
        },
      ]}
    />
  );
};
