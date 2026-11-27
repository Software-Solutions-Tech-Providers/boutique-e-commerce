import { useState } from 'react';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useBoutiqueCart } from '../../context/BoutiqueCartContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  BOUTIQUE_SOCIAL_POSTS,
  BoutiqueSocialPost,
  BRAND_INFO,
  SAREE_PRODUCTS,
} from '../../data/boutiqueData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

export function BoutiqueInstagramFavorites() {
  const { openQuickView } = useBoutiqueCart();
  const { t } = useLanguage();
  const [activePost, setActivePost] = useState<BoutiqueSocialPost | null>(null);

  const activeLinkedProduct = activePost
    ? SAREE_PRODUCTS.find((p) => p.id === activePost.linkedProductId) || SAREE_PRODUCTS[0]
    : null;

  return (
    <>
      <section id="instagram-favorites" aria-labelledby="ig-fav-heading" className="w-full px-2 sm:px-4 lg:px-6 space-y-1.5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#7C1D26] hover:underline underline-offset-2"
            >
              {BRAND_INFO.instagramHandle}
            </a>
            <h2 id="ig-fav-heading" className="font-display text-lg sm:text-2xl font-semibold text-[#231712]">
              {t.igFavoritesTitle}
            </h2>
          </div>

          <p className="text-[11px] sm:text-xs font-medium text-[#635147]">{t.tapToShop}</p>
        </div>

        {/* Clean Visual Lookbook Grid */}
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2.5 lg:gap-3">
          {BOUTIQUE_SOCIAL_POSTS.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setActivePost(post)}
              aria-label={`${t.tapToShop}: ${post.caption}`}
              className="group relative aspect-[3/4] w-full overflow-hidden rounded-lg sm:rounded-xl border border-[#E6DDD0] bg-[#F4EDE2] text-left cursor-pointer"
            >
              <SafeImage
                src={post.image}
                alt={post.caption}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute top-1.5 right-1.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/90 text-[#7C1D26] shadow-xs"
              >
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Instagram Favorite Quick-Shop Modal */}
      {activePost && activeLinkedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/55" onClick={() => setActivePost(null)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.igFavoritesTitle}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#E6DDD0] bg-[#FCF9F4] shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActivePost(null)}
              aria-label="Close preview"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#231712] shadow cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-[4/3] max-h-[42vh] w-full bg-[#F4EDE2]">
              <SafeImage src={activePost.image} alt={activePost.caption} className="h-full w-full object-cover" />
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#7C1D26] hover:underline"
                >
                  {activePost.handle}
                </a>
              </div>
              <p className="text-sm text-[#231712]">{activePost.caption}</p>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E6DDD0] bg-white p-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#231712]">{activeLinkedProduct.name}</p>
                  <p className="text-sm font-bold text-[#231712] tabular-nums">
                    {formatINR(activeLinkedProduct.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const prod = activeLinkedProduct;
                    setActivePost(null);
                    openQuickView(prod);
                  }}
                  className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg bg-[#7C1D26] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#5E141B] cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>{t.shopLook}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
