import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import css from './index.module.scss';

type DropdownProps = {
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  items?: {
    label?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    type?: 'item' | 'separator';
  }[];
};

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  align = 'end',
  items = [],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <AnimatePresence>
        {isDropdownOpen && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content asChild align={align}>
              <motion.div
                className={css.dropdownMenu}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {items.map((item, index) => {
                  if (item.type === 'separator') {
                    return (
                      <DropdownMenu.Separator
                        key={index}
                        className={css.dropdownMenuSeparator}
                      />
                    );
                  }
                  return (
                    <DropdownMenu.Item
                      key={index}
                      className={css.dropdownMenuItem}
                      onClick={item.onClick}
                    >
                      <div className={css.dropdownMenuItemIcon}>
                        {item.icon}
                      </div>
                      {item.label}
                    </DropdownMenu.Item>
                  );
                })}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};
