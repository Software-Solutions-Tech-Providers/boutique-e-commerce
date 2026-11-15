import React, { useMemo, useState } from 'react';
import { ArrowRight, Camera, Star, X, ZoomIn } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Review } from '../types/store';
import { formatINR } from '../utils/commerce';

export const ReviewsPage: React.FC = () => {
  const { reviews, products, currentUser, submitReview, navigate } = useStore();
  const [filterMode, setFilterMode] = useState<'all' | 'photos' | 'five'>('all');
  const [modalReview, setModalReview] = useState<{ review: Review; product?: Product } | null>(
    null
  );

  // Submit review drawer/form
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [revName, setRevName] = useState(currentUser?.name || '');
  const [revCity, setRevCity] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revPhoto, setRevPhoto] = useState<string | undefined>(undefined);

  const approvedReviews = useMemo(
    () => reviews.filter((r) => r.approved),
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    if (filterMode === 'photos') return approvedReviews.filter((r) => Boolean(r.photoUrl));
    if (filterMode === 'five') return approvedReviews.filter((r) => r.rating === 5);
    return approvedReviews;
  }, [approvedReviews, filterMode]);

  const avgRating = useMemo(() => {
    if (approvedReviews.length === 0) return '5.0';
    const sum = approvedReviews.reduce((s, r) => s + r.rating, 0);
    return (sum / approvedReviews.length).toFixed(1);
  }, [approvedReviews]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setRevPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim() || !selectedProdId) return;
    const prod = products.find((p) => p.id === selectedProdId);
    submitReview({
      productId: selectedProdId,
      userName: revName.trim(),
      city: revCity.trim() || 'India',
      rating: revRating,
      title: revTitle.trim() || 'Verified Boutique Review',
      comment: revComment.trim(),
      photoUrl: revPhoto,
      purchasedVariant: prod ? `${prod.colors[0]?.name || 'Signature'} · ${prod.fabricType}` : undefined,
      verifiedPurchase: true,
    });
    setFormOpen(false);
    setRevTitle('');
    setRevComment('');
    setRevPhoto(undefined);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-10">
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Patron Community &amp; Verified Drapes
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
            Customer Reviews &amp; Weave Gallery
          </h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-secondary)] tabular-nums">
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--text-primary)]">
              <Star className="w-3.5 h-3.5 fill-[#9A7B3E] text-[#9A7B3E]" />
              {avgRating} / 5.0
            </span>
            <span>·</span>
            <span>{approvedReviews.length} Verified Reviews</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-lg text-xs">
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'photos', label: 'With Photos' },
              { id: 'five', label: '5 Stars' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterMode(t.id as typeof filterMode)}
                className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                  filterMode === t.id
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-semibold rounded-md cursor-pointer"
          >
            {formOpen ? 'Close Form' : 'Write a Review'}
          </button>
        </div>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 max-w-2xl space-y-4 text-xs"
        >
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Share Your Vastra Atelier Experience
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="sm:col-span-2 px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              required
              value={revName}
              onChange={(e) => setRevName(e.target.value)}
              placeholder="Your Name"
              className="px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
            />
            <input
              type="text"
              value={revCity}
              onChange={(e) => setRevCity(e.target.value)}
              placeholder="City (e.g. Mumbai)"
              className="px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[var(--text-secondary)]">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRevRating(star)}
                className={`text-lg cursor-pointer ${
                  star <= revRating ? 'text-[var(--accent-gold)]' : 'text-[var(--border-color)]'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <input
            type="text"
            value={revTitle}
            onChange={(e) => setRevTitle(e.target.value)}
            placeholder="Review Headline"
            className="w-full px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
          />
          <textarea
            rows={3}
            required
            value={revComment}
            onChange={(e) => setRevComment(e.target.value)}
            placeholder="Describe weave quality, colour accuracy, and drape..."
            className="w-full px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
          />

          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-[var(--accent)] font-medium cursor-pointer">
              <Camera className="w-4 h-4" />
              <span>{revPhoto ? 'Change Photo' : 'Upload Purchased Product Photo'}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {revPhoto && (
              <img
                src={revPhoto}
                alt="Uploaded preview"
                className="w-12 h-12 rounded object-cover border border-[var(--border-color)]"
              />
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-semibold rounded-md cursor-pointer"
          >
            Publish Review (+150 Patron Points)
          </button>
        </form>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => {
          const prod = products.find((p) => p.id === rev.productId);
          const photo = rev.photoUrl || prod?.images[0];
          return (
            <article
              key={rev.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {photo && (
                  <button
                    type="button"
                    onClick={() => setModalReview({ review: rev, product: prod })}
                    className="group relative w-full aspect-[4/3] bg-[var(--bg-subtle)] overflow-hidden block text-left cursor-pointer"
                  >
                    <img
                      src={photo}
                      alt={rev.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                      <span>
                        {rev.userName} · {rev.city}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-black/55 flex items-center justify-center">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                )}

                <div className="p-5 space-y-2">
                  <p className="text-xs font-medium text-[var(--accent-gold)]">
                    {'★'.repeat(rev.rating)} · Verified Purchase
                  </p>
                  <h2 className="text-base font-semibold text-[var(--text-primary)] font-sans">
                    {rev.title}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    “{rev.comment}”
                  </p>
                </div>
              </div>

              {prod && (
                <button
                  type="button"
                  onClick={() => navigate({ page: 'product', slug: prod.slug })}
                  className="mx-5 mb-5 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] hover:border-[var(--accent)] flex items-center gap-3 text-left cursor-pointer group"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)]">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] truncate tabular-nums">
                      {rev.purchasedVariant || prod.fabricType} · {formatINR(prod.price)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] shrink-0" />
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* Inspection Modal */}
      {modalReview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setModalReview(null)}
        >
          <div
            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[4/3] md:aspect-auto bg-[var(--bg-subtle)] min-h-[260px]">
              <img
                src={modalReview.review.photoUrl || modalReview.product?.images[0] || ''}
                alt={modalReview.review.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-[var(--accent-gold)]">
                      {'★'.repeat(modalReview.review.rating)} · Verified Purchase
                    </p>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-1 font-sans">
                      {modalReview.review.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalReview(null)}
                    aria-label="Close modal"
                    className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  “{modalReview.review.comment}”
                </p>
                <p className="text-xs font-medium text-[var(--text-primary)]">
                  — {modalReview.review.userName}, {modalReview.review.city}
                </p>
              </div>
              {modalReview.product && (
                <button
                  type="button"
                  onClick={() => {
                    const slug = modalReview.product!.slug;
                    setModalReview(null);
                    navigate({ page: 'product', slug });
                  }}
                  className="w-full py-2.5 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-semibold rounded-md inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  Shop {modalReview.product.name}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
