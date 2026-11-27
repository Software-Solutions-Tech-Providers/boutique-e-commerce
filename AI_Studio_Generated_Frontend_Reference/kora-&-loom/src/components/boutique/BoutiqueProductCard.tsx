import { useState } from 'react';
import { Eye, Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { useBoutiqueCart } from '../../context/BoutiqueCartContext';
import { useLanguage } from '../../context/LanguageContext';
import { SareeProduct } from '../../data/boutiqueData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

interface BoutiqueProductCardProps {
  product: SareeProduct;
}

export function BoutiqueProductCard({ product }: BoutiqueProductCardProps) {
  const { cart, addToCart, wishlistIds, toggleWishlist, openQuickView } = useBoutiqueCart();
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);
  const isWishlisted = wishlistIds.includes(product.id);

  const inBagQty = cart
    .filter((i) => i.productId === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E6DDD0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* 3:4 Portrait Saree Image with secondary weave hover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4EDE2]">
        <button
          type="button"
          onClick={() => openQuickView(product)}
          aria-label={`Quick view ${product.name}`}
          className="block h-full w-full text-left cursor-pointer"
        >
          <SafeImage
            src={product.image}
            alt={product.name}
            fallbackTitle={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          <SafeImage
            src={product.secondaryImage}
            alt={`${product.name} detail`}
            fallbackTitle={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </button>

        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id, product.name)}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 text-[#231712] shadow-sm hover:bg-white cursor-pointer"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#7C1D26] text-[#7C1D26]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => openQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 text-[#231712] shadow-sm hover:bg-white cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Compact Card Details, Clear Price & + / - Quantity Controls */}
      <div className="flex flex-1 flex-col justify-between p-2 sm:p-2.5 gap-1.5">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#635147]">
            <span className="truncate">{product.sku}</span>
            <span className="inline-flex items-center gap-0.5 font-semibold text-[#231712] tabular-nums shrink-0">
              <Star className="h-3 w-3 fill-[#B4690E] text-[#B4690E]" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="block text-left font-display text-xs sm:text-sm font-semibold leading-snug text-[#231712] hover:text-[#7C1D26] line-clamp-2 cursor-pointer"
          >
            {product.name}
          </button>
        </div>

        <div className="space-y-1.5 pt-1 border-t border-[#E6DDD0]/80">
          {inBagQty > 0 && (
            <div className="flex justify-end">
              <span className="rounded bg-[#F4EDE2] px-1.5 py-0.5 text-[10px] font-semibold text-[#7C1D26] tabular-nums">
                {t.inBagLabel}: {inBagQty}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-1.5">
            <p className="text-sm sm:text-base font-bold text-[#231712] tabular-nums">
              {formatINR(product.price)}
            </p>

            {/* + / - Quantity Controls */}
            <div className="inline-flex h-8 items-center rounded-lg border border-[#E6DDD0] bg-[#FCF9F4] shrink-0">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label={`Decrease quantity for ${product.name}`}
                className="flex h-full w-6 sm:w-7 items-center justify-center text-[#231712] hover:bg-[#F4EDE2] rounded-l-lg cursor-pointer"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-5 text-center text-xs font-semibold text-[#231712] tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                aria-label={`Increase quantity for ${product.name}`}
                className="flex h-full w-6 sm:w-7 items-center justify-center text-[#231712] hover:bg-[#F4EDE2] rounded-r-lg cursor-pointer"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              addToCart(product, product.defaultOption, qty);
              setQty(1);
            }}
            className="flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-lg bg-[#7C1D26] px-2.5 py-1.5 text-[11px] min-[375px]:text-xs sm:text-[13px] font-semibold text-white transition-colors hover:bg-[#5E141B] active:scale-[0.99] cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            <span>{t.addToCart}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
