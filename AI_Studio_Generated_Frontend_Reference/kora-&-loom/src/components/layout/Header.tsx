import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpLeft, Clock, Heart, Menu, Search, ShoppingBag, Star, TrendingUp, User, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { discountPercent, formatINR } from '../../utils/formatters';
import {
  getSearchSuggestions,
  SEARCH_SCOPES,
  SearchScope,
  searchProducts,
  splitHighlightSegments,
  TRENDING_SEARCHES,
} from '../../utils/search';
import { SafeImage } from '../common/SafeImage';

const RECENT_SEARCHES_KEY = 'kl_recent_searches_v1';

function HighlightedText({ text, query }: { text: string; query: string }) {
  const segments = splitHighlightSegments(text, query);
  return (
    <>
      {segments.map((seg, idx) =>
        seg.match ? (
          <strong key={idx} className="font-bold text-[#1C1917]">
            {seg.text}
          </strong>
        ) : (
          <span key={idx}>{seg.text}</span>
        )
      )}
    </>
  );
}

export function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { cartCount, openCart, wishlistIds } = useStore();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [topBannerDismissed, setTopBannerDismissed] = useState(false);

  // Scoped ranked search state
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('All');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setSearchDropdownOpen(false);
    setActiveIndex(-1);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch {
      // ignore storage quota
    }
  }, [recentSearches]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = desktopSearchRef.current?.contains(target);
      const insideMobile = mobileSearchRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
        setSearchDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo(() => getSearchSuggestions(PRODUCTS, query, scope), [query, scope]);
  const rankedProducts = useMemo(
    () => (query.trim() ? searchProducts(PRODUCTS, query, scope) : []),
    [query, scope]
  );
  const topProducts = rankedProducts.slice(0, 4);
  const hasQuery = query.trim().length > 0;

  const recordRecent = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => [clean, ...prev.filter((r) => r.toLowerCase() !== clean.toLowerCase())].slice(0, 5));
  };

  const executeSearch = (targetQuery: string, targetScope: SearchScope = scope) => {
    const clean = targetQuery.trim();
    if (clean) recordRecent(clean);
    setSearchDropdownOpen(false);
    setMobileSearchOpen(false);
    setActiveIndex(-1);

    const params = new URLSearchParams();
    if (clean) params.set('q', clean);
    if (targetScope !== 'All') params.set('cat', targetScope);
    const qs = params.toString();
    navigate(qs ? `/collections?${qs}` : '/collections');
  };

  const openProduct = (productId: string) => {
    if (query.trim()) recordRecent(query.trim());
    setSearchDropdownOpen(false);
    setMobileSearchOpen(false);
    setActiveIndex(-1);
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, scope);
  };

  const navItemsCount = hasQuery
    ? suggestions.length + topProducts.length
    : recentSearches.length + TRENDING_SEARCHES.length;

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, ref: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === 'Escape') {
      setSearchDropdownOpen(false);
      setActiveIndex(-1);
      ref.current?.blur();
      return;
    }
    if (!searchDropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setSearchDropdownOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (navItemsCount > 0) setActiveIndex((prev) => (prev + 1) % navItemsCount);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (navItemsCount > 0) setActiveIndex((prev) => (prev <= 0 ? navItemsCount - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      if (hasQuery) {
        if (activeIndex < suggestions.length) {
          const item = suggestions[activeIndex];
          setQuery(item.text);
          setScope(item.scope);
          executeSearch(item.text, item.scope);
        } else {
          const hit = topProducts[activeIndex - suggestions.length];
          if (hit) openProduct(hit.product.id);
        }
      } else if (activeIndex < recentSearches.length) {
        const term = recentSearches[activeIndex];
        setQuery(term);
        executeSearch(term, scope);
      } else {
        const trend = TRENDING_SEARCHES[activeIndex - recentSearches.length];
        if (trend) {
          setQuery(trend.query);
          setScope(trend.scope);
          executeSearch(trend.query, trend.scope);
        }
      }
    }
  };

  const renderRetrievalDropdown = (inputFocusRef: React.RefObject<HTMLInputElement | null>) => (
    <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-full md:w-[440px] max-h-[72dvh] overflow-y-auto overscroll-contain rounded-xl border border-[#E5E0D8] bg-white shadow-2xl">
      {!hasQuery ? (
        <div className="p-3 sm:p-4 space-y-3.5">
          {recentSearches.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#57534E]">
                <span>Recent Searches</span>
                <button
                  type="button"
                  onClick={() => setRecentSearches([])}
                  className="text-[11px] font-medium normal-case text-[#5B1B29] hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              <ul className="divide-y divide-[#F2EFE9]">
                {recentSearches.map((term, idx) => (
                  <li key={term} className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        executeSearch(term, scope);
                      }}
                      className={`flex flex-1 items-center gap-2 py-1.5 px-2 text-left text-xs sm:text-sm rounded transition-colors cursor-pointer ${
                        activeIndex === idx ? 'bg-[#F2EFE9] font-semibold' : 'hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5 text-[#57534E] shrink-0" />
                      <span className="truncate text-[#1C1917]">{term}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecentSearches((prev) => prev.filter((item) => item !== term))}
                      aria-label={`Remove ${term} from recent searches`}
                      className="p-1 text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#57534E]">
              <TrendingUp className="h-3.5 w-3.5 text-[#14532D]" />
              <span>Trending in Kora &amp; Loom</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_SEARCHES.map((trend, idx) => {
                const itemIndex = recentSearches.length + idx;
                return (
                  <button
                    key={trend.query}
                    type="button"
                    onClick={() => {
                      setQuery(trend.query);
                      setScope(trend.scope);
                      executeSearch(trend.query, trend.scope);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      activeIndex === itemIndex
                        ? 'border-[#14532D] bg-[#14532D] text-white'
                        : 'border-[#E5E0D8] bg-[#FAF9F6] text-[#1C1917] hover:border-[#14532D]'
                    }`}
                  >
                    {trend.query}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[#E5E0D8]">
          {suggestions.length > 0 && (
            <ul className="py-1" role="listbox" aria-label="Search suggestions">
              {suggestions.map((item, idx) => (
                <li key={item.id}>
                  <div
                    className={`flex items-center justify-between gap-2 px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                      activeIndex === idx ? 'bg-[#F2EFE9]' : 'hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(item.text);
                        setScope(item.scope);
                        executeSearch(item.text, item.scope);
                      }}
                      className="flex flex-1 items-center gap-2 min-w-0 text-left cursor-pointer"
                    >
                      <Search className="h-3.5 w-3.5 text-[#57534E] shrink-0" />
                      <span className="truncate text-[#57534E]">
                        <HighlightedText text={item.text} query={query} />
                      </span>
                      {item.hint && (
                        <span className="shrink-0 text-[11px] font-medium text-[#14532D]">· {item.hint}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(item.text);
                        inputFocusRef.current?.focus();
                      }}
                      aria-label={`Fill search with ${item.text}`}
                      className="p-1 text-[#57534E] hover:text-[#1C1917] shrink-0 cursor-pointer"
                    >
                      <ArrowUpLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {topProducts.length > 0 ? (
            <div className="p-2.5 space-y-1.5">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-[#57534E]">
                Top Matches {scope !== 'All' ? `in ${scope}` : ''}
              </p>
              <div className="space-y-1.5">
                {topProducts.map(({ product: p }, idx) => {
                  const itemIndex = suggestions.length + idx;
                  const pct = discountPercent(p.price, p.mrp);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => openProduct(p.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-colors cursor-pointer ${
                        activeIndex === itemIndex
                          ? 'border-[#14532D] bg-[#F2EFE9]'
                          : 'border-[#E5E0D8]/80 bg-white hover:border-[#14532D]/50 hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <SafeImage
                        src={p.images[0].url}
                        alt={p.name}
                        className="h-12 w-10 rounded object-cover shrink-0 bg-[#F2EFE9]"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="truncate text-xs font-medium text-[#1C1917]">
                          <HighlightedText text={p.name} query={query} />
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#57534E]">
                          <span className="truncate">{p.weave}</span>
                          <span className="inline-flex items-center gap-0.5 text-[#B45309] font-semibold shrink-0">
                            <Star className="h-3 w-3 fill-[#B45309]" />
                            {p.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5 text-xs tabular-nums">
                          <span className="font-bold text-[#14532D]">{formatINR(p.price)}</span>
                          {pct > 0 && <span className="text-[10px] font-semibold text-[#B45309]">({pct}% off)</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center space-y-2">
              <p className="text-xs text-[#57534E]">
                No matches for <strong className="text-[#1C1917]">"{query}"</strong>
                {scope !== 'All' ? ` in ${scope}` : ''}.
              </p>
              {scope !== 'All' && (
                <button
                  type="button"
                  onClick={() => {
                    setScope('All');
                    executeSearch(query, 'All');
                  }}
                  className="rounded-full border border-[#14532D] px-3 py-1 text-xs font-semibold text-[#14532D] hover:bg-[#14532D] hover:text-white transition-colors cursor-pointer"
                >
                  Search in All Departments
                </button>
              )}
            </div>
          )}

          {rankedProducts.length > 0 && (
            <button
              type="button"
              onClick={() => executeSearch(query, scope)}
              className="flex w-full items-center justify-between bg-[#FAF9F6] px-3.5 py-2.5 text-xs font-semibold text-[#14532D] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            >
              <span>
                See all {rankedProducts.length} {rankedProducts.length === 1 ? 'result' : 'results'} for "{query.trim()}"
              </span>
              <span>View all &rarr;</span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="bg-[#FAF9F6]">
        {/* 1. App Promo Bar (scrolls away naturally) */}
        {!topBannerDismissed && (
          <div className="flex h-9 items-center justify-between bg-[#F2EFE9] px-3 text-xs text-[#1C1917] sm:px-6 border-b border-[#E5E0D8]/60">
            <div className="flex-1 text-center truncate">
              <span>use code: <strong>APP5%</strong> · To get 5% off on 1st order</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => alert('Install our mobile web app for instant 1-tap checkout and exclusive drops!')}
                className="rounded-full bg-[#1C1917] px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-black active:scale-95 transition-all"
              >
                Open in app
              </button>
              <button
                type="button"
                onClick={() => setTopBannerDismissed(true)}
                aria-label="Close promo notice"
                className="p-1 text-[#57534E] hover:text-[#1C1917]"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Brand Authority Strip (scrolls away naturally) */}
        <div className="flex h-7 items-center justify-center bg-[#14532D] px-4 text-[11px] font-medium text-white tracking-wide">
          <span className="truncate">🏆 Featured in Weaver Handloom Collective · Silk Mark Certified</span>
        </div>
      </header>

      {/* 3. Main Sticky Header Bar */}
      <div className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E5E0D8]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6">
          {/* Left: Sidebar Menu Button (desktop & mobile) + Shop Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation sidebar"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9] active:scale-95 transition-all cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              to="/"
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap"
            >
              Kora &amp; Loom
            </Link>
          </div>

          {/* Right Group: Menu Links + Compact Scaled Search Bar + Utility Icons */}
          <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 min-w-0">
            {/* Desktop Navigation Links */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10.5px] xl:text-[11px] font-semibold uppercase tracking-wide text-[#57534E] whitespace-nowrap"
            >
              {[
                { to: '/collections', label: 'Collections' },
                { to: '/collections/silk-sarees', label: 'Silk Sarees' },
                { to: '/collections/cotton-linen', label: 'Cotton & Linen' },
                { to: '/collections/blouses-jewellery', label: 'Blouses & Jewellery' },
                { to: '/quiz', label: 'Saree Finder' },
                { to: '/offers', label: 'Offers' },
              ].map((item) => {
                const isActive = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`transition-colors hover:text-[#1C1917] hover:underline underline-offset-4 ${
                      isActive ? 'text-[#14532D] underline' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Compact Scaled Search Bar (sits right beside menu links, before Wishlist icon) */}
            <div ref={desktopSearchRef} className="relative hidden md:block w-48 lg:w-36 xl:w-48 2xl:w-60 shrink-0">
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                className="flex h-8 w-full items-stretch overflow-hidden rounded-md border border-[#D6CFC4] bg-white focus-within:border-[#14532D] focus-within:ring-2 focus-within:ring-[#14532D]/15 transition-shadow"
              >
                <select
                  value={scope}
                  onChange={(e) => {
                    setScope(e.target.value as SearchScope);
                    setActiveIndex(-1);
                    desktopInputRef.current?.focus();
                  }}
                  aria-label="Search department"
                  className="max-w-[54px] xl:max-w-[66px] truncate border-r border-[#E5E0D8] bg-[#F2EFE9] px-1.5 text-[11px] font-semibold text-[#1C1917] focus:outline-none cursor-pointer"
                >
                  {SEARCH_SCOPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.shortLabel}
                    </option>
                  ))}
                </select>

                <div className="relative flex flex-1 items-center min-w-0">
                  <input
                    ref={desktopInputRef}
                    type="search"
                    enterKeyHint="search"
                    value={query}
                    onFocus={() => setSearchDropdownOpen(true)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSearchDropdownOpen(true);
                      setActiveIndex(-1);
                    }}
                    onKeyDown={(e) => handleInputKeyDown(e, desktopInputRef)}
                    placeholder="Search sarees, SKU..."
                    aria-label="Search boutique products"
                    aria-expanded={searchDropdownOpen}
                    className="h-full w-full bg-transparent pl-2 pr-6 text-xs text-[#1C1917] placeholder:text-[#57534E]/75 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setActiveIndex(-1);
                        desktopInputRef.current?.focus();
                      }}
                      aria-label="Clear search"
                      className="absolute right-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  aria-label="Submit search"
                  className="flex w-8 shrink-0 items-center justify-center bg-[#14532D] text-white hover:bg-[#0F3F22] active:scale-95 transition-colors cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </form>

              {searchDropdownOpen && renderRetrievalDropdown(desktopInputRef)}
            </div>

            {/* Utility Actions Cluster */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Mobile Search Trigger */}
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen((prev) => {
                    const next = !prev;
                    if (next) {
                      setSearchDropdownOpen(true);
                      window.setTimeout(() => mobileInputRef.current?.focus(), 40);
                    } else {
                      setSearchDropdownOpen(false);
                    }
                    return next;
                  });
                }}
                aria-label="Search sarees"
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9] active:scale-95 transition-all cursor-pointer"
              >
                {mobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </button>

              <Link
                to="/wishlist"
                aria-label={`Wishlist (${wishlistIds.length})`}
                className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9] active:scale-95 transition-all"
              >
                <Heart className="h-4 w-4" />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#14532D] px-1 text-[10px] font-bold text-white tabular-nums">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              <Link
                to="/account"
                aria-label="Account"
                className="hidden sm:flex h-9 items-center gap-1 rounded-md px-1.5 xl:px-2 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9] active:scale-95 transition-all whitespace-nowrap"
              >
                <User className="h-4 w-4 shrink-0" />
                <span className="hidden xl:inline">{user ? user.name.split(' ')[0] : 'Account'}</span>
              </Link>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Shopping bag with ${cartCount} items`}
                className="relative flex h-9 w-9 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9] active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E11D48] px-1 text-[10px] font-bold text-white tabular-nums">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Expandable Compact Search Bar */}
        {mobileSearchOpen && (
          <div ref={mobileSearchRef} className="md:hidden relative border-t border-[#E5E0D8] bg-white px-3 py-2.5 shadow-md">
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="flex h-10 w-full items-stretch overflow-hidden rounded-lg border border-[#D6CFC4] bg-[#FAF9F6] focus-within:border-[#14532D] focus-within:bg-white"
            >
              <select
                value={scope}
                onChange={(e) => {
                  setScope(e.target.value as SearchScope);
                  setActiveIndex(-1);
                  mobileInputRef.current?.focus();
                }}
                aria-label="Search department"
                className="max-w-[74px] truncate border-r border-[#E5E0D8] bg-[#F2EFE9] px-2 text-xs font-semibold text-[#1C1917] focus:outline-none"
              >
                {SEARCH_SCOPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.shortLabel}
                  </option>
                ))}
              </select>

              <div className="relative flex flex-1 items-center min-w-0">
                <input
                  ref={mobileInputRef}
                  type="search"
                  enterKeyHint="search"
                  autoFocus
                  value={query}
                  onFocus={() => setSearchDropdownOpen(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchDropdownOpen(true);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={(e) => handleInputKeyDown(e, mobileInputRef)}
                  placeholder="Search Kanchipuram, under 1500, SKU..."
                  aria-label="Search boutique products"
                  className="h-full w-full bg-transparent px-2.5 pr-7 text-base text-[#1C1917] placeholder:text-[#57534E]/75 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setActiveIndex(-1);
                      mobileInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-1 flex h-6 w-6 items-center justify-center rounded-full text-[#57534E] hover:text-[#1C1917]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                aria-label="Submit search"
                className="flex w-11 shrink-0 items-center justify-center bg-[#14532D] text-white hover:bg-[#0F3F22]"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {searchDropdownOpen && (
              <div className="relative mt-1">{renderRetrievalDropdown(mobileInputRef)}</div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 flex h-[100dvh] w-full max-w-xs flex-col overflow-y-auto overscroll-contain bg-[#FAF9F6] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <span className="font-display text-2xl font-bold text-[#1C1917]">Kora &amp; Loom</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close sidebar"
                className="rounded p-1 text-[#57534E] hover:bg-[#F2EFE9]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-sm font-medium text-[#1C1917]">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                Home
              </Link>
              <Link to="/collections" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                All Collections
              </Link>
              <Link to="/collections/silk-sarees" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                Heirloom Silk Sarees
              </Link>
              <Link to="/collections/cotton-linen" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                Summer Cottons &amp; Linens
              </Link>
              <Link to="/collections/blouses-jewellery" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                Blouses &amp; Temple Jewellery
              </Link>
              <Link to="/campaign/diwali" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-[#B45309]">
                ✨ The Diwali Loom Edit
              </Link>
              <Link to="/quiz" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                30s Saree Finder Quiz
              </Link>
              <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                Buy More – Save More Offers
              </Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                Saved Wishlist ({wishlistIds.length})
              </Link>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                Track Order &amp; Account
              </Link>
              <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#14532D]">
                Customer Support &amp; Policy
              </Link>
            </nav>

            <div className="mt-auto border-t border-[#E5E0D8] pt-4 text-xs text-[#57534E] space-y-2">
              <p>Weaver Direct Boutique · Chennai, India</p>
              <p>Care Desk: care@koraandloom.in</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
