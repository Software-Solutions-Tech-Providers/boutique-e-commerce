import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Camera,
  Check,
  Copy,
  Heart,
  MapPin,
  Minus,
  Play,
  Plus,
  Ruler,
  Scale,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  X,
  ZoomIn,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductDrapeReel } from '../components/ProductDrapeReel';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { useStore } from '../context/StoreContext';
import { getFabricQualityPromise } from '../data/conversionData';
import { UnitType } from '../types/store';
import {
  buildWhatsAppEnquiryUrl,
  calculateUnitPrice,
  checkPincodeServiceability,
  formatINR,
  PincodeEstimate,
} from '../utils/commerce';

export const ProductDetailPage: React.FC = () => {
  const {
    view,
    products,
    categories,
    reviews,
    wishlist,
    compareList,
    toggleCompare,
    currentUser,
    navigate,
    addToCart,
    toggleWishlist,
    markProductViewed,
    subscribeBackInStock,
    submitReview,
    notify,
  } = useStore();

  const slug = view.page === 'product' ? view.slug : '';
  const product = products.find((p) => p.slug === slug) || products[0];

  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video'; index: number }>({
    type: 'image',
    index: 0,
  });
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [unitType, setUnitType] = useState<UnitType>(product.unitType);
  const [measureQty, setMeasureQty] = useState(
    product.unitType === 'piece' ? 1 : Math.max(2, product.minMeasure)
  );

  // PIN code serviceability
  const [pincode, setPincode] = useState('400001');
  const [pinResult, setPinResult] = useState<PincodeEstimate | null>(() =>
    checkPincodeServiceability('400001')
  );

  // Back in stock
  const [restockContact, setRestockContact] = useState(currentUser?.email || '');
  const [restockSent, setRestockSent] = useState(false);

  // Detail Tabs & Review Form
  const [infoTab, setInfoTab] = useState<'specs' | 'care' | 'reviews'>('specs');
  const [revName, setRevName] = useState(currentUser?.name || '');
  const [revCity, setRevCity] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revPhoto, setRevPhoto] = useState<string | undefined>(undefined);
  const [activeReviewPhoto, setActiveReviewPhoto] = useState<{
    url: string;
    userName: string;
    title: string;
    variant?: string;
  } | null>(null);

  useEffect(() => {
    if (product) {
      markProductViewed(product.id);
      setActiveMedia({ type: 'image', index: 0 });
      setSelectedColor(product.colors[0]?.name || 'Default');
      setSelectedSize(product.sizes[0] || 'Standard');
      setUnitType(product.unitType);
      setMeasureQty(product.unitType === 'piece' ? 1 : Math.max(2, product.minMeasure));
      setRestockSent(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const category = categories.find((c) => c.id === product.categoryId);
  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyProductLink = () => {
    const shareText = `${product.name} — ${formatINR(product.price)} at Vastra Atelier (${window.location.href})`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
    setLinkCopied(true);
    notify('Product link copied for sharing.', 'success');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleNativeShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `${product.name} | Vastra Atelier`,
          text: `Explore "${product.name}" (${product.fabricType}) at ${formatINR(product.price)}.`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      handleCopyProductLink();
    }
  };
  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === product.id && r.approved),
    [reviews, product.id]
  );

  const similarProducts = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.id !== product.id &&
            (p.categoryId === product.categoryId || p.occasion === product.occasion)
        )
        .slice(0, 3),
    [products, product]
  );

  const computedPrice = calculateUnitPrice(product.price, measureQty, unitType);
  const computedOriginal = calculateUnitPrice(product.originalPrice, measureQty, unitType);

  const handleColorSelect = (colorName: string, colorImg?: string) => {
    setSelectedColor(colorName);
    if (colorImg) {
      const idx = product.images.indexOf(colorImg);
      if (idx >= 0) {
        setActiveMedia({ type: 'image', index: idx });
      }
    }
  };

  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setRevPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const measureLabel =
    product.unitType === 'piece' ? selectedSize : `${measureQty} ${unitType}s`;

  const handleSubmitReviewWithVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;
    submitReview({
      productId: product.id,
      userName: revName.trim(),
      city: revCity.trim() || 'India',
      rating: revRating,
      title: revTitle.trim() || 'Verified Boutique Review',
      comment: revComment.trim(),
      photoUrl: revPhoto,
      purchasedVariant: `${selectedColor} · ${measureLabel}`,
      verifiedPurchase: true,
    });
    setRevTitle('');
    setRevComment('');
    setRevPhoto(undefined);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-10 sm:space-y-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => navigate({ page: 'home' })}
          className="hover:text-[var(--text-primary)] cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        {category && (
          <>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: category.id })}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              {category.name}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--text-primary)]">{product.name}</span>
      </nav>

      {/* Main Contiguous Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: High-Res Model Look + Texture Zoom + Drape Video */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => {
                  setZoomActive(false);
                  const modelIdx = product.modelImage ? product.images.indexOf(product.modelImage) : 0;
                  setActiveMedia({ type: 'image', index: modelIdx >= 0 ? modelIdx : 0 });
                }}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                  activeMedia.type === 'image' &&
                  (product.images[activeMedia.index] === product.modelImage || activeMedia.index === 0)
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                On Model
              </button>
              {product.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setZoomActive(false);
                    const detailIdx = product.images.findIndex((img) => img !== product.modelImage);
                    setActiveMedia({ type: 'image', index: detailIdx >= 0 ? detailIdx : 1 });
                  }}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                    activeMedia.type === 'image' &&
                    product.images[activeMedia.index] !== product.modelImage &&
                    activeMedia.index > 0
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  Fabric Detail
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setZoomActive(false);
                  setActiveMedia({ type: 'video', index: 0 });
                }}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                  activeMedia.type === 'video'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                Drape Video
              </button>
            </div>
          </div>

          <div
            onMouseMove={handleMouseMoveZoom}
            onClick={() => activeMedia.type === 'image' && setZoomActive((z) => !z)}
            className={`relative aspect-[3/4] sm:aspect-[4/3] bg-[var(--bg-subtle)] rounded-lg overflow-hidden border border-[var(--border-color)] ${
              activeMedia.type === 'image' ? 'cursor-zoom-in' : ''
            }`}
          >
            {activeMedia.type === 'video' ? (
              <ProductDrapeReel product={product} variant="detail" autoPlay />
            ) : (
              <img
                src={product.images[activeMedia.index] || product.images[0]}
                alt={`${product.name} — view ${activeMedia.index + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-200"
                style={
                  zoomActive
                    ? {
                        transform: 'scale(2.35)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />
            )}

            {activeMedia.type === 'image' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomActive((z) => !z);
                }}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 hover:bg-white text-[#141416] text-xs font-medium rounded-md shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                {zoomActive ? 'Exit Weave Zoom' : 'Inspect Texture'}
              </button>
            )}
          </div>

          {/* Thumbnails + Video Switch */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => {
                  setZoomActive(false);
                  setActiveMedia({ type: 'image', index: idx });
                }}
                className={`w-16 sm:w-20 h-16 rounded-md overflow-hidden border-2 shrink-0 cursor-pointer ${
                  activeMedia.type === 'image' && activeMedia.index === idx
                    ? 'border-[var(--accent)]'
                    : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setZoomActive(false);
                setActiveMedia({ type: 'video', index: 0 });
              }}
              className={`w-24 h-16 rounded-md border-2 shrink-0 flex flex-col items-center justify-center gap-1 text-xs font-medium cursor-pointer ${
                activeMedia.type === 'video'
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white dark:text-[#141416]'
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-primary)]'
              }`}
            >
              <Play className="w-4 h-4" />
              Drape Video
            </button>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
              <span>
                {product.fabricType} · SKU {product.sku}
              </span>
              {product.isLimitedEdition && (
                <span className="font-semibold text-[var(--accent-gold)]">Limited Edition</span>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mt-1.5 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{product.subtitle}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <div className="flex items-center gap-1 tabular-nums">
                <Star className="w-4 h-4 fill-[#9A7B3E] text-[#9A7B3E]" />
                <span className="font-semibold text-[var(--text-primary)]">{product.rating.toFixed(1)}</span>
                <span className="text-[var(--text-secondary)]">({productReviews.length} reviews)</span>
              </div>
              <span className="text-[var(--border-color)]">|</span>
              <span
                className={`font-medium ${
                  product.stockCount === 0
                    ? 'text-rose-600'
                    : product.stockCount <= 3
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {product.stockCount === 0
                  ? 'Currently Out of Stock'
                  : product.stockCount <= 3
                  ? `Only ${product.stockCount} remaining on loom`
                  : 'In Stock · Ready to Dispatch'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-[var(--border-color)] flex flex-wrap items-baseline gap-2.5 sm:gap-3 tabular-nums">
            <span className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
              {formatINR(computedPrice)}
            </span>
            {computedOriginal > computedPrice && (
              <>
                <span className="text-base text-[var(--text-secondary)] opacity-75 line-through">
                  {formatINR(computedOriginal)}
                </span>
                <span className="text-sm font-semibold text-emerald-600">
                  Save {formatINR(computedOriginal - computedPrice)} ({product.discountPercent}% OFF)
                </span>
              </>
            )}
            <span className="text-xs text-[var(--text-secondary)] sm:ml-auto">
              Transparent price · 5% textile GST at checkout
            </span>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{product.description}</p>

          {/* Interactive Colour Swatch Selector */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
                Selected Shade: <span className="text-[var(--text-primary)]">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleColorSelect(c.name, c.image)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs cursor-pointer transition-colors ${
                      selectedColor === c.name
                        ? 'border-[var(--accent)] bg-[var(--bg-subtle)] font-semibold text-[var(--text-primary)]'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size OR Metre/Yard Yardage Selector */}
          {product.unitType !== 'piece' ? (
            <div className="p-4 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-color)] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Select Cut Length ({formatINR(product.price)}/metre)
                </span>
                <div className="flex bg-[var(--bg-surface)] border border-[var(--border-color)] rounded p-0.5 text-xs">
                  {(['metre', 'yard'] as UnitType[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnitType(u)}
                      className={`px-2.5 py-0.5 rounded capitalize cursor-pointer ${
                        unitType === u
                          ? 'bg-[var(--accent)] text-white dark:text-[#141416] font-medium'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {u}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md">
                  <button
                    type="button"
                    onClick={() =>
                      setMeasureQty((q) => Math.max(product.minMeasure, Number((q - 0.5).toFixed(1))))
                    }
                    className="p-2.5 hover:bg-[var(--bg-subtle)] cursor-pointer text-[var(--text-primary)]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                    {measureQty} {unitType}
                    {measureQty > 1 ? 's' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMeasureQty((q) => Math.min(product.maxMeasure, Number((q + 0.5).toFixed(1))))
                    }
                    className="p-2.5 hover:bg-[var(--bg-subtle)] cursor-pointer text-[var(--text-primary)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">
                  Continuous single cut ({product.dimensions.split('·')[0]})
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Measurement / Fit: <span className="text-[var(--text-primary)]">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md border cursor-pointer transition-colors ${
                      selectedSize === sz
                        ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary CTAs or Back-in-Stock */}
          {product.stockCount > 0 ? (
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    addToCart(product, {
                      selectedColor,
                      selectedSize,
                      measureQuantity: measureQty,
                      unitType,
                    })
                  }
                  className="flex-1 py-3 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>
                <div className="flex gap-2.5 sm:flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, {
                        selectedColor,
                        selectedSize,
                        measureQuantity: measureQty,
                        unitType,
                        openDrawer: false,
                      });
                      navigate({ page: 'checkout' });
                    }}
                    className="flex-1 py-3 px-4 bg-[#141416] dark:bg-white hover:opacity-90 text-white dark:text-[#141416] text-sm font-semibold rounded-md transition-colors cursor-pointer min-h-[44px]"
                  >
                    Buy Now
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className="px-3.5 border border-[var(--border-color)] rounded-md hover:border-[var(--text-primary)] cursor-pointer min-h-[44px]"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? 'fill-[var(--accent)] text-[var(--accent)]' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              <a
                href={buildWhatsAppEnquiryUrl(product, selectedColor, measureLabel)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 border border-[var(--border-color)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-xs font-medium rounded-md inline-flex items-center justify-center gap-2 transition-colors min-h-[42px]"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                Enquire on WhatsApp about this Weave
              </a>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1 text-[11px] sm:text-xs">
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  className={`py-2 px-1.5 sm:px-2.5 border rounded-md inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                    isCompared
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-subtle)] font-semibold'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 shrink-0" />
                  <span>{isCompared ? 'Compared' : 'Compare'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyProductLink}
                  className="py-2 px-1.5 sm:px-2.5 border border-[var(--border-color)] rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                  <span>{linkCopied ? 'Copied' : 'Copy Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="py-2 px-1.5 sm:px-2.5 border border-[var(--border-color)] rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg space-y-3">
              <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[var(--accent)]" />
                Back-in-Stock Loom Notification
              </p>
              {restockSent ? (
                <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> We will alert you as soon as the next loom batch finishes.
                </p>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={restockContact}
                    onChange={(e) => setRestockContact(e.target.value)}
                    placeholder="Email or WhatsApp number"
                    className="min-w-0 flex-1 px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (restockContact.trim()) {
                        subscribeBackInStock(product.id, restockContact);
                        setRestockSent(true);
                      }
                    }}
                    className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-surface)] text-xs font-medium rounded-md cursor-pointer shrink-0"
                  >
                    Notify Me
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PIN Code Delivery Availability Checker */}
          <div className="pt-4 border-t border-[var(--border-color)] space-y-2.5">
            <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
              Check Delivery &amp; COD Availability
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code"
                className="min-w-0 flex-1 px-3 py-2 text-xs bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--accent)] tabular-nums"
              />
              <button
                type="button"
                onClick={() => setPinResult(checkPincodeServiceability(pincode))}
                className="px-4 py-2 text-xs font-medium border border-[var(--border-color)] rounded-md hover:border-[var(--text-primary)] cursor-pointer shrink-0"
              >
                Check
              </button>
            </div>
            {pinResult && (
              <p
                className={`text-xs leading-relaxed ${
                  pinResult.valid ? 'text-[var(--text-secondary)]' : 'text-rose-600'
                }`}
              >
                {pinResult.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)] pt-1">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <span>
              Silk Mark Authenticated · Calibrated daylight photos (no artificial colour filters) · 7-day transparent return on unwashed pieces
            </span>
          </div>
        </div>
      </div>

      {/* Specifications, Care & Customer Reviews + Photo Upload */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-10">
        <div className="flex items-center gap-6 border-b border-[var(--border-color)] pb-3 mb-6 overflow-x-auto max-w-full">
          {[
            { id: 'specs', label: 'Fabric & Quality Promise' },
            { id: 'care', label: 'Care & Preservation' },
            { id: 'reviews', label: `Customer Reviews (${productReviews.length})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setInfoTab(t.id as typeof infoTab)}
              className={`text-sm font-medium pb-2 -mb-[13px] border-b-2 whitespace-nowrap cursor-pointer shrink-0 ${
                infoTab === t.id
                  ? 'border-[var(--accent)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {infoTab === 'specs' && (() => {
          const quality = getFabricQualityPromise(product.fabricType);
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Fabric Classification</p>
                  <p className="font-medium text-[var(--text-primary)] mt-1">{product.fabricType}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Composition</p>
                  <p className="font-medium text-[var(--text-primary)] mt-1">{product.materialComposition}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Weaving Cluster</p>
                  <p className="font-medium text-[var(--text-primary)] mt-1">{product.weaveOrigin}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Dimensions</p>
                  <p className="font-medium text-[var(--text-primary)] mt-1">{product.dimensions}</p>
                </div>
              </div>

              <div className="pt-5 border-t border-[var(--border-color)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                  Quality &amp; Delivery Consistency Standard
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <div className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <p className="font-semibold text-[var(--text-primary)] mb-1">Natural Weave Texture</p>
                    <p>{quality.weaveExpectation}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <p className="font-semibold text-[var(--text-primary)] mb-1">True Daylight Shade Match</p>
                    <p>{quality.colorAccuracyNote}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <p className="font-semibold text-[var(--text-primary)] mb-1">Muslin Packaging &amp; QC</p>
                    <p>{quality.packagingStandard}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <p className="font-semibold text-[var(--text-primary)] mb-1">Clear Return &amp; Refund Policy</p>
                    <p>{quality.returnPolicyNote}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {infoTab === 'care' && (
          <div className="max-w-2xl space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p className="font-semibold text-[var(--text-primary)]">Atelier Preservation Protocol</p>
            <p>{product.careInstructions}</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Every silk and handloom piece arrives in a breathable unbleached cotton muslin bag to
              allow natural fibres to breathe in humid conditions.
            </p>
          </div>
        )}

        {infoTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-5">
              {/* Genuine Rating Breakdown Computed Directly from Approved Reviews */}
              {productReviews.length > 0 && (
                <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 text-center sm:text-left sm:border-r sm:border-[var(--border-color)] sm:pr-4 tabular-nums">
                    <p className="text-3xl font-semibold text-[var(--text-primary)]">
                      {(
                        productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
                      ).toFixed(1)}
                      <span className="text-base text-[var(--accent-gold)] ml-1">★</span>
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Based on {productReviews.length} verified review{productReviews.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="sm:col-span-8 space-y-1.5 text-xs tabular-nums">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = productReviews.filter((r) => Math.round(r.rating) === star).length;
                      const pct = Math.round((count / productReviews.length) * 100);
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-7 text-[var(--text-secondary)]">{star}★</span>
                          <div className="flex-1 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden border border-[var(--border-color)]">
                            <div
                              className="h-full bg-[#9A7B3E] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-[var(--text-secondary)]">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customer Photos Gallery Strip */}
              {productReviews.length > 0 && (
                <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5">
                  <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[var(--accent)]" />
                    Customer Photos of Purchased Weaves
                  </p>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {productReviews.map((rev) => {
                      const img = rev.photoUrl || product.images[0];
                      return (
                        <button
                          key={`gal-${rev.id}`}
                          type="button"
                          onClick={() =>
                            setActiveReviewPhoto({
                              url: img,
                              userName: `${rev.userName} · ${rev.city}`,
                              title: rev.title,
                              variant: rev.purchasedVariant,
                            })
                          }
                          className="relative w-20 h-20 rounded-md overflow-hidden border border-[var(--border-color)] hover:border-[var(--accent)] shrink-0 cursor-pointer group"
                          aria-label={`View customer photo by ${rev.userName}`}
                        >
                          <img
                            src={img}
                            alt={`Customer photo by ${rev.userName}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {productReviews.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">
                  Be the first patron to share your drape experience for this piece.
                </p>
              ) : (
                productReviews.map((rev) => {
                  const customerImg = rev.photoUrl || product.images[0];
                  return (
                    <div
                      key={rev.id}
                      className="p-4 sm:p-5 border border-[var(--border-color)] rounded-lg space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {rev.userName} · {rev.city}
                        </span>
                        <span className="text-[var(--accent-gold)]">
                          {'★'.repeat(rev.rating)} · Verified Purchase
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveReviewPhoto({
                              url: customerImg,
                              userName: `${rev.userName} · ${rev.city}`,
                              title: rev.title,
                              variant: rev.purchasedVariant,
                            })
                          }
                          className="relative w-28 h-28 rounded-md overflow-hidden border border-[var(--border-color)] hover:border-[var(--accent)] shrink-0 cursor-pointer group bg-[var(--bg-subtle)]"
                          aria-label={`Enlarge ${rev.userName} review photo`}
                        >
                          <img
                            src={customerImg}
                            alt={`${rev.userName} purchased ${product.name}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                            <ZoomIn className="w-3 h-3" />
                          </span>
                        </button>

                        <div className="min-w-0 flex-1 space-y-2">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {rev.title}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {rev.comment}
                          </p>

                          <div className="pt-2 flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded object-cover border border-[var(--border-color)] shrink-0"
                            />
                            <span className="truncate">
                              Purchased:{' '}
                              <strong className="font-medium text-[var(--text-primary)]">
                                {rev.purchasedVariant || `${product.name}`}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form
              onSubmit={handleSubmitReviewWithVariant}
              className="lg:col-span-5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg p-5 space-y-3 h-fit"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)] font-sans">
                Write a Patron Review &amp; Upload Photo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder="Your Name"
                  className="px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
                <input
                  type="text"
                  value={revCity}
                  onChange={(e) => setRevCity(e.target.value)}
                  placeholder="City"
                  className="px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--text-secondary)]">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRevRating(star)}
                    className={`text-base cursor-pointer ${
                      star <= revRating ? 'text-[var(--accent-gold)]' : 'text-[var(--border-color)]'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={revTitle}
                onChange={(e) => setRevTitle(e.target.value)}
                placeholder="Headline (e.g. Graceful pallu drape)"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />

              <textarea
                rows={3}
                required
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                placeholder="Share your thoughts on weave texture, colour accuracy, and fit..."
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />

              <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                <Camera className="w-4 h-4 text-[var(--accent)]" />
                <span>{revPhoto ? 'Photo attached (click to change)' : 'Attach a customer photo'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              {revPhoto && (
                <img
                  src={revPhoto}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded border border-[var(--border-color)]"
                />
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-semibold rounded-md cursor-pointer"
              >
                Publish Review
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Similar & Personalized Recommendations */}
      {similarProducts.length > 0 && (
        <section>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-6">
            Curated Pairings &amp; Similar Weaves
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add to Bag & Buy Now Bar */}
      {product.stockCount > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-[60px] bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-color)] px-4 flex items-center justify-between gap-3 no-print">
          <div className="min-w-0">
            <p className="text-[11px] text-[var(--text-secondary)] truncate">{selectedColor}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
              {formatINR(computedPrice)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                addToCart(product, {
                  selectedColor,
                  selectedSize,
                  measureQuantity: measureQty,
                  unitType,
                })
              }
              className="px-3.5 py-2.5 min-h-[44px] bg-[var(--accent)] text-white dark:text-[#141416] text-xs font-semibold rounded-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(product, {
                  selectedColor,
                  selectedSize,
                  measureQuantity: measureQty,
                  unitType,
                  openDrawer: false,
                });
                navigate({ page: 'checkout' });
              }}
              className="px-3.5 py-2.5 min-h-[44px] bg-[#141416] dark:bg-white text-white dark:text-[#141416] text-xs font-semibold rounded-md cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}

      {/* Enlarged Customer Review Photo Modal */}
      {activeReviewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveReviewPhoto(null)}
        >
          <div
            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[4/3] bg-[var(--bg-subtle)] relative">
              <img
                src={activeReviewPhoto.url}
                alt={activeReviewPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveReviewPhoto(null)}
                aria-label="Close photo"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {activeReviewPhoto.title}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {activeReviewPhoto.userName}
                  {activeReviewPhoto.variant ? ` · ${activeReviewPhoto.variant}` : ''}
                </p>
              </div>
              <img
                src={product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded object-cover border border-[var(--border-color)] shrink-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
