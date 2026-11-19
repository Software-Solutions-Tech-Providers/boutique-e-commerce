import { ArrowRight, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

export function BrowseAbandonmentStrip() {
  const { pathname } = useLocation();
  const { browseNudgeProduct, dismissBrowseNudge, addToCart } = useStore();

  // Only show quietly on non-PDP, non-checkout pages when the user previously browsed an item and has an empty bag
  if (
    !browseNudgeProduct ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/order-confirmation')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 hidden sm:flex items-center gap-3 rounded-lg border border-[#E5E0D8] bg-white p-3 shadow-lg max-w-sm">
      <SafeImage
        src={browseNudgeProduct.images[0].url}
        alt={browseNudgeProduct.name}
        className="h-14 w-12 rounded object-cover shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-[#57534E]">Continue where you left off</p>
        <Link
          to={`/product/${browseNudgeProduct.id}`}
          className="block truncate text-xs font-semibold text-[#1C1917] hover:text-[#14532D]"
        >
          {browseNudgeProduct.name}
        </Link>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-xs font-semibold text-[#14532D] tabular-nums">
            {formatINR(browseNudgeProduct.price)}
          </span>
          <button
            type="button"
            onClick={() => addToCart(browseNudgeProduct, { quantity: 1 })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C1917] underline underline-offset-2 hover:text-[#14532D] cursor-pointer"
          >
            <span>Add to Bag</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={dismissBrowseNudge}
        aria-label="Dismiss reminder"
        className="self-start p-1 text-[#57534E] hover:text-[#1C1917]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
