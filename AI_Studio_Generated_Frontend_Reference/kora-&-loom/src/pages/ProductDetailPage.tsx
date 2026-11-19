import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Heart,
  RotateCcw,
  Ruler,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { RatingStars } from '../components/common/RatingStars';
import { BackInStockModal } from '../components/product/BackInStockModal';
import { DeliveryEstimator } from '../components/product/DeliveryEstimator';
import { DiscountLadder } from '../components/product/DiscountLadder';
import { ProductGallery } from '../components/product/ProductGallery';
import { ReviewSection } from '../components/product/ReviewSection';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { discountPercent, formatINR } from '../utils/formatters';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, wishlistIds, toggleWishlist, recordProductView, recentlyViewedIds } = useStore();

  const product = useMemo(() => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0], [id]);

  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(product.variants?.[0]?.label);
  const [purchaseMode, setPurchaseMode] = useState<'once' | 'subscription'>('once');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [backInStockOpen, setBackInStockOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const buyBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedQty(1);
    setSelectedVariant(product.variants?.[0]?.label);
    setPurchaseMode('once');
    setOpenFaqIndex(0);
    recordProductView(product.id);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [product, recordProductView]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (buyBoxRef.current) observer.observe(buyBoxRef.current);
    return () => observer.disconnect();
  }, [product.id]);

  const selectedVariantObj = product.variants?.find((v) => v.label === selectedVariant);
  const isOutOfStock = Boolean(selectedVariantObj && !selectedVariantObj.inStock);

  const activeTier = product.discountLadder?.find((t) => t.quantity === selectedQty);
  const effectiveDisplayPrice =
    purchaseMode === 'subscription' && product.subscriptionOption
      ? product.subscriptionOption.monthlyPrice * selectedQty
      : activeTier
      ? activeTier.totalPrice
      : product.price * selectedQty;

  const savingsPct = discountPercent(product.price, product.mrp);
  const isWishlisted = wishlistIds.includes(product.id);

  const complementaryProducts = PRODUCTS.filter((p) => product.complementaryIds.includes(p.id));
  const recentlyViewedProducts = recentlyViewedIds
    .filter((vid) => vid !== product.id)
    .map((vid) => PRODUCTS.find((p) => p.id === vid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  const handlePrimaryBuy = (goDirectlyToCheckout: boolean) => {
    if (isOutOfStock) {
      setBackInStockOpen(true);
      return;
    }
    addToCart(product, {
      quantity: selectedQty,
      variant: selectedVariant,
      isSubscription: purchaseMode === 'subscription',
      tierTotalOverride: activeTier ? activeTier.totalPrice : undefined,
      openDrawer: !goDirectlyToCheckout,
    });
    if (goDirectlyToCheckout) {
      navigate('/checkout');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-14 pb-24">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#57534E]">
        <Link to="/" className="hover:text-[#1C1917]">
          Home
        </Link>
        <span>/</span>
        <Link to="/collections" className="hover:text-[#1C1917]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#1C1917] font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Conversion Split: Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <ProductGallery
            productName={product.name}
            images={product.images}
            hasVideoPreview={product.hasVideoPreview}
            videoCaption={product.videoCaption}
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          {/* Above-the-Fold 4 Core Elements: Name, Price, 1-Line Benefit, Star Ratings */}
          <div className="space-y-2.5 border-b border-[#E5E0D8] pb-5">
            <div className="flex items-center justify-between gap-2 text-xs text-[#57534E]">
              <span>
                {product.weave} · SKU: <strong className="text-[#1C1917] tabular-nums">{product.sku}</strong>
              </span>
              {product.tag && <span className="font-semibold text-[#14532D]">{product.tag}</span>}
            </div>

            <h1 className="font-display text-3xl font-semibold leading-tight text-[#1C1917] sm:text-4xl text-balance">
              {product.name}
            </h1>

            <p className="text-base text-[#57534E] leading-relaxed">{product.oneLineBenefit}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-baseline gap-2.5 tabular-nums">
                <span className="text-2xl font-semibold text-[#1C1917]">{formatINR(effectiveDisplayPrice)}</span>
                {product.mrp > product.price && (
                  <span className="text-sm text-[#57534E] line-through">
                    {formatINR(product.mrp * selectedQty)}
                  </span>
                )}
                {savingsPct > 0 && (
                  <span className="text-sm font-semibold text-[#14532D]">Save {savingsPct}%</span>
                )}
              </div>

              <a href="#reviews" className="hover:underline">
                <RatingStars rating={product.rating} count={product.reviewCount} />
              </a>
            </div>
          </div>

          {/* Blouse / Spec & Size Guide */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#57534E]">
            <span>{product.blouseIncluded}</span>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="inline-flex items-center gap-1.5 font-semibold text-[#14532D] hover:underline cursor-pointer"
            >
              <Ruler className="h-3.5 w-3.5" />
              <span>{product.hasSizeGuide ? 'Blouse Size Guide' : 'Saree Drape & Length Guide'}</span>
            </button>
          </div>

          {/* Variant Selector (for stitched blouses with OOS demonstration) */}
          {product.variants && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#1C1917]">Select Size</span>
                <span className="text-[#57534E]">{product.lengthSpec}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const active = selectedVariant === v.label;
                  return (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => setSelectedVariant(v.label)}
                      className={`rounded-md border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'border-[#14532D] bg-[#14532D] text-white'
                          : v.inStock
                          ? 'border-[#E5E0D8] bg-white text-[#1C1917] hover:border-[#57534E]'
                          : 'border-dashed border-[#E5E0D8] bg-[#F2EFE9] text-[#57534E]'
                      }`}
                    >
                      {v.label} {!v.inStock && '(Sold Out)'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discount Ladder (Buy More - Save More) */}
          {product.discountLadder && (
            <DiscountLadder
              tiers={product.discountLadder}
              selectedQty={selectedQty}
              onSelectQty={setSelectedQty}
            />
          )}

          {/* Subscription Option (for replenishable Saree Care Kit) */}
          {product.subscriptionOption && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Choose Purchase Plan
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPurchaseMode('once')}
                  className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                    purchaseMode === 'once'
                      ? 'border-[#14532D] bg-[#14532D]/5 ring-1 ring-[#14532D]'
                      : 'border-[#E5E0D8] bg-white'
                  }`}
                >
                  <div className="flex justify-between text-sm font-semibold text-[#1C1917] tabular-nums">
                    <span>One-Time Purchase</span>
                    <span>{formatINR(product.price)}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#57534E]">Single full kit delivery</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPurchaseMode('subscription')}
                  className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                    purchaseMode === 'subscription'
                      ? 'border-[#14532D] bg-[#14532D]/5 ring-1 ring-[#14532D]'
                      : 'border-[#E5E0D8] bg-white'
                  }`}
                >
                  <div className="flex justify-between text-sm font-semibold text-[#14532D] tabular-nums">
                    <span>Monthly Refill</span>
                    <span>{formatINR(product.subscriptionOption.monthlyPrice)}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#57534E]">Save ₹50/mo · Pause anytime</p>
                </button>
              </div>
            </div>
          )}

          {/* Delivery Estimator */}
          <DeliveryEstimator />

          {/* Buy Button Zone + Adjacent Hesitation-Busters */}
          <div ref={buyBoxRef} className="space-y-3">
            {isOutOfStock ? (
              <button
                type="button"
                onClick={() => setBackInStockOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#B45309] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#92400E] transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                <span>Notify Me When {selectedVariant} Restocks</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handlePrimaryBuy(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#14532D] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#0F3F22] transition-colors cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className="tabular-nums">Add to Bag · {formatINR(effectiveDisplayPrice)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrimaryBuy(true)}
                  className="flex items-center justify-center rounded-md border border-[#14532D] bg-white px-5 py-3.5 text-sm font-semibold text-[#14532D] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id, product.name)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="flex h-12 w-12 items-center justify-center rounded-md border border-[#E5E0D8] bg-white text-[#1C1917] hover:bg-[#F2EFE9] shrink-0 cursor-pointer"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-[#991B1B] text-[#991B1B]' : ''}`} />
                </button>
              </div>
            )}

            {/* Answer all visitor doubts directly beneath the Buy Button */}
            <div className="grid grid-cols-1 gap-2 rounded-lg border border-[#E5E0D8] bg-white p-3.5 text-xs text-[#1C1917] sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#14532D] shrink-0" />
                <span>Delivery in 2–4 days</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-[#14532D] shrink-0" />
                <span>7-day easy returns &amp; exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#14532D] shrink-0" />
                <span>UPI · Cards · COD accepted</span>
              </div>
            </div>
          </div>

          {/* Benefits First (Feature -> Customer Outcome) */}
          <div className="space-y-3 border-t border-[#E5E0D8] pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
              Why Customers Love This Weave
            </p>
            <ul className="space-y-2.5">
              {product.benefits.map((b) => (
                <li key={b.feature} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#14532D] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[#1C1917]">{b.feature}: </span>
                    <span className="text-[#57534E]">{b.benefit}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#57534E] pt-1">
              Dimensions: {product.lengthSpec} · Care: {product.fabricCare}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Immediately Below Purchase Section */}
      <ReviewSection
        productId={product.id}
        productName={product.name}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />

      {/* Product FAQs */}
      <section className="border-t border-[#E5E0D8] pt-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">Clear Your Doubts</p>
        <h2 className="mt-1 font-display text-3xl font-semibold text-[#1C1917] mb-5">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-[#E5E0D8] rounded-lg border border-[#E5E0D8] bg-white">
          {product.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[#1C1917] hover:bg-[#FAF9F6] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-[#57534E]">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Complementary Pairings */}
      {complementaryProducts.length > 0 && (
        <section className="border-t border-[#E5E0D8] pt-10">
          <h2 className="font-display text-3xl font-semibold text-[#1C1917] mb-6">Complete Your Ensemble</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {complementaryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <section className="border-t border-[#E5E0D8] pt-10">
          <h2 className="font-display text-2xl font-semibold text-[#1C1917] mb-5">Recently Viewed</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Add to Cart Bar (compact <=56px for mobile sticky budget) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E5E0D8] bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1C1917]">{product.name}</p>
              <p className="text-xs text-[#57534E] tabular-nums">
                {formatINR(effectiveDisplayPrice)} · 7-day easy exchange · COD
              </p>
            </div>
            <button
              type="button"
              onClick={() => handlePrimaryBuy(false)}
              className="rounded-md bg-[#14532D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isOutOfStock ? 'Notify Me' : `Add to Bag · ${formatINR(effectiveDisplayPrice)}`}
            </button>
          </div>
        </div>
      )}

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        isBlouse={Boolean(product.hasSizeGuide)}
      />

      <BackInStockModal
        open={backInStockOpen}
        onClose={() => setBackInStockOpen(false)}
        productId={product.id}
        productName={product.name}
        variant={selectedVariant || 'Standard'}
      />
    </div>
  );
}
