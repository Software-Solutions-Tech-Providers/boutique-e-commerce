import React, { useState } from 'react';
import { Eye, Heart, Scale, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { formatINR } from '../utils/commerce';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    navigate,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    addToCart,
    setQuickViewProduct,
    t,
  } = useStore();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const displayImage =
    hovered && product.images.length > 1 ? product.images[1] : product.images[0];

  const statusLabel =
    product.stockCount === 0
      ? t.product.soldOut
      : product.isLimitedEdition
      ? t.product.limitedEdition
      : product.isNewArrival
      ? t.product.newArrival
      : product.isBestSeller
      ? t.product.bestSeller
      : null;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-[var(--bg-subtle)] overflow-hidden">
        <button
          type="button"
          onClick={() => navigate({ page: 'product', slug: product.slug })}
          className="block w-full h-full cursor-pointer text-left"
          aria-label={`View ${product.name}`}
        >
          {!imgError && displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--bg-subtle)] p-4 text-center">
              <span className="font-display text-base sm:text-lg text-[var(--text-primary)]">{product.name}</span>
              <span className="text-xs text-[var(--text-secondary)] mt-1">{product.fabricType}</span>
            </div>
          )}
        </button>

        {/* Compare Toggle */}
        <button
          type="button"
          onClick={() => toggleCompare(product.id)}
          aria-label={isCompared ? 'Remove from comparison' : 'Compare product'}
          title={isCompared ? 'In comparison' : 'Compare weave'}
          className={`absolute top-2.5 left-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isCompared
              ? 'bg-[var(--accent)] text-white dark:text-[#141416]'
              : 'bg-white/90 text-neutral-700 hover:bg-white hover:text-[#141416]'
          }`}
        >
          <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isWishlisted
              ? 'bg-[var(--accent)] text-white dark:text-[#141416]'
              : 'bg-white/90 text-neutral-700 hover:bg-white hover:text-[#141416]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Action Bar (Hover on Desktop) */}
        <div className="hidden md:flex absolute inset-x-3 bottom-3 items-center gap-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-[#141416] text-xs font-medium rounded flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            {t.product.quickView}
          </button>
          <button
            type="button"
            disabled={product.stockCount === 0}
            onClick={() => addToCart(product)}
            className="flex-1 py-2 px-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-neutral-400 text-white dark:text-[#141416] text-xs font-medium rounded flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stockCount === 0 ? t.product.outOfStock : t.product.addToBag}
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 sm:gap-3">
        <div>
          <div className="flex items-center justify-between gap-1.5 text-[11px] sm:text-xs text-[var(--text-secondary)]">
            <span className="truncate">
              {product.fabricType}
            </span>
            {statusLabel && (
              <span
                className={`shrink-0 font-medium ${
                  product.stockCount === 0 ? 'text-rose-500' : 'text-[var(--accent)]'
                }`}
              >
                {statusLabel}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate({ page: 'product', slug: product.slug })}
            className="mt-1 text-left block w-full cursor-pointer"
          >
            <h3 className="text-xs sm:text-[15px] font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors font-sans">
              {product.name}
            </h3>
          </button>
        </div>

        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-end justify-between gap-1.5">
            <div className="flex flex-wrap items-baseline gap-1.5 tabular-nums min-w-0">
              <span className="text-xs sm:text-[15px] font-semibold text-[var(--text-primary)]">
                {formatINR(product.price)}
                {product.unitType !== 'piece' && (
                  <span className="text-[10px] sm:text-xs font-normal text-[var(--text-secondary)]">
                    /{product.unitType}
                  </span>
                )}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {product.discountPercent}% off
                </span>
              )}
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs text-[var(--text-secondary)] tabular-nums shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#9A7B3E] text-[#9A7B3E]" />
              <span className="font-medium text-[var(--text-primary)]">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Touch-friendly mobile quick actions */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={() => setQuickViewProduct(product)}
              aria-label={`Quick view ${product.name}`}
              className="p-2 border border-[var(--border-color)] rounded text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] cursor-pointer shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={product.stockCount === 0}
              onClick={() => addToCart(product)}
              className="flex-1 py-2 px-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-neutral-400 text-white dark:text-[#141416] text-[11px] font-medium rounded flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              <ShoppingBag className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {product.stockCount === 0 ? t.product.outOfStock : t.product.addToBag}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
