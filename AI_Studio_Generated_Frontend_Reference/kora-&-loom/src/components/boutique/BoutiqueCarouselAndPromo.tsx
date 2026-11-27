import { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Heart, Minus, Plus, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useBoutiqueCart } from '../../context/BoutiqueCartContext';
import { useLanguage } from '../../context/LanguageContext';
import { BoutiqueCategory, SareeProduct } from '../../data/boutiqueData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';
import { BoutiqueProductCard } from './BoutiqueProductCard';

export type PriceBandFilter = 'all' | 'under-1500' | '1500-3000' | 'above-3000';

interface BoutiqueCarouselProps {
  id: string;
  eyebrow: string;
  title: string;
  products: SareeProduct[];
  layout?: 'grid' | 'carousel';
  activeCategoryFilter?: 'All' | BoutiqueCategory;
  onResetCategory?: () => void;
  priceFilter?: PriceBandFilter;
  onChangePriceFilter?: (band: PriceBandFilter) => void;
  hasMore?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  expandLabel?: string;
  onViewAllCollections?: () => void;
}

function HorizontalSpotlightCard({ product }: { product: SareeProduct }) {
  const { addToCart, openQuickView, wishlistIds, toggleWishlist } = useBoutiqueCart();
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <article className="grid grid-cols-1 overflow-hidden rounded-xl border border-[#E6DDD0] bg-white sm:grid-cols-12">
      <button
        type="button"
        onClick={() => openQuickView(product)}
        className="relative aspect-[4/3] sm:aspect-auto sm:h-full max-h-[260px] w-full overflow-hidden bg-[#F4EDE2] sm:col-span-5 cursor-pointer"
      >
        <SafeImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </button>

      <div className="flex flex-col justify-between gap-2.5 p-3 sm:p-4 sm:col-span-7">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#635147]">
            <span>{product.sku} · {t.categories[product.category]}</span>
            <span className="inline-flex items-center gap-0.5 font-semibold text-[#231712] tabular-nums">
              <Star className="h-3 w-3 fill-[#B4690E] text-[#B4690E]" />
              {product.rating.toFixed(1)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="text-left font-display text-base sm:text-lg font-semibold text-[#231712] hover:text-[#7C1D26] cursor-pointer"
          >
            {product.name}
          </button>
          <p className="text-xs text-[#635147] line-clamp-2">{product.shortDesc}</p>
          <p className="text-[11px] text-[#635147]">{product.fabricSpec}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E6DDD0] pt-2">
          <p className="text-base sm:text-lg font-bold text-[#231712] tabular-nums">
            {formatINR(product.price)}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex h-9 items-center rounded-lg border border-[#E6DDD0] bg-[#FCF9F4]">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label={`Decrease quantity for ${product.name}`}
                className="flex h-full w-8 items-center justify-center text-[#231712] hover:bg-[#F4EDE2] rounded-l-lg cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-semibold text-[#231712] tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                aria-label={`Increase quantity for ${product.name}`}
                className="flex h-full w-8 items-center justify-center text-[#231712] hover:bg-[#F4EDE2] rounded-r-lg cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id, product.name)}
              aria-label={t.wishlist}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6DDD0] bg-white text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#7C1D26] text-[#7C1D26]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => openQuickView(product)}
              aria-label="Quick view"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6DDD0] bg-white text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(product, product.defaultOption, qty);
                setQty(1);
              }}
              className="inline-flex min-h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#7C1D26] px-3.5 text-xs sm:text-[13px] font-semibold text-white hover:bg-[#5E141B] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
              <span>{t.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function BoutiqueCarouselSection({
  id,
  eyebrow,
  title,
  products,
  layout = 'grid',
  activeCategoryFilter,
  onResetCategory,
  priceFilter,
  onChangePriceFilter,
  hasMore = false,
  isExpanded = false,
  onToggleExpand,
  expandLabel,
  onViewAllCollections,
}: BoutiqueCarouselProps) {
  const { t } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const priceBands: Array<{ id: PriceBandFilter; label: string }> = [
    { id: 'all', label: t.allPrices },
    { id: 'under-1500', label: 'Under ₹1,500' },
    { id: '1500-3000', label: '₹1,500 – ₹3,000' },
    { id: 'above-3000', label: '₹3,000+' },
  ];

  const scrollByCards = (dir: 'prev' | 'next') => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dir === 'next' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <section id={id} className="scroll-mt-14 w-full px-2 sm:px-4 lg:px-6 space-y-1.5">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#7C1D26]">
            {eyebrow}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg sm:text-2xl font-semibold text-[#231712]">{title}</h2>
            {activeCategoryFilter && activeCategoryFilter !== 'All' && onResetCategory && (
              <button
                type="button"
                onClick={onResetCategory}
                className="text-xs font-semibold text-[#7C1D26] underline underline-offset-2 cursor-pointer"
              >
                {t.categories[activeCategoryFilter]} · {t.clearFilter}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onViewAllCollections && (
            <button
              type="button"
              onClick={onViewAllCollections}
              className="text-xs font-semibold text-[#7C1D26] hover:underline underline-offset-2 cursor-pointer"
            >
              {t.viewAllCollections}
            </button>
          )}

          {layout === 'carousel' && products.length > 3 && (
            <div className="hidden sm:flex lg:hidden items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => scrollByCards('prev')}
                aria-label={`Scroll ${title} left`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E6DDD0] bg-white text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards('next')}
                aria-label={`Scroll ${title} right`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E6DDD0] bg-white text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Budget Filter Row */}
      {onChangePriceFilter && priceFilter && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {priceBands.map((band) => (
            <button
              key={band.id}
              type="button"
              onClick={() => onChangePriceFilter(band.id)}
              className={`min-h-[30px] shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                priceFilter === band.id
                  ? 'border-[#7C1D26] bg-[#7C1D26]/10 font-semibold text-[#7C1D26]'
                  : 'border-[#E6DDD0] bg-white text-[#635147] hover:text-[#231712]'
              }`}
            >
              {band.label}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border border-[#E6DDD0] bg-white p-4 text-center space-y-2">
          <p className="font-display text-base sm:text-lg font-semibold text-[#231712]">
            {t.noMatches}
          </p>
          {onResetCategory && (
            <button
              type="button"
              onClick={onResetCategory}
              className="rounded-lg bg-[#7C1D26] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              {t.resetFilters}
            </button>
          )}
        </div>
      ) : products.length === 1 ? (
        <div className="w-full">
          <HorizontalSpotlightCard product={products[0]} />
        </div>
      ) : products.length === 2 ? (
        <>
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {products.map((product) => (
              <BoutiqueProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-2 gap-3">
            {products.map((product) => (
              <HorizontalSpotlightCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : products.length === 3 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {products.map((product) => (
            <BoutiqueProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4 lg:gap-3"
        >
          {products.map((product) => (
            <BoutiqueProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {onToggleExpand && (hasMore || isExpanded) && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={onToggleExpand}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#7C1D26]/35 bg-white px-5 py-1.5 text-xs sm:text-sm font-semibold text-[#7C1D26] hover:bg-[#7C1D26] hover:text-white transition-colors cursor-pointer"
          >
            <span>{isExpanded ? t.showLess : (expandLabel || t.viewMore)}</span>
          </button>
        </div>
      )}
    </section>
  );
}

export function BoutiquePromoBanner({ onExploreBridal }: { onExploreBridal: () => void }) {
  const { applyPromo, openCart } = useBoutiqueCart();
  const { t } = useLanguage();

  const handleApply = () => {
    const res = applyPromo('KORA10');
    if (!res.ok) {
      onExploreBridal();
    } else {
      openCart();
    }
  };

  return (
    <section className="w-full px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-[#E6DDD0] bg-[#7C1D26] p-3.5 sm:flex-row sm:items-center sm:px-5 sm:py-4 text-white">
        <div className="space-y-0.5">
          <p className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#FDE68A]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.promoEyebrow}</span>
          </p>
          <h2 className="font-display text-base font-semibold leading-snug sm:text-xl">
            {t.promoHeading}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-[#7C1D26] hover:bg-[#FCF9F4] transition-colors cursor-pointer"
          >
            <span>{t.applyOffer}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onExploreBridal}
            className="inline-flex min-h-[38px] items-center rounded-lg border border-white/40 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {t.bridalCombos}
          </button>
        </div>
      </div>
    </section>
  );
}
