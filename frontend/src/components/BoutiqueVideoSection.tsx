import React, { useMemo } from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { formatINR } from '../utils/commerce';
import { ProductDrapeReel } from './ProductDrapeReel';

const VideoReelCard: React.FC<{ product: Product }> = ({ product }) => {
  const { navigate, setQuickViewProduct, addToCart, t } = useStore();

  return (
    <article className="group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col">
      <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-neutral-900 overflow-hidden">
        <ProductDrapeReel
          product={product}
          variant="card"
          formattedPrice={formatINR(product.price)}
          onNavigateProduct={() => navigate({ page: 'product', slug: product.slug })}
        />
      </div>

      <div className="p-3 flex items-center gap-2 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          className="flex-1 py-2 px-2.5 text-xs font-medium border border-[var(--border-color)] rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
          {t.product.quickView}
        </button>
        <button
          type="button"
          disabled={product.stockCount === 0}
          onClick={() => addToCart(product)}
          className="flex-1 py-2 px-2.5 text-xs font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white dark:text-[#141416] rounded-md inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {product.stockCount === 0 ? t.product.outOfStock : t.product.addToBag}
        </button>
      </div>
    </article>
  );
};

export const BoutiqueVideoSection: React.FC = () => {
  const { products, t } = useStore();

  const videoProducts = useMemo(() => {
    const withCustomVideo = products.filter((p) => Boolean(p.videoUrl));
    const flagshipIds = ['prod-1', 'prod-2', 'prod-3', 'prod-7'];
    const flagship = products.filter(
      (p) => flagshipIds.includes(p.id) && !withCustomVideo.some((w) => w.id === p.id)
    );
    const remaining = products.filter(
      (p) =>
        !withCustomVideo.some((w) => w.id === p.id) && !flagship.some((f) => f.id === p.id)
    );
    return [...withCustomVideo, ...flagship, ...remaining].slice(0, 4);
  }, [products]);

  if (videoProducts.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
            {t.home.reelsKicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
            {t.home.reelsTitle}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            {t.home.reelsSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videoProducts.map((product) => (
          <VideoReelCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
