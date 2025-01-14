import React from 'react';
import css from './index.module.scss';

type SidebarProps = {
  children: React.ReactNode;
};

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return <aside className={css.sidebar}>{children}</aside>;
};
