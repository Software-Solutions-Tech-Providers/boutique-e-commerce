import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap min-w-0 max-w-full ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
      >
        {/* Outer architectural loom frame */}
        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Interlocking warp & weft diamond motif */}
        <path
          d="M16 6L24 16L16 26L8 16L16 6Z"
          stroke="var(--accent-gold)"
          strokeWidth="1.6"
        />
        {/* Central weaver shuttle */}
        <path
          d="M12 16C13.8 13.4 18.2 13.4 20 16C18.2 18.6 13.8 18.6 12 16Z"
          fill="var(--accent)"
        />
        <circle cx="16" cy="16" r="1.4" fill="var(--bg-surface)" />
      </svg>
      <span className="font-display text-[19px] sm:text-2xl lg:text-[26px] leading-none font-semibold tracking-tight text-[var(--text-primary)] truncate">
        Vastra Atelier
      </span>
    </span>
  );
};
