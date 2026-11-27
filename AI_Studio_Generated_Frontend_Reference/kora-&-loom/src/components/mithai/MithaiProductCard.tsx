import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { useMithaiCart } from '../../context/MithaiCartContext';
import { MithaiProduct } from '../../data/mithaiData';
import { discountPercent, formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

interface MithaiProductCardProps {
  product: MithaiProduct;
}

export function MithaiProductCard({ product }: MithaiProductCardProps) {
  const { addToCart, wishlistIds, toggleWishlist, openQuickView } = useMithaiCart();
  const isWishlisted = wishlistIds.includes(product.id);
  const pct = discountPercent(product.price, product.originalPrice);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E6DDD0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EDE2]">
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
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        {product.offerLabel && (
          <span className="absolute top-2.5 left-2.5 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#7C1D26]">
            {product.offerLabel}
          </span>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id, product.name)}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#231712] shadow-sm hover:bg-white cursor-pointer"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#7C1D26] text-[#7C1D26]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => openQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#231712] shadow-sm hover:bg-white cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-[#635147]">
            <span className="truncate">{product.category} · {product.defaultWeight}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#231712] tabular-nums shrink-0">
              <Star className="h-3.5 w-3.5 fill-[#B4690E] text-[#B4690E]" />
              {product.rating.toFixed(1)}
              <span className="font-normal text-[#635147]">({product.reviewCount})</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="block text-left font-display text-lg font-semibold leading-snug text-[#231712] hover:text-[#7C1D26] line-clamp-2 cursor-pointer"
          >
            {product.name}
          </button>

          <p className="text-xs leading-relaxed text-[#635147] line-clamp-2">{product.shortDesc}</p>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-[#E6DDD0]/80">
          <div className="flex items-baseline justify-between gap-2 tabular-nums">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-[#231712]">{formatINR(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#635147] line-through">{formatINR(product.originalPrice)}</span>
              )}
            </div>
            {pct > 0 && <span className="text-xs font-semibold text-[#7C1D26]">{pct}% OFF</span>}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, product.defaultWeight, 1)}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#7C1D26] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#5E141B] active:scale-[0.99] cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
