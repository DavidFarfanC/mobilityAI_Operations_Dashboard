type IconProps = React.SVGProps<SVGSVGElement>;

export const MapIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M9 4.5 15 3v16.5L9 21l-6-2.5V2z" />
    <path d="m9 4.5 6-1.5M9 4.5v16.5" />
    <path d="M3 4.5 9 7l6-2.5 6 2.5" />
    <path d="m15 4.5 6-2.5V19l-6 2.5" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </svg>
);

export const BoltIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M13 3 6 14h6l-1 7 7-11h-6z" />
  </svg>
);

export const FlameIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M12 3s-2 2.5-2 5 2 4 2 4" />
    <path d="M12 3s2 2.5 2 5-2 4-2 4" />
    <path d="M12 21a6 6 0 0 1-6-6c0-3 2-5 4-7l2-3 2 3c2 2 4 4 4 7a6 6 0 0 1-6 6z" />
  </svg>
);

export const ArrowUpRight = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M7 17 17 7" />
    <path d="M10 7h7v7" />
  </svg>
);

export const TrainIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <rect x="6" y="3" width="12" height="14" rx="2" />
    <path d="M6 11h12" />
    <circle cx="9" cy="16.5" r="1" />
    <circle cx="15" cy="16.5" r="1" />
    <path d="m8 21 2-2h4l2 2" />
  </svg>
);
