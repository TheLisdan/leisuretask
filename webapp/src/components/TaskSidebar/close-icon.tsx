type CloseIconProps = {
  className?: string;
};

export const CloseIcon: React.FC<CloseIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1.81812"
      width="25.713"
      height="2.5713"
      rx="1"
      transform="rotate(45 1.81812 0)"
      fill="currentColor"
    />
    <rect
      y="18.1818"
      width="25.713"
      height="2.5713"
      rx="1"
      transform="rotate(-45 0 18.1818)"
      fill="currentColor"
    />
  </svg>
);
