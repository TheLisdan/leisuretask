import cn from 'classnames';
import React from 'react';
import css from './index.module.scss';

type LoaderProps = {
  type?: 'fullscreen' | 'inline';
};

export const Loader: React.FC<LoaderProps> = ({ type = 'fullscreen' }) => (
  <div
    className={cn({
      [css.loader]: true,
      [css[`type-${type}`]]: true,
    })}
  />
);
