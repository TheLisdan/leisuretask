import React, { useRef, useState } from 'react';
import css from './index.module.scss';

type PersistentSidebarProps = {
  children: React.ReactNode;
};

export const PersistentSidebar: React.FC<PersistentSidebarProps> = ({
  children,
}) => {
  const [width, setWidth] = useState(270);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const minWidth = 270;
  const maxWidth = 600;

  const startResizing = (event: React.MouseEvent) => {
    if (sidebarRef.current) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const rightEdge = sidebarRect.right;

      if (event.clientX >= rightEdge - 7) {
        event.preventDefault();
        document.body.style.cursor = 'ew-resize';
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
      }
    }
  };

  const resize = (event: MouseEvent) => {
    if (sidebarRef.current) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const newWidth = event.clientX - sidebarRect.left;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    }
  };

  const stopResizing = () => {
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
  };

  return (
    <aside
      className={css.sidebar}
      style={{ width }}
      onMouseDown={startResizing}
      ref={sidebarRef}
    >
      {children}
    </aside>
  );
};
