import { MapPin, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BRAND_INFO } from '../../data/boutiqueData';

const TRUST_ICONS = [Sparkles, ShieldCheck, Truck, MapPin];

export function BoutiqueTrustAndCollections() {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="trust-heading" className="w-full px-2 sm:px-4 lg:px-6">
      <div className="rounded-xl border border-[#E6DDD0] bg-[#F4EDE2]/75 p-2.5 sm:p-3.5">
        <h2 id="trust-heading" className="sr-only">
          Why Shop With {BRAND_INFO.name}
        </h2>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {t.trustItems.map((item, idx) => {
            const Icon = TRUST_ICONS[idx] || Sparkles;
            return (
              <div
                key={item.title}
                className="flex items-start gap-2.5 rounded-xl border border-[#E6DDD0] bg-white p-2.5 sm:p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7C1D26]/10 text-[#7C1D26]">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans text-xs sm:text-sm font-semibold text-[#231712]">{item.title}</h3>
                  <p className="text-[11px] leading-snug text-[#635147]">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
