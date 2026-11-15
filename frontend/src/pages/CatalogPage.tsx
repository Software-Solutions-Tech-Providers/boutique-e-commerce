import React, { useMemo, useState } from 'react';
import { Filter, Scale, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { AUDIENCE_SEGMENTS } from '../data/conversionData';
import { formatINR } from '../utils/commerce';

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'discount' | 'latest' | 'rating';

export const CatalogPage: React.FC = () => {
  const {
    view,
    categories,
    products,
    navigate,
    compareList,
    setCompareOpen,
    attribution,
    clearAttribution,
  } = useStore();

  const initialCategory = view.page === 'catalog' && view.category ? view.category : 'all';
  const initialSearch = view.page === 'catalog' && view.search ? view.search : '';
  const initialOccasion = view.page === 'catalog' && view.occasion ? view.occasion : 'all';
  const initialAudience = view.page === 'catalog' && view.audience ? view.audience : 'all';
  const initialMaxPrice = view.page === 'catalog' && view.maxPrice ? view.maxPrice : 50000;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>(initialOccasion);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>(initialAudience);
  const [unitFilter, setUnitFilter] = useState<'all' | 'yardage' | 'piece'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync if user clicked a top-bar category, audience chip, or occasion link while already on catalog
  React.useEffect(() => {
    if (view.page === 'catalog') {
      if (view.category !== undefined) setSelectedCategory(view.category);
      if (view.search !== undefined) setSearchQuery(view.search);
      if (view.occasion !== undefined) setSelectedOccasion(view.occasion);
      if (view.audience !== undefined) {
        setSelectedAudience(view.audience);
        const seg = AUDIENCE_SEGMENTS.find((s) => s.id === view.audience);
        if (seg?.filterPreset.unitType === 'yardage') {
          setUnitFilter('yardage');
        } else {
          setUnitFilter('all');
        }
        if (seg?.filterPreset.maxPrice) {
          setMaxPrice(seg.filterPreset.maxPrice);
        } else if (view.maxPrice === undefined) {
          setMaxPrice(50000);
        }
      }
      if (view.maxPrice !== undefined) setMaxPrice(view.maxPrice);
      if (view.filter === 'new') setSelectedCategory('cat-new-arrivals');
      if (view.filter === 'festive') setSelectedOccasion('Festive');
    }
  }, [view]);

  const fabricTypes = useMemo(
    () => Array.from(new Set(products.map((p) => p.fabricType))),
    [products]
  );

  const occasions = useMemo(
    () => Array.from(new Set(products.map((p) => p.occasion))),
    [products]
  );

  const colorOptions = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((p) => {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'cat-new-arrivals') {
          if (!p.isNewArrival) return false;
        } else if (selectedCategory === 'cat-sarees') {
          if (
            ![
              'cat-sarees',
              'cat-designer-sarees',
              'cat-cotton-sarees',
              'cat-silk-sarees',
              'cat-bridal',
              'cat-festive',
            ].includes(p.categoryId)
          ) {
            return false;
          }
        } else if (p.categoryId !== selectedCategory) {
          return false;
        }
      }

      if (q) {
        const hay = `${p.name} ${p.subtitle} ${p.fabricType} ${p.weaveOrigin} ${p.subcategory}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (selectedFabric !== 'all' && p.fabricType !== selectedFabric) return false;
      if (selectedOccasion !== 'all' && p.occasion !== selectedOccasion) return false;
      if (
        selectedColor !== 'all' &&
        !p.colors.some((c) => c.name === selectedColor)
      ) {
        return false;
      }
      if (p.price > maxPrice) return false;
      if (inStockOnly && p.stockCount <= 0) return false;
      if (unitFilter === 'yardage' && p.unitType === 'piece') return false;
      if (unitFilter === 'piece' && p.unitType !== 'piece') return false;
      if (selectedAudience === 'designer-boutique' && !p.isLimitedEdition && !p.isBestSeller) {
        return false;
      }
      if (selectedAudience === 'new-collections' && !p.isNewArrival) {
        return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latest') return b.createdAt.localeCompare(a.createdAt);
      return Number(b.isBestSeller) - Number(a.isBestSeller);
    });
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedFabric,
    selectedOccasion,
    selectedColor,
    selectedAudience,
    unitFilter,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const activeAudienceObj = AUDIENCE_SEGMENTS.find((s) => s.id === selectedAudience);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedFabric('all');
    setSelectedOccasion('all');
    setSelectedColor('all');
    setSelectedAudience('all');
    setUnitFilter('all');
    setMaxPrice(50000);
    setInStockOnly(false);
  };

  const applyAudiencePreset = (segId: string) => {
    if (segId === 'all') {
      resetFilters();
      return;
    }
    const seg = AUDIENCE_SEGMENTS.find((s) => s.id === segId);
    if (!seg) return;
    setSelectedAudience(seg.id);
    setSelectedCategory(seg.filterPreset.category || 'all');
    setSelectedOccasion(seg.filterPreset.occasion || 'all');
    setMaxPrice(seg.filterPreset.maxPrice || 50000);
    setUnitFilter(seg.filterPreset.unitType === 'yardage' ? 'yardage' : 'all');
  };

  const filterSidebarContent = (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
          Categories
        </h3>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[var(--accent)] text-white dark:text-[#141416]'
                : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            All Collections ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs cursor-pointer flex items-center justify-between ${
                selectedCategory === cat.id
                  ? 'bg-[var(--accent)] text-white dark:text-[#141416] font-medium'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Max Price
          </h3>
          <span className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">
            {formatINR(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={1500}
          max={50000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
      </div>

      <div className="pt-4 border-t border-[var(--border-color)]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5">
          Fabric Type
        </h3>
        <select
          value={selectedFabric}
          onChange={(e) => setSelectedFabric(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--accent)]"
        >
          <option value="all">All Fabrics</option>
          {fabricTypes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4 border-t border-[var(--border-color)]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5">
          Occasion
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {['all', ...occasions].map((occ) => (
            <button
              key={occ}
              type="button"
              onClick={() => setSelectedOccasion(occ)}
              className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                selectedOccasion === occ
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
              }`}
            >
              {occ === 'all' ? 'Any' : occ}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border-color)]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5">
          Colour Palette
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedColor('all')}
            className={`px-2 py-1 text-xs rounded border cursor-pointer ${
              selectedColor === 'all'
                ? 'border-[var(--accent)] font-semibold text-[var(--text-primary)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)]'
            }`}
          >
            All
          </button>
          {colorOptions.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setSelectedColor(c.name)}
              title={c.name}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                selectedColor === c.name ? 'border-[var(--accent)] scale-110' : 'border-[var(--border-color)]'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border-color)]">
        <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded border-[var(--border-color)]"
          />
          <span>Ready to Dispatch (In Stock Only)</span>
        </label>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full py-2 text-xs font-medium border border-[var(--border-color)] rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
      >
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate({ page: 'home' })}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[var(--text-primary)]">
              {activeCategoryObj ? activeCategoryObj.name : 'All Collections'}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
            {activeCategoryObj ? activeCategoryObj.name : 'Boutique Textile Archive'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'Explore authentic handloom sarees, dress materials, and architectural yardage.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[160px] sm:flex-none">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by weave, silk, origin..."
              className="pl-9 pr-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--accent)] w-full sm:w-56"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort products"
            className="flex-1 sm:flex-none min-w-[150px] max-w-full px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="featured">Sort: Featured &amp; Best Selling</option>
            <option value="discount">Sort: Biggest Savings (% Off)</option>
            <option value="latest">Sort: Latest Arrivals</option>
            <option value="price_asc">Sort: Price Low to High</option>
            <option value="price_desc">Sort: Price High to Low</option>
            <option value="rating">Sort: Highest Rated</option>
          </select>

          {compareList.length > 0 && (
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--accent)] text-[var(--accent)] rounded-md bg-[var(--bg-surface)] cursor-pointer tabular-nums shrink-0"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare ({compareList.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--border-color)] rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)] cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* Followers-to-Customers Campaign Continuity Strip */}
      {attribution.source !== 'Direct' && attribution.campaign && (
        <div className="mt-5 px-4 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              {attribution.landingHeadline || `${attribution.source} Collection Edit`}
            </p>
            <p className="text-[var(--text-secondary)]">
              Campaign {attribution.campaign} · Silk Mark certified handloom · 7-day transparent return guarantee
            </p>
          </div>
          <button
            type="button"
            onClick={clearAttribution}
            aria-label="Clear campaign notice"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Target Audience / Shopping Intent Preset Strip */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => applyAudiencePreset('all')}
          className={`px-3.5 py-2 text-xs font-medium rounded-md border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            selectedAudience === 'all'
              ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
              : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          All Shoppers
        </button>
        {AUDIENCE_SEGMENTS.map((seg) => (
          <button
            key={seg.id}
            type="button"
            onClick={() => applyAudiencePreset(seg.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-md border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              selectedAudience === seg.id
                ? 'bg-[var(--accent)] text-white dark:text-[#141416] border-[var(--accent)]'
                : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {activeAudienceObj && (
        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          Showing textiles tailored for: <strong className="text-[var(--text-primary)]">{activeAudienceObj.customerIntent}</strong>
        </p>
      )}

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-color)]">
              <Filter className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)] font-sans">
                Refine Selection
              </h2>
            </div>
            {filterSidebarContent}
          </div>
        </aside>

        <section className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4 text-xs text-[var(--text-secondary)] tabular-nums">
            <span>Showing {filteredProducts.length} curated pieces</span>
            {(selectedCategory !== 'all' ||
              searchQuery ||
              selectedFabric !== 'all' ||
              selectedOccasion !== 'all' ||
              selectedColor !== 'all' ||
              selectedAudience !== 'all' ||
              unitFilter !== 'all' ||
              inStockOnly) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[var(--accent)] hover:underline cursor-pointer"
              >
                Clear active filters
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-12 text-center">
              <p className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                No weaves match your current filter
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Try clearing a fabric or price constraint to view the full archive.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-5 py-2 bg-[var(--accent)] text-white dark:text-[#141416] text-xs font-medium rounded-md cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-start lg:hidden">
          <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] w-80 max-w-full h-full p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-color)]">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] font-sans">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-[var(--text-secondary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterSidebarContent}
          </div>
        </div>
      )}
    </div>
  );
};
