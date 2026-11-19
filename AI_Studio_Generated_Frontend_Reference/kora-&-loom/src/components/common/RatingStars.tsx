import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  compact?: boolean;
}

export function RatingStars({ rating, count, compact = false }: RatingStarsProps) {
  const fullStars = Math.round(rating);

  return (
    <div className="inline-flex items-center gap-1.5 text-sm">
      <div className="flex items-center gap-0.5 text-[#B45309]" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className={`h-3.5 w-3.5 ${
              idx < fullStars ? 'fill-[#B45309] text-[#B45309]' : 'fill-transparent text-[#D6D3CD]'
            }`}
          />
        ))}
      </div>
      <span className="font-semibold text-[#1C1917] tabular-nums">{rating.toFixed(1)}</span>
      {typeof count === 'number' && (
        <span className="text-[#57534E] tabular-nums">
          {compact ? `(${count})` : `(${count} verified reviews)`}
        </span>
      )}
    </div>
  );
}
