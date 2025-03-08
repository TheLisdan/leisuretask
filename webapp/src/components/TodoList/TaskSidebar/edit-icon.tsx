type EditIconProps = {
  className?: string;
};

export const EditIcon: React.FC<EditIconProps> = ({ className }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.94553 13.8366L5.50209 15.1605C5.24087 15.9403 5.98642 16.6823 6.77009 16.4223L8.10041 15.981C8.24805 15.9321 8.3822 15.8495 8.49224 15.74L20.2911 3.99866C20.6826 3.60909 20.6826 2.97747 20.2911 2.5879L19.4042 1.70534C19.0127 1.31577 18.378 1.31577 17.9865 1.70534L6.1877 13.4467C6.07766 13.5562 5.99475 13.6897 5.94553 13.8366Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="0.384089"
      width="0.541863"
      height="2.70932"
      transform="matrix(0.708831 -0.705379 0.708831 0.705379 15.7345 4.32873)"
      stroke="currentColor"
      strokeWidth="0.541863"
    />
    <path
      d="M14.6386 2.08121H6C3.23858 2.08121 1 4.31978 1 7.08121V16.0001C1 18.7615 3.23858 21.0001 6 21.0001H15.0114C17.7729 21.0001 20.0114 18.7615 20.0114 16.0001V6.91603"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
