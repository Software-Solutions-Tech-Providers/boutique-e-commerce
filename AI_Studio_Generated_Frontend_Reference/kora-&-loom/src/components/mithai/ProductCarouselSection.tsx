import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MithaiCategory, MithaiProduct } from '../../data/mithaiData';
import { MithaiProductCard } from './MithaiProductCard';

interface ProductCarouselSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  products: MithaiProduct[];
  activeCategoryFilter?: 'All' | MithaiCategory;
  onResetCategory?: () => void;
}

export function ProductCarouselSection({
  id,
  eyebrow,
  title,
  products,
  activeCategoryFilter,
  onResetCategory,
}: ProductCarouselSectionProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (dir: 'prev' | 'next') => {
    if (!scrollerRef.current) return;
    const delta = dir === 'next' ? 320 : -320;
    scrollerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id={id} className="mx-auto max-w-7xl px-3 sm:px-6 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7C1D26]">{eyebrow}</p>
          <div className="flex flex-wrap items-center gap-3 mt-0.5">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#231712]">{title}</h2>
            {activeCategoryFilter && activeCategoryFilter !== 'All' && onResetCategory && (
              <button
                type="button"
                onClick={onResetCategory}
                className="text-xs font-semibold text-[#7C1D26] underline underline-offset-2 cursor-pointer"
              >
                Showing {activeCategoryFilter} · Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Desktop Carousel Arrows */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollByCards('prev')}
            aria-label={`Scroll ${title} left`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6DDD0] bg-white text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards('next')}
            aria-label={`Scroll ${title} right`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6DDD0] bg-white text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-[#E6DDD0] bg-white p-8 text-center space-y-2">
          <p className="font-display text-xl font-semibold text-[#231712]">No items in this category yet</p>
          {onResetCategory && (
            <button
              type="button"
              onClick={onResetCategory}
              className="rounded-lg bg-[#7C1D26] px-4 py-2 text-xs font-semibold text-white"
            >
              View All Sweets &amp; Snacks
            </button>
          )}
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[72vw] max-w-[275px] shrink-0 snap-start sm:w-[44vw] lg:w-auto lg:max-w-none">
              <MithaiProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
