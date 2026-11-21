import React, { useMemo, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

export function Header() {
  const navigate = useNavigate();
  const { cartCount, openCart, wishlistIds } = useStore();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [topBannerDismissed, setTopBannerDismissed] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#FAF9F6] border-b border-[#E5E0D8]">
      {/* 1. App Promo Bar matching Screenshot 7 */}
      {!topBannerDismissed && (
        <div className="flex h-9 items-center justify-between bg-[#F2EFE9] px-3 text-xs text-[#1C1917] sm:px-6 border-b border-[#E5E0D8]/60">
          <div className="flex-1 text-center truncate">
            <span>use code: <strong>APP5%</strong> · To get 5% off on 1st order</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => alert('Install our mobile web app for instant 1-tap checkout and exclusive drops!')}
              className="rounded-full bg-[#1C1917] px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-black transition-colors"
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

      {/* 2. Brand Authority Strip matching Screenshot 7 */}
      <div className="flex h-7 items-center justify-center bg-[#14532D] px-4 text-[11px] font-medium text-white tracking-wide">
        <span>🏆 Featured in Weaver Handloom Collective · Silk Mark Certified</span>
      </div>

      {/* 3. Main Header Bar matching Screenshot 7 */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9]"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap"
          >
            Kora &amp; Loom
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#57534E]">
          <Link to="/collections" className="hover:text-[#1C1917] hover:underline underline-offset-4">
            Collections
          </Link>
          <Link to="/collections/silk-sarees" className="hover:text-[#1C1917] hover:underline underline-offset-4">
            Silk Sarees
          </Link>
          <Link to="/collections/cotton-linen" className="hover:text-[#1C1917] hover:underline underline-offset-4">
            Cotton &amp; Linen
          </Link>
          <Link to="/collections/blouses-jewellery" className="hover:text-[#1C1917] hover:underline underline-offset-4">
            Blouses &amp; Jewellery
          </Link>
          <Link to="/quiz" className="hover:text-[#1C1917] hover:underline underline-offset-4">
            Saree Finder
          </Link>
          <Link to="/offers" className="hover:text-[#1C1917] hover:underline underline-offset-4">
            Offers
          </Link>
        </nav>

        {/* Actions Cluster */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search sarees"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9] cursor-pointer"
          >
            <Search className="h-4 w-4" />
          </button>

          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlistIds.length})`}
            className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9]"
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
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9]"
          >
            <User className="h-4 w-4" />
            <span>{user ? user.name.split(' ')[0] : 'Account'}</span>
          </Link>

          {/* Bag with Red Notification Count matching Screenshot 7 */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-[#1C1917] hover:bg-[#F2EFE9] cursor-pointer"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E11D48] px-1 text-[10px] font-bold text-white tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="border-t border-[#E5E0D8] bg-white px-4 py-3 sm:px-6 shadow-md animate-in fade-in duration-150">
          <div className="mx-auto max-w-4xl">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#57534E]" />
                <input
                  type="search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Kanchipuram, Banarasi, SKU (e.g. KL-KNC-101)..."
                  className="w-full rounded-md border border-[#E5E0D8] bg-[#FAF9F6] py-2 pl-9 pr-3 text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-[#14532D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F3F22]"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#57534E] hover:text-[#1C1917]"
              >
                <X className="h-4 w-4" />
              </button>
            </form>

            {query.trim() && (
              <div className="mt-3 divide-y divide-[#E5E0D8] rounded-md border border-[#E5E0D8] bg-white">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-[#FAF9F6] transition-colors"
                  >
                    <SafeImage src={p.images[0].url} alt={p.name} className="h-10 w-8 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold text-[#1C1917]">{p.name}</p>
                      <p className="text-[11px] text-[#57534E]">
                        {p.weave} · <strong className="text-[#14532D] tabular-nums">{formatINR(p.price)}</strong>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-[#FAF9F6] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <span className="font-display text-2xl font-bold text-[#1C1917]">Kora &amp; Loom</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
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
    </header>
  );
}
