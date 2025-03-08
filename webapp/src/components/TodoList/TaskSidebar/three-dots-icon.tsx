type ThreeDotsIconProps = {
  className?: string;
};

export const ThreeDotsIcon: React.FC<ThreeDotsIconProps> = ({ className }) => (
  <svg
    width="20"
    height="5"
    viewBox="0 0 20 5"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="2.45902"
      cy="2.45901"
      r="2.45902"
      transform="rotate(-90 2.45902 2.45901)"
      fill="currentColor"
    />
    <circle
      cx="10"
      cy="2.45901"
      r="2.45902"
      transform="rotate(-90 10 2.45901)"
      fill="currentColor"
    />
    <circle
      cx="17.5409"
      cy="2.45901"
      r="2.45902"
      transform="rotate(-90 17.5409 2.45901)"
      fill="currentColor"
    />
  </svg>
);
