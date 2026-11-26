import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Heart,
  HelpCircle,
  Minus,
  Play,
  Plus,
  Ruler,
  Share2,
  ShieldCheck,
  Shirt,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RatingStars } from '../components/common/RatingStars';
import { SafeImage } from '../components/common/SafeImage';
import { BackInStockModal } from '../components/product/BackInStockModal';
import { DeliveryEstimator } from '../components/product/DeliveryEstimator';
import { DiscountLadder } from '../components/product/DiscountLadder';
import { EMIPlansModal } from '../components/product/EMIPlansModal';
import { ProductGallery } from '../components/product/ProductGallery';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { VirtualTryOnModal } from '../components/product/VirtualTryOnModal';
import { WriteReviewModal } from '../components/product/WriteReviewModal';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { PRODUCTS } from '../data/products';
import { discountPercent, formatINR } from '../utils/formatters';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    addToCart,
    wishlistIds,
    toggleWishlist,
    recordProductView,
    recentlyViewedIds,
    reviews,
  } = useStore();
  const { showToast } = useToast();

  const product = useMemo(() => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0], [id]);

  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(product.variants?.[0]?.label);
  const [purchaseMode, setPurchaseMode] = useState<'once' | 'subscription'>('once');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [backInStockOpen, setBackInStockOpen] = useState(false);
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<typeof product | null>(null);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Accordion open states (matching Screenshot 6)
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const buyBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedQty(1);
    setSelectedVariant(product.variants?.[0]?.label);
    setPurchaseMode('once');
    setOpenAccordion('details');
    setTryOnProduct(null);
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

  useEffect(() => {
    if (showStickyBar) {
      document.body.dataset.pdpSticky = 'true';
    } else {
      delete document.body.dataset.pdpSticky;
    }
    return () => {
      delete document.body.dataset.pdpSticky;
    };
  }, [showStickyBar]);

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
  const savingsAmount = Math.max(0, product.mrp - product.price);
  const isWishlisted = wishlistIds.includes(product.id);
  const emiPerMonth = Math.round(effectiveDisplayPrice / 3);

  // Cross-sell & Pairings
  const complementaryProducts = PRODUCTS.filter((p) => product.complementaryIds.includes(p.id));
  const recentlyViewedProducts = recentlyViewedIds
    .filter((vid) => vid !== product.id)
    .map((vid) => PRODUCTS.find((p) => p.id === vid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  // Reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.name} - Handloom Boutique Collection`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Saree link copied to clipboard!');
    }
  };

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

  const toggleAccordionItem = (idKey: string) => {
    setOpenAccordion((prev) => (prev === idKey ? null : idKey));
  };

  return (
    <div className="bg-[#FAF9F6] pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-10 text-[#1C1917]">
      {/* 1. Breadcrumbs */}
      <div className="border-b border-[#E5E0D8]/60">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar px-4 py-2 sm:px-6 text-xs text-[#57534E]"
        >
          <Link to="/" className="hover:text-[#1C1917] shrink-0">Home</Link>
          <span className="text-[#57534E]/60 shrink-0">&gt;</span>
          <Link to="/collections" className="hover:text-[#1C1917] shrink-0">Products</Link>
          <span className="text-[#57534E]/60 shrink-0">&gt;</span>
          <Link
            to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="hover:text-[#1C1917] shrink-0"
          >
            {product.category}
          </Link>
          <span className="text-[#57534E]/60 shrink-0">&gt;</span>
          <span className="text-[#1C1917] font-medium truncate min-w-0">{product.name}</span>
        </nav>
      </div>

      {/* 2. Main Product Section (Mobile/Tablet: stacked vertical flow; Desktop lg+: 2-column conversion split) */}
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-6">
        <div className="grid grid-cols-1 gap-5 md:gap-7 lg:grid-cols-12 lg:gap-9 xl:gap-11 items-start">
          {/* Left Column: Gallery (clears 56px sticky header on desktop) */}
          <div className="w-full max-w-lg mx-auto lg:max-w-none lg:col-span-6 lg:sticky lg:top-20">
            <ProductGallery
              key={product.id}
              productName={product.name}
              images={product.images}
              hasVideoPreview={product.hasVideoPreview}
              videoCaption={product.videoCaption}
              salePercent={savingsPct > 0 ? savingsPct : 12}
            />
          </div>

          {/* Right Column: 80/20 Streamlined Purchase Module */}
          <div className="min-w-0 lg:col-span-6 space-y-3">
            {/* 1. Title + Share */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-[#1C1917] flex-1">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={handleShare}
                aria-label={`Share ${product.name}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#1C1917] hover:bg-[#F2EFE9] active:scale-95 transition-all"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* 2. Above-the-Fold Proof: RatingStars + SKU + One-Line Benefit */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <a href="#reviews" className="inline-flex items-center hover:opacity-85 transition-opacity">
                  <RatingStars rating={product.rating} count={product.reviewCount} />
                </a>
                <span className="text-xs text-[#57534E]">
                  SKU: <span className="font-semibold text-[#1C1917] tabular-nums">{product.sku}</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#57534E]">
                {product.oneLineBenefit}
              </p>
            </div>

            {/* 3. Price Row + Single Clean Inline EMI Strip */}
            <div className="space-y-1.5 pt-1">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {product.mrp > product.price && (
                  <span className="text-sm sm:text-base font-semibold text-[#57534E] line-through tabular-nums">
                    {formatINR(product.mrp * selectedQty)}
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-bold text-[#059669] tabular-nums">
                  {formatINR(effectiveDisplayPrice)}
                </span>
                {savingsAmount > 0 && (
                  <span className="rounded-md bg-[#059669] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white tabular-nums shadow-xs">
                    SAVE {formatINR(savingsAmount * selectedQty)}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#57534E]">
                or <strong className="text-[#14532D] tabular-nums">{formatINR(emiPerMonth)}/mo</strong> No-Cost EMI (3 mos) ·{' '}
                <button
                  type="button"
                  onClick={() => setEmiModalOpen(true)}
                  className="font-semibold text-[#5B1B29] underline underline-offset-2 hover:text-[#45121E] cursor-pointer"
                >
                  View Plans
                </button>
              </p>
            </div>

            {/* 4. Fabric/Variant Selector, Size Guide & Virtual Drape Studio */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#57534E]">
                  Fabric: <strong className="text-[#1C1917]">{product.weave}</strong>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTryOnProduct(product)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B1B29] hover:underline underline-offset-2 cursor-pointer"
                  >
                    <Shirt className="h-3.5 w-3.5" />
                    <span>Try Drape</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D] hover:underline underline-offset-2 cursor-pointer"
                  >
                    <Ruler className="h-3.5 w-3.5" />
                    <span>{product.hasSizeGuide ? 'Size Guide' : 'Drape & Measure Guide'}</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[#1C1917] bg-[#FAF9F6] px-4 py-1.5 text-xs font-semibold text-[#1C1917]"
                >
                  {product.weave}
                </button>
                {product.variants && product.variants.map((v) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setSelectedVariant(v.label)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      selectedVariant === v.label
                        ? 'border-[#14532D] bg-[#14532D] text-white'
                        : 'border-[#E5E0D8] bg-white text-[#57534E] hover:border-[#1C1917]'
                    } ${!v.inStock ? 'opacity-65 line-through' : ''}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Quantity Stepper + Calm Stock/Craft Status */}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-xs text-[#57534E]">Quantity:</span>
                <div className="flex items-center w-28 rounded-md border border-[#E5E0D8] bg-white">
                  <button
                    type="button"
                    onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center text-[#57534E] hover:text-[#1C1917] active:scale-95 transition-transform"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="flex-1 text-center text-xs font-bold tabular-nums text-[#1C1917]">
                    {selectedQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedQty((prev) => prev + 1)}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center text-[#57534E] hover:text-[#1C1917] active:scale-95 transition-transform"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <span
                className={`text-xs font-semibold ${
                  isOutOfStock ? 'text-[#991B1B]' : 'text-[#14532D]'
                }`}
              >
                {isOutOfStock
                  ? 'Currently out of stock · Notify me'
                  : 'Handwoven in small batches · Dispatches in 24h'}
              </span>
            </div>

            {/* 6. Action Buttons: Add to Cart (Sand) + Wishlist + BUY IT NOW (Wine) */}
            <div ref={buyBoxRef} className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handlePrimaryBuy(false)}
                  className="flex-1 rounded-md bg-[#C4A482] py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#B28F6B] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {isOutOfStock ? 'Notify When Back' : 'Add to Cart'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id, product.name)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="flex h-12 w-12 items-center justify-center rounded-md border border-[#E5E0D8] bg-white text-[#1C1917] hover:bg-[#F2EFE9] active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <Heart className={`h-5 w-5 transition-colors duration-150 ${isWishlisted ? 'fill-[#991B1B] text-[#991B1B] kl-heart-active' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handlePrimaryBuy(true)}
                className="w-full rounded-md bg-[#5B1B29] py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#45121E] active:scale-[0.98] transition-all cursor-pointer"
              >
                Buy It Now
              </button>
            </div>

            {/* "Complete the Look" Pairing Cards (without GoKwik branding) */}
            <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF9F6] p-3.5 sm:p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                <span className="font-bold text-[#1C1917]">Complete the Look</span>
                <span className="text-[11px] text-[#57534E]">Curated Boutique Pairings</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {complementaryProducts.slice(0, 2).map((cp) => (
                  <div key={cp.id} className="min-w-0 rounded-lg border border-[#E5E0D8] bg-white p-2 sm:p-2.5 flex flex-col justify-between space-y-2 shadow-2xs">
                    <Link to={`/product/${cp.id}`} className="block aspect-[4/3] w-full overflow-hidden rounded bg-[#F2EFE9]">
                      <SafeImage src={cp.images[0].url} alt={cp.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="space-y-0.5 min-w-0">
                      <Link to={`/product/${cp.id}`} className="block truncate text-xs font-semibold text-[#1C1917] hover:text-[#14532D]">
                        {cp.name}
                      </Link>
                      <div className="flex flex-wrap items-baseline gap-1.5 text-xs tabular-nums">
                        <span className="font-bold text-[#1C1917]">{formatINR(cp.price)}</span>
                        {cp.mrp > cp.price && <span className="text-[10px] text-[#57534E] line-through">{formatINR(cp.mrp)}</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => addToCart(cp, { quantity: 1, openDrawer: true })}
                        className="rounded bg-[#1C1917] py-1.5 px-1 text-[11px] font-semibold text-white hover:bg-black cursor-pointer touch-manipulation"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(cp, { quantity: 1, openDrawer: false });
                          addToCart(product, { quantity: 1, openDrawer: true });
                          showToast('Bundle added to bag with special savings!');
                        }}
                        className="rounded border border-[#E5E0D8] bg-white py-1.5 px-1 text-[10px] font-semibold text-[#1C1917] hover:bg-[#F2EFE9] cursor-pointer touch-manipulation"
                      >
                        Bundle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Assurances matching Screenshot 6 */}
            <div className="rounded-lg border border-[#E5E0D8] bg-white p-3.5 space-y-2.5 text-xs text-[#1C1917]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#14532D] shrink-0" />
                <span className="font-bold uppercase tracking-wider">Dispatched within 24 hours</span>
                <HelpCircle className="h-3.5 w-3.5 text-[#57534E] shrink-0" />
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-[#14532D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider">100% Purity of Fabric</span>
                  <p className="text-[#57534E] mt-0.5 leading-relaxed">
                    Our sarees are crafted from the finest, 100% authentic handloom yarns with Silk Mark testing verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Pincode Estimator */}
            <DeliveryEstimator />

            {/* Discount Ladder if present */}
            {product.discountLadder && (
              <DiscountLadder
                tiers={product.discountLadder}
                selectedQty={selectedQty}
                onSelectQty={setSelectedQty}
              />
            )}

            {/* 5 Smooth Collapsible Accordions */}
            <div className="divide-y divide-[#E5E0D8] border-y border-[#E5E0D8] bg-white">
              {[
                {
                  key: 'details',
                  title: 'Product Details',
                  content: (
                    <div className="space-y-2 pb-4 text-xs text-[#57534E] leading-relaxed">
                      <p>• <strong>Weave:</strong> {product.weave} Handloom cluster</p>
                      <p>• <strong>Length / Spec:</strong> {product.lengthSpec}</p>
                      <p>• <strong>Includes:</strong> {product.blouseIncluded}</p>
                      <p>• <strong>Care:</strong> {product.fabricCare}</p>
                    </div>
                  ),
                },
                {
                  key: 'note',
                  title: 'Note',
                  content: (
                    <div className="pb-4 text-xs text-[#57534E] leading-relaxed">
                      <p>
                        Each handloom piece is individually crafted by master artisans. Minor slub yarn variations, weave texture, and dye shades are natural signatures of human craft rather than flaws.
                      </p>
                    </div>
                  ),
                },
                {
                  key: 'wash',
                  title: 'Wash Instructions',
                  content: (
                    <div className="space-y-1.5 pb-4 text-xs text-[#57534E] leading-relaxed">
                      <p>• Dry clean strictly for the first two washes to preserve authentic zari sheen.</p>
                      <p>• Store in breathable unbleached cotton/muslin bags. Avoid hanging on metal hangers.</p>
                      <p>• Change fold lines every 3 months for lifelong heirloom durability.</p>
                    </div>
                  ),
                },
                {
                  key: 'shipping',
                  title: 'Shipping & Delivery Policy',
                  content: (
                    <div className="space-y-1.5 pb-4 text-xs text-[#57534E] leading-relaxed">
                      <p>• Free Express Insured Shipping on all orders over ₹2,500.</p>
                      <p>• Orders under ₹2,500 carry a standard ₹120 insured door delivery fee.</p>
                      <p>• Metro cities: 2–3 business days. Rest of India: 3–5 business days.</p>
                      <p>• Cash on Delivery (COD) supported across 19,000+ Indian pincodes.</p>
                    </div>
                  ),
                },
                {
                  key: 'refund',
                  title: 'Refund & Exchange Policy',
                  content: (
                    <div className="space-y-1.5 pb-4 text-xs text-[#57534E] leading-relaxed">
                      <p>• 7-Day Easy Doorstep Exchange &amp; Return with free courier pickup.</p>
                      <p>• Exchange for another shade/blouse size or opt for <strong>110% Instant Store Credit</strong> bonus.</p>
                      <p>• Original fold, tag, and unstitched blouse intact required for exchange pickup.</p>
                    </div>
                  ),
                },
              ].map((item) => {
                const isOpen = openAccordion === item.key;
                return (
                  <div key={item.key}>
                    <button
                      type="button"
                      onClick={() => toggleAccordionItem(item.key)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917] cursor-pointer"
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="kl-accordion-content" data-open={isOpen ? 'true' : 'false'}>
                      <div className="kl-accordion-inner">{item.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Highlight Trust Strip */}
      <div className="mt-8 sm:mt-10 border-y border-[#E5E0D8] bg-[#F2EFE9] py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-[#1C1917]">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-x-3 gap-y-1.5 px-4 text-center sm:flex sm:flex-wrap sm:items-center sm:justify-around sm:gap-6">
          <span>SAFE &amp; SECURED</span>
          <span className="hidden sm:inline text-[#57534E]">·</span>
          <span>FREE SHIPPING OVER ₹2,500</span>
          <span className="hidden sm:inline text-[#57534E]">·</span>
          <span>1,50,000+ HAPPY CUSTOMERS</span>
          <span className="hidden sm:inline text-[#57534E]">·</span>
          <span>PAN INDIA DELIVERY &amp; COD</span>
        </div>
      </div>

      {/* 4. "Frequently Bought Together" Carousel */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-9 space-y-4 sm:space-y-5">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Frequently Bought Together
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {PRODUCTS.slice(1, 5).map((fProduct) => {
            const fSavingsPct = discountPercent(fProduct.price, fProduct.mrp);
            const isFwishlisted = wishlistIds.includes(fProduct.id);
            const fEmi = Math.round(fProduct.price / 3);

            return (
              <div
                key={fProduct.id}
                className="min-w-0 flex flex-col justify-between rounded-lg border border-[#E5E0D8] bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9] group">
                  <Link to={`/product/${fProduct.id}`} className="block h-full w-full">
                    <SafeImage src={fProduct.images[0].url} alt={fProduct.name} className="h-full w-full object-cover" />
                  </Link>

                  {/* Sale Tag */}
                  {fSavingsPct > 0 && (
                    <span className="absolute top-2 left-2 rounded-xs bg-[#E11D48] px-2 py-0.5 text-[10px] font-bold text-white">
                      Sale {fSavingsPct}%
                    </span>
                  )}

                  {/* Try it on Pill Button */}
                  <button
                    type="button"
                    onClick={() => setTryOnProduct(fProduct)}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#5B1B29] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-white shadow-md hover:bg-[#45121E] transition-colors cursor-pointer touch-manipulation"
                  >
                    <Shirt className="h-3 w-3 shrink-0" />
                    <span>Try it on</span>
                  </button>

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(fProduct.id, fProduct.name)}
                    aria-label={isFwishlisted ? `Remove ${fProduct.name} from wishlist` : `Save ${fProduct.name} to wishlist`}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1C1917] shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer touch-manipulation"
                  >
                    <Heart className={`h-3.5 w-3.5 transition-colors duration-150 ${isFwishlisted ? 'fill-[#991B1B] text-[#991B1B] kl-heart-active' : ''}`} />
                  </button>
                </div>

                <div className="p-2.5 sm:p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <button
                    type="button"
                    onClick={() => addToCart(fProduct, { quantity: 1, openDrawer: true })}
                    className="w-full rounded-md border border-[#1C1917] bg-white py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:bg-[#FAF9F6] transition-colors cursor-pointer touch-manipulation"
                  >
                    Add to Cart
                  </button>

                  <div className="space-y-1">
                    <Link to={`/product/${fProduct.id}`} className="block text-xs font-semibold text-[#1C1917] hover:text-[#14532D] line-clamp-2">
                      {fProduct.name}
                    </Link>
                    <div className="flex flex-wrap items-baseline gap-1.5 text-xs tabular-nums">
                      <span className="font-semibold text-[#57534E] line-through">{formatINR(fProduct.mrp)}</span>
                      <span className="font-bold text-[#059669]">{formatINR(fProduct.price)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-[10px] text-[#57534E]">
                      <span>or <strong className="text-[#059669] tabular-nums">{formatINR(fEmi)}/Month</strong></span>
                      <button
                        type="button"
                        onClick={() => setEmiModalOpen(true)}
                        className="rounded bg-[#5B1B29] px-1.5 py-0.5 text-[9px] font-semibold text-white cursor-pointer touch-manipulation"
                      >
                        Buy on EMI
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Editorial Drape & Craft Showcase Card (aligned to max-w-7xl with compact editorial height) */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="relative aspect-[4/3] sm:aspect-[21/9] lg:max-h-[400px] w-full overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#1C1917] shadow-lg group">
          <SafeImage
            src={product.images[1]?.url || product.images[0].url}
            alt={`${product.name} handloom drape showcase`}
            className="h-full w-full object-cover opacity-85 kl-gallery-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25 flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white space-y-2 sm:space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
              Kora &amp; Loom Handloom Collective
            </span>
            <p className="font-display text-xl sm:text-3xl font-semibold max-w-lg leading-snug">
              Handloom Craft in Natural Daylight
            </p>
            <p className="text-xs text-white/85 max-w-md">{product.videoCaption}</p>

            <button
              type="button"
              onClick={() => setTryOnProduct(product)}
              aria-label="Open Virtual Drape Studio"
              className="inline-flex items-center gap-2 rounded-full bg-[#5B1B29] px-5 py-2.5 text-xs font-semibold text-white shadow-xl hover:bg-[#45121E] active:scale-95 transition-all cursor-pointer"
            >
              {product.hasVideoPreview ? <Play className="h-3.5 w-3.5 fill-white" /> : <Shirt className="h-3.5 w-3.5" />}
              <span>Preview Drape &amp; Blouse Pairing</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Section (balanced 2-col layout on desktop, compact stack on mobile) */}
      <section id="reviews" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start border-t border-[#E5E0D8] pt-7 sm:pt-8">
          <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Customer Reviews
            </h2>
            <div className="flex justify-center lg:justify-start">
              <RatingStars rating={product.rating} count={product.reviewCount} />
            </div>
            <p className="text-xs text-[#57534E]">
              {productReviews.length > 0
                ? `Showing ${productReviews.length} verified buyer ${productReviews.length === 1 ? 'review' : 'reviews'} for this piece.`
                : 'Be the first to share how this weave drapes and feels.'}
            </p>
            <button
              type="button"
              onClick={() => setWriteReviewOpen(true)}
              className="w-full sm:w-auto lg:w-full rounded-md bg-[#5B1B29] px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#45121E] active:scale-[0.98] transition-all cursor-pointer"
            >
              Write a review
            </button>
          </div>

          <div className="lg:col-span-8">
            {productReviews.length > 0 ? (
              <div className="divide-y divide-[#E5E0D8] rounded-xl border border-[#E5E0D8] bg-white p-4 sm:p-5 space-y-4">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <RatingStars rating={rev.rating} count={0} />
                        <span className="font-bold text-[#1C1917]">{rev.author}</span>
                        <span className="rounded bg-[#14532D]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#14532D]">
                          Verified
                        </span>
                      </div>
                      <span className="text-[#57534E]">{rev.date}</span>
                    </div>
                    <p className="font-semibold text-sm text-[#1C1917]">{rev.title}</p>
                    <p className="text-[#57534E] leading-relaxed">{rev.comment}</p>
                    <p className="text-[11px] text-[#57534E]/80">
                      Purchased for: {rev.occasionPurchased} · {rev.city}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#E5E0D8] bg-white p-6 text-center text-xs text-[#57534E]">
                No reviews on this weave yet. Share your drape notes or occasion photos to help fellow shoppers.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Recently Viewed Products (aligned to max-w-7xl grid) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 space-y-4 sm:space-y-5">
          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Recently Viewed Products
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recentlyViewedProducts.map((rvProduct) => {
              const rvSavingsPct = discountPercent(rvProduct.price, rvProduct.mrp);
              const isRvWishlisted = wishlistIds.includes(rvProduct.id);

              return (
                <div
                  key={rvProduct.id}
                  className="min-w-0 flex flex-col justify-between rounded-lg border border-[#E5E0D8] bg-white overflow-hidden shadow-2xs"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9]">
                    <Link to={`/product/${rvProduct.id}`} className="block h-full w-full">
                      <SafeImage src={rvProduct.images[0].url} alt={rvProduct.name} className="h-full w-full object-cover" />
                    </Link>
                    {rvSavingsPct > 0 && (
                      <span className="absolute top-2 left-2 rounded-xs bg-[#E11D48] px-2 py-0.5 text-[10px] font-bold text-white">
                        Sale {rvSavingsPct}%
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(rvProduct.id, rvProduct.name)}
                      aria-label={isRvWishlisted ? `Remove ${rvProduct.name} from wishlist` : `Save ${rvProduct.name} to wishlist`}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1C1917] shadow-xs active:scale-95 transition-all touch-manipulation"
                    >
                      <Heart className={`h-3.5 w-3.5 transition-colors duration-150 ${isRvWishlisted ? 'fill-[#991B1B] text-[#991B1B] kl-heart-active' : ''}`} />
                    </button>
                  </div>
                  <div className="p-2.5 sm:p-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => addToCart(rvProduct, { quantity: 1, openDrawer: true })}
                      className="w-full rounded-md border border-[#1C1917] bg-white py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:bg-[#FAF9F6] cursor-pointer touch-manipulation"
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${rvProduct.id}`}
                      className="block truncate text-xs font-semibold text-[#1C1917] hover:text-[#14532D]"
                    >
                      {rvProduct.name}
                    </Link>
                    <div className="flex flex-wrap items-baseline gap-1.5 text-xs tabular-nums">
                      <span className="text-[#57534E] line-through">{formatINR(rvProduct.mrp)}</span>
                      <span className="font-bold text-[#059669]">{formatINR(rvProduct.price)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 8. Sticky Bottom Add to Cart Bar for Mobile (slides smoothly above MobileBottomNav) */}
      <div
        data-visible={showStickyBar ? 'true' : 'false'}
        aria-hidden={!showStickyBar}
        className="kl-sticky-bar fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 border-t border-[#E5E0D8] bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2.5 shadow-xl md:hidden"
      >
        <div className="flex items-center gap-2.5 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id, product.name)}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            tabIndex={showStickyBar ? 0 : -1}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[#E5E0D8] bg-white text-[#1C1917] active:scale-95 transition-all shrink-0 touch-manipulation"
          >
            <Heart className={`h-5 w-5 transition-colors duration-150 ${isWishlisted ? 'fill-[#991B1B] text-[#991B1B] kl-heart-active' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => handlePrimaryBuy(false)}
            tabIndex={showStickyBar ? 0 : -1}
            className="flex-1 rounded-md bg-[#C4A482] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#B28F6B] active:scale-[0.98] transition-all touch-manipulation"
          >
            {isOutOfStock ? 'Notify When Back' : `Add to Cart · ${formatINR(effectiveDisplayPrice)}`}
          </button>
        </div>
      </div>

      {/* Modals */}
      <EMIPlansModal
        open={emiModalOpen}
        onClose={() => setEmiModalOpen(false)}
        price={effectiveDisplayPrice}
        productName={product.name}
      />

      <VirtualTryOnModal
        open={Boolean(tryOnProduct)}
        onClose={() => setTryOnProduct(null)}
        product={tryOnProduct || product}
        onAddToCart={({ drapeLabel, addonProductId, blouseAddonPrice, blouseLabel }) => {
          const targetProduct = tryOnProduct || product;
          addToCart(targetProduct, {
            quantity: 1,
            variant: `Drape: ${drapeLabel}`,
            openDrawer: !addonProductId,
          });
          if (addonProductId && blouseAddonPrice > 0) {
            const addonProduct = PRODUCTS.find((p) => p.id === addonProductId);
            if (addonProduct) {
              addToCart(addonProduct, {
                quantity: 1,
                variant: blouseLabel,
                unitPriceOverride: blouseAddonPrice,
                openDrawer: true,
              });
            }
          }
        }}
      />

      <WriteReviewModal
        open={writeReviewOpen}
        onClose={() => setWriteReviewOpen(false)}
        productId={product.id}
        productName={product.name}
      />

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
