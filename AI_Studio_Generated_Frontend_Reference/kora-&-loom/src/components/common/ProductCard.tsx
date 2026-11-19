import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { discountPercent, formatINR } from '../../utils/formatters';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, wishlistIds, toggleWishlist } = useStore();
  const isWishlisted = wishlistIds.includes(product.id);
  const savingsPct = discountPercent(product.price, product.mrp);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, { quantity: 1 });
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

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1C1917] shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#14532D]"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#991B1B] text-[#991B1B]' : ''}`} />
        </button>

        {product.tag && (
          <span className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#1C1917]">
            {product.tag}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4 gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#57534E] truncate">
            <span>{product.weave}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{product.rating.toFixed(1)} ★ ({product.reviewCount})</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{product.sku}</span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="block font-display text-lg font-semibold leading-snug text-[#1C1917] hover:text-[#14532D] transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          <p className="text-xs text-[#57534E] line-clamp-1">{product.oneLineBenefit}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D8]/70 gap-2">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-base font-semibold text-[#1C1917]">{formatINR(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-[#57534E] line-through">{formatINR(product.mrp)}</span>
            )}
            {savingsPct > 0 && <span className="text-xs font-semibold text-[#14532D]">{savingsPct}% off</span>}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#14532D] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F3F22] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
