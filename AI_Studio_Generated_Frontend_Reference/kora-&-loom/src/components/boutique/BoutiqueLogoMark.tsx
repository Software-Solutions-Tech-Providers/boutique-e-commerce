interface BoutiqueLogoMarkProps {
  className?: string;
}

export function BoutiqueLogoMark({ className = 'h-8 w-8' }: BoutiqueLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="40" height="40" rx="10" fill="#7C1D26" />
      <rect x="2" y="2" width="36" height="36" rx="8" stroke="#FDE68A" strokeOpacity="0.45" strokeWidth="1.2" />
      <path
        d="M20 8L30 20L20 32L10 20L20 8Z"
        stroke="#FDE68A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 13.5L25.5 20L20 26.5L14.5 20L20 13.5Z"
        fill="#FDE68A"
      />
    </svg>
  );
}
