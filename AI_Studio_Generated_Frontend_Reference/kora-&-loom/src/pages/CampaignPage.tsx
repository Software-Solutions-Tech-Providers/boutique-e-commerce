import { CheckCircle2, Sparkles, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { SafeImage } from '../components/common/SafeImage';
import { useStore } from '../context/StoreContext';
import { DIWALI_CAMPAIGN } from '../data/collections';
import { PRODUCTS } from '../data/products';

export function CampaignPage() {
  const navigate = useNavigate();
  const { applyPromoCode, openCart } = useStore();

  const festiveProducts = PRODUCTS.filter((p) => DIWALI_CAMPAIGN.featuredProductIds.includes(p.id));

  const handleApplyFestiveCode = () => {
    applyPromoCode('DIWALI10');
    openCart();
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Focused Campaign Hero matching ad traffic intent directly */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-xl border border-[#E5E0D8] bg-white lg:grid-cols-12">
          <div className="flex flex-col justify-center gap-5 p-7 sm:p-10 lg:col-span-5">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B45309]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{DIWALI_CAMPAIGN.title}</span>
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-[#1C1917] text-balance">
              {DIWALI_CAMPAIGN.headline}
            </h1>
            <p className="text-sm leading-relaxed text-[#57534E]">{DIWALI_CAMPAIGN.subcopy}</p>

            <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF9F6] p-4 space-y-2 text-xs text-[#1C1917]">
              <p className="font-semibold text-[#14532D]">Festive Offer Code: DIWALI10 (Extra 10% Off)</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#57534E]">
                <span className="inline-flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-[#14532D]" /> Free Express Shipping ₹2,500+
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#14532D]" /> Guaranteed Pre-Diwali Dispatch
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleApplyFestiveCode}
                className="rounded-md bg-[#14532D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F3F22] transition-colors cursor-pointer"
              >
                Activate DIWALI10 in Bag
              </button>
              <button
                type="button"
                onClick={() => navigate('/product/festive-duo-gift-set')}
                className="rounded-md border border-[#E5E0D8] bg-white px-5 py-3 text-sm font-semibold text-[#1C1917] hover:bg-[#F2EFE9] cursor-pointer"
              >
                View 2-Saree Gift Duo
              </button>
            </div>
          </div>

          <div className="min-h-[280px] lg:col-span-7">
            <SafeImage
              src={DIWALI_CAMPAIGN.bannerImage}
              alt="Diwali festive handloom silk sarees beside lit brass diyas"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Curated Festive Lineup Only (no distracting homepage clutter) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#1C1917]">
            Featured Diwali Festive Selection
          </h2>
          <p className="mt-1 text-sm text-[#57534E]">
            Every piece below is in-stock for 24-hour dispatch with matching unstitched or ready-made blouse pairings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {festiveProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
