import React, { useMemo, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useMithaiCart } from '../../context/MithaiCartContext';
import { CATEGORY_TILES, MITHAI_PRODUCTS, MithaiCategory } from '../../data/mithaiData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

interface MithaiHeaderProps {
  activeCategory: 'All' | MithaiCategory;
  onSelectCategory: (cat: 'All' | MithaiCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchOpen: boolean;
  onToggleSearch: (open: boolean) => void;
  onOpenAccount: () => void;
  onOpenWishlist: () => void;
}

export function MithaiHeader({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  searchOpen,
  onToggleSearch,
  onOpenAccount,
  onOpenWishlist,
}: MithaiHeaderProps) {
  const { cartCount, openCart, wishlistIds, openQuickView } = useMithaiCart();
  const [bannerOpen, setBannerOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MITHAI_PRODUCTS.slice(0, 4);
    return MITHAI_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Announcement / Promotional Bar (Non-sticky so mobile sticky cap remains <= 15%) */}
      {bannerOpen && (
        <div className="flex min-h-[34px] items-center justify-between bg-[#7C1D26] px-3 py-1 text-[11px] sm:text-xs text-white sm:px-6">
          <div className="flex-1 text-center truncate">
            <span>Free Express Delivery ₹799+ · 10% Off ₹1,499+ (</span>
            <strong className="font-semibold">SWEET10</strong>
            <span>) · Fresh Small-Batch Kitchen</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerOpen(false)}
            aria-label="Dismiss announcement"
            className="ml-2 p-1 text-white/80 hover:text-white shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. Mobile-First Sticky Header (48px mobile, 64px md+) */}
      <header className="sticky top-0 z-40 border-b border-[#E6DDD0] bg-[#FCF9F4]/95 backdrop-blur-md">
        <div className="mx-auto flex h-12 md:h-16 max-w-7xl items-center justify-between gap-4 px-3 sm:px-6">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-[#231712] hover:bg-[#F4EDE2] md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <a
              href="#top"
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#231712] whitespace-nowrap shrink-0"
            >
              Madhura Mithai
            </a>
          </div>

          {/* Desktop Primary Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-[#635147]">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('Traditional Sweets');
                scrollToSection('bestsellers');
              }}
              className="hover:text-[#7C1D26] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sweets
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('Crisp Savouries');
                scrollToSection('bestsellers');
              }}
              className="hover:text-[#7C1D26] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Savouries
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('Celebration Combos');
                scrollToSection('special-collections');
              }}
              className="hover:text-[#7C1D26] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Gift Combos
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('brand-story')}
              className="hover:text-[#7C1D26] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Our Craft
            </button>
          </nav>

          {/* Header Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSearch(!searchOpen)}
              aria-label="Search sweets and snacks"
              className="flex h-11 w-11 md:w-auto md:px-3 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search</span>
            </button>

            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Wishlist (${wishlistIds.length} saved)`}
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
            >
              <Heart className="h-4 w-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-2 right-2 text-[10px] font-semibold text-[#7C1D26] tabular-nums">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenAccount}
              aria-label="Account sign in"
              className="hidden sm:flex h-11 w-11 items-center justify-center rounded-lg text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
            >
              <User className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="inline-flex h-10 md:h-11 items-center gap-1.5 rounded-lg bg-[#7C1D26] px-3 text-xs font-semibold text-white hover:bg-[#5E141B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="tabular-nums">Bag ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E6DDD0] bg-white px-3 py-3 sm:px-6 shadow-md">
            <div className="mx-auto max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#635147]" />
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search Mysore Pak, Kaju Katli, Mango Barfi, Murukku..."
                    className="w-full rounded-lg border border-[#E6DDD0] bg-[#FCF9F4] py-2.5 pl-9 pr-3 text-sm text-[#231712] focus:border-[#7C1D26] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onToggleSearch(false)}
                  aria-label="Close search"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-[#635147] hover:bg-[#F4EDE2]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {searchMatches.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onToggleSearch(false);
                      openQuickView(item);
                    }}
                    className="flex items-center gap-3 rounded-lg border border-[#E6DDD0] p-2 text-left hover:bg-[#FCF9F4] cursor-pointer"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-14 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#231712]">{item.name}</p>
                      <p className="text-[11px] text-[#635147] tabular-nums">
                        {item.defaultWeight} · {formatINR(item.price)}
                      </p>
                    </div>
                  </button>
                ))}
                {searchMatches.length === 0 && (
                  <p className="text-xs text-[#635147] py-1">No sweets matched “{searchQuery}”.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. Navigation / Product Categories Bar (Scrolls cleanly on 360px+ mobile) */}
      <div className="border-b border-[#E6DDD0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto no-scrollbar px-3 py-2.5 sm:px-6">
          <button
            type="button"
            onClick={() => {
              onSelectCategory('All');
              scrollToSection('bestsellers');
            }}
            className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-[#7C1D26] text-white'
                : 'bg-[#F4EDE2] text-[#231712] hover:bg-[#E6DDD0]'
            }`}
          >
            All Delicacies
          </button>
          {CATEGORY_TILES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelectCategory(cat.id);
                scrollToSection('bestsellers');
              }}
              className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#7C1D26] text-white'
                  : 'bg-[#F4EDE2] text-[#231712] hover:bg-[#E6DDD0]'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="relative z-10 flex w-72 max-w-[85vw] flex-col bg-[#FCF9F4] p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DDD0] pb-3">
              <span className="font-display text-xl font-bold text-[#231712]">Madhura Mithai</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#635147]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-1 text-sm font-medium text-[#231712]">
              {CATEGORY_TILES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.id);
                    scrollToSection('bestsellers');
                  }}
                  className="flex min-h-[44px] items-center justify-between rounded-lg px-3 text-left hover:bg-[#F4EDE2]"
                >
                  <span>{cat.title}</span>
                  <span className="text-xs text-[#635147]">{cat.itemCount}</span>
                </button>
              ))}
              <div className="my-2 border-t border-[#E6DDD0]" />
              <button
                type="button"
                onClick={() => scrollToSection('special-collections')}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-left hover:bg-[#F4EDE2]"
              >
                Wedding &amp; Corporate Boxes
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('brand-story')}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-left hover:bg-[#F4EDE2]"
              >
                Our Brass-Uruli Kitchen
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAccount();
                }}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-left text-[#7C1D26] font-semibold hover:bg-[#F4EDE2]"
              >
                OTP Sign In / Orders
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
