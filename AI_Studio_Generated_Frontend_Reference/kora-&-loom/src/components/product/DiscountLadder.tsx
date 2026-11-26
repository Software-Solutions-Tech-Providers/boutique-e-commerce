import { Check, Truck } from 'lucide-react';
import { DiscountTier } from '../../types';
import { formatINR } from '../../utils/formatters';

interface DiscountLadderProps {
  tiers: DiscountTier[];
  selectedQty: number;
  onSelectQty: (qty: number) => void;
}

export function DiscountLadder({ tiers, selectedQty, onSelectQty }: DiscountLadderProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
          Buy More – Save More
        </p>
        <span className="text-xs text-[#14532D] font-medium">Free Shipping above ₹2,500</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {tiers.map((tier) => {
          const isSelected = selectedQty === tier.quantity;
          return (
            <button
              key={tier.quantity}
              type="button"
              onClick={() => onSelectQty(tier.quantity)}
              className={`flex flex-col justify-between rounded-lg border p-3 text-left transition-colors cursor-pointer touch-manipulation ${
                tiers.length === 3 ? 'sm:last:col-span-2 xl:last:col-span-1' : ''
              } ${
                isSelected
                  ? 'border-[#14532D] bg-[#14532D]/5 ring-1 ring-[#14532D]'
                  : 'border-[#E5E0D8] bg-white hover:border-[#57534E]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="text-sm font-semibold text-[#1C1917]">
                  Buy {tier.quantity}
                </span>
                <span className="text-sm font-semibold text-[#1C1917] tabular-nums">
                  {formatINR(tier.totalPrice)}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                {tier.savings > 0 ? (
                  <span className="font-semibold text-[#14532D] tabular-nums">
                    {tier.label || `Save ${formatINR(tier.savings)}`}
                  </span>
                ) : (
                  <span className="text-[#57534E]">Standard price</span>
                )}

                {tier.freeShipping ? (
                  <span className="inline-flex items-center gap-1 text-[#14532D] font-medium">
                    {isSelected ? <Check className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                    Free Shipping
                  </span>
                ) : (
                  <span className="text-[#57534E]">+ shipping</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
