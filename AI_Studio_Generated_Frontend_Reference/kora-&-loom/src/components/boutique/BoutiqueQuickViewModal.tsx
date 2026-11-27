import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Heart, Minus, Plus, ShoppingBag, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBoutiqueCart } from '../../context/BoutiqueCartContext';
import { useLanguage } from '../../context/LanguageContext';
import { getBoutiqueProductDetailPath } from '../../data/boutiqueData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

export function BoutiqueQuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, openCart, wishlistIds, toggleWishlist } =
    useBoutiqueCart();
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedOption(quickViewProduct.defaultOption);
      setQty(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const optObj =
    quickViewProduct.drapeOptions.find((o) => o.label === selectedOption) ||
    quickViewProduct.drapeOptions[0];
  const unitPrice = Math.round(quickViewProduct.price * optObj.multiplier);
  const isWishlisted = wishlistIds.includes(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(quickViewProduct, optObj.label, qty);
    closeQuickView();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/55 backdrop-blur-xs sm:p-4">
      <div className="fixed inset-0" onClick={closeQuickView} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={quickViewProduct.name}
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[#FCF9F4] shadow-2xl"
      >
        <div className="mx-auto my-2.5 h-1.5 w-10 rounded-full bg-[#E6DDD0] sm:hidden" />

        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#231712] shadow-sm hover:bg-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="aspect-[4/3] max-h-[36vh] sm:max-h-none sm:aspect-auto sm:h-full bg-[#F4EDE2]">
            <SafeImage
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#635147]">
                <span>{t.categories[quickViewProduct.category]}</span>
                <span>·</span>
                <span className="tabular-nums">{quickViewProduct.sku}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#231712] tabular-nums">
                  <Star className="h-3.5 w-3.5 fill-[#B4690E] text-[#B4690E]" />
                  {quickViewProduct.rating.toFixed(1)}
                </span>
              </div>

              <h2 className="font-display text-2xl font-semibold text-[#231712]">{quickViewProduct.name}</h2>
              <p className="text-sm text-[#635147] leading-relaxed">{quickViewProduct.shortDesc}</p>
            </div>

            <div className="tabular-nums">
              <span className="text-2xl font-bold text-[#231712]">{formatINR(unitPrice * qty)}</span>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#635147]">
                {t.drapeOption}
              </span>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.drapeOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedOption(opt.label)}
                    className={`min-h-[40px] rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                      optObj.label === opt.label
                        ? 'border-[#7C1D26] bg-[#7C1D26] text-white'
                        : 'border-[#E6DDD0] bg-white text-[#231712] hover:border-[#635147]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#E6DDD0] bg-white p-3 space-y-1.5 text-xs text-[#635147]">
              <p>
                <strong className="text-[#231712]">{t.weaveLabel}</strong> {quickViewProduct.fabricSpec}
              </p>
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7C1D26] mt-0.5 shrink-0" />
                <span>{quickViewProduct.blouseDetails}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <div className="inline-flex items-center rounded-lg border border-[#E6DDD0] bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-10 items-center justify-center text-[#231712]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-11 w-10 items-center justify-center text-[#231712]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#7C1D26] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5E141B] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{t.addToBag}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id, quickViewProduct.name)}
                aria-label="Save to wishlist"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E6DDD0] bg-white text-[#231712]"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#7C1D26] text-[#7C1D26]' : ''}`} />
              </button>
            </div>

            <Link
              to={getBoutiqueProductDetailPath(quickViewProduct)}
              onClick={closeQuickView}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C1D26] hover:underline"
            >
              <span>View Full Product Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
