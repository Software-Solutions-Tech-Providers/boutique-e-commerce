import { useMemo, useState } from 'react';
import { CategoryCarouselSection } from '../components/mithai/CategoryCarouselSection';
import { HeroSection } from '../components/mithai/HeroSection';
import { MithaiCartDrawer } from '../components/mithai/MithaiCartDrawer';
import { MithaiHeader } from '../components/mithai/MithaiHeader';
import { MobileBottomBar } from '../components/mithai/MobileBottomBar';
import { NewsletterAndFooter } from '../components/mithai/NewsletterAndFooter';
import { ProductCarouselSection } from '../components/mithai/ProductCarouselSection';
import { PromoBannerSection } from '../components/mithai/PromoBannerSection';
import { QuickViewModal } from '../components/mithai/QuickViewModal';
import { StoryReviewsSocialSection } from '../components/mithai/StoryReviewsSocialSection';
import { TrustAndCollectionsSection } from '../components/mithai/TrustAndCollectionsSection';
import { UtilityModals } from '../components/mithai/UtilityModals';
import { MITHAI_PRODUCTS, MithaiCategory } from '../data/mithaiData';

export function MithaiHomePage() {
  const [activeCategory, setActiveCategory] = useState<'All' | MithaiCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const bestsellers = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? MITHAI_PRODUCTS.filter((p) => p.sectionTags.includes('bestseller'))
        : MITHAI_PRODUCTS.filter((p) => p.category === activeCategory);
    return base;
  }, [activeCategory]);

  const featuredProducts = useMemo(
    () => MITHAI_PRODUCTS.filter((p) => p.sectionTags.includes('featured')).slice(0, 4),
    []
  );

  const newArrivals = useMemo(
    () => MITHAI_PRODUCTS.filter((p) => p.sectionTags.includes('new')).slice(0, 4),
    []
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#231712]">
      {/* Sections 1, 2, 3: Announcement Bar, Mobile Header & Category Navigation */}
      <MithaiHeader
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchOpen={searchOpen}
        onToggleSearch={setSearchOpen}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      <main className="space-y-10 sm:space-y-14 pb-12 sm:pb-16">
        {/* Section 4: Hero Banner */}
        <HeroSection
          onShopBestsellers={() => {
            setActiveCategory('All');
            scrollTo('bestsellers');
          }}
          onShopCombos={() => {
            setActiveCategory('Celebration Combos');
            scrollTo('bestsellers');
          }}
        />

        {/* Section 5: Shop by Category */}
        <CategoryCarouselSection
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />

        {/* Section 6: Best Sellers (reflects selected category filter) */}
        <ProductCarouselSection
          id="bestsellers"
          eyebrow="Customer Favourites"
          title={activeCategory === 'All' ? 'Best Sellers' : activeCategory}
          products={bestsellers}
          activeCategoryFilter={activeCategory}
          onResetCategory={() => setActiveCategory('All')}
        />

        {/* Section 7: Featured Products */}
        <ProductCarouselSection
          id="featured-products"
          eyebrow="Signature Brass-Uruli Picks"
          title="Featured Delicacies"
          products={featuredProducts}
        />

        {/* Section 8: Promotional / Discount Banner */}
        <PromoBannerSection
          onExploreCombos={() => {
            setActiveCategory('Celebration Combos');
            scrollTo('bestsellers');
          }}
        />

        {/* Section 9: New Arrivals */}
        <ProductCarouselSection
          id="new-arrivals"
          eyebrow="Fresh Seasonal Batches"
          title="New Arrivals"
          products={newArrivals}
        />

        {/* Sections 10 & 11: Trust Factors + Special Collections */}
        <TrustAndCollectionsSection
          onSelectCollection={(cat) => setActiveCategory(cat)}
        />

        {/* Sections 12, 13, 14: Customer Testimonials, Brand Story & Social Gallery */}
        <StoryReviewsSocialSection />

        {/* Section 15 & 16: Newsletter Subscription & Footer */}
        <NewsletterAndFooter onSelectCategory={(cat) => setActiveCategory(cat)} />
      </main>

      {/* Mobile Bottom Thumb Navigation + Modals & Bag Drawer */}
      <MobileBottomBar onOpenSearch={() => setSearchOpen(true)} />
      <QuickViewModal />
      <MithaiCartDrawer />
      <UtilityModals
        wishlistOpen={wishlistOpen}
        onCloseWishlist={() => setWishlistOpen(false)}
        accountOpen={accountOpen}
        onCloseAccount={() => setAccountOpen(false)}
      />
    </div>
  );
}
