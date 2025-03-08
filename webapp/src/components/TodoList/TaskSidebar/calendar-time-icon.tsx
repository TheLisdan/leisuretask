type CalendarTimeIconProps = {
  className?: string;
};

export const CalendarTimeIcon: React.FC<CalendarTimeIconProps> = ({
  className,
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="1"
      width="15.5439"
      height="15.5439"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="0.350877"
      y="4.56139"
      width="16.8421"
      height="0.701754"
      stroke="currentColor"
      strokeWidth="0.701754"
    />
    <circle cx="15.7895" cy="15.7894" r="4.21053" fill="currentColor" />
    <rect
      x="15.4386"
      y="13.6842"
      width="0.701754"
      height="2.80702"
      fill="white"
    />
    <rect
      x="15.4386"
      y="16.4912"
      width="0.701754"
      height="2.80702"
      transform="rotate(-90 15.4386 16.4912)"
      fill="white"
    />
  </svg>
);
