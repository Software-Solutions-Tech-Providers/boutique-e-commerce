import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { ProductModalShell } from './ProductModalShell';

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export function WriteReviewModal({ open, onClose, productId, productName }: WriteReviewModalProps) {
  const { addReview } = useStore();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [occasion, setOccasion] = useState('Sister’s Wedding / Festive');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    addReview({
      productId,
      author: author.trim(),
      city: city.trim() || 'Pan-India',
      rating,
      verified: true,
      occasionPurchased: occasion,
      title: title.trim() || 'Exquisite drape and rich zari work',
      comment: comment.trim(),
    });

    showToast('Thank you! Your verified review has been posted.');
    onClose();
  };

  return (
    <ProductModalShell
      open={open}
      onClose={onClose}
      ariaLabel="Write a Review"
      maxWidthClass="max-w-lg"
      panelClassName="bg-white p-4 sm:p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-2 border-b border-[#E5E0D8] pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1C1917]">Write a Review</h3>
          <p className="text-xs text-[#57534E] truncate">{productName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close review modal"
          className="rounded p-1.5 text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] shrink-0 touch-manipulation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Star Rating Select */}
        <div className="space-y-1.5">
          <label className="font-semibold text-[#1C1917]">Your Rating</label>
          <div className="flex flex-wrap items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} out of 5 stars`}
                className="flex h-10 w-10 items-center justify-center text-[#B45309] hover:scale-110 transition-transform cursor-pointer touch-manipulation"
              >
                <Star
                  className={`h-6 w-6 ${
                    (hoverRating || rating) >= star ? 'fill-[#B45309] text-[#B45309]' : 'text-[#E5E0D8]'
                  }`}
                />
              </button>
            ))}
            <span className="ml-1 font-medium text-[#57534E]">{rating} out of 5 stars</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="font-semibold text-[#1C1917]">Your Name</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Ananya Sundaram"
              className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-[#1C1917]">City / Location</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Chennai, Bengaluru"
              className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[#1C1917]">Occasion Purchased</label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. Diwali Puja, Wedding Reception, Office"
            className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[#1C1917]">Review Headline</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Breathable feel and stayed pleated for 10 hours"
            className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[#1C1917]">Your Experience / Feedback</label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell other boutique shoppers about the fabric weight, zari sheen, pleats fall, and drape comfort..."
            className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-base sm:text-sm text-[#1C1917] focus:border-[#14532D] focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E5E0D8] pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#E5E0D8] bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9] touch-manipulation"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#14532D] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] transition-colors touch-manipulation"
          >
            Submit Review
          </button>
        </div>
      </form>
    </ProductModalShell>
  );
}
