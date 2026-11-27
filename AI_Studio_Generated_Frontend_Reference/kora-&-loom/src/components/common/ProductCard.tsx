import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { discountPercent, formatINR } from '../../utils/formatters';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  onTryItOn?: () => void;
}

export function ProductCard({ product, onTryItOn }: ProductCardProps) {
  const { addToCart, wishlistIds, toggleWishlist } = useStore();
  const isWishlisted = wishlistIds.includes(product.id);
  const savingsPct = discountPercent(product.price, product.mrp);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];
  const emiMonth = Math.round(product.price / 3);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, { quantity: 1, openDrawer: true });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  return (
    <article className="group flex flex-col bg-white border border-[#E5E0D8] rounded-lg overflow-hidden transition-all duration-200 ease-settle hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9]">
        <SafeImage
          src={primaryImage.url}
          alt={primaryImage.alt}
          fallbackTitle={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <SafeImage
          src={secondaryImage.url}
          alt={secondaryImage.alt}
          fallbackTitle={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Top-Left Red Sale Badge matching Screenshots 2 & 5 */}
        {savingsPct > 0 && (
          <span className="absolute top-2.5 left-2.5 rounded-xs bg-[#E11D48] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            Sale {savingsPct}%
          </span>
        )}

        {/* Top-Right Round Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1C1917] shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#14532D]"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#991B1B] text-[#991B1B]' : ''}`} />
        </button>

        {product.tag && (
          <span className="absolute bottom-2.5 left-2.5 bg-white/95 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#1C1917] rounded shadow-xs">
            {product.tag}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between p-3.5 gap-2.5">
        {/* Full-width "ADD TO CART" Border Button matching Screenshots 2 & 5 */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="w-full rounded-md border border-[#1C1917] bg-white py-2 text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
        >
          Add to Cart
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-[#57534E] truncate">
            <span>{product.weave}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{product.rating.toFixed(1)} ★ ({product.reviewCount})</span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="block text-xs sm:text-sm font-semibold leading-snug text-[#1C1917] hover:text-[#14532D] transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="space-y-1 pt-1 border-t border-[#E5E0D8]/70">
          <div className="flex items-baseline gap-2 tabular-nums">
            {product.mrp > product.price && (
              <span className="text-xs text-[#57534E] line-through">Rs. {formatINR(product.mrp)}</span>
            )}
            <span className="text-sm font-bold text-[#059669]">Rs. {formatINR(product.price)}</span>
          </div>

          <p className="text-[10px] text-[#57534E]">
            or <strong className="text-[#059669] tabular-nums">{formatINR(emiMonth)}/Month</strong> · <span className="font-semibold text-[#5B1B29]">Buy on EMI</span>
          </p>
        </div>
      </div>
    </article>
  );
}
