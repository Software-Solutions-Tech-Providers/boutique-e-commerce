import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../context/LanguageContext';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  label: string;
  variant: 'header-desktop' | 'header-mobile' | 'drawer-grid' | 'chatbot';
}

export function LanguageSelector({
  value,
  onChange,
  label,
  variant,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === value) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (variant === 'drawer-grid') {
    return (
      <div className="rounded-xl border border-[#E6DDD0] bg-white p-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#231712]">
            <Globe className="h-3.5 w-3.5 text-[#7C1D26]" />
            {label}
          </span>
          <span className="text-[11px] font-medium text-[#7C1D26]">{currentLang.nativeLabel}</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={label}>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = lang.code === value;
            return (
              <button
                key={lang.code}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(lang.code)}
                className={`flex min-h-[34px] items-center justify-between gap-1 rounded-lg border px-2 py-1 text-left text-xs transition-colors cursor-pointer ${
                  active
                    ? 'border-[#7C1D26] bg-[#7C1D26] font-semibold text-white'
                    : 'border-[#E6DDD0] bg-[#FCF9F4] text-[#231712] hover:border-[#7C1D26]/50'
                }`}
              >
                <span className="truncate">{lang.nativeLabel}</span>
                {active && <Check className="h-3 w-3 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const isChatbot = variant === 'chatbot';
  const isMobileHeader = variant === 'header-mobile';

  return (
    <div ref={containerRef} className={`relative ${isChatbot ? 'flex-1 min-w-0' : 'shrink-0'}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${currentLang.nativeLabel}`}
        className={
          isChatbot
            ? 'flex w-full items-center justify-between gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-semibold text-white hover:bg-white/10 focus:outline-none cursor-pointer'
            : isMobileHeader
              ? 'flex h-9 items-center gap-1 rounded-full border border-[#E6DDD0] bg-white px-2.5 text-[11px] font-semibold text-[#231712] hover:border-[#7C1D26]/50 focus:outline-none cursor-pointer'
              : 'flex h-8 lg:h-9 2xl:h-10 items-center gap-1.5 rounded-full border border-[#E6DDD0] bg-white px-2.5 lg:px-3 text-xs lg:text-sm 2xl:text-base font-medium text-[#231712] hover:border-[#7C1D26]/50 focus:outline-none cursor-pointer'
        }
      >
        {!isChatbot && (
          <Globe
            className={
              isMobileHeader
                ? 'h-3.5 w-3.5 text-[#7C1D26] shrink-0'
                : 'h-3.5 w-3.5 lg:h-4 lg:w-4 text-[#7C1D26] shrink-0'
            }
          />
        )}
        <span className="truncate">{currentLang.nativeLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${
            isChatbot ? 'text-white/85' : 'text-[#635147]'
          } ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute right-0 top-full z-[60] mt-1.5 max-h-[250px] overflow-y-auto rounded-xl border border-[#E6DDD0] bg-white p-1 shadow-xl ${
            isChatbot
              ? 'w-52 max-w-[calc(100vw-32px)]'
              : 'w-48 sm:w-52 2xl:w-60 max-w-[calc(100vw-16px)]'
          }`}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = lang.code === value;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 text-left transition-colors cursor-pointer ${
                  isChatbot ? 'min-h-[32px] py-1' : 'min-h-[36px] py-1.5'
                } ${
                  active
                    ? isChatbot
                      ? 'bg-[#075E54]/10 font-semibold text-[#075E54]'
                      : 'bg-[#F4EDE2] font-semibold text-[#7C1D26]'
                    : 'text-[#231712] hover:bg-[#FCF9F4]'
                }`}
              >
                <span className="text-xs sm:text-sm 2xl:text-base">{lang.nativeLabel}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#635147] shrink-0">
                  <span>{lang.englishName}</span>
                  {active && (
                    <Check
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isChatbot ? 'text-[#075E54]' : 'text-[#7C1D26]'
                      }`}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
