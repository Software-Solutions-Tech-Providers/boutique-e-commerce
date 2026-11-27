import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  BOUTIQUE_SOCIAL_POSTS,
  BRAND_INFO,
  getBoutiqueProductDetailPath,
  SAREE_PRODUCTS,
} from '../../data/boutiqueData';
import { SafeImage } from '../common/SafeImage';

export function BoutiqueInstagramFavorites() {
  const { t } = useLanguage();

  return (
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

      {/* Clean Visual Lookbook Grid — routes directly to each saree's ProductDetailPage */}
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2.5 lg:gap-3">
        {BOUTIQUE_SOCIAL_POSTS.map((post) => {
          const linkedProduct =
            SAREE_PRODUCTS.find((p) => p.id === post.linkedProductId) || SAREE_PRODUCTS[0];
          const productPath = getBoutiqueProductDetailPath(linkedProduct);

          return (
            <Link
              key={post.id}
              to={productPath}
              aria-label={`${t.shopLook}: ${linkedProduct.name}`}
              title={linkedProduct.name}
              className="group relative aspect-[3/4] w-full overflow-hidden rounded-lg sm:rounded-xl border border-[#E6DDD0] bg-[#F4EDE2] text-left"
            >
              <SafeImage
                src={post.image}
                alt={linkedProduct.name}
                fallbackTitle={linkedProduct.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute top-1.5 right-1.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/90 text-[#7C1D26] shadow-xs"
              >
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
