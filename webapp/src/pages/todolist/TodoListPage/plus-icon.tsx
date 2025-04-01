import React from 'react';

type PlusIconProps = {
  className?: string;
};

export const PlusIcon: React.FC<PlusIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="9" width="20" height="2" rx="1" fill="currentColor" />
    <rect
      x="9"
      y="20"
      width="20"
      height="2"
      rx="1"
      transform="rotate(-90 9 20)"
      fill="currentColor"
    />
  </svg>
);
