import { ArrowRight, CheckCircle2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { formatINR } from '../utils/formatters';

export function OffersPage() {
  const { addToCart } = useStore();
  const maheshwari = PRODUCTS.find((p) => p.id === 'maheshwari-ochre-rose')!;
  const careKit = PRODUCTS.find((p) => p.id === 'silk-care-kit')!;
  const festiveDuo = PRODUCTS.find((p) => p.id === 'festive-duo-gift-set')!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-10">
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
          Simple, Transparent Value
        </p>
        <h1 className="font-display text-4xl font-semibold text-[#1C1917]">
          Buy More – Save More &amp; Free Shipping Offers
        </h1>
        <p className="text-sm text-[#57534E]">
          No confusing minimum-spend traps or hidden shipping markups. Every offer below shows exact savings before checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card 1: Discount Ladder */}
        <article className="flex flex-col justify-between rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
              Quantity Discount Ladder
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
              Maheshwari Cotton-Silk Ladder
            </h2>
            <p className="text-xs text-[#57534E]">
              Ideal for everyday office wardrobes, sister sets, or festive return gifts.
            </p>
          </div>

          <div className="space-y-2 text-sm tabular-nums">
            <div className="flex justify-between rounded bg-[#FAF9F6] px-3 py-2">
              <span>Buy 1</span>
              <span className="font-semibold">{formatINR(1000)} + shipping</span>
            </div>
            <div className="flex justify-between rounded bg-[#FAF9F6] px-3 py-2">
              <span>Buy 2 (Save ₹100)</span>
              <span className="font-semibold">{formatINR(1900)} + shipping</span>
            </div>
            <div className="flex justify-between rounded border border-[#14532D] bg-[#14532D]/5 px-3 py-2 text-[#14532D]">
              <span className="font-semibold">Buy 3 · Best Value</span>
              <span className="font-semibold">{formatINR(2700)} + Free Shipping</span>
            </div>
            <div className="flex justify-between rounded bg-[#FAF9F6] px-3 py-2">
              <span>Buy 4 (Save ₹600)</span>
              <span className="font-semibold">{formatINR(3400)} + Free Shipping</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addToCart(maheshwari, { quantity: 3, tierTotalOverride: 2700 })}
              className="flex-1 rounded-md bg-[#14532D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] cursor-pointer"
            >
              Add 3-Saree Tier (₹2,700)
            </button>
            <Link
              to={`/product/${maheshwari.id}`}
              className="rounded-md border border-[#E5E0D8] px-3 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9]"
            >
              View
            </Link>
          </div>
        </article>

        {/* Card 2: Festive Duo Clear Math */}
        <article className="flex flex-col justify-between rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B45309]">
              2-Saree Festive Math
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
              Diwali Maroon &amp; Teal Silk Duo
            </h2>
            <p className="text-xs text-[#57534E]">
              Two curated festive silks boxed together with instant ₹400 savings &amp; Free Express Shipping.
            </p>
          </div>

          <div className="rounded-lg bg-[#FAF9F6] p-4 space-y-2 text-sm tabular-nums border border-[#E5E0D8]">
            <div className="flex justify-between text-[#57534E]">
              <span>2 × Festive Silk Sarees (₹1,999)</span>
              <span>{formatINR(3998)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#14532D]">
              <span>Bundle Offer</span>
              <span>−{formatINR(400)}</span>
            </div>
            <div className="flex justify-between text-[#14532D]">
              <span>Express Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between border-t border-[#E5E0D8] pt-2 font-semibold text-[#1C1917]">
              <span>You Pay</span>
              <span>{formatINR(3598)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addToCart(festiveDuo, { quantity: 1 })}
              className="flex-1 rounded-md bg-[#14532D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] cursor-pointer"
            >
              Add Duo (₹3,598)
            </button>
            <Link
              to={`/product/${festiveDuo.id}`}
              className="rounded-md border border-[#E5E0D8] px-3 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9]"
            >
              View
            </Link>
          </div>
        </article>

        {/* Card 3: Subscription for Wardrobe Care */}
        <article className="flex flex-col justify-between rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
              Wardrobe Care Autoship
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
              Monthly Silk Care Refill
            </h2>
            <p className="text-xs text-[#57534E]">
              Keep zari from tarnishing with fresh Himalayan cedar blocks, mild silk wash, and breathable mulmul bags.
            </p>
          </div>

          <ul className="space-y-2 text-sm text-[#1C1917] tabular-nums">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#14532D] shrink-0" />
              <span>One-time kit: {formatINR(500)}</span>
            </li>
            <li className="flex items-center gap-2 font-semibold text-[#14532D]">
              <CheckCircle2 className="h-4 w-4 text-[#14532D] shrink-0" />
              <span>Monthly Refill Plan: {formatINR(450)} / mo</span>
            </li>
            <li className="flex items-center gap-2 text-[#57534E]">
              <Truck className="h-4 w-4 text-[#14532D] shrink-0" />
              <span>Pause, skip, or cancel anytime in Account</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => addToCart(careKit, { quantity: 1, isSubscription: true })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#14532D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] cursor-pointer"
          >
            <span>Start Monthly Care (₹450/mo)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </article>
      </div>
    </div>
  );
}
