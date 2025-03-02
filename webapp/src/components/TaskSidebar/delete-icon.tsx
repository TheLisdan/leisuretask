type DeleteIconProps = {
  className?: string;
};

export const DeleteIcon: React.FC<DeleteIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 4H17V15C17 17.2091 15.2091 19 13 19H7C4.79086 19 3 17.2091 3 15V4Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <mask id="path-2-inside-1_231_24" fill="white">
      <path d="M0 4C0 3.44772 0.447715 3 1 3H19C19.5523 3 20 3.44772 20 4V4C20 4.55228 19.5523 5 19 5H1C0.447716 5 0 4.55228 0 4V4Z" />
    </mask>
    <path
      d="M0 4C0 3.44772 0.447715 3 1 3H19C19.5523 3 20 3.44772 20 4V4C20 4.55228 19.5523 5 19 5H1C0.447716 5 0 4.55228 0 4V4Z"
      fill="currentColor"
    />
    <path
      d="M1 5H19V1H1V5ZM19 3H1V7H19V3ZM1 3C1.55228 3 2 3.44771 2 4H-2C-2 5.65685 -0.656853 7 1 7V3ZM18 4C18 3.44772 18.4477 3 19 3V7C20.6569 7 22 5.65685 22 4H18ZM19 5C18.4477 5 18 4.55229 18 4H22C22 2.34315 20.6569 1 19 1V5ZM1 1C-0.656854 1 -2 2.34315 -2 4H2C2 4.55228 1.55228 5 1 5V1Z"
      fill="currentColor"
      mask="url(#path-2-inside-1_231_24)"
    />
    <mask id="path-4-inside-2_231_24" fill="white">
      <path d="M5 3C5 1.34315 6.34315 0 8 0H12C13.6569 0 15 1.34315 15 3V3H5V3Z" />
    </mask>
    <path
      d="M3 3C3 0.238576 5.23858 -2 8 -2H12C14.7614 -2 17 0.238576 17 3H13C13 2.44772 12.5523 2 12 2H8C7.44772 2 7 2.44772 7 3H3ZM15 3H5H15ZM3 3C3 0.238576 5.23858 -2 8 -2V2C7.44772 2 7 2.44772 7 3H3ZM12 -2C14.7614 -2 17 0.238576 17 3H13C13 2.44772 12.5523 2 12 2V-2Z"
      fill="currentColor"
      mask="url(#path-4-inside-2_231_24)"
    />
    <rect x="7" y="8" width="2" height="7" rx="1" fill="currentColor" />
    <rect x="11" y="8" width="2" height="7" rx="1" fill="currentColor" />
  </svg>
);
