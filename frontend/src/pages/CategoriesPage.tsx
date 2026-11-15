import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const OCCASIONS = [
  {
    name: 'Bridal',
    subtitle: 'Heirloom muhurtham Kanjivarams & red zari Banarasi brocades',
  },
  {
    name: 'Festive',
    subtitle: 'Luminous tissue silks, zari dupattas & celebratory kurtis',
  },
  {
    name: 'Evening',
    subtitle: 'Midnight indigo silks & sculptural metallic-border weaves',
  },
  {
    name: 'Everyday',
    subtitle: 'Featherlight Dhakai Jamdani & breathable handspun cottons',
  },
  {
    name: 'Bespoke Tailoring',
    subtitle: 'Pure raw silk & indigo linen yardage sold by the metre',
  },
];

export const CategoriesPage: React.FC = () => {
  const { categories, products, navigate } = useStore();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-14">
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Curated Departments
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
            All Textile Categories &amp; Occasions
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Browse our master weaving clusters across heirloom sarees, couture dress materials,
            blouse brocades, and continuous yardage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate({ page: 'catalog', category: 'all' })}
          className="px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-semibold rounded-md inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          View All Products ({products.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Categories Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const count =
            cat.id === 'cat-new-arrivals'
              ? products.filter((p) => p.isNewArrival).length
              : products.filter((p) => p.categoryId === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate({ page: 'catalog', category: cat.id })}
              className="group text-left bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-colors flex flex-col cursor-pointer"
            >
              <div className="aspect-[4/3] w-full bg-[var(--bg-subtle)] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {cat.parentGroup} · {count > 0 ? `${count} weaves` : 'Curated'}
                  </p>
                  <h2 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] mt-0.5 font-sans group-hover:text-[var(--accent)] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 hidden sm:block">
                    {cat.description}
                  </p>
                </div>
                <span className="text-xs font-medium text-[var(--accent)] inline-flex items-center gap-1 pt-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Shop by Occasion */}
      <section className="pt-4 border-t border-[var(--border-color)] space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Dressing Guide
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mt-1">
            Shop by Occasion
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.name}
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all', occasion: occ.name })}
              className="p-5 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] rounded-xl text-left flex flex-col justify-between gap-4 transition-colors cursor-pointer group"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                  {occ.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  {occ.subtitle}
                </p>
              </div>
              <span className="text-xs font-medium text-[var(--accent)] inline-flex items-center gap-1">
                Browse Edit <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
