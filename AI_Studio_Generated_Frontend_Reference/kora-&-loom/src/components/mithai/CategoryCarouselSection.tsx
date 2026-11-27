import { CATEGORY_TILES, MithaiCategory } from '../../data/mithaiData';
import { SafeImage } from '../common/SafeImage';

interface CategoryCarouselSectionProps {
  activeCategory: 'All' | MithaiCategory;
  onSelectCategory: (cat: MithaiCategory) => void;
}

export function CategoryCarouselSection({
  activeCategory,
  onSelectCategory,
}: CategoryCarouselSectionProps) {
  const handlePick = (cat: MithaiCategory) => {
    onSelectCategory(cat);
    const el = document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="shop-by-category" className="mx-auto max-w-7xl px-3 sm:px-6 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7C1D26]">Browse by Craving</p>
          <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-semibold text-[#231712]">
            Shop by Category
          </h2>
        </div>
        <span className="text-xs text-[#635147] sm:hidden">Swipe →</span>
      </div>

      {/* Horizontal swipe on mobile, 3-col tablet, 6-col desktop */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-4 md:overflow-visible">
        {CATEGORY_TILES.map((tile) => {
          const isSelected = activeCategory === tile.id;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => handlePick(tile.id)}
              className={`group flex w-40 shrink-0 snap-start flex-col overflow-hidden rounded-xl border text-left transition-all md:w-auto cursor-pointer ${
                isSelected
                  ? 'border-[#7C1D26] ring-1 ring-[#7C1D26] bg-white'
                  : 'border-[#E6DDD0] bg-white hover:border-[#635147]'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F4EDE2]">
                <SafeImage
                  src={tile.image}
                  alt={tile.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3 space-y-0.5">
                <h3 className="font-sans text-sm font-semibold text-[#231712] group-hover:text-[#7C1D26] line-clamp-1">
                  {tile.title}
                </h3>
                <p className="text-[11px] text-[#635147] line-clamp-1">{tile.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
