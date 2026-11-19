import React, { useMemo, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

export function Header() {
  const navigate = useNavigate();
  const { cartCount, openCart, wishlistIds, bannerDismissed, dismissBanner } = useStore();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.weave.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.occasion.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/collections?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E0D8]">
      {!bannerDismissed && (
        <div className="flex h-9 items-center justify-between bg-[#14532D] px-4 text-xs text-white sm:px-6">
          <div className="flex-1 text-center truncate">
            <span>Free Express Shipping above ₹2,500 · Cash on Delivery &amp; 7-Day Easy Exchanges · </span>
            <Link to="/campaign/diwali" className="underline underline-offset-2 font-semibold hover:text-white/90">
              Shop Diwali Edit
            </Link>
          </div>
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Close announcement"
            className="ml-2 p-1 text-white/80 hover:text-white shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9] md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0"
          >
            Kora &amp; Loom
          </Link>
        </div>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
          <Link to="/collections" className="hover:text-[#1C1917] hover:underline underline-offset-4 whitespace-nowrap shrink-0">
            Collections
          </Link>
          <Link to="/campaign/diwali" className="hover:text-[#1C1917] hover:underline underline-offset-4 whitespace-nowrap shrink-0">
            Diwali Edit
          </Link>
          <Link to="/quiz" className="hover:text-[#1C1917] hover:underline underline-offset-4 whitespace-nowrap shrink-0">
            Saree Finder
          </Link>
          <Link to="/offers" className="hover:text-[#1C1917] hover:underline underline-offset-4 whitespace-nowrap shrink-0">
            Offers
          </Link>
          <Link to="/support" className="hover:text-[#1C1917] hover:underline underline-offset-4 whitespace-nowrap shrink-0">
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search weaves or SKU codes"
            className="flex h-10 items-center gap-2 rounded-md px-2.5 text-sm font-medium text-[#1C1917] hover:bg-[#F2EFE9] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search</span>
          </button>

          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlistIds.length} saved)`}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9]"
          >
            <Heart className="h-4 w-4" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1.5 right-1.5 text-[10px] font-semibold text-[#14532D] tabular-nums">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          <Link
            to="/account"
            aria-label="Account and Orders"
            className="flex h-10 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-[#1C1917] hover:bg-[#F2EFE9] whitespace-nowrap shrink-0"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Orders'}</span>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#14532D] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#0F3F22] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#E5E0D8] bg-white px-4 py-4 sm:px-6 shadow-md">
          <div className="mx-auto max-w-4xl">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#57534E]" />
                <input
                  type="search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by saree name, weave (Kanchipuram, Linen), or video SKU code (e.g. KL-KNC-101)..."
                  className="w-full rounded-md border border-[#E5E0D8] bg-[#FAF9F6] py-2.5 pl-10 pr-4 text-sm text-[#1C1917] placeholder:text-[#57534E] focus:border-[#14532D] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-[#14532D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] whitespace-nowrap shrink-0 cursor-pointer"
              >
                View All
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="p-2 text-[#57534E] hover:text-[#1C1917]"
              >
                <X className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-3 rounded-md border border-[#E5E0D8] p-2 hover:bg-[#FAF9F6] transition-colors"
                >
                  <SafeImage
                    src={item.images[0].url}
                    alt={item.name}
                    className="h-14 w-12 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#1C1917]">{item.name}</p>
                    <p className="text-xs text-[#57534E] tabular-nums">
                      {item.sku} · {item.weave} · {formatINR(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
              {searchResults.length === 0 && (
                <p className="text-sm text-[#57534E] py-2">
                  No weaves matched “{query}”. Try searching Kanchipuram, Maheshwari, Blouse, or KL-KNC-101.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 flex w-72 max-w-[85vw] flex-col bg-[#FAF9F6] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
              <span className="font-display text-xl font-bold text-[#1C1917]">Kora &amp; Loom</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 text-[#57534E]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-4 text-base font-medium text-[#1C1917]">
              <Link to="/collections" onClick={() => setMobileMenuOpen(false)} className="py-1">
                All Collections
              </Link>
              <Link to="/collections/silk-sarees" onClick={() => setMobileMenuOpen(false)} className="py-1">
                Heirloom Silks
              </Link>
              <Link to="/collections/cotton-linen" onClick={() => setMobileMenuOpen(false)} className="py-1">
                Summer Cottons &amp; Linens
              </Link>
              <Link to="/collections/under-1500" onClick={() => setMobileMenuOpen(false)} className="py-1">
                Under ₹1,500
              </Link>
              <Link to="/campaign/diwali" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#14532D] font-semibold">
                Diwali Festive Edit
              </Link>
              <Link to="/quiz" onClick={() => setMobileMenuOpen(false)} className="py-1">
                Saree Finder Quiz
              </Link>
              <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="py-1">
                Buy More – Save More Offers
              </Link>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="py-1">
                Orders &amp; Tracking
              </Link>
              <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="py-1">
                Returns &amp; Support
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
