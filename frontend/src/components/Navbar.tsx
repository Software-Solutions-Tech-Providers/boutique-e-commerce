import React, { useMemo, useState } from 'react';
import {
  Globe,
  Heart,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LANGUAGE_OPTIONS, LanguageCode } from '../i18n/translations';
import { formatINR } from '../utils/commerce';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const {
    view,
    navigate,
    cart,
    wishlist,
    products,
    categories,
    currentUser,
    setCartOpen,
    setAuthOpen,
    theme,
    setTheme,
    language,
    setLanguage,
    t,
  } = useStore();

  const [promoVisible, setPromoVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const suggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products.slice(0, 4);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabricType.toLowerCase().includes(q) ||
          p.weaveOrigin.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchTerm, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate({ page: 'catalog', search: searchTerm.trim() });
  };

  return (
    <div className="sticky top-0 z-40 no-print bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
      {/* Slim Utility & Preferences Strip (Announcement + Theme + Language) */}
      <div className="bg-[#141416] text-white text-xs min-h-[30px] sm:min-h-[34px] px-3 sm:px-6 lg:px-10 py-1.5 sm:py-1 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            className="inline-flex items-center gap-1.5 text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#E5C98B]" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#E5C98B]" />
                <span>Light</span>
              </>
            )}
          </button>
          <span className="text-neutral-600" aria-hidden="true">
            |
          </span>
          <label className="inline-flex items-center gap-1.5 text-neutral-300">
            <Globe className="w-3.5 h-3.5 text-[#E5C98B]" />
            <select
              aria-label="Select language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code} className="text-black">
                  {opt.nativeLabel}
                </option>
              ))}
            </select>
          </label>
        </div>

        {promoVisible ? (
          <p className="text-center leading-snug tracking-wide flex-1 min-w-0 text-[11px] sm:text-xs text-balance md:truncate">
            {t.announcement}
          </p>
        ) : (
          <div className="flex-1 min-w-0" />
        )}

        <div className="flex items-center gap-2 shrink-0">
          {promoVisible && (
            <button
              type="button"
              onClick={() => setPromoVisible(false)}
              aria-label="Dismiss announcement"
              className="p-0.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3-Zone Header */}
      <header className="max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 min-w-0">
        {/* Zone 1: Bespoke Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-1.5 sm:p-2 -ml-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => navigate({ page: 'home' })}
            className="cursor-pointer text-[var(--text-primary)] min-w-0 max-w-full flex items-center"
            aria-label="Vastra Atelier Home"
          >
            <BrandLogo />
          </button>
        </div>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-[var(--text-secondary)]"
          onMouseLeave={() => setMegaMenuOpen(false)}
        >
          <div className="relative" onMouseEnter={() => setMegaMenuOpen(true)}>
            <button
              type="button"
              onClick={() => {
                setMegaMenuOpen(false);
                navigate({ page: 'categories' });
              }}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                view.page === 'categories' ||
                (view.page === 'catalog' && (!view.category || view.category === 'all'))
                  ? 'border-[var(--accent)] text-[var(--text-primary)]'
                  : 'border-transparent hover:text-[var(--text-primary)]'
              }`}
            >
              {t.nav.collections}
            </button>

            {megaMenuOpen && (
              <div className="absolute left-0 top-full pt-2 w-[540px] z-50">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-xl p-5 grid grid-cols-2 gap-5 text-xs">
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-secondary)]">
                      Boutique Categories
                    </p>
                    <div className="space-y-1">
                      {categories.slice(0, 6).map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setMegaMenuOpen(false);
                            navigate({ page: 'catalog', category: cat.id });
                          }}
                          className="block w-full text-left py-1 text-[var(--text-primary)] hover:text-[var(--accent)] cursor-pointer"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 border-l border-[var(--border-color)] pl-5">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-secondary)]">
                      Discover &amp; Explore
                    </p>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMegaMenuOpen(false);
                          navigate({ page: 'categories' });
                        }}
                        className="block w-full text-left py-1 font-semibold text-[var(--accent)] hover:underline cursor-pointer"
                      >
                        Browse All 12 Categories
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMegaMenuOpen(false);
                          navigate({ page: 'catalog', category: 'cat-new-arrivals' });
                        }}
                        className="block w-full text-left py-1 text-[var(--text-primary)] hover:text-[var(--accent)] cursor-pointer"
                      >
                        New Arrivals
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMegaMenuOpen(false);
                          navigate({ page: 'reviews' });
                        }}
                        className="block w-full text-left py-1 text-[var(--text-primary)] hover:text-[var(--accent)] cursor-pointer"
                      >
                        Customer Reviews &amp; Photos
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMegaMenuOpen(false);
                          navigate({ page: 'info', section: 'about' });
                        }}
                        className="block w-full text-left py-1 text-[var(--text-primary)] hover:text-[var(--accent)] cursor-pointer"
                      >
                        About Vastra Atelier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate({ page: 'catalog', category: 'cat-sarees' })}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              view.page === 'catalog' && view.category === 'cat-sarees'
                ? 'border-[var(--accent)] text-[var(--text-primary)]'
                : 'border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            {t.nav.sarees}
          </button>
          <button
            type="button"
            onClick={() => navigate({ page: 'catalog', category: 'cat-cotton-linen' })}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              view.page === 'catalog' && view.category === 'cat-cotton-linen'
                ? 'border-[var(--accent)] text-[var(--text-primary)]'
                : 'border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            {t.nav.fabrics}
          </button>
          <button
            type="button"
            onClick={() => navigate({ page: 'catalog', category: 'cat-bridal' })}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              view.page === 'catalog' && view.category === 'cat-bridal'
                ? 'border-[var(--accent)] text-[var(--text-primary)]'
                : 'border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            {t.nav.bridal}
          </button>
          <button
            type="button"
            onClick={() => navigate({ page: 'account', tab: 'track' })}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              view.page === 'account' && view.tab === 'track'
                ? 'border-[var(--accent)] text-[var(--text-primary)]'
                : 'border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            {t.nav.trackOrder}
          </button>
        </nav>

        {/* Zone 3: Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2.5 lg:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search textiles"
            className="p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          <button
            type="button"
            onClick={() => navigate({ page: 'wishlist' })}
            aria-label="Wishlist"
            className="relative p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Heart className="w-[18px] h-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0 min-w-[16px] h-4 px-1 bg-[var(--accent)] text-white dark:text-[#141416] text-[10px] font-semibold rounded-full flex items-center justify-center tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff') && (
            <button
              type="button"
              onClick={() => navigate({ page: 'admin' })}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view.page === 'admin'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.nav.admin}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => (currentUser ? navigate({ page: 'account', tab: 'profile' }) : setAuthOpen(true))}
            aria-label={currentUser ? currentUser.name : t.nav.signIn}
            className="hidden sm:inline-flex items-center gap-1.5 px-2 lg:px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserIcon className="w-4 h-4" />
            <span className="max-w-[90px] truncate">
              {currentUser ? currentUser.name.split(' ')[0] : t.nav.signIn}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`${t.nav.bag} (${cartCount})`}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white dark:text-[#141416] bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t.nav.bag}</span>
            <span>({cartCount})</span>
          </button>
        </div>
      </header>

      {/* Expandable Live Search */}
      {searchOpen && (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] px-4 sm:px-6 lg:px-10 py-4 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Banarasi silk, Jamdani cotton, Chanderi dress materials, linen..."
                className="w-full pl-10 pr-24 py-2.5 text-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--text-primary)] text-[var(--bg-surface)] rounded cursor-pointer"
              >
                Search
              </button>
            </form>

            <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                {searchTerm.trim() ? 'Matching weaves' : 'Popular boutique searches'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      navigate({ page: 'product', slug: item.slug });
                    }}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--bg-subtle)] text-left transition-colors cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 object-cover rounded bg-[var(--bg-subtle)] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] tabular-nums">
                        {item.fabricType} · {formatINR(item.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile & Tablet Navigation Drawer (including Theme + Language Controls) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-4 space-y-4 max-h-[calc(100vh-5.5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="text-xs text-[var(--text-secondary)] space-y-1">
              <span>Theme</span>
              <div
                role="group"
                aria-label="Mobile theme switch"
                className="grid grid-cols-2 gap-1 p-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)]"
              >
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`inline-flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                    theme === 'light'
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`inline-flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
              </div>
            </div>
            <label className="text-xs text-[var(--text-secondary)] space-y-1">
              <span>Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="w-full px-2.5 py-2 rounded bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)]"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.nativeLabel}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ page: 'catalog', category: cat.id });
                }}
                className="text-left text-sm py-2 px-3 rounded bg-[var(--bg-subtle)] text-[var(--text-primary)]"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate({ page: 'categories' });
              }}
              className="text-[var(--text-primary)] font-medium"
            >
              All Categories
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate({ page: 'reviews' });
              }}
              className="text-[var(--text-secondary)]"
            >
              Reviews
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate({ page: 'info', section: 'about' });
              }}
              className="text-[var(--text-secondary)]"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate({ page: 'account', tab: 'track' });
              }}
              className="text-[var(--text-secondary)]"
            >
              {t.nav.trackOrder}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentUser) navigate({ page: 'account', tab: 'profile' });
                else setAuthOpen(true);
              }}
              className="font-medium text-[var(--accent)]"
            >
              {currentUser ? currentUser.name.split(' ')[0] : t.nav.signIn}
            </button>
            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff') && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ page: 'admin' });
                }}
                className="font-semibold text-[var(--text-primary)]"
              >
                {t.nav.admin}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
