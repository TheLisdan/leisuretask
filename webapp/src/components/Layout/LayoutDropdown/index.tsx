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
}) => (
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
);
