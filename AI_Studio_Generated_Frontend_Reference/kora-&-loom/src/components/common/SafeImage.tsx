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
        aria-label={alt || fallbackTitle || 'Handpicked saree preview'}
        className={`flex flex-col items-center justify-center bg-[#F4EDE2] text-[#635147] p-4 text-center ${className}`}
      >
        <Sparkles className="h-5 w-5 text-[#7C1D26]/60 mb-2" />
        <span className="font-display text-sm font-semibold text-[#231712] line-clamp-2">
          {fallbackTitle || alt || 'ANIPOO AADAIYAKAM'}
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
