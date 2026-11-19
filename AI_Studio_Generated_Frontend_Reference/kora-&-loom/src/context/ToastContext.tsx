import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

interface ToastItem {
  id: number;
  message: string;
  tone: 'success' | 'info';
}

interface ToastContextValue {
  showToast: (message: string, tone?: 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, tone: 'success' | 'info' = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-lg border border-[#E5E0D8] bg-white px-4 py-3 text-sm text-[#1C1917] shadow-lg"
          >
            {toast.tone === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#14532D]" />
            ) : (
              <Info className="h-4 w-4 shrink-0 text-[#B45309]" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="ml-1 rounded p-1 text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
