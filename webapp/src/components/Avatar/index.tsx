import { getCloudinaryUploadUrl } from '@leisuretask/shared/src/cloudinary';
import cs from 'classnames';
import React, { forwardRef } from 'react';
import { UserType } from '../../lib/trpcTypes';
import css from './index.module.scss';

type AvatarProps = {
  user: UserType;
  size?: 'small' | 'big';
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
            src={getCloudinaryUploadUrl(user.avatar, 'avatar', size)}
            alt={user.name[0]}
            className={cs(css.avatar, {
              [css.small]: size === 'small',
              [css.big]: size === 'big',
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
              [css.big]: size === 'big',
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
