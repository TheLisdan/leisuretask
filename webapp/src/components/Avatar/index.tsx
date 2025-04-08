import cs from 'classnames';
import React, { forwardRef } from 'react';
import { UserType } from '../../lib/trpcTypes';
import css from './index.module.scss';

type AvatarProps = {
  user: UserType;
  size?: 'small' | 'large';
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ user, size = 'small' }, ref) => {
    if (!user) {
      return <div>User not found</div>;
    }

    if (user.avatar) {
      return (
        <div ref={ref} className={css.avatarContainer}>
          <img
            src={user.avatar}
            alt={user.name[0]}
            className={cs(css.avatar, {
              [css.small]: size === 'small',
              [css.large]: size === 'large',
            })}
          />
        </div>
      );
    } else {
      return (
        <div ref={ref} className={css.avatarContainer}>
          <div
            className={cs(css.avatar, {
              [css.small]: size === 'small',
              [css.large]: size === 'large',
            })}
          >
            {user.name[0].toUpperCase()}
          </div>
        </div>
      );
    }
  }
);

Avatar.displayName = 'Avatar';
