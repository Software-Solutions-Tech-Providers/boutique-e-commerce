import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Mail, Sparkles, X, ZoomIn } from 'lucide-react';
import { BoutiqueVideoSection } from '../components/BoutiqueVideoSection';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { AUDIENCE_SEGMENTS } from '../data/conversionData';
import { Product, Review } from '../types/store';
import { formatINR } from '../utils/commerce';

type CollectionTab = 'new' | 'bestseller' | 'festive' | 'limited' | 'yardage';

export const HomePage: React.FC = () => {
  const {
    banners,
    categories,
    products,
    reviews,
    recentlyViewed,
    coupons,
    attribution,
    clearAttribution,
    navigate,
    subscribeMarketing,
    t,
  } = useStore();

  const [activeTab, setActiveTab] = useState<CollectionTab>('new');
  const [newsletterContact, setNewsletterContact] = useState('');
  const [newsletterChannel, setNewsletterChannel] = useState<'email' | 'whatsapp'>('email');
  const [consentChecked, setConsentChecked] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [activeReviewModal, setActiveReviewModal] = useState<{
    review: Review;
    product?: Product;
  } | null>(null);

  const heroBanner = banners.find((b) => b.kind === 'hero' && b.active) || banners[0];
  const seasonalBanner = banners.find((b) => b.kind === 'seasonal' && b.active) || banners[1];

  const featuredProducts = useMemo(() => {
    switch (activeTab) {
      case 'new':
        return products.filter((p) => p.isNewArrival).slice(0, 6);
      case 'bestseller':
        return products.filter((p) => p.isBestSeller).slice(0, 6);
      case 'festive':
        return products
          .filter((p) => p.occasion === 'Festive' || p.occasion === 'Bridal')
          .slice(0, 6);
      case 'limited':
        return products.filter((p) => p.isLimitedEdition).slice(0, 6);
      case 'yardage':
        return products.filter((p) => p.unitType !== 'piece').slice(0, 6);
    }
  }, [activeTab, products]);

  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewed
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .slice(0, 3),
    [recentlyViewed, products]
  );

  const approvedTestimonials = useMemo(
    () => reviews.filter((r) => r.approved).slice(0, 3),
    [reviews]
  );

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterContact.trim() || !consentChecked) return;
    subscribeMarketing(newsletterContact, newsletterChannel);
    setSubscribed(true);
    setNewsletterContact('');
  };

  return (
    <main className="space-y-12 sm:space-y-20 pb-8">
      {/* Followers-to-Customers Campaign Continuity Strip (only when arriving from a campaign) */}
      {attribution.source !== 'Direct' && attribution.campaign && (
        <div className="bg-[var(--bg-surface)] border-b border-[var(--border-color)]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <p className="text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">{attribution.source} Edit</strong> ·{' '}
              {attribution.landingHeadline || `Curated arrival (${attribution.campaign})`}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ page: 'catalog', category: 'all' })}
                className="font-semibold text-[var(--accent)] hover:underline cursor-pointer"
              >
                View Curated Pieces →
              </button>
              <button
                type="button"
                onClick={clearAttribution}
                aria-label="Dismiss campaign notice"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Mobile Full-Frame Low-Margin Saree Model Hero + Desktop Editorial Split */}
      {heroBanner && (
        <section className="bg-[var(--bg-surface)] border-b border-[var(--border-color)]">
          {/* Mobile & Tablet Portrait View: Girl wearing saree fills screen width with minimal edge margin */}
          <div className="lg:hidden px-1.5 sm:px-3 pt-1.5 pb-4 space-y-3">
            <div className="relative w-full min-h-[74svh] max-h-[680px] rounded-xl overflow-hidden bg-neutral-900">
              <img
                src={heroBanner.image}
                alt={heroBanner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full min-h-[74svh] max-h-[680px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white space-y-2.5">
                <p className="text-[11px] font-medium tracking-widest uppercase text-[#E5C98B]">
                  {heroBanner.kicker}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl leading-[1.08] font-semibold text-white text-balance">
                  {heroBanner.title}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed line-clamp-2 max-w-md">
                  {heroBanner.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate({ page: 'catalog', category: heroBanner.targetCategory || 'all' })
                    }
                    className="px-4 py-2.5 bg-white text-[#141416] hover:bg-neutral-100 text-xs sm:text-sm font-semibold rounded-md inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {heroBanner.ctaLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate({ page: 'catalog', category: 'cat-cotton-linen' })
                    }
                    className="px-4 py-2.5 border border-white/60 bg-black/35 backdrop-blur-xs text-white hover:bg-black/50 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {t.nav.fabrics}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-2 pt-1 grid grid-cols-3 gap-2 text-center text-[11px] text-[var(--text-secondary)]">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Silk Mark</p>
                <p>Pure handloom</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Daylight True</p>
                <p>7-day returns</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Free Shipping</p>
                <p>Above ₹4,999</p>
              </div>
            </div>
          </div>

          {/* Desktop Architectural 12-Column Split */}
          <div className="hidden lg:grid max-w-[1440px] mx-auto grid-cols-12 items-stretch">
            <div className="col-span-5 px-14 py-16 flex flex-col justify-center gap-6">
              <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-gold)]">
                {heroBanner.kicker}
              </p>
              <h1 className="font-display text-[clamp(2.25rem,3.6vw,3.75rem)] leading-[1.08] font-semibold text-[var(--text-primary)] text-balance">
                {heroBanner.title}
              </h1>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
                {heroBanner.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate({ page: 'catalog', category: heroBanner.targetCategory || 'all' })
                  }
                  className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-sm font-medium rounded-md inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {heroBanner.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate({ page: 'catalog', category: 'cat-cotton-linen' })
                  }
                  className="px-5 py-3 border border-[var(--border-color)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.nav.fabrics}
                </button>
              </div>
              <div className="pt-4 border-t border-[var(--border-color)] grid grid-cols-3 gap-4 text-xs text-[var(--text-secondary)]">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Silk Mark Certified</p>
                  <p className="mt-0.5">Handloom sarees &amp; dress fabrics</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Transparent Policy</p>
                  <p className="mt-0.5">7-day unwashed return &amp; GST invoice</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Insured Dispatch</p>
                  <p className="mt-0.5">Free delivery above ₹4,999</p>
                </div>
              </div>
            </div>

            <div className="col-span-7 relative min-h-[560px] max-h-[660px] bg-[var(--bg-subtle)] overflow-hidden">
              <img
                src={heroBanner.image}
                alt={heroBanner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </section>
      )}

      {/* 2. Shop by Category */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
              {t.home.shopByCategoryKicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
              {t.home.shopByCategoryTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate({ page: 'categories' })}
            className="text-sm font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            {t.home.viewAllCategories} ({categories.length}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories
            .filter((c) => c.featured)
            .slice(0, 6)
            .map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate({ page: 'catalog', category: cat.id })}
                className="group text-left bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[var(--accent)] transition-colors cursor-pointer"
              >
                <div className="aspect-[4/3] bg-[var(--bg-subtle)] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 sm:p-3">
                  <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] truncate">{cat.parentGroup}</p>
                  <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mt-0.5 leading-snug line-clamp-2 sm:line-clamp-1 font-sans">
                    {cat.name}
                  </h3>
                </div>
              </button>
            ))}
        </div>

        {/* Shop by Buyer Need & Occasion Quick Strip */}
        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Curated by Need &amp; Budget
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {AUDIENCE_SEGMENTS.map((seg) => (
              <button
                key={seg.id}
                type="button"
                title={seg.customerIntent}
                onClick={() =>
                  navigate({
                    page: 'catalog',
                    category: seg.filterPreset.category || 'all',
                    occasion: seg.filterPreset.occasion,
                    audience: seg.id,
                    maxPrice: seg.filterPreset.maxPrice,
                    filter: seg.filterPreset.filter,
                  })
                }
                className="px-3.5 py-2 text-xs font-medium rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Tabbed Featured Collections */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
              {t.home.atelierShowcaseKicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
              {t.home.featuredTitle}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Collection view"
            className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-lg overflow-x-auto max-w-full"
          >
            {[
              { id: 'new', label: t.home.tabs.new },
              { id: 'bestseller', label: t.home.tabs.bestseller },
              { id: 'festive', label: t.home.tabs.festive },
              { id: 'limited', label: t.home.tabs.limited },
              { id: 'yardage', label: t.home.tabs.yardage },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as CollectionTab)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Boutique Items Videos Showcase */}
      <BoutiqueVideoSection />

      {/* 5. Seasonal Edit & Exclusive Atelier Offers */}
      {seasonalBanner && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="bg-[#141416] text-white rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-6 p-5 sm:p-10 lg:p-14 flex flex-col justify-center gap-5">
              <p className="text-xs font-medium uppercase tracking-widest text-[#E5C98B]">
                {seasonalBanner.kicker}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-balance">
                {seasonalBanner.title}
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-lg">
                {seasonalBanner.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {coupons
                  .filter((c) => c.active)
                  .slice(0, 2)
                  .map((c) => (
                    <div
                      key={c.code}
                      className="border border-neutral-700 rounded-md p-3 bg-neutral-900/60"
                    >
                      <p className="text-xs font-semibold text-[#E5C98B] tracking-wide">
                        Code: {c.code}
                      </p>
                      <p className="text-xs text-neutral-300 mt-1">{c.description}</p>
                    </div>
                  ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      page: 'catalog',
                      category: seasonalBanner.targetCategory || 'cat-bridal',
                    })
                  }
                  className="px-6 py-3 bg-white text-[#141416] hover:bg-neutral-100 text-sm font-semibold rounded-md inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {seasonalBanner.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 min-h-[280px] bg-neutral-900">
              <img
                src={seasonalBanner.image}
                alt={seasonalBanner.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* 6. Patron Testimonials & Recently Viewed */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                {t.home.testimonialsKicker}
              </p>
              <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] mt-1">
                {t.home.testimonialsTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ page: 'reviews' })}
              className="text-xs sm:text-sm font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              View All Reviews &amp; Buyer Photos <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedTestimonials.map((rev) => {
              const prod = products.find((p) => p.id === rev.productId);
              const reviewImage = rev.photoUrl || prod?.images[0];
              return (
                <article
                  key={rev.id}
                  className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {reviewImage && (
                      <button
                        type="button"
                        onClick={() => setActiveReviewModal({ review: rev, product: prod })}
                        className="group relative w-full aspect-[4/3] bg-[var(--bg-subtle)] overflow-hidden block text-left cursor-pointer"
                        aria-label={`Inspect ${rev.userName} review photo`}
                      >
                        <img
                          src={reviewImage}
                          alt={`${rev.userName} wearing ${prod?.name || 'Vastra Atelier weave'}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-white">
                          <span className="text-[11px] font-medium tracking-wide truncate">
                            Customer Photo · {rev.city}
                          </span>
                          <span className="w-7 h-7 rounded-full bg-black/55 backdrop-blur-xs flex items-center justify-center shrink-0">
                            <ZoomIn className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </button>
                    )}

                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-[var(--accent-gold)]">
                          {'★'.repeat(rev.rating)} · Verified Purchase
                        </span>
                        <span className="text-[var(--text-secondary)]">
                          {rev.userName}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)] font-sans">
                        {rev.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        “{rev.comment}”
                      </p>
                    </div>
                  </div>

                  {prod && (
                    <button
                      type="button"
                      onClick={() => navigate({ page: 'product', slug: prod.slug })}
                      className="mx-5 sm:mx-6 mb-5 sm:mb-6 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] hover:border-[var(--accent)] flex items-center gap-3 text-left transition-colors cursor-pointer group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded object-cover shrink-0 bg-[var(--bg-surface)]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-secondary)]">
                          Purchased Product
                        </p>
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] truncate tabular-nums">
                          {rev.purchasedVariant || prod.fabricType} · {formatINR(prod.price)}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] shrink-0" />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {recentlyViewedProducts.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                  {t.home.recentlyViewedKicker}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mt-1">
                  {t.home.recentlyViewedTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate({ page: 'catalog', category: 'all' })}
                className="text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
              >
                {t.home.viewAllCategories}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {recentlyViewedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Instagram-Style Shoppable Community Gallery */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                @vastra.atelier · Community Lookbook
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mt-1">
                Styled &amp; Draped by Patrons
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ page: 'reviews' })}
              className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              Explore Patron Gallery <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-4">
            {products.slice(0, 6).map((p) => (
              <button
                key={`ig-${p.id}`}
                type="button"
                onClick={() => navigate({ page: 'product', slug: p.slug })}
                className="group relative aspect-square rounded-lg overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border-color)] cursor-pointer text-left"
                aria-label={`Shop ${p.name}`}
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[11px] font-medium text-white line-clamp-2 leading-tight">
                    {p.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter & WhatsApp Collection Announcements */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {t.home.newsletterKicker}
            </p>
            <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
              {t.home.newsletterTitle}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-lg">
              {t.home.newsletterSubtitle}
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>
                  You are subscribed to Vastra Atelier previews. Welcome to the Loom Dispatch.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewsletterChannel('email')}
                    className={`px-3 py-1.5 text-xs font-medium rounded border cursor-pointer ${
                      newsletterChannel === 'email'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Email Updates
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewsletterChannel('whatsapp')}
                    className={`px-3 py-1.5 text-xs font-medium rounded border cursor-pointer ${
                      newsletterChannel === 'whatsapp'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    WhatsApp Alerts
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={newsletterChannel === 'email' ? 'email' : 'tel'}
                      required
                      value={newsletterContact}
                      onChange={(e) => setNewsletterContact(e.target.value)}
                      placeholder={
                        newsletterChannel === 'email'
                          ? 'Enter your email address'
                          : 'Enter WhatsApp number (+91 ...)'
                      }
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {t.home.subscribeBtn}
                  </button>
                </div>

                <label className="flex items-start gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded border-[var(--border-color)]"
                    required
                  />
                  <span>
                    I consent to receive new collection announcements and back-in-stock alerts via{' '}
                    {newsletterChannel === 'email' ? 'email' : 'WhatsApp Business'}. Opt out anytime.
                  </span>
                </label>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Customer Purchased Review Photo Modal */}
      {activeReviewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveReviewModal(null)}
        >
          <div
            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[4/3] md:aspect-auto bg-[var(--bg-subtle)] relative min-h-[260px]">
              <img
                src={
                  activeReviewModal.review.photoUrl ||
                  activeReviewModal.product?.images[0] ||
                  ''
                }
                alt={activeReviewModal.review.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-[var(--accent-gold)]">
                      {'★'.repeat(activeReviewModal.review.rating)} · Verified Purchase
                    </p>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-1 font-sans">
                      {activeReviewModal.review.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveReviewModal(null)}
                    aria-label="Close review photo"
                    className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  “{activeReviewModal.review.comment}”
                </p>
                <p className="text-xs font-medium text-[var(--text-primary)]">
                  — {activeReviewModal.review.userName}, {activeReviewModal.review.city}
                </p>
              </div>

              {activeReviewModal.product && (
                <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeReviewModal.product.images[0]}
                      alt={activeReviewModal.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded object-cover shrink-0 border border-[var(--border-color)]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        {activeReviewModal.product.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] tabular-nums">
                        {activeReviewModal.review.purchasedVariant ||
                          activeReviewModal.product.fabricType}{' '}
                        · {formatINR(activeReviewModal.product.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const slug = activeReviewModal.product!.slug;
                      setActiveReviewModal(null);
                      navigate({ page: 'product', slug });
                    }}
                    className="w-full py-2.5 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-semibold rounded-md inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    View Purchased Weave
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
