import React from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/commerce';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, navigate, moveWishlistToCart, toggleWishlist } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">Saved Archive</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
            Your Atelier Wishlist ({savedProducts.length})
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate({ page: 'catalog', category: 'all' })}
          className="text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
        >
          Continue browsing
        </button>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-10 sm:p-14 text-center mt-8">
          <Heart className="w-10 h-10 text-[var(--text-secondary)] opacity-50 mx-auto mb-3" />
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Your wishlist is currently empty
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
            Save handloom sarees, bridal weaves, or yardage cuts while you curate your wardrobe.
          </p>
          <button
            type="button"
            onClick={() => navigate({ page: 'catalog', category: 'all' })}
            className="mt-5 px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-sm font-medium rounded-md cursor-pointer"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-8">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg overflow-hidden flex flex-col"
            >
              <button
                type="button"
                onClick={() => navigate({ page: 'product', slug: product.slug })}
                className="aspect-[4/3] bg-[var(--bg-subtle)] overflow-hidden cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                    <span className="text-[var(--text-secondary)] truncate">{product.fabricType}</span>
                    {product.stockCount > 0 && product.stockCount <= 3 && (
                      <span className="text-amber-600 font-medium shrink-0">
                        Only {product.stockCount} left
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mt-1 font-sans line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap items-baseline gap-2 mt-1.5 sm:mt-2 tabular-nums">
                    <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                      {formatINR(product.price)}
                      {product.unitType !== 'piece' && `/${product.unitType}`}
                    </p>
                    {product.discountPercent > 0 && (
                      <span className="text-[11px] font-medium text-emerald-600">
                        {product.discountPercent}% off
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() =>
                      product.stockCount === 0
                        ? navigate({ page: 'product', slug: product.slug })
                        : moveWishlistToCart(product.id)
                    }
                    className="flex-1 py-2.5 px-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-medium rounded flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {product.stockCount === 0 ? 'Notify Restock' : 'Move to Bag'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Remove from wishlist"
                    className="p-2.5 border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
