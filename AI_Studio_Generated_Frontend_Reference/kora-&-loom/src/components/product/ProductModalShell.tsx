import React, { useEffect } from 'react';

interface ProductModalShellProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  maxWidthClass?: string;
  panelClassName?: string;
  backdropClassName?: string;
  fullScreenOnMobile?: boolean;
  children: React.ReactNode;
}

/**
 * Shared accessible modal wrapper with Escape-to-close, backdrop dismissal,
 * body scroll locking, and dynamic viewport (`dvh`) + safe-area handling
 * across iOS, Android, and desktop screens.
 */
export function ProductModalShell({
  open,
  onClose,
  ariaLabel,
  maxWidthClass = 'max-w-lg',
  panelClassName = 'bg-white p-4 sm:p-6',
  backdropClassName = 'bg-black/60',
  fullScreenOnMobile = false,
  children,
}: ProductModalShellProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`kl-modal-backdrop fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs ${
        fullScreenOnMobile
          ? 'p-0 sm:p-4 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]'
          : 'p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]'
      } ${backdropClassName}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className={`kl-modal-panel w-full ${maxWidthClass} overflow-y-auto overscroll-contain shadow-2xl ${
          fullScreenOnMobile
            ? 'h-[100dvh] max-h-[100dvh] rounded-none border-0 sm:h-auto sm:max-h-[92dvh] sm:rounded-xl sm:border sm:border-[#E5E0D8]'
            : 'max-h-[90dvh] rounded-xl border border-[#E5E0D8]'
        } ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
