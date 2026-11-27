import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, ShieldCheck, Sparkles, Tag, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  BOUTIQUE_CATEGORIES,
  BOUTIQUE_IMAGES,
  BoutiqueCategory,
  SPECIAL_BOUTIQUE_COLLECTIONS,
} from '../../data/boutiqueData';
import { SafeImage } from '../common/SafeImage';

interface BoutiqueHeroBannerProps {
  onShopBestsellers: () => void;
  onShopBridal: () => void;
}

export function BoutiqueHeroBanner({ onShopBestsellers, onShopBridal }: BoutiqueHeroBannerProps) {
  const { t } = useLanguage();

  const heroDetails = [
    { icon: Sparkles, label: t.trustItems[0]?.title || 'Handpicked Loom Selection' },
    { icon: ShieldCheck, label: t.trustItems[1]?.title || 'Blouse Piece Included' },
    { icon: Truck, label: t.freeDeliveryLine },
    { icon: Tag, label: t.paymentMethodsLine },
  ];

  return (
    <section id="top" className="w-full">
      <div className="relative w-full overflow-hidden bg-[#1D120D] h-[calc(100svh-166px)] min-h-[430px] md:h-[calc(100svh-136px)] md:min-h-[500px] 2xl:h-[calc(100svh-148px)]">
        {/* Full-width, full-height hero image anchored on upper-center so model's face is never cropped */}
        <SafeImage
          src={BOUTIQUE_IMAGES.hero}
          alt="Handpicked emerald Kanchipuram silk saree draped in sunlit courtyard"
          className="h-full w-full object-cover object-[49%_10%]"
        />

        {/* Responsive scrim: bottom-up on mobile portrait to leave model's face & upper saree clear; left-to-right on wider screens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#1A0E0A]/90 via-[#1A0E0A]/35 to-transparent sm:bg-gradient-to-r sm:from-[#1A0E0A]/80 sm:via-[#1A0E0A]/30 sm:to-transparent"
        />

        {/* Headline & Action Buttons */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end px-4 pb-10 sm:justify-center sm:px-6 sm:pb-0 lg:px-8">
          <div className="max-w-md lg:max-w-lg space-y-2.5 sm:space-y-3.5 text-white">
            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-semibold leading-[1.1] text-balance drop-shadow-xs">
              {t.heroTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={onShopBestsellers}
                className="inline-flex min-h-[42px] sm:min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#7C1D26] px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5E141B] cursor-pointer"
              >
                <span>{t.shopSarees}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onShopBridal}
                className="inline-flex min-h-[42px] sm:min-h-[44px] items-center justify-center rounded-lg border border-white/50 bg-black/30 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-xs hover:bg-white/15 transition-colors cursor-pointer"
              >
                {t.bridalCombos}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Details Strip Directly After Bottom of Hero Banner */}
      <div className="w-full border-y border-[#E6DDD0] bg-[#231712] text-[#FCF9F4] px-2 py-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 lg:grid-cols-4 lg:gap-4">
          {heroDetails.map((detail) => {
            const Icon = detail.icon;
            return (
              <div
                key={detail.label}
                className="flex items-center justify-start lg:justify-center gap-1.5 text-[11px] sm:text-xs font-medium text-[#FCF9F4]"
              >
                <Icon className="h-3.5 w-3.5 text-[#FDE68A] shrink-0" />
                <span className="truncate">{detail.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface BoutiqueStickyCategoryNavProps {
  activeCategory: 'All' | BoutiqueCategory;
  onSelectCategory: (cat: 'All' | BoutiqueCategory) => void;
}

export function BoutiqueStickyCategoryNav({
  activeCategory,
  onSelectCategory,
}: BoutiqueStickyCategoryNavProps) {
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Saree categories"
      className="sticky top-0 z-30 w-full border-b border-[#E6DDD0] bg-[#FCF9F4]/95 backdrop-blur-md"
    >
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-2 py-1.5 sm:px-4 lg:justify-center lg:gap-3 lg:px-6">
        <button
          type="button"
          onClick={() => onSelectCategory('All')}
          className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
            activeCategory === 'All'
              ? 'bg-[#7C1D26] font-semibold text-white'
              : 'text-[#635147] hover:bg-[#F4EDE2] hover:text-[#231712]'
          }`}
        >
          {t.allSarees}
        </button>

        {BOUTIQUE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#7C1D26] font-semibold text-white'
                  : 'text-[#635147] hover:bg-[#F4EDE2] hover:text-[#231712]'
              }`}
            >
              {t.categories[cat.id]}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

interface BoutiqueCategoryStripProps {
  activeCategory: 'All' | BoutiqueCategory;
  onSelectCategory: (cat: 'All' | BoutiqueCategory) => void;
}

export function BoutiqueCategoryStrip({ activeCategory, onSelectCategory }: BoutiqueCategoryStripProps) {
  const { t } = useLanguage();
  const [expandedCollections, setExpandedCollections] = useState(false);

  return (
    <section id="shop-by-category" className="scroll-mt-14 w-full px-2 sm:px-4 lg:px-6 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg sm:text-2xl font-semibold text-[#231712]">
            {t.shopByCategory}
          </h2>
          {activeCategory !== 'All' && (
            <span className="text-xs font-semibold text-[#7C1D26]">{t.categories[activeCategory]}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpandedCollections((prev) => !prev)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D26] hover:underline underline-offset-2 cursor-pointer"
        >
          <span>{expandedCollections ? t.showLess : t.viewAllCollections}</span>
          {expandedCollections ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2.5 lg:gap-3">
        {BOUTIQUE_CATEGORIES.map((tile) => {
          const isSelected = activeCategory === tile.id;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => onSelectCategory(tile.id)}
              className={`group flex flex-col overflow-hidden rounded-lg sm:rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#7C1D26] ring-1 ring-[#7C1D26] bg-white'
                  : 'border-[#E6DDD0] bg-white hover:border-[#635147]'
              }`}
            >
              <div className="aspect-square sm:aspect-[4/5] w-full overflow-hidden bg-[#F4EDE2]">
                <SafeImage
                  src={tile.image}
                  alt={t.categories[tile.id]}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-1.5 sm:p-2 space-y-0.5">
                <h3 className="font-sans text-[11px] sm:text-xs font-semibold text-[#231712] group-hover:text-[#7C1D26] line-clamp-1">
                  {t.categories[tile.id]}
                </h3>
                {expandedCollections && (
                  <p className="text-[10px] text-[#635147] line-clamp-1">
                    {tile.subtitle} · {tile.itemCount}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Special Curated Collections */}
      {expandedCollections && (
        <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3 sm:gap-3">
          {SPECIAL_BOUTIQUE_COLLECTIONS.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectCategory(col.filterCategory)}
              className="group flex items-center gap-3 overflow-hidden rounded-xl border border-[#E6DDD0] bg-white p-2 text-left hover:border-[#7C1D26] transition-colors cursor-pointer"
            >
              <SafeImage
                src={col.image}
                alt={col.title}
                className="h-16 w-14 rounded-lg object-cover shrink-0 bg-[#F4EDE2]"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="truncate font-display text-sm font-semibold text-[#231712] group-hover:text-[#7C1D26]">
                  {col.title}
                </p>
                <p className="text-[11px] text-[#635147] line-clamp-2 leading-snug">{col.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7C1D26]">
                  <span>{col.ctaLabel}</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
