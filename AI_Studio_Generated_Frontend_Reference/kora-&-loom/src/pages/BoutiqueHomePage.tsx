import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  BoutiqueCarouselSection,
  BoutiquePromoBanner,
  PriceBandFilter,
} from '../components/boutique/BoutiqueCarouselAndPromo';
import { BoutiqueCartDrawer } from '../components/boutique/BoutiqueCartDrawer';
import { BoutiqueHeader } from '../components/boutique/BoutiqueHeader';
import { BoutiqueHeroBanner, BoutiqueCategoryStrip, BoutiqueStickyCategoryNav } from '../components/boutique/BoutiqueHeroAndCategories';
import { BoutiqueHowToOrder } from '../components/boutique/BoutiqueHowToOrder';
import { BoutiqueInstagramFavorites } from '../components/boutique/BoutiqueInstagramFavorites';
import { BoutiqueMobileBottomBar } from '../components/boutique/BoutiqueMobileBottomBar';
import { BoutiqueNewsletterAndFooter } from '../components/boutique/BoutiqueNewsletterAndFooter';
import { BoutiqueQuickViewModal } from '../components/boutique/BoutiqueQuickViewModal';
import { BoutiqueStoryReviewsSocial } from '../components/boutique/BoutiqueStoryReviewsSocial';
import { BoutiqueSupportChatbot } from '../components/boutique/BoutiqueSupportChatbot';
import { BoutiqueTrustAndCollections } from '../components/boutique/BoutiqueTrustAndCollections';
import { BoutiqueUtilityModals } from '../components/boutique/BoutiqueUtilityModals';
import { useLanguage } from '../context/LanguageContext';
import { BoutiqueCategory, SAREE_PRODUCTS } from '../data/boutiqueData';

export function BoutiqueHomePage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'All' | BoutiqueCategory>('All');
  const [priceFilter, setPriceFilter] = useState<PriceBandFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [expandPrimary, setExpandPrimary] = useState(false);
  const [expandNewArrivals, setExpandNewArrivals] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(true);

  useEffect(() => {
    const updateScrollControls = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      setShowScrollTop(scrollY > 80);
      const atBottom = scrollY + viewportH >= docH - 64;
      setShowScrollBottom(docH > viewportH + 40 && !atBottom);
    };

    updateScrollControls();
    window.addEventListener('scroll', updateScrollControls, { passive: true });
    window.addEventListener('resize', updateScrollControls, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateScrollControls);
      observer.observe(document.documentElement);
    }

    return () => {
      window.removeEventListener('scroll', updateScrollControls);
      window.removeEventListener('resize', updateScrollControls);
      observer?.disconnect();
    };
  }, []);

  const handleSelectCategory = (cat: 'All' | BoutiqueCategory) => {
    setActiveCategory(cat);
    setPriceFilter('all');
    setExpandPrimary(false);
    setExpandNewArrivals(false);
    requestAnimationFrame(() => {
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleViewAllCollections = () => {
    setActiveCategory('All');
    setPriceFilter('all');
    setExpandPrimary(true);
    requestAnimationFrame(() => {
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const filteredPrimary = useMemo(() => {
    const byCategory =
      activeCategory === 'All'
        ? SAREE_PRODUCTS
        : SAREE_PRODUCTS.filter((p) => p.category === activeCategory);

    if (priceFilter === 'under-1500') return byCategory.filter((p) => p.price < 1500);
    if (priceFilter === '1500-3000') return byCategory.filter((p) => p.price >= 1500 && p.price <= 3000);
    if (priceFilter === 'above-3000') return byCategory.filter((p) => p.price > 3000);
    return byCategory;
  }, [activeCategory, priceFilter]);

  const bestSellers = useMemo(() => {
    if (activeCategory === 'All' && priceFilter === 'all' && !expandPrimary) {
      return filteredPrimary.slice(0, 4);
    }
    return filteredPrimary;
  }, [activeCategory, priceFilter, expandPrimary, filteredPrimary]);

  const remainingProducts = useMemo(() => {
    const shownIds = new Set(bestSellers.map((p) => p.id));
    return SAREE_PRODUCTS.filter((p) => !shownIds.has(p.id));
  }, [bestSellers]);

  const newArrivals = useMemo(() => {
    return expandNewArrivals ? remainingProducts : remainingProducts.slice(0, 2);
  }, [remainingProducts, expandNewArrivals]);

  const scrollToBestsellers = () => {
    const el = document.getElementById('bestsellers');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToBridal = () => {
    handleSelectCategory('Bridal & Gift Combos');
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setPriceFilter('all');
    setExpandPrimary(false);
    setExpandNewArrivals(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const primaryProductsSection = (
    <BoutiqueCarouselSection
      id="bestsellers"
      eyebrow={activeCategory === 'All' ? t.curatedCollection : t.shopByCategory}
      title={activeCategory === 'All' ? t.bestSellers : t.categories[activeCategory]}
      products={bestSellers}
      layout="grid"
      activeCategoryFilter={activeCategory}
      onResetCategory={handleResetFilters}
      priceFilter={priceFilter}
      onChangePriceFilter={(band) => {
        setPriceFilter(band);
        setExpandPrimary(false);
      }}
      hasMore={filteredPrimary.length > bestSellers.length}
      isExpanded={expandPrimary}
      onToggleExpand={
        activeCategory === 'All' && priceFilter === 'all'
          ? () => setExpandPrimary((prev) => !prev)
          : undefined
      }
      expandLabel={t.viewMore}
      onViewAllCollections={
        activeCategory !== 'All' || !expandPrimary ? handleViewAllCollections : undefined
      }
    />
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-[#FCF9F4] text-[#231712]">
      {/* Header with Single Menu Icon, Top-Left Search (md+) & Centered "Kora + Logo + Loom" */}
      <BoutiqueHeader
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchOpen={searchOpen}
        onToggleSearch={setSearchOpen}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* Sticky Category Navigation Bar across Mobile, Tablet, Laptop & Desktop */}
      <BoutiqueStickyCategoryNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      <main className="w-full space-y-3 sm:space-y-4 pb-0">
        {/* Full-Width Uncropped Single-Screen Hero Banner */}
        <BoutiqueHeroBanner
          onShopBestsellers={scrollToBestsellers}
          onShopBridal={scrollToBridal}
        />

        {/* Instagram Favorites Directly Below Hero Banner */}
        <BoutiqueInstagramFavorites />

        {/* When a specific category is selected, display selected category's products first before Shop by Category */}
        {activeCategory !== 'All' ? (
          <>
            {primaryProductsSection}
            <BoutiqueCategoryStrip
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
          </>
        ) : (
          <>
            <BoutiqueCategoryStrip
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
            {primaryProductsSection}
          </>
        )}

        {/* Promotional Offer Strip */}
        <BoutiquePromoBanner onExploreBridal={scrollToBridal} />

        {/* Fresh Off the Loom (excluding products already shown above, with Show More) */}
        {newArrivals.length > 0 && (
          <BoutiqueCarouselSection
            id="new-arrivals"
            eyebrow={t.freshOffLoom}
            title={t.newArrivals}
            products={newArrivals}
            layout="grid"
            hasMore={remainingProducts.length > newArrivals.length}
            isExpanded={expandNewArrivals}
            onToggleExpand={
              remainingProducts.length > 2
                ? () => setExpandNewArrivals((prev) => !prev)
                : undefined
            }
            expandLabel={t.showMore}
          />
        )}

        {/* Step-by-Step How to Order Video Section */}
        <BoutiqueHowToOrder onStartShopping={scrollToBestsellers} />

        {/* Trust Strip & Customer Reviews */}
        <BoutiqueTrustAndCollections />
        <BoutiqueStoryReviewsSocial />

        {/* Customer Support Callback + Centered Footer */}
        <BoutiqueNewsletterAndFooter
          onSelectCategory={handleSelectCategory}
          onOpenAccount={() => setAccountOpen(true)}
        />
      </main>

      {/* Smooth Scroll Controls: At top -> Scroll to Bottom only; middle -> both; bottom -> Back to Top only */}
      <div className="fixed bottom-14 left-2.5 z-40 flex flex-col gap-1.5 md:bottom-5 md:left-5">
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label={t.backToTop}
            title={t.backToTop}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E6DDD0] bg-[#FCF9F4]/95 text-[#231712] shadow-md backdrop-blur-xs transition-colors hover:border-[#7C1D26] hover:bg-[#7C1D26] hover:text-white cursor-pointer"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
        {showScrollBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label={t.scrollToBottom}
            title={t.scrollToBottom}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E6DDD0] bg-[#FCF9F4]/95 text-[#231712] shadow-md backdrop-blur-xs transition-colors hover:border-[#7C1D26] hover:bg-[#7C1D26] hover:text-white cursor-pointer"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* AI-Powered Multilingual Support Chatbot & Floating Instagram + WhatsApp "Help" */}
      <BoutiqueSupportChatbot />

      {/* Mobile 48px Thumb Bottom Bar */}
      <BoutiqueMobileBottomBar
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      {/* Quick View, Slide-over Saree Bag, Wishlist & OTP Sign-In */}
      <BoutiqueQuickViewModal />
      <BoutiqueCartDrawer />
      <BoutiqueUtilityModals
        wishlistOpen={wishlistOpen}
        onCloseWishlist={() => setWishlistOpen(false)}
        accountOpen={accountOpen}
        onCloseAccount={() => setAccountOpen(false)}
      />
    </div>
  );
}
