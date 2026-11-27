import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { COLLECTIONS } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { OccasionType, ProductCategory } from '../types';
import { SearchScope, searchProducts } from '../utils/search';

const PAGE_SIZE = 6;

const CATEGORIES: Array<'All' | ProductCategory> = [
  'All',
  'Silk Sarees',
  'Cotton Sarees',
  'Linen Sarees',
  'Blouses',
  'Jewellery',
  'Saree Care',
  'Festive Sets',
];

const OCCASIONS: Array<'All' | OccasionType> = [
  'All',
  'Bridal & Festive',
  'Festive',
  'Office & Daywear',
  'Casual & Office',
  'Wardrobe Care',
];

export function CollectionPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const collectionMeta = COLLECTIONS.find((c) => c.slug === slug);

  const [category, setCategory] = useState<'All' | ProductCategory>(collectionMeta?.filterCategory || 'All');
  const [occasion, setOccasion] = useState<'All' | OccasionType>('All');
  const [priceBracket, setPriceBracket] = useState<'all' | 'under-1000' | 'under-1500' | '1500-2500' | '2500-plus'>(
    collectionMeta?.maxPrice === 1500 ? 'under-1500' : 'all'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const [weaveFilter, setWeaveFilter] = useState(searchParams.get('weave') || '');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const skuInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const meta = COLLECTIONS.find((c) => c.slug === slug);
    setCategory(meta?.filterCategory || 'All');
    setPriceBracket(meta?.maxPrice === 1500 ? 'under-1500' : 'all');
    setPage(1);
  }, [slug]);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') as SearchScope | null;
    const occ = searchParams.get('occasion') as OccasionType | null;
    const weave = searchParams.get('weave') || '';
    const meta = COLLECTIONS.find((c) => c.slug === slug);
    setSearchText(q);
    setWeaveFilter(weave);
    if (cat && CATEGORIES.includes(cat)) {
      setCategory(cat);
    } else {
      setCategory(meta?.filterCategory || 'All');
    }
    if (occ && OCCASIONS.includes(occ)) {
      setOccasion(occ);
    } else {
      setOccasion('All');
    }
    if (searchParams.get('search') === 'true') {
      window.setTimeout(() => skuInputRef.current?.focus(), 60);
    }
    setPage(1);
  }, [searchParams, slug]);

  const filteredProducts = useMemo(() => {
    const q = searchText.trim();
    const ranked = q ? searchProducts(PRODUCTS, q, 'All') : PRODUCTS.map((product) => ({ product, score: 0 }));

    const list = ranked
      .filter(({ product: p }) => {
        if (category !== 'All') {
          if (slug === 'cotton-linen') {
            if (p.category !== 'Cotton Sarees' && p.category !== 'Linen Sarees') return false;
          } else if (slug === 'blouses-jewellery') {
            if (p.category !== 'Blouses' && p.category !== 'Jewellery') return false;
          } else if (p.category !== category) {
            return false;
          }
        }
        if (weaveFilter === 'kanchipuram' && !p.weave.toLowerCase().includes('kanchi')) return false;
        if (
          weaveFilter === 'banarasi-soft' &&
          !p.weave.toLowerCase().includes('banarasi') &&
          !p.weave.toLowerCase().includes('soft silk')
        ) {
          return false;
        }
        if (occasion !== 'All' && p.occasion !== occasion) return false;
        if (priceBracket === 'under-1000' && p.price > 1000) return false;
        if (priceBracket === 'under-1500' && p.price > 1500) return false;
        if (priceBracket === '1500-2500' && (p.price < 1500 || p.price > 2500)) return false;
        if (priceBracket === '2500-plus' && p.price < 2500) return false;
        return true;
      })
      .map(({ product }) => product);

    if (sortBy === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, occasion, priceBracket, sortBy, searchText, slug, weaveFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFilters = () => {
    setCategory('All');
    setOccasion('All');
    setPriceBracket('all');
    setSearchText('');
    setWeaveFilter('');
    setSearchParams({});
    setPage(1);
  };

  const FilterControls = (
    <div className="space-y-6">
      <div>
        <label htmlFor="sku-search" className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-2">
          Search Weave or SKU Code
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#57534E]" />
          <input
            ref={skuInputRef}
            id="sku-search"
            type="search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            placeholder="e.g. Banarasi, KL-KNC-101"
            className="w-full rounded-md border border-[#E5E0D8] bg-white py-2 pl-9 pr-3 text-base sm:text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-2">Category</p>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                if (weaveFilter) {
                  setWeaveFilter('');
                  const next = new URLSearchParams(searchParams);
                  next.delete('weave');
                  setSearchParams(next);
                }
                setPage(1);
              }}
              className={`block w-full rounded px-2.5 py-1.5 text-left text-sm transition-colors cursor-pointer ${
                category === cat ? 'bg-[#14532D] text-white font-semibold' : 'text-[#1C1917] hover:bg-[#F2EFE9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-2">Price Bracket</p>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'under-1000', label: 'Under ₹1,000' },
            { id: 'under-1500', label: 'Under ₹1,500' },
            { id: '1500-2500', label: '₹1,500 – ₹2,500' },
            { id: '2500-plus', label: 'Heirloom ₹2,500+' },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setPriceBracket(b.id as typeof priceBracket);
                setPage(1);
              }}
              className={`block w-full rounded px-2.5 py-1.5 text-left text-sm transition-colors cursor-pointer ${
                priceBracket === b.id ? 'bg-[#14532D] text-white font-semibold' : 'text-[#1C1917] hover:bg-[#F2EFE9]'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-2">Occasion</p>
        <div className="space-y-1.5">
          {OCCASIONS.map((occ) => (
            <button
              key={occ}
              type="button"
              onClick={() => {
                setOccasion(occ);
                setPage(1);
              }}
              className={`block w-full rounded px-2.5 py-1.5 text-left text-sm transition-colors cursor-pointer ${
                occasion === occ ? 'bg-[#14532D] text-white font-semibold' : 'text-[#1C1917] hover:bg-[#F2EFE9]'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-md border border-[#E5E0D8] bg-white py-2 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9] cursor-pointer"
      >
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="border-b border-[#E5E0D8] pb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
            {collectionMeta ? collectionMeta.subtitle : 'Handloom Catalogue'}
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-[#1C1917]">
            {collectionMeta ? collectionMeta.title : 'All Boutique Collections'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#57534E]">
            {collectionMeta
              ? collectionMeta.description
              : 'Filter by fabric weave, occasion, price tier, or search directly by video SKU code.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-[#E5E0D8] bg-white px-3.5 py-2 text-xs font-semibold text-[#1C1917] lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-md border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-semibold text-[#1C1917] focus:border-[#14532D] focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="hidden lg:block lg:col-span-3">{FilterControls}</aside>

        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E] tabular-nums">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                Showing {paginatedProducts.length} of {filteredProducts.length} weaves
              </span>
              {weaveFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setWeaveFilter('');
                    const next = new URLSearchParams(searchParams);
                    next.delete('weave');
                    setSearchParams(next);
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#14532D]/10 px-2.5 py-0.5 font-semibold text-[#14532D] hover:bg-[#14532D]/20 cursor-pointer"
                >
                  <span>
                    {weaveFilter === 'kanchipuram' ? 'Kanchipuram Silks' : 'Banarasi & Soft Silks'}
                  </span>
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="rounded-lg border border-[#E5E0D8] bg-white p-12 text-center space-y-3">
              <p className="font-display text-2xl font-semibold text-[#1C1917]">No weaves match these filters</p>
              <p className="text-sm text-[#57534E]">Try clearing a price bracket or searching another fabric.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-md bg-[#14532D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F3F22]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 xl:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-semibold text-[#1C1917] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-9 w-9 rounded-md text-xs font-semibold tabular-nums cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#14532D] text-white'
                        : 'border border-[#E5E0D8] bg-white text-[#1C1917] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-semibold text-[#1C1917] disabled:opacity-40 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/45" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative z-10 h-full w-80 max-w-[85vw] overflow-y-auto bg-[#FAF9F6] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8] mb-5">
              <span className="font-display text-xl font-semibold">Filter Collection</span>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterControls}
          </div>
        </div>
      )}
    </div>
  );
}
