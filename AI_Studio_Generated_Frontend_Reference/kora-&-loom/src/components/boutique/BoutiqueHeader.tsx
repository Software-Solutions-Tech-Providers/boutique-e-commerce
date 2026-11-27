import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useBoutiqueCart } from '../../context/BoutiqueCartContext';
import { useLanguage } from '../../context/LanguageContext';
import { BoutiqueLogoMark } from './BoutiqueLogoMark';
import { LanguageSelector } from './LanguageSelector';
import {
  BOUTIQUE_CATEGORIES,
  BoutiqueCategory,
  BRAND_INFO,
  SAREE_PRODUCTS,
} from '../../data/boutiqueData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

interface BoutiqueHeaderProps {
  activeCategory: 'All' | BoutiqueCategory;
  onSelectCategory: (cat: 'All' | BoutiqueCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchOpen: boolean;
  onToggleSearch: (open: boolean) => void;
  onOpenAccount: () => void;
  onOpenWishlist: () => void;
}

export function BoutiqueHeader({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  searchOpen,
  onToggleSearch,
  onOpenAccount,
  onOpenWishlist,
}: BoutiqueHeaderProps) {
  const { cartCount, openCart, wishlistIds, openQuickView } = useBoutiqueCart();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState<'sarees' | 'bridal' | null>('sarees');

  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SAREE_PRODUCTS.slice(0, 4);
    return SAREE_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCatAndScroll = (cat: 'All' | BoutiqueCategory) => {
    setMenuOpen(false);
    onSelectCategory(cat);
  };

  const renderSearchBox = (variant: 'mobile' | 'desktop') => (
    <div
      className={
        variant === 'desktop'
          ? 'relative w-full max-w-[210px] lg:max-w-[270px] xl:max-w-[330px] 2xl:max-w-[420px]'
          : 'relative flex-1'
      }
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#635147]" />
      <input
        type="search"
        value={searchQuery}
        onFocus={() => onToggleSearch(true)}
        onChange={(e) => {
          onSearchChange(e.target.value);
          onToggleSearch(true);
        }}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchPlaceholder}
        className="h-9 2xl:h-10 w-full rounded-full border border-[#E6DDD0] bg-white pl-9 pr-8 text-xs sm:text-sm 2xl:text-base text-[#231712] placeholder:text-[#635147]/75 focus:border-[#7C1D26] focus:outline-none"
      />
      {(searchQuery || searchOpen) && (
        <button
          type="button"
          onClick={() => {
            onSearchChange('');
            onToggleSearch(false);
          }}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#635147] hover:bg-[#F4EDE2] cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Clean Live Search Dropdown */}
      {searchOpen && (
        <div
          className={`absolute left-0 top-11 z-50 rounded-2xl border border-[#E6DDD0] bg-white p-3 shadow-xl space-y-2 ${
            variant === 'desktop' ? 'w-[340px] lg:w-[420px]' : 'right-0'
          }`}
        >
          <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
            {searchMatches.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onToggleSearch(false);
                  openQuickView(item);
                }}
                className="flex items-center gap-3 rounded-xl border border-[#E6DDD0]/80 bg-[#FCF9F4] p-2 text-left hover:border-[#7C1D26]/40 cursor-pointer"
              >
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#231712]">{item.name}</p>
                  <p className="text-[11px] text-[#635147] tabular-nums">{formatINR(item.price)}</p>
                </div>
              </button>
            ))}
            {searchMatches.length === 0 && (
              <p className="px-2 py-2 text-xs text-[#635147]">{t.noMatches}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="relative z-40 w-full border-b border-[#E6DDD0] bg-[#FCF9F4]">
        <div className="w-full px-2 py-1.5 sm:px-4 sm:py-2 lg:px-6 2xl:px-10 space-y-1.5 md:space-y-0">
          {/* Row 1: Menu Icon (+ Top-Left Search on md+) | Centered Brand Name + Logo | Language Selector + Utility Icons */}
          <div className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            {/* Top-Left: Menu Icon + Search Bar (on tablet, laptop, desktop & Smart TV) */}
            <div className="flex items-center justify-self-start gap-2 min-w-0 w-full">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t.menu}
                className="inline-flex h-9 w-9 2xl:h-10 2xl:w-10 shrink-0 items-center justify-center rounded-full text-[#231712] hover:bg-[#F4EDE2] transition-colors cursor-pointer"
              >
                <Menu className="h-5 w-5 2xl:h-6 2xl:w-6 stroke-[1.75] shrink-0" />
              </button>

              <div className="hidden md:flex flex-1 min-w-0">
                {renderSearchBox('desktop')}
              </div>
            </div>

            {/* Top-Center: Single-Line Brand ("Kora + Logo + Loom") */}
            <a
              href="#top"
              aria-label={`${BRAND_INFO.name} Home`}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 justify-self-center whitespace-nowrap group"
            >
              <span className="font-display text-[15px] min-[375px]:text-[16px] sm:text-xl lg:text-[22px] 2xl:text-[26px] font-bold tracking-tight text-[#231712] group-hover:text-[#7C1D26] transition-colors">
                {BRAND_INFO.firstWord}
              </span>
              <BoutiqueLogoMark className="h-6 w-6 min-[375px]:h-7 min-[375px]:w-7 sm:h-9 sm:w-9 2xl:h-10 2xl:w-10 shrink-0 shadow-xs rounded-lg" />
              <span className="font-display text-[15px] min-[375px]:text-[16px] sm:text-xl lg:text-[22px] 2xl:text-[26px] font-bold tracking-tight text-[#231712] group-hover:text-[#7C1D26] transition-colors">
                {BRAND_INFO.secondWord}
              </span>
            </a>

            {/* Top-Right: Responsive Website Language Selector + Wishlist, Account & Bag */}
            <div className="flex items-center justify-end justify-self-end gap-0.5 sm:gap-1.5 2xl:gap-2.5">
              <div className="hidden md:block">
                <LanguageSelector
                  value={language}
                  onChange={setLanguage}
                  label={t.languageLabel}
                  variant="header-desktop"
                />
              </div>

              <button
                type="button"
                onClick={onOpenWishlist}
                aria-label={`${t.wishlist} (${wishlistIds.length})`}
                className="relative flex h-9 w-[26px] min-[375px]:w-7 sm:w-9 2xl:h-10 2xl:w-10 items-center justify-center rounded-full text-[#231712] hover:bg-[#F4EDE2] transition-colors cursor-pointer"
              >
                <Heart className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] 2xl:h-5 2xl:w-5 stroke-[1.75]" />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1.5 right-0.5 h-2 w-2 rounded-full bg-[#7C1D26]" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={onOpenAccount}
                aria-label={t.account}
                className="flex h-9 w-[26px] min-[375px]:w-7 sm:w-9 2xl:h-10 2xl:w-10 items-center justify-center rounded-full text-[#231712] hover:bg-[#F4EDE2] transition-colors cursor-pointer"
              >
                <User className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] 2xl:h-5 2xl:w-5 stroke-[1.75]" />
              </button>

              <button
                type="button"
                onClick={openCart}
                aria-label={`${t.bag} (${cartCount})`}
                className="relative flex h-9 w-[26px] min-[375px]:w-7 sm:w-9 2xl:h-10 2xl:w-10 items-center justify-center rounded-full text-[#231712] hover:bg-[#F4EDE2] transition-colors cursor-pointer"
              >
                <ShoppingBag className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] 2xl:h-5 2xl:w-5 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0 flex h-4 min-w-[15px] items-center justify-center rounded-full bg-[#7C1D26] px-1 text-[10px] font-semibold text-white tabular-nums">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Row 2 (< md): Preserve Mobile Search Layout + Responsive In-DOM Language Selector */}
          <div className="flex items-center gap-1.5 md:hidden">
            {renderSearchBox('mobile')}
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              label={t.languageLabel}
              variant="header-mobile"
            />
          </div>
        </div>
      </header>

      {/* Slide-Out Boutique Menu Drawer (works across Mobile, Tablet, Laptop & Desktop) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/45" onClick={() => setMenuOpen(false)} />
          <div className="relative z-10 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-[#FCF9F4] p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DDD0] pb-3.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-display text-sm font-bold text-[#231712]">{BRAND_INFO.firstWord}</span>
                <BoutiqueLogoMark className="h-7 w-7 rounded-lg shrink-0" />
                <span className="font-display text-sm font-bold text-[#231712] truncate">{BRAND_INFO.secondWord}</span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#635147] hover:bg-[#F4EDE2] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Persistent Inline Language Grid inside Menu Drawer */}
            <div className="mt-3">
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                label={t.languageLabel}
                variant="drawer-grid"
              />
            </div>

            <nav className="mt-3 flex flex-col gap-1 text-sm font-medium text-[#231712]">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex min-h-[42px] items-center rounded-lg px-3 text-left hover:bg-[#F4EDE2] cursor-pointer"
              >
                {t.home}
              </button>

              <div className="rounded-xl border border-[#E6DDD0] bg-white/80">
                <button
                  type="button"
                  onClick={() => setDrawerSection(drawerSection === 'sarees' ? null : 'sarees')}
                  className="flex min-h-[42px] w-full items-center justify-between px-3 text-left font-semibold text-[#231712] cursor-pointer"
                >
                  <span>{t.shopSareesHeading}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#635147] transition-transform ${
                      drawerSection === 'sarees' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {drawerSection === 'sarees' && (
                  <div className="flex flex-col border-t border-[#E6DDD0] py-1">
                    <button
                      type="button"
                      onClick={() => handleSelectCatAndScroll('All')}
                      className="flex min-h-[38px] items-center justify-between px-4 text-xs text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
                    >
                      <span>{t.allSarees}</span>
                    </button>
                    {BOUTIQUE_CATEGORIES.slice(0, 4).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCatAndScroll(cat.id)}
                        className="flex min-h-[38px] items-center justify-between px-4 text-xs text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
                      >
                        <span>{t.categories[cat.id]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-1 rounded-xl border border-[#E6DDD0] bg-white/80">
                <button
                  type="button"
                  onClick={() => setDrawerSection(drawerSection === 'bridal' ? null : 'bridal')}
                  className="flex min-h-[42px] w-full items-center justify-between px-3 text-left font-semibold text-[#231712] cursor-pointer"
                >
                  <span>{t.bridalCombos}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#635147] transition-transform ${
                      drawerSection === 'bridal' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {drawerSection === 'bridal' && (
                  <div className="flex flex-col border-t border-[#E6DDD0] py-1">
                    {BOUTIQUE_CATEGORIES.slice(4).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCatAndScroll(cat.id)}
                        className="flex min-h-[38px] items-center justify-between px-4 text-xs text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
                      >
                        <span>{t.categories[cat.id]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => scrollToSection('instagram-favorites')}
                className="mt-1 flex min-h-[42px] items-center rounded-lg px-3 text-left hover:bg-[#F4EDE2] cursor-pointer"
              >
                {t.igFavoritesTitle}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('bestsellers')}
                className="flex min-h-[42px] items-center rounded-lg px-3 text-left hover:bg-[#F4EDE2] cursor-pointer"
              >
                {t.bestSellers}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('new-arrivals')}
                className="flex min-h-[42px] items-center rounded-lg px-3 text-left hover:bg-[#F4EDE2] cursor-pointer"
              >
                {t.newArrivals}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('how-to-order')}
                className="flex min-h-[42px] items-center rounded-lg px-3 text-left hover:bg-[#F4EDE2] cursor-pointer"
              >
                {t.howToOrderTitle}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('customer-support')}
                className="flex min-h-[42px] items-center rounded-lg px-3 text-left hover:bg-[#F4EDE2] cursor-pointer"
              >
                {t.supportBadge}
              </button>

              <div className="my-2 border-t border-[#E6DDD0]" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenWishlist();
                }}
                className="flex min-h-[42px] items-center justify-between rounded-lg px-3 text-left hover:bg-[#F4EDE2] cursor-pointer"
              >
                <span>{t.wishlist}</span>
                <span className="text-xs font-semibold text-[#7C1D26] tabular-nums">{wishlistIds.length}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openCart();
                }}
                className="flex min-h-[42px] items-center justify-between rounded-lg px-3 text-left hover:bg-[#F4EDE2] cursor-pointer"
              >
                <span>{t.bag}</span>
                <span className="text-xs font-semibold text-[#7C1D26] tabular-nums">{cartCount}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAccount();
                }}
                className="flex min-h-[42px] items-center rounded-lg px-3 text-left text-[#7C1D26] font-semibold hover:bg-[#F4EDE2] cursor-pointer"
              >
                {t.signIn}
              </button>
            </nav>

            <div className="mt-auto pt-4 border-t border-[#E6DDD0] text-[11px] text-[#635147]">
              <p className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#7C1D26] shrink-0 mt-0.5" />
                <span>{BRAND_INFO.fullAddress}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
