import { CreditCard, ShieldCheck, Smartphone, X } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { ProductModalShell } from './ProductModalShell';

interface EMIPlansModalProps {
  open: boolean;
  onClose: () => void;
  price: number;
  productName: string;
}

export function EMIPlansModal({ open, onClose, price, productName }: EMIPlansModalProps) {
  const threeMonth = Math.round(price / 3);
  const sixMonth = Math.round(price / 6);
  const nineMonth = Math.round(price / 9);

  return (
    <ProductModalShell
      open={open}
      onClose={onClose}
      ariaLabel="No Cost EMI Plans"
      maxWidthClass="max-w-lg"
      panelClassName="bg-white p-4 sm:p-6 space-y-5"
    >
      <div className="flex items-start justify-between gap-2 border-b border-[#E5E0D8] pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#14532D]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#14532D]">
              0% Interest
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1C1917]">No Cost EMI Plans</h3>
          </div>
          <p className="mt-0.5 text-xs text-[#57534E] truncate">{productName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close EMI plans"
          className="rounded p-1.5 text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] shrink-0 touch-manipulation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Snapmint Instant UPI 3-Month Plan */}
      <div className="rounded-lg border border-[#14532D]/40 bg-[#14532D]/5 p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-[#14532D] shrink-0" />
            <span className="text-sm font-bold text-[#1C1917]">Snapmint UPI · 3 Months</span>
          </div>
          <span className="rounded bg-[#14532D] px-2 py-0.5 text-xs font-semibold text-white">Recommended</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#14532D] tabular-nums">{formatINR(threeMonth)}</span>
          <span className="text-xs text-[#57534E]">/ month for 3 months</span>
        </div>
        <p className="text-xs text-[#57534E]">
          Pay {formatINR(threeMonth)} today via UPI. Remaining 2 installments deducted monthly automatically with 0% interest and no credit card required.
        </p>
      </div>

      {/* Bank Credit Card EMI Plans */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#57534E]">
          <CreditCard className="h-3.5 w-3.5" />
          <span>Bank Credit Card No-Cost EMI</span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E5E0D8] p-3 text-xs space-y-1">
            <div className="flex justify-between gap-2 font-semibold text-[#1C1917]">
              <span>6 Months No-Cost</span>
              <span className="text-[#14532D] tabular-nums">{formatINR(sixMonth)}/mo</span>
            </div>
            <p className="text-[#57534E]">HDFC, ICICI, SBI, Axis, Kotak</p>
            <p className="text-[11px] text-[#14532D] font-medium">Zero interest charges</p>
          </div>

          <div className="rounded-lg border border-[#E5E0D8] p-3 text-xs space-y-1">
            <div className="flex justify-between gap-2 font-semibold text-[#1C1917]">
              <span>9 Months Standard</span>
              <span className="text-[#1C1917] tabular-nums">{formatINR(nineMonth)}/mo</span>
            </div>
            <p className="text-[#57534E]">All major RuPay &amp; Visa cards</p>
            <p className="text-[11px] text-[#57534E]">Low monthly interest</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[#E5E0D8] pt-3 text-[11px] text-[#57534E]">
        <ShieldCheck className="h-4 w-4 text-[#14532D] shrink-0" />
        <span>Instant approval at checkout with OTP · 100% RBI compliant partner NBFCs.</span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-md bg-[#1C1917] py-2.5 text-xs font-semibold text-white hover:bg-black transition-colors touch-manipulation"
      >
        Close &amp; Continue Shopping
      </button>
    </ProductModalShell>
  );
}
