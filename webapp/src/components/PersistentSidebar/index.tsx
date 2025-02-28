import React from 'react';
import css from './index.module.scss';

type PersistentSidebarProps = {
  children: React.ReactNode;
};

export const PersistentSidebar: React.FC<PersistentSidebarProps> = ({
  children,
}) => {
  return <aside className={css.sidebar}>{children}</aside>;
};
