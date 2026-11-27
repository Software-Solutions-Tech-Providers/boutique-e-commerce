import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquareHeart, Quote, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BOUTIQUE_SAMPLE_REVIEWS } from '../../data/boutiqueData';

type ReviewFilter = 'all' | 'positive' | 'constructive' | 5 | 4 | 3;

export function BoutiqueStoryReviewsSocial() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('all');

  const stats = useMemo(() => {
    const total = BOUTIQUE_SAMPLE_REVIEWS.length;
    const positiveCount = BOUTIQUE_SAMPLE_REVIEWS.filter((r) => r.sentiment === 'positive').length;
    const constructiveCount = BOUTIQUE_SAMPLE_REVIEWS.filter((r) => r.sentiment === 'constructive').length;
    const count5 = BOUTIQUE_SAMPLE_REVIEWS.filter((r) => r.rating === 5).length;
    const count4 = BOUTIQUE_SAMPLE_REVIEWS.filter((r) => r.rating === 4).length;
    const count3 = BOUTIQUE_SAMPLE_REVIEWS.filter((r) => r.rating === 3).length;
    const avg =
      total > 0
        ? BOUTIQUE_SAMPLE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / total
        : 5;

    return {
      total,
      positiveCount,
      constructiveCount,
      avg: avg.toFixed(1),
      bars: [
        { stars: 5 as const, count: count5, pct: Math.round((count5 / total) * 100) },
        { stars: 4 as const, count: count4, pct: Math.round((count4 / total) * 100) },
        { stars: 3 as const, count: count3, pct: Math.round((count3 / total) * 100) },
      ],
    };
  }, []);

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'positive') {
      return BOUTIQUE_SAMPLE_REVIEWS.filter((r) => r.sentiment === 'positive');
    }
    if (activeFilter === 'constructive') {
      return BOUTIQUE_SAMPLE_REVIEWS.filter((r) => r.sentiment === 'constructive');
    }
    if (activeFilter === 5 || activeFilter === 4 || activeFilter === 3) {
      return BOUTIQUE_SAMPLE_REVIEWS.filter((r) => r.rating === activeFilter);
    }
    return BOUTIQUE_SAMPLE_REVIEWS;
  }, [activeFilter]);

  const visibleReviews =
    activeFilter === 'all' && !expanded ? filteredReviews.slice(0, 3) : filteredReviews;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="w-full px-2 sm:px-4 lg:px-6 space-y-2.5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="reviews-heading" className="font-display text-lg sm:text-2xl font-semibold text-[#231712]">
            {t.customerReviews}
          </h2>
        </div>
        <p className="text-xs font-medium text-[#635147] tabular-nums">
          {stats.total} {t.verifiedReviewsLabel} · {stats.positiveCount} {t.positiveReviewsLabel} · {stats.constructiveCount} {t.constructiveFeedbackLabel}
        </p>
      </div>

      {/* Rating Summary & 5★ / 4★ / 3★ Breakdown */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#E6DDD0] bg-white p-3 sm:p-4 lg:grid-cols-12 lg:items-center">
        {/* Overall Score & Sentiment Highlights */}
        <div className="flex flex-wrap items-center justify-between gap-3 lg:col-span-5 lg:border-r lg:border-[#E6DDD0] lg:pr-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#FCF9F4] border border-[#E6DDD0] px-3.5 py-2">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#231712] tabular-nums leading-none">
                {stats.avg}
              </span>
              <span className="mt-1 text-[10px] font-semibold text-[#635147] tabular-nums">
                / 5.0
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-0.5 text-[#B4690E]" aria-label={`${stats.avg} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? 'fill-current' : 'fill-[#B4690E]/45 text-[#B4690E]'}`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-[#231712] tabular-nums">
                {stats.total} {t.verifiedReviewsLabel}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-semibold text-emerald-800 tabular-nums">
                  {stats.positiveCount} {t.positiveReviewsLabel}
                </span>
                <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 font-semibold text-amber-900 tabular-nums">
                  {stats.constructiveCount} {t.constructiveFeedbackLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 5-Star, 4-Star, 3-Star Rating Breakdown */}
        <div className="space-y-1.5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#635147]">
              {t.ratingBreakdownLabel}
            </span>
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'border-[#7C1D26] bg-[#7C1D26] text-white'
                    : 'border-[#E6DDD0] bg-[#FCF9F4] text-[#231712] hover:border-[#7C1D26]'
                }`}
              >
                {t.allReviewsLabel} ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('positive')}
                className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'positive'
                    ? 'border-emerald-700 bg-emerald-700 text-white'
                    : 'border-[#E6DDD0] bg-[#FCF9F4] text-[#231712] hover:border-emerald-700'
                }`}
              >
                {t.positiveReviewsLabel} ({stats.positiveCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('constructive')}
                className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'constructive'
                    ? 'border-amber-700 bg-amber-700 text-white'
                    : 'border-[#E6DDD0] bg-[#FCF9F4] text-[#231712] hover:border-amber-700'
                }`}
              >
                {t.constructiveFeedbackLabel} ({stats.constructiveCount})
              </button>
            </div>
          </div>

          {stats.bars.map((bar) => {
            const isSelected = activeFilter === bar.stars;
            return (
              <button
                key={bar.stars}
                type="button"
                onClick={() => setActiveFilter(isSelected ? 'all' : bar.stars)}
                className={`flex w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#F4EDE2]' : 'hover:bg-[#FCF9F4]'
                }`}
              >
                <span className="inline-flex w-10 items-center gap-0.5 text-xs font-semibold text-[#231712] tabular-nums shrink-0">
                  {bar.stars} <Star className="h-3 w-3 fill-[#B4690E] text-[#B4690E]" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F4EDE2]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      bar.stars === 3 ? 'bg-amber-600' : 'bg-[#B4690E]'
                    }`}
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="w-16 text-right text-[11px] font-medium text-[#635147] tabular-nums shrink-0">
                  {bar.count} ({bar.pct}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-2.5">
        {visibleReviews.map((rev) => {
          const isConstructive = rev.sentiment === 'constructive';
          return (
            <blockquote
              key={rev.id}
              className={`flex flex-col justify-between gap-2 rounded-xl border p-3 ${
                isConstructive
                  ? 'border-amber-200 bg-[#FFFDF8]'
                  : 'border-[#E6DDD0] bg-white'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="flex items-center gap-0.5 text-[#B4690E]"
                      aria-label={`${rev.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= rev.rating ? 'fill-current' : 'text-[#E6DDD0]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-[#635147] tabular-nums">
                      {rev.rating}.0
                    </span>
                  </div>

                  {isConstructive ? (
                    <span className="rounded bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                      {t.constructiveFeedbackLabel}
                    </span>
                  ) : (
                    <Quote className="h-4 w-4 text-[#E6DDD0] shrink-0" />
                  )}
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-[#231712]">
                  “{rev.comment}”
                </p>

                {rev.careNote && (
                  <div className="rounded-lg border border-amber-200/80 bg-[#F4EDE2]/65 p-2 text-[11px] leading-snug text-[#231712]">
                    <p className="inline-flex items-center gap-1 font-semibold text-[#7C1D26] mb-0.5">
                      <MessageSquareHeart className="h-3 w-3 shrink-0" />
                      <span>{t.boutiqueCareNoteLabel}:</span>
                    </p>
                    <p className="text-[#635147]">{rev.careNote}</p>
                  </div>
                )}
              </div>

              <footer className="border-t border-[#E6DDD0] pt-1.5 space-y-0.5">
                <p className="text-xs font-semibold text-[#231712]">
                  {rev.name} · <span className="font-normal text-[#635147]">{rev.city}</span>
                </p>
                <p className="truncate text-[10px] text-[#635147]">{rev.purchasedItem}</p>
              </footer>
            </blockquote>
          );
        })}
      </div>

      {/* Show 20+ Reviews / Show Less Toggle */}
      {activeFilter === 'all' && BOUTIQUE_SAMPLE_REVIEWS.length > 3 && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#7C1D26]/35 bg-white px-5 py-1.5 text-xs sm:text-sm font-semibold text-[#7C1D26] hover:bg-[#7C1D26] hover:text-white transition-colors cursor-pointer"
          >
            <span>{expanded ? t.showLess : t.show20PlusReviews}</span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      )}
    </section>
  );
}
