import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { SafeImage } from '../components/common/SafeImage';
import { COLLECTIONS } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { FEATURED_TESTIMONIALS } from '../data/reviews';
import { formatINR } from '../utils/formatters';

type TabFilter = 'bestsellers' | 'Silk Sarees' | 'Cotton & Linen' | 'Blouses & Jewellery';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('bestsellers');

  const visibleProducts = useMemo(() => {
    if (activeTab === 'bestsellers') {
      return PRODUCTS.filter((p) => p.tag === 'Bestseller' || p.id === 'banarasi-katan-crimson').slice(0, 6);
    }
    if (activeTab === 'Silk Sarees') {
      return PRODUCTS.filter((p) => p.category === 'Silk Sarees');
    }
    if (activeTab === 'Cotton & Linen') {
      return PRODUCTS.filter((p) => p.category === 'Cotton Sarees' || p.category === 'Linen Sarees');
    }
    return PRODUCTS.filter((p) => p.category === 'Blouses' || p.category === 'Jewellery' || p.category === 'Saree Care');
  }, [activeTab]);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Single Clear Starting Point Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:pt-8">
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-xl border border-[#E5E0D8] bg-white lg:grid-cols-12">
          <div className="flex flex-col justify-center gap-6 p-7 sm:p-10 lg:col-span-5">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#14532D]">
                Weaver-Direct Handloom Boutique
              </p>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] text-[#1C1917] sm:text-5xl text-balance">
                Breathable handloom sarees, woven for Indian celebrations.
              </h1>
              <p className="text-base leading-relaxed text-[#57534E]">
                Direct from Kanchipuram, Banaras, and Maheshwar looms—with daylight drape videos, transparent Buy More – Save More pricing, and Cash on Delivery.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 rounded-md bg-[#14532D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F3F22] whitespace-nowrap shrink-0"
              >
                <span>Shop Handloom Bestsellers</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 rounded-md border border-[#E5E0D8] bg-[#FAF9F6] px-5 py-3 text-sm font-semibold text-[#1C1917] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-4 w-4 text-[#14532D]" />
                <span>30s Saree Finder</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-[#E5E0D8] pt-5 text-xs text-[#57534E]">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[#14532D] shrink-0" />
                <span>2–4 Day Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#14532D] shrink-0" />
                <span>7-Day Exchanges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#14532D] shrink-0" />
                <span>UPI &amp; COD Ready</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[300px] lg:col-span-7">
            <SafeImage
              src="/src/assets/images/hero_kanchipuram_editorial_1795082278166.jpg"
              alt="Sunlit heritage courtyard editorial of emerald Kanchipuram handloom silk saree"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Guided Shop by Collection */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">Curated Entry Points</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#1C1917]">Shop by Collection</h2>
          </div>
          <Link to="/collections" className="text-sm font-semibold text-[#14532D] hover:underline whitespace-nowrap shrink-0">
            View Full Catalogue →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              to={`/collections/${col.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-[#E5E0D8] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9]">
                <SafeImage
                  src={col.image}
                  alt={col.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-display text-xl font-semibold text-[#1C1917] group-hover:text-[#14532D]">
                  {col.title}
                </h3>
                <p className="text-xs text-[#57534E]">{col.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Bestsellers & Filtered Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">Weaver-Verified Favorites</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#1C1917]">Most Loved Weaves</h2>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#F2EFE9] p-1">
            {(
              [
                { id: 'bestsellers', label: 'Bestsellers' },
                { id: 'Silk Sarees', label: 'Silk Sarees' },
                { id: 'Cotton & Linen', label: 'Cotton & Linen' },
                { id: 'Blouses & Jewellery', label: 'Blouses & Care' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id ? 'bg-white text-[#1C1917] shadow-sm' : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Clear Offer Math + Real Proof Split */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Simple Visual Offer Math */}
          <div className="rounded-xl border border-[#E5E0D8] bg-white p-7 sm:p-8 lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
                Clear Multi-Saree Savings
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#1C1917] text-balance">
                Buy 3 Maheshwari Sarees. Save ₹300 + Free Shipping.
              </h2>
              <p className="text-sm text-[#57534E] leading-relaxed">
                No confusing fine-print coupons. Pick your quantity on any saree page and watch instant bundle savings apply automatically.
              </p>
            </div>

            <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF9F6] p-4 space-y-2 text-sm tabular-nums">
              <div className="flex justify-between text-[#57534E]">
                <span>3 × Maheshwari Cotton Silk (₹1,000)</span>
                <span>{formatINR(3000)}</span>
              </div>
              <div className="flex justify-between text-[#14532D] font-semibold">
                <span>Buy More – Save More Ladder</span>
                <span>−{formatINR(300)}</span>
              </div>
              <div className="flex justify-between text-[#14532D]">
                <span>Express Insured Shipping (above ₹2,500)</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between border-t border-[#E5E0D8] pt-2 text-base font-semibold text-[#1C1917]">
                <span>You Pay</span>
                <span>{formatINR(2700)}</span>
              </div>
            </div>

            <Link
              to="/product/maheshwari-ochre-rose"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#14532D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F3F22] transition-colors"
            >
              <span>Customize Your 3-Saree Tier</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Verified Real Proof */}
          <div className="rounded-xl border border-[#E5E0D8] bg-white p-7 sm:p-8 lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                  Verified Buyer Stories
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold text-[#1C1917]">
                  Why 14,000+ Women Trust Kora &amp; Loom
                </h2>
              </div>
              <span className="text-sm font-semibold text-[#B45309] tabular-nums whitespace-nowrap shrink-0">
                4.8 / 5 Avg Rating
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {FEATURED_TESTIMONIALS.map((t) => (
                <article key={t.name} className="rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] p-4 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#14532D]">{t.outcome}</p>
                    <p className="text-xs leading-relaxed text-[#57534E]">“{t.quote}”</p>
                  </div>
                  <div className="pt-2 border-t border-[#E5E0D8] text-xs">
                    <p className="font-semibold text-[#1C1917]">{t.name}</p>
                    <p className="text-[#57534E]">{t.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
