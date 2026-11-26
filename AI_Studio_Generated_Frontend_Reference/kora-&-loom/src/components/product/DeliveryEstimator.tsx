import React, { useState } from 'react';
import { CheckCircle2, MapPin, Truck } from 'lucide-react';
import { DeliveryEstimate, estimateDeliveryByPincode } from '../../utils/delivery';

export function DeliveryEstimator() {
  const [pincode, setPincode] = useState('600018');
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(() => estimateDeliveryByPincode('600018'));
  const [error, setError] = useState<string | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const res = estimateDeliveryByPincode(pincode);
    if (!res) {
      setError('Enter a valid 6-digit Indian pincode.');
      setEstimate(null);
      return;
    }
    setError(null);
    setEstimate(res);
  };

  return (
    <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF9F6] p-3.5 space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
        <MapPin className="h-4 w-4 text-[#14532D]" />
        <span>Check Estimated Delivery &amp; COD Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit pincode"
          aria-label="Delivery pincode"
          className="min-w-0 flex-1 rounded-md border border-[#E5E0D8] bg-white px-3 py-2 text-base sm:text-sm text-[#1C1917] tabular-nums focus:border-[#14532D] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md border border-[#14532D] bg-white px-4 py-2 text-xs font-semibold text-[#14532D] hover:bg-[#14532D] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer touch-manipulation"
        >
          Check
        </button>
      </form>

      {error && <p className="text-xs text-[#991B1B]">{error}</p>}

      {estimate && (
        <div className="space-y-1 text-xs text-[#57534E]">
          <p className="flex items-center gap-1.5 font-semibold text-[#14532D]">
            <Truck className="h-3.5 w-3.5 shrink-0" />
            <span>
              {estimate.windowLabel} to {estimate.pincode}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#14532D] shrink-0" />
            <span>
              {estimate.cityHint} · COD &amp; UPI available
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
