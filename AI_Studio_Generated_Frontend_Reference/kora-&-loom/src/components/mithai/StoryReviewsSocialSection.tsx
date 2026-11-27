import { useState } from 'react';
import { Instagram, ShoppingBag, Star, X } from 'lucide-react';
import { useMithaiCart } from '../../context/MithaiCartContext';
import {
  MITHAI_IMAGES,
  MITHAI_PRODUCTS,
  SAMPLE_REVIEWS,
  SOCIAL_GALLERY,
  SocialPost,
} from '../../data/mithaiData';
import { SafeImage } from '../common/SafeImage';

export function StoryReviewsSocialSection() {
  const { openQuickView } = useMithaiCart();
  const [activePost, setActivePost] = useState<SocialPost | null>(null);

  const openLinkedProduct = (productId: string) => {
    setActivePost(null);
    const prod = MITHAI_PRODUCTS.find((p) => p.id === productId);
    if (prod) openQuickView(prod);
  };

  return (
    <>
      {/* 12. Customer Testimonials / Reviews */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7C1D26]">
              Sample Tasting Notes
            </p>
            <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-semibold text-[#231712]">
              Loved by Sweet Connoisseurs
            </h2>
          </div>
          <span className="text-xs text-[#635147]">Swipe reviews on mobile →</span>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 md:grid md:grid-cols-3 md:overflow-visible">
          {SAMPLE_REVIEWS.map((rev) => (
            <article
              key={rev.id}
              className="flex w-[82vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-xl border border-[#E6DDD0] bg-white p-5 gap-4 md:w-auto md:max-w-none"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-0.5 text-[#B4690E]">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-[#B4690E]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[#231712]">“{rev.comment}”</p>
              </div>
              <div className="border-t border-[#E6DDD0] pt-3 text-xs text-[#635147]">
                <p className="font-semibold text-[#231712]">
                  {rev.name} · {rev.city}
                </p>
                <p className="mt-0.5">Ordered: {rev.purchasedItem}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 13. Brand Story / About Us */}
      <section id="brand-story" className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-[#E6DDD0] bg-white lg:grid-cols-12">
          <div className="aspect-[16/10] lg:aspect-auto lg:col-span-6">
            <SafeImage
              src={MITHAI_IMAGES.kitchen}
              alt="Master halwai stirring pure cow-ghee mithai in a brass uruli vessel"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:col-span-6 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7C1D26]">
              Our Brass-Uruli Kitchen
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#231712] text-balance">
              Born from slow-cooked mornings and honest family recipes.
            </h2>
            <p className="text-sm leading-relaxed text-[#635147] sm:text-base">
              Every morning at 5:30 AM, our halwais roast single-origin besan, grind soaked Goa cashews, and fold fresh fruit reductions in heavy brass urulis. Nothing sits in cold storage—your box is packed straight from the cooling tray.
            </p>
            <div className="grid grid-cols-2 gap-4 border-t border-[#E6DDD0] pt-4 text-xs">
              <div>
                <p className="font-display text-2xl font-bold text-[#7C1D26] tabular-nums">100%</p>
                <p className="text-[#635147]">Pure Vegetarian Kitchen</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#7C1D26] tabular-nums">24 hrs</p>
                <p className="text-[#635147]">Fresh-Batch Dispatch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Instagram / Social Media Gallery */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7C1D26]">
              <Instagram className="h-3.5 w-3.5" />
              <span>@madhuramithai</span>
            </p>
            <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-semibold text-[#231712]">
              Fresh From Our Kitchen Feed
            </h2>
          </div>
          <span className="text-xs text-[#635147] hidden sm:inline">Tap any post to shop</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 sm:gap-3">
          {SOCIAL_GALLERY.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setActivePost(post)}
              aria-label={`View post: ${post.caption}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[#E6DDD0] bg-[#F4EDE2] cursor-pointer"
            >
              <SafeImage
                src={post.image}
                alt={post.caption}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5 text-left">
                <span className="text-[11px] font-medium text-white line-clamp-2">{post.caption}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DDD0] px-4 py-3">
              <span className="text-xs font-semibold text-[#231712]">{activePost.handle}</span>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                aria-label="Close post"
                className="p-1 text-[#635147]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-square bg-[#F4EDE2]">
              <SafeImage src={activePost.image} alt={activePost.caption} className="h-full w-full object-cover" />
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-[#231712]">{activePost.caption}</p>
              <button
                type="button"
                onClick={() => openLinkedProduct(activePost.linkedProductId)}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#7C1D26] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#5E141B] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Shop Featured Sweet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
