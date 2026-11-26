import React, { useMemo, useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RatingStars } from '../common/RatingStars';

interface ReviewSectionProps {
  productId: string;
  productName: string;
  rating: number;
  reviewCount: number;
}

export function ReviewSection({ productId, productName, rating, reviewCount }: ReviewSectionProps) {
  const { reviews, addReview } = useStore();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showForm, setShowForm] = useState(false);

  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [occasion, setOccasion] = useState('Festive Celebration');
  const [stars, setStars] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const productReviews = useMemo(() => {
    const matched = reviews.filter((r) => r.productId === productId);
    const list = matched.length > 0 ? matched : reviews.slice(0, 3);
    if (filterRating === 'all') return list;
    return list.filter((r) => r.rating === filterRating);
  }, [reviews, productId, filterRating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;
    addReview({
      productId,
      author: author.trim(),
      city: city.trim() || 'India',
      rating: stars,
      verified: true,
      occasionPurchased: occasion,
      title: title.trim() || 'Verified Boutique Purchase',
      comment: comment.trim(),
    });
    setAuthor('');
    setCity('');
    setTitle('');
    setComment('');
    setShowForm(false);
  };

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="border-t border-[#E5E0D8] pt-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
            Verified Buyer Feedback
          </p>
          <h2 id="reviews-heading" className="mt-1 font-display text-3xl font-semibold text-[#1C1917]">
            Customer Reviews for {productName}
          </h2>
          <div className="mt-2">
            <RatingStars rating={rating} count={reviewCount} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-[#F2EFE9] p-1">
            {(['all', 5, 4] as const).map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setFilterRating(val)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterRating === val ? 'bg-white text-[#1C1917] shadow-sm' : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {val === 'all' ? 'All Reviews' : `${val} Stars`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            className="rounded-md border border-[#14532D] px-3.5 py-2 text-xs font-semibold text-[#14532D] hover:bg-[#14532D] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-lg border border-[#E5E0D8] bg-white p-5 space-y-4 max-w-2xl"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm focus:border-[#14532D] focus:outline-none"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Chennai)"
              className="rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm focus:border-[#14532D] focus:outline-none"
            />
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm focus:border-[#14532D] focus:outline-none bg-white"
            >
              <option>Wedding &amp; Reception</option>
              <option>Festive Celebration</option>
              <option>Office &amp; Daywear</option>
              <option>Gift Purchase</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#57534E]">Rating:</span>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setStars(num)}
                aria-label={`${num} stars`}
                className="p-1 cursor-pointer touch-manipulation"
              >
                <Star className={`h-5 w-5 ${num <= stars ? 'fill-[#B45309] text-[#B45309]' : 'text-[#D6D3CD]'}`} />
              </button>
            ))}
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review headline (e.g. Featherlight drape and rich zari)"
            className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm focus:border-[#14532D] focus:outline-none"
          />
          <textarea
            required
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How did the fabric feel, drape, and fit?"
            className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm focus:border-[#14532D] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-[#14532D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] touch-manipulation"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productReviews.map((rev) => (
          <article key={rev.id} className="rounded-lg border border-[#E5E0D8] bg-white p-5 flex flex-col justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#57534E]">
                <span className="inline-flex items-center gap-1 font-semibold text-[#14532D]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Buyer
                </span>
                <span>{rev.date}</span>
              </div>

              <div className="flex items-center gap-0.5 text-[#B45309]">
                {Array.from({ length: rev.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-[#B45309]" />
                ))}
              </div>

              <h3 className="font-sans text-sm font-semibold text-[#1C1917]">{rev.title}</h3>
              <p className="text-sm leading-relaxed text-[#57534E]">{rev.comment}</p>
            </div>

            <div className="border-t border-[#E5E0D8]/70 pt-3 text-xs text-[#57534E]">
              <span className="font-semibold text-[#1C1917]">{rev.author}</span> · {rev.city} · {rev.occasionPurchased}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
