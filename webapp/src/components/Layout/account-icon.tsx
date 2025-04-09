type AccountIconProps = {
  className?: string;
};

export const AccountIcon: React.FC<AccountIconProps> = ({ className }) => (
  <svg
    width="19"
    height="20"
    viewBox="0 0 19 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.139 10.7625C14.572 9.666 15.5 7.9435 15.5 6C15.5 2.6865 12.8135 0 9.5 0C6.1865 0 3.5 2.6865 3.5 6C3.5 7.9435 4.428 9.666 5.861 10.7625C2.42 12.2655 0 15.8325 0 20H19C19 15.8325 16.58 12.2655 13.139 10.7625ZM5.5 6C5.5 3.7945 7.2945 2 9.5 2C11.7055 2 13.5 3.7945 13.5 6C13.5 8.2055 11.7055 10 9.5 10C7.2945 10 5.5 8.2055 5.5 6ZM9.5 12C12.9885 12 15.928 14.5535 16.7625 18H2.2375C3.072 14.5535 6.0115 12 9.5 12Z"
      fill="currentColor"
    />
  </svg>
);
