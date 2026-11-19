import { useState } from 'react';
import { CheckCircle2, Package, Star, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { formatINR } from '../utils/formatters';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, submitSurvey } = useAuth();
  const { addToCart } = useStore();

  const order = orders.find((o) => o.id === id) || orders[0];
  const [upsellAdded, setUpsellAdded] = useState(false);
  const [surveyScore, setSurveyScore] = useState<number>(order?.surveyRating || 0);

  const upsellProduct = PRODUCTS.find((p) => p.id === 'temple-gold-jhumka')!;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-3xl font-semibold">Order Not Found</h1>
        <Link to="/" className="text-sm font-semibold text-[#14532D] underline">
          Return Home
        </Link>
      </div>
    );
  }

  const handleUpsell = () => {
    addToCart(upsellProduct, { quantity: 1, openDrawer: true });
    setUpsellAdded(true);
  };

  const handleSurvey = (rating: number) => {
    setSurveyScore(rating);
    submitSurvey(order.id, rating);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
      <div className="rounded-xl border border-[#E5E0D8] bg-white p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-7 w-7 text-[#14532D] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
              Order Confirmed · {order.paymentMethod}
            </p>
            <h1 className="font-display text-3xl font-semibold text-[#1C1917]">
              Thank you, {order.customerName}! Order #{order.id}
            </h1>
            <p className="mt-1 text-sm text-[#57534E]">
              {order.estimatedDelivery} to {order.address}, {order.city} ({order.pincode})
            </p>
          </div>
        </div>

        {/* Live Tracking Strip */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] p-4 sm:grid-cols-4 text-xs">
          {['Confirmed', 'Weaving & QC', 'Dispatched', 'Delivered'].map((stage, idx) => (
            <div key={stage} className="flex items-center gap-2">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                  idx === 0 ? 'bg-[#14532D] text-white' : 'bg-[#E5E0D8] text-[#57534E]'
                }`}
              >
                {idx + 1}
              </span>
              <span className={idx === 0 ? 'font-semibold text-[#1C1917]' : 'text-[#57534E]'}>{stage}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E0D8] pt-4 text-sm tabular-nums">
          <span className="text-[#57534E]">
            Total Paid ({order.paymentMethod}): <strong className="text-[#1C1917]">{formatINR(order.total)}</strong>
          </span>
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 font-semibold text-[#14532D] hover:underline"
          >
            <Package className="h-4 w-4" />
            <span>Track Order &amp; Manage Exchanges</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Post-Purchase Upsell */}
        <div className="rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
            <Truck className="h-4 w-4" />
            <span>Add Before Parcel Leaves Loom Desk</span>
          </div>
          <div className="flex gap-4">
            <SafeImage
              src={upsellProduct.images[0].url}
              alt={upsellProduct.name}
              className="h-24 w-20 rounded object-cover shrink-0"
            />
            <div className="space-y-1">
              <h2 className="font-display text-xl font-semibold text-[#1C1917]">{upsellProduct.name}</h2>
              <p className="text-xs text-[#57534E]">{upsellProduct.oneLineBenefit}</p>
              <p className="text-sm font-semibold text-[#14532D] tabular-nums">{formatINR(upsellProduct.price)}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={upsellAdded}
            onClick={handleUpsell}
            className="w-full rounded-md bg-[#14532D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] disabled:bg-[#57534E] cursor-pointer"
          >
            {upsellAdded ? 'Added to Next Bag' : 'Add Temple Jhumkas to Order'}
          </button>
        </div>

        {/* Post-Purchase Survey */}
        <div className="rounded-xl border border-[#E5E0D8] bg-white p-6 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
              10-Second Post-Purchase Survey
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
              How smooth was your checkout?
            </h2>
            <p className="text-xs text-[#57534E]">
              Your quick rating helps our boutique improve delivery clarity and sizing confidence.
            </p>
          </div>

          {surveyScore > 0 ? (
            <p className="rounded-md bg-[#FAF9F6] border border-[#E5E0D8] p-3 text-sm font-semibold text-[#14532D]">
              Thank you for rating us {surveyScore}/5!
            </p>
          ) : (
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSurvey(num)}
                  aria-label={`Rate ${num} out of 5`}
                  className="flex h-11 w-11 items-center justify-center rounded-md border border-[#E5E0D8] hover:border-[#B45309] hover:bg-[#FAF9F6] cursor-pointer"
                >
                  <Star className="h-5 w-5 text-[#B45309]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
