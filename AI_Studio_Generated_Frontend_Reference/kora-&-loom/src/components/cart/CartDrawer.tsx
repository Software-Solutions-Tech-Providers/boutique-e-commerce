import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FREE_SHIPPING_THRESHOLD, PRODUCTS } from '../../data/products';
import { getCartKey, getEffectiveLineTotal, useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

export function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    promoCode,
    promoDiscount,
    shippingFee,
    freeShippingRemaining,
    cartTotal,
    isCartOpen,
    closeCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    applyPromoCode,
    clearPromoCode,
    whatsappRecoveryPhone,
    saveWhatsappRecovery,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [waPhone, setWaPhone] = useState(whatsappRecoveryPhone);
  const [waSaved, setWaSaved] = useState(false);

  if (!isCartOpen) return null;

  const progressPct = Math.min(100, Math.round(((FREE_SHIPPING_THRESHOLD - freeShippingRemaining) / FREE_SHIPPING_THRESHOLD) * 100));

  // Cross-sell: pick an accessory or blouse not currently in cart
  const cartIds = new Set(cart.map((c) => c.productId));
  const crossSellCandidates = PRODUCTS.filter((p) => !cartIds.has(p.id) && (p.category === 'Blouses' || p.category === 'Jewellery' || p.category === 'Saree Care')).slice(0, 2);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoMessage(res.message);
    if (res.ok) setPromoInput('');
  };

  const handleWhatsappSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (waPhone.replace(/\D/g, '').length < 10) return;
    saveWhatsappRecovery(waPhone);
    setWaSaved(true);
  };

  const goCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/45" onClick={closeCart} />
      <aside
        aria-label="Shopping Bag"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF9F6] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5E0D8] bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#14532D]" />
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">Your Bag</h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="rounded-md p-2 text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="border-b border-[#E5E0D8] bg-[#F2EFE9]/70 px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#1C1917]">
            <Truck className="h-4 w-4 text-[#14532D] shrink-0" />
            {freeShippingRemaining === 0 && cart.length > 0 ? (
              <span>Unlocked! Your order qualifies for Free Express Insured Shipping.</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">{formatINR(freeShippingRemaining)}</strong> more for Free Express Shipping (above ₹2,500)
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E0D8]">
            <div
              className="h-full bg-[#14532D] transition-all duration-200"
              style={{ width: `${cart.length === 0 ? 0 : progressPct}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <p className="font-display text-2xl font-semibold text-[#1C1917]">Your boutique bag is empty</p>
              <p className="text-sm text-[#57534E]">
                Explore handloom sarees, fitted blouses, or take our 30-second Saree Finder Quiz.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    navigate('/collections');
                  }}
                  className="rounded-md bg-[#14532D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F3F22]"
                >
                  Browse Collections
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    navigate('/quiz');
                  }}
                  className="rounded-md border border-[#E5E0D8] bg-white px-4 py-2.5 text-sm font-semibold text-[#1C1917] hover:bg-[#F2EFE9]"
                >
                  Take Saree Finder Quiz
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {cart.map((item) => {
                  const key = getCartKey(item);
                  const lineTotal = getEffectiveLineTotal(item);
                  const regularTotal = item.unitPrice * item.quantity;
                  const savedOnTier = Math.max(0, regularTotal - lineTotal);

                  return (
                    <li key={key} className="flex gap-3 rounded-lg border border-[#E5E0D8] bg-white p-3">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-20 rounded object-cover shrink-0 bg-[#F2EFE9]"
                      />
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-[#1C1917] line-clamp-2">{item.name}</p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(key)}
                              aria-label={`Remove ${item.name}`}
                              className="p-1 text-[#57534E] hover:text-[#991B1B]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-[#57534E] tabular-nums">
                            {item.sku}
                            {item.variant ? ` · Size ${item.variant}` : ''}
                            {item.isSubscription ? ' · Monthly Refill (Save 10%)' : ''}
                          </p>
                          {savedOnTier > 0 && (
                            <p className="mt-1 text-xs font-semibold text-[#14532D] tabular-nums">
                              Buy More – Save More applied (-{formatINR(savedOnTier)})
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded border border-[#E5E0D8]">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(key, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-8 w-8 items-center justify-center text-[#1C1917] hover:bg-[#F2EFE9]"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold tabular-nums">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(key, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="flex h-8 w-8 items-center justify-center text-[#1C1917] hover:bg-[#F2EFE9]"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-[#1C1917] tabular-nums">{formatINR(lineTotal)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Complementary Blouse / Jewellery Cross-Sell */}
              {crossSellCandidates.length > 0 && (
                <div className="pt-2 border-t border-[#E5E0D8]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-2">
                    Complete Your Drape
                  </p>
                  <div className="space-y-2">
                    {crossSellCandidates.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-[#E5E0D8] bg-white p-2.5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <SafeImage
                            src={addon.images[0].url}
                            alt={addon.name}
                            className="h-12 w-12 rounded object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-[#1C1917]">{addon.name}</p>
                            <p className="text-xs text-[#57534E] tabular-nums">{formatINR(addon.price)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(addon, { quantity: 1, openDrawer: true })}
                          className="rounded border border-[#14532D] px-2.5 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#14532D] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Cart Recovery */}
              <div className="rounded-lg border border-[#E5E0D8] bg-white p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
                  <MessageCircle className="h-4 w-4 text-[#14532D]" />
                  <span>Need time to decide? Save this bag to WhatsApp</span>
                </div>
                {waSaved ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#14532D] font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Bag link sent to +91 {waPhone}
                  </p>
                ) : (
                  <form onSubmit={handleWhatsappSave} className="mt-2 flex gap-2">
                    <input
                      type="tel"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="10-digit WhatsApp number"
                      className="flex-1 rounded border border-[#E5E0D8] px-2.5 py-1.5 text-xs text-[#1C1917] focus:border-[#14532D] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded bg-[#F2EFE9] px-3 py-1.5 text-xs font-semibold text-[#1C1917] hover:bg-[#E5E0D8] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Save Bag
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Totals & Zero-Surprise-Cost Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-[#E5E0D8] bg-white px-5 py-4 space-y-3">
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code (DIWALI10 or LOOM200)"
                className="flex-1 rounded-md border border-[#E5E0D8] px-3 py-2 text-xs text-[#1C1917] focus:border-[#14532D] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md border border-[#E5E0D8] bg-[#FAF9F6] px-3 py-2 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9]"
              >
                Apply
              </button>
            </form>
            {promoMessage && <p className="text-xs text-[#57534E]">{promoMessage}</p>}

            <div className="space-y-1.5 text-sm tabular-nums">
              <div className="flex justify-between text-[#57534E]">
                <span>Subtotal</span>
                <span>{formatINR(cartSubtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#14532D]">
                  <span>
                    Promo ({promoCode}){' '}
                    <button type="button" onClick={clearPromoCode} className="underline text-xs ml-1">
                      Remove
                    </button>
                  </span>
                  <span>−{formatINR(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#57534E]">
                <span>Shipping (Upfront, no surprises)</span>
                <span>{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
              </div>
              <div className="flex justify-between border-t border-[#E5E0D8] pt-2 text-base font-semibold text-[#1C1917]">
                <span>Total Payable</span>
                <span>{formatINR(cartTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={goCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F3F22] cursor-pointer"
            >
              <span>Guest / Express Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-[11px] text-[#57534E]">
              UPI · Cards · Cash on Delivery available · 7-day easy exchanges
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
