import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Ruler,
  Share2,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
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
  const [tryOnModalOpen, setTryOnModalOpen] = useState(false);
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
  const savingsAmount = Math.max(0, product.mrp - product.price);
  const isWishlisted = wishlistIds.includes(product.id);
  const emiPerMonth = Math.round(product.price / 3);

  // Cross-sell & Pairings
  const complementaryProducts = PRODUCTS.filter((p) => product.complementaryIds.includes(p.id));
  const recentlyViewedProducts = recentlyViewedIds
    .filter((vid) => vid !== product.id)
    .map((vid) => PRODUCTS.find((p) => p.id === vid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

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
    <div className="bg-[#FAF9F6] pb-24 text-[#1C1917]">
      {/* 1. Breadcrumbs matching Screenshot 7 */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 py-3 sm:px-6 text-xs text-[#57534E] border-b border-[#E5E0D8]/60 truncate">
        <Link to="/" className="hover:text-[#1C1917]">Home</Link>
        <span className="mx-1.5 text-[#57534E]/60">&gt;</span>
        <Link to="/collections" className="hover:text-[#1C1917]">Products</Link>
        <span className="mx-1.5 text-[#57534E]/60">&gt;</span>
        <Link to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#1C1917]">
          {product.category}
        </Link>
        <span className="mx-1.5 text-[#57534E]/60">&gt;</span>
        <span className="text-[#1C1917] font-medium">{product.name}</span>
      </nav>

      {/* 2. Main Product Section (Mobile: stacked vertical flow; Desktop: 2-column conversion split) */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Gallery matching Screenshot 7 */}
          <div className="lg:col-span-6 lg:sticky lg:top-20">
            <ProductGallery
              productName={product.name}
              images={product.images}
              hasVideoPreview={product.hasVideoPreview}
              videoCaption={product.videoCaption}
              salePercent={savingsPct > 0 ? savingsPct : 12}
            />
          </div>

          {/* Right Column: Full Purchase Module matching Screenshot 4 & 6 */}
          <div className="lg:col-span-6 space-y-4">
            {/* Title with Share Button matching Screenshot 4 */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-sans text-lg sm:text-xl font-bold leading-snug text-[#1C1917] flex-1">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share saree"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#1C1917] hover:bg-[#F2EFE9] transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Urgency Pill matching Screenshot 4 */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#DC2626]">
              <Flame className="h-4 w-4 fill-[#DC2626] text-[#DC2626]" />
              <span>8 sold in last 25 hours</span>
            </div>

            {/* SKU line matching Screenshot 4 */}
            <div className="text-xs text-[#57534E]">
              SKU: <span className="font-semibold text-[#1C1917] tabular-nums">{product.sku}</span>
            </div>

            {/* Price Row with Strikethrough, Green Selling Price, and SAVE Badge matching Screenshot 4 */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {product.mrp > product.price && (
                <span className="text-sm sm:text-base font-semibold text-[#57534E] line-through tabular-nums">
                  Rs. {formatINR(product.mrp * selectedQty)}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-bold text-[#059669] tabular-nums">
                Rs. {formatINR(effectiveDisplayPrice)}
              </span>
              {savingsAmount > 0 && (
                <span className="rounded-md bg-[#059669] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white tabular-nums shadow-xs">
                  SAVE RS. {formatINR(savingsAmount * selectedQty)}
                </span>
              )}
            </div>

            {/* Snapmint No-Cost EMI Card matching Screenshot 4 */}
            <div className="rounded-lg border border-[#E5E0D8] bg-white p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-[#059669] px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
                    NEW
                  </span>
                  <span className="text-[#1C1917]">
                    or <strong className="text-[#059669] tabular-nums">{formatINR(emiPerMonth)}/month</strong> (3 months)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmiModalOpen(true)}
                  className="rounded bg-[#5B1B29] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#45121E] transition-colors cursor-pointer"
                >
                  View Plans
                </button>
              </div>
              <p className="text-[11px] text-[#57534E]">
                No Cost EMI on <strong className="text-[#1C1917]">UPI</strong> | <span className="text-[#B45309] font-bold">snapmint</span>
              </p>
            </div>

            {/* Fabric Pill Selector matching Screenshot 4 */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-[#57534E]">Fabric: <strong className="text-[#1C1917]">{product.weave}</strong></span>
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
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper matching Screenshot 4 */}
            <div className="space-y-1.5">
              <span className="text-xs text-[#57534E]">Quantity:</span>
              <div className="flex items-center w-28 rounded-md border border-[#E5E0D8] bg-white">
                <button
                  type="button"
                  onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                  className="flex h-9 w-9 items-center justify-center text-[#57534E] hover:text-[#1C1917]"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="flex-1 text-center text-xs font-bold tabular-nums text-[#1C1917]">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQty((prev) => prev + 1)}
                  className="flex h-9 w-9 items-center justify-center text-[#57534E] hover:text-[#1C1917]"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Scarcity Bar matching Screenshot 4 */}
            <div className="space-y-1 pt-1">
              <p className="text-xs font-semibold text-[#DC2626]">
                Please hurry! Only 20 left in stock
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E0D8]">
                <div className="h-full w-1/4 rounded-full bg-[#DC2626]" />
              </div>
            </div>

            {/* Special Offers (Gokwik-style) matching Screenshot 4 */}
            <div className="rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#B45309]">Special Offers</span>
                <span className="text-[11px] text-[#57534E]">Powered by <strong>GoKwik</strong></span>
              </div>
              <div className="rounded-lg border border-[#F2EFE9] bg-white p-3 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-[#B45309]/10 px-2 py-0.5 text-[10px] font-bold text-[#B45309]">
                    EMI on Cards
                  </span>
                  <div className="text-xs text-[#1C1917]">
                    <p className="font-semibold">EMI starts from ₹88/M</p>
                    <p className="text-[11px] text-[#57534E]">Plans Available From 10+ Banks</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEmiModalOpen(true)}
                  className="p-1 text-[#57534E] hover:text-[#1C1917]"
                >
                  &gt;
                </button>
              </div>
              <div className="flex justify-center gap-1 pt-0.5">
                <div className="h-1.5 w-6 rounded-full bg-[#B45309]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#E5E0D8]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#E5E0D8]" />
              </div>
            </div>

            {/* Action Buttons: Add to Cart (Sand) + Wishlist + BUY IT NOW (Wine) matching Screenshot 4 */}
            <div ref={buyBoxRef} className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handlePrimaryBuy(false)}
                  className="flex-1 rounded-md bg-[#C4A482] py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#B28F6B] transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id, product.name)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="flex h-12 w-12 items-center justify-center rounded-md border border-[#E5E0D8] bg-white text-[#1C1917] hover:bg-[#F2EFE9] transition-colors shrink-0 cursor-pointer"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-[#991B1B] text-[#991B1B]' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handlePrimaryBuy(true)}
                className="w-full rounded-md bg-[#5B1B29] py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#45121E] transition-colors cursor-pointer"
              >
                Buy It Now
              </button>
            </div>

            {/* "Goes well with" Carousel Cards matching Screenshot 4 & 6 */}
            <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF9F6] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1C1917]">Goes well with</span>
                <span className="text-[11px] text-[#57534E]">Powered by <strong>GoKwik</strong></span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {complementaryProducts.slice(0, 2).map((cp) => (
                  <div key={cp.id} className="rounded-lg border border-[#E5E0D8] bg-white p-2.5 flex flex-col justify-between space-y-2 shadow-2xs">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded bg-[#F2EFE9]">
                      <SafeImage src={cp.images[0].url} alt={cp.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="truncate text-xs font-semibold text-[#1C1917]">{cp.name}</p>
                      <div className="flex items-baseline gap-1.5 text-xs tabular-nums">
                        <span className="font-bold text-[#1C1917]">{formatINR(cp.price)}</span>
                        {cp.mrp > cp.price && <span className="text-[10px] text-[#57534E] line-through">{formatINR(cp.mrp)}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => addToCart(cp, { quantity: 1, openDrawer: true })}
                        className="flex-1 rounded bg-[#1C1917] py-1.5 text-[11px] font-semibold text-white hover:bg-black"
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
                        className="flex-1 rounded border border-[#E5E0D8] bg-white py-1.5 text-[10px] font-semibold text-[#1C1917] hover:bg-[#F2EFE9]"
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

            {/* 5 Collapsible Accordions matching Screenshot 6 */}
            <div className="divide-y divide-[#E5E0D8] border-y border-[#E5E0D8] bg-white">
              {/* 1. Product Details */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordionItem('details')}
                  className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917]"
                >
                  <span>Product Details</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'details' && (
                  <div className="space-y-2 pb-4 text-xs text-[#57534E] leading-relaxed">
                    <p>• <strong>Weave:</strong> {product.weave} Handloom cluster</p>
                    <p>• <strong>Length:</strong> {product.lengthSpec}</p>
                    <p>• <strong>Blouse:</strong> {product.blouseIncluded}</p>
                    <p>• <strong>Zari / Border:</strong> Traditional Korvai temple zari tested for skin comfort</p>
                    <p>• <strong>Weight:</strong> Approximately 480–540g for comfortable 8+ hour celebrations</p>
                  </div>
                )}
              </div>

              {/* 2. Note */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordionItem('note')}
                  className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917]"
                >
                  <span>Note</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === 'note' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'note' && (
                  <div className="pb-4 text-xs text-[#57534E] leading-relaxed">
                    <p>
                      Each handloom saree is individually handwoven on shuttle pit-looms. Minor slub yarn variations, weave texture, and dye shades are natural signatures of human artisanal craft rather than flaws.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Wash Instructions */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordionItem('wash')}
                  className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917]"
                >
                  <span>Wash Instructions</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === 'wash' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'wash' && (
                  <div className="space-y-1.5 pb-4 text-xs text-[#57534E] leading-relaxed">
                    <p>• Dry clean strictly for the first two washes to preserve authentic zari sheen.</p>
                    <p>• Store in breathable unbleached cotton/muslin bags. Avoid hanging on metal hangers.</p>
                    <p>• Change fold lines every 3 months for lifelong heirloom durability.</p>
                  </div>
                )}
              </div>

              {/* 4. Shipping & Delivery Policy */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordionItem('shipping')}
                  className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917]"
                >
                  <span>Shipping &amp; Delivery Policy</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="space-y-1.5 pb-4 text-xs text-[#57534E] leading-relaxed">
                    <p>• Free Express Insured Shipping on all orders over ₹2,500.</p>
                    <p>• Orders under ₹2,500 carry a standard ₹120 insured door delivery fee.</p>
                    <p>• Metro cities: 2–3 business days. Rest of India: 3–5 business days.</p>
                    <p>• Cash on Delivery (COD) supported across 19,000+ Indian pincodes.</p>
                  </div>
                )}
              </div>

              {/* 5. Refund & Exchange Policy */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordionItem('refund')}
                  className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917]"
                >
                  <span>Refund &amp; Exchange Policy</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === 'refund' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'refund' && (
                  <div className="space-y-1.5 pb-4 text-xs text-[#57534E] leading-relaxed">
                    <p>• 7-Day Easy Doorstep Exchange &amp; Return with free courier pickup.</p>
                    <p>• Exchange for another shade/blouse size or opt for <strong>110% Instant Store Credit</strong> bonus.</p>
                    <p>• Original fold, tag, and unstitched blouse intact required for exchange pickup.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Highlight Marquee Strip matching Screenshot 5 & 6 */}
      <div className="mt-12 overflow-hidden border-y border-[#E5E0D8] bg-[#F2EFE9] py-3 text-xs font-bold uppercase tracking-widest text-[#1C1917]">
        <div className="flex items-center justify-around gap-6 whitespace-nowrap px-4 text-center">
          <span>SAFE &amp; SECURED</span>
          <span className="text-[#57534E]">·</span>
          <span>FREE SHIPPING OVER ₹2,500</span>
          <span className="text-[#57534E]">·</span>
          <span>1,50,000+ HAPPY CUSTOMERS</span>
          <span className="text-[#57534E]">·</span>
          <span>PAN INDIA DELIVERY &amp; COD</span>
        </div>
      </div>

      {/* 4. "Frequently Bought Together" Carousel matching Screenshot 5 */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 space-y-6">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Frequently Bought Together
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.slice(1, 5).map((fProduct) => {
            const fSavingsPct = discountPercent(fProduct.price, fProduct.mrp);
            const isFwishlisted = wishlistIds.includes(fProduct.id);
            const fEmi = Math.round(fProduct.price / 3);

            return (
              <div
                key={fProduct.id}
                className="flex flex-col justify-between rounded-lg border border-[#E5E0D8] bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9] group">
                  <SafeImage src={fProduct.images[0].url} alt={fProduct.name} className="h-full w-full object-cover" />
                  
                  {/* Sale Tag */}
                  <span className="absolute top-2 left-2 rounded-xs bg-[#E11D48] px-2 py-0.5 text-[10px] font-bold text-white">
                    Sale {fSavingsPct}%
                  </span>

                  {/* Try it on Pill Button matching Screenshot 5 */}
                  <button
                    type="button"
                    onClick={() => setTryOnModalOpen(true)}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#5B1B29] px-3 py-1 text-[11px] font-semibold text-white shadow-md hover:bg-[#45121E] transition-colors"
                  >
                    <Shirt className="h-3 w-3" />
                    <span>Try it on</span>
                  </button>

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(fProduct.id, fProduct.name)}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1C1917] shadow-sm hover:bg-white"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isFwishlisted ? 'fill-[#991B1B] text-[#991B1B]' : ''}`} />
                  </button>
                </div>

                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <button
                    type="button"
                    onClick={() => addToCart(fProduct, { quantity: 1, openDrawer: true })}
                    className="w-full rounded-md border border-[#1C1917] bg-white py-2 text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>

                  <div className="space-y-1">
                    <Link to={`/product/${fProduct.id}`} className="block text-xs font-semibold text-[#1C1917] hover:text-[#14532D] line-clamp-2">
                      {fProduct.name}
                    </Link>
                    <div className="flex items-baseline gap-1.5 text-xs tabular-nums">
                      <span className="font-semibold text-[#57534E] line-through">{formatINR(fProduct.mrp)}</span>
                      <span className="font-bold text-[#059669]">{formatINR(fProduct.price)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#57534E]">
                      <span>or <strong className="text-[#059669]">{formatINR(fEmi)}/Month</strong></span>
                      <button
                        type="button"
                        onClick={() => setEmiModalOpen(true)}
                        className="rounded bg-[#5B1B29] px-1.5 py-0.2 text-[9px] font-semibold text-white"
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

      {/* 5. Embedded Video Showcase Card matching Screenshot 3 & 5 */}
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#1C1917] shadow-xl group">
          <SafeImage
            src={product.images[1]?.url || product.images[0].url}
            alt="Diwali festive saree loom walkthrough"
            className="h-full w-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <p className="font-display text-xl sm:text-2xl font-bold">
              🌸 Your Festive Saree Is Waiting! 🤩
            </p>
            <p className="text-xs text-white/80">Kora &amp; Loom Handloom Boutique</p>

            <button
              type="button"
              onClick={() => {
                showToast('Playing full 4K daylight drape inspection video...');
              }}
              aria-label="Play saree video"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E11D48] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="h-7 w-7 fill-white ml-1" />
            </button>

            <div className="pt-2">
              <span className="rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold backdrop-blur-xs">
                Watch on YouTube
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Section matching Screenshot 3 */}
      <section id="reviews" className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-1 text-[#B45309]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5 fill-[#B45309] text-[#B45309]" />
            ))}
          </div>
          <p className="text-xs text-[#57534E]">
            {productReviews.length > 0 ? `${productReviews.length} Verified Buyer Reviews` : 'Be the first to write a review'}
          </p>
        </div>

        {/* Full-width Write a Review Button matching Screenshot 3 */}
        <button
          type="button"
          onClick={() => setWriteReviewOpen(true)}
          className="w-full rounded-md bg-[#5B1B29] py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#45121E] transition-colors cursor-pointer"
        >
          Write a review
        </button>

        {/* Reviews List */}
        {productReviews.length > 0 && (
          <div className="divide-y divide-[#E5E0D8] rounded-xl border border-[#E5E0D8] bg-white p-5 space-y-4">
            {productReviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rev.rating} count={0} />
                    <span className="font-bold text-[#1C1917]">{rev.author}</span>
                    <span className="rounded bg-[#14532D]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#14532D]">Verified</span>
                  </div>
                  <span className="text-[#57534E]">{rev.date}</span>
                </div>
                <p className="font-semibold text-sm text-[#1C1917]">{rev.title}</p>
                <p className="text-[#57534E] leading-relaxed">{rev.comment}</p>
                <p className="text-[11px] text-[#57534E]/80">Purchased for: {rev.occasionPurchased} · {rev.city}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Recently Viewed Products matching Screenshot 2 & 3 */}
      {recentlyViewedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 space-y-6">
          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Recently Viewed Products
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
            {recentlyViewedProducts.map((rvProduct) => (
              <div
                key={rvProduct.id}
                className="flex flex-col justify-between rounded-lg border border-[#E5E0D8] bg-white overflow-hidden shadow-2xs"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9]">
                  <SafeImage src={rvProduct.images[0].url} alt={rvProduct.name} className="h-full w-full object-cover" />
                  <span className="absolute top-2 left-2 rounded-xs bg-[#E11D48] px-2 py-0.5 text-[10px] font-bold text-white">
                    Sale 12%
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(rvProduct.id, rvProduct.name)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#1C1917]"
                  >
                    <Heart className="h-3 w-3" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => addToCart(rvProduct, { quantity: 1, openDrawer: true })}
                    className="w-full rounded-md border border-[#1C1917] bg-white py-1.5 text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:bg-[#FAF9F6]"
                  >
                    Add to Cart
                  </button>
                  <p className="truncate text-xs font-semibold text-[#1C1917]">{rvProduct.name}</p>
                  <div className="flex items-baseline gap-1.5 text-xs tabular-nums">
                    <span className="text-[#57534E] line-through">{formatINR(rvProduct.mrp)}</span>
                    <span className="font-bold text-[#059669]">{formatINR(rvProduct.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Sticky Bottom Add to Cart Bar for Mobile matching Screenshots 1-7 */}
      {showStickyBar && (
        <div className="fixed bottom-14 left-0 right-0 z-30 border-t border-[#E5E0D8] bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-xl md:hidden">
          <div className="flex items-center gap-2.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id, product.name)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-[#E5E0D8] bg-white text-[#1C1917] shrink-0"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-[#991B1B] text-[#991B1B]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => handlePrimaryBuy(false)}
              className="flex-1 rounded-md bg-[#C4A482] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#B28F6B] transition-colors"
            >
              Add to Cart · {formatINR(effectiveDisplayPrice)}
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <EMIPlansModal
        open={emiModalOpen}
        onClose={() => setEmiModalOpen(false)}
        price={product.price}
        productName={product.name}
      />

      <VirtualTryOnModal
        open={tryOnModalOpen}
        onClose={() => setTryOnModalOpen(false)}
        product={product}
        onAddToCart={() => addToCart(product, { quantity: 1, openDrawer: true })}
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
