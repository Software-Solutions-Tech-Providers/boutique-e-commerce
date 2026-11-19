import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export function SafeImage({ src, alt, className = '', fallbackTitle, ...rest }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackTitle || 'Handloom textile preview'}
        className={`flex flex-col items-center justify-center bg-[#F2EFE9] text-[#57534E] p-4 text-center ${className}`}
      >
        <Sparkles className="h-5 w-5 text-[#14532D]/60 mb-2" />
        <span className="font-display text-sm font-semibold text-[#1C1917] line-clamp-2">
          {fallbackTitle || alt || 'Kora & Loom'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
