import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { getMithaiCartKey, useMithaiCart } from '../../context/MithaiCartContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

export function MithaiCartDrawer() {
  const { showToast } = useToast();
  const {
    cart,
    subtotal,
    promoCode,
    promoDiscount,
    shippingFee,
    freeShippingRemaining,
    totalPayable,
    isCartOpen,
    closeCart,
    updateQty,
    removeItem,
    clearCart,
    applyPromo,
    clearPromo,
  } = useMithaiCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'express' | 'done'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderId, setOrderId] = useState('');

  if (!isCartOpen) return null;

  const progress = Math.min(100, Math.round(((799 - freeShippingRemaining) / 799) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromo(promoInput);
    setPromoMsg(res.message);
    if (res.ok) setPromoInput('');
  };

  const handleExpressOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || phone.replace(/\D/g, '').length < 10 || pincode.replace(/\D/g, '').length < 6) {
      showToast('Please enter your name, 10-digit mobile, and 6-digit pincode.', 'info');
      return;
    }
    const generated = `MM-${Math.floor(2100 + Math.random() * 7800)}`;
    setOrderId(generated);
    clearCart();
    setCheckoutStep('done');
    showToast(`Order ${generated} confirmed!`);
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <aside
        aria-label="Your Sweet Bag"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FCF9F4] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E6DDD0] bg-white px-4 py-3.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#7C1D26]" />
            <h2 className="font-display text-2xl font-semibold text-[#231712]">Your Bag</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close bag"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#635147] hover:bg-[#F4EDE2]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div className="border-b border-[#E6DDD0] bg-[#F4EDE2]/70 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#231712]">
            <Truck className="h-4 w-4 text-[#7C1D26] shrink-0" />
            {freeShippingRemaining === 0 && cart.length > 0 ? (
              <span>Unlocked! Free Express Insulated Pan-India Delivery.</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">{formatINR(freeShippingRemaining)}</strong> more for Free Delivery (₹799+)
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E6DDD0]">
            <div
              className="h-full bg-[#7C1D26] transition-all duration-200"
              style={{ width: `${cart.length === 0 ? 0 : progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {checkoutStep === 'done' ? (
            <div className="rounded-xl border border-[#E6DDD0] bg-white p-6 text-center space-y-3 mt-4">
              <CheckCircle2 className="h-10 w-10 text-[#7C1D26] mx-auto" />
              <h3 className="font-display text-2xl font-semibold text-[#231712]">
                Order #{orderId} Confirmed
              </h3>
              <p className="text-sm text-[#635147]">
                Fresh batch packing starts shortly for {customerName} (Pincode {pincode}). You will receive tracking updates on +91 {phone}.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-lg bg-[#7C1D26] py-3 text-sm font-semibold text-white hover:bg-[#5E141B]"
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="font-display text-2xl font-semibold text-[#231712]">Your mithai bag is empty</p>
              <p className="text-sm text-[#635147]">
                Add fresh cow-ghee Mysore Pak, Kaju Katli, or crisp Madras Mixture to get started.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg bg-[#7C1D26] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5E141B]"
              >
                Explore Bestsellers
              </button>
            </div>
          ) : checkoutStep === 'express' ? (
            <form onSubmit={handleExpressOrder} className="space-y-4 rounded-xl border border-[#E6DDD0] bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-[#231712]">Express Guest Checkout</h3>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="text-xs font-semibold text-[#7C1D26] underline"
                >
                  Edit Bag
                </button>
              </div>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2.5 text-sm focus:border-[#7C1D26] focus:outline-none"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit Mobile / WhatsApp"
                className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2.5 text-sm tabular-nums focus:border-[#7C1D26] focus:outline-none"
              />
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit Delivery Pincode"
                className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2.5 text-sm tabular-nums focus:border-[#7C1D26] focus:outline-none"
              />
              <p className="text-xs text-[#635147]">
                Pay via UPI, Card, or Cash on Delivery · Total payable:{' '}
                <strong className="text-[#231712] tabular-nums">{formatINR(totalPayable)}</strong>
              </p>
              <button
                type="submit"
                className="min-h-[44px] w-full rounded-lg bg-[#7C1D26] py-3 text-sm font-semibold text-white hover:bg-[#5E141B] cursor-pointer"
              >
                Place Express Order · {formatINR(totalPayable)}
              </button>
            </form>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => {
                const key = getMithaiCartKey(item);
                return (
                  <li key={key} className="flex gap-3 rounded-xl border border-[#E6DDD0] bg-white p-3">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover shrink-0 bg-[#F4EDE2]"
                    />
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#231712] truncate">{item.name}</p>
                          <p className="text-xs text-[#635147]">{item.weightLabel}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1 text-[#635147] hover:text-[#7C1D26]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-[#E6DDD0]">
                          <button
                            type="button"
                            onClick={() => updateQty(key, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center text-[#231712]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(key, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center text-[#231712]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#231712] tabular-nums">
                          {formatINR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && checkoutStep === 'cart' && (
          <div className="border-t border-[#E6DDD0] bg-white px-4 py-4 space-y-3">
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Code: SWEET10 or FESTIVE15"
                className="flex-1 rounded-lg border border-[#E6DDD0] px-3 py-2 text-xs text-[#231712] focus:border-[#7C1D26] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg border border-[#E6DDD0] bg-[#FCF9F4] px-3 py-2 text-xs font-semibold text-[#231712] hover:bg-[#F4EDE2]"
              >
                Apply
              </button>
            </form>
            {promoMsg && <p className="text-xs text-[#635147]">{promoMsg}</p>}

            <div className="space-y-1 text-sm tabular-nums">
              <div className="flex justify-between text-[#635147]">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#7C1D26]">
                  <span>
                    Offer ({promoCode}){' '}
                    <button type="button" onClick={clearPromo} className="underline text-xs ml-1">
                      Remove
                    </button>
                  </span>
                  <span>−{formatINR(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#635147]">
                <span>Insulated Delivery</span>
                <span>{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
              </div>
              <div className="flex justify-between border-t border-[#E6DDD0] pt-2 text-base font-semibold text-[#231712]">
                <span>Total Payable</span>
                <span>{formatINR(totalPayable)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutStep('express')}
              className="min-h-[46px] w-full rounded-lg bg-[#7C1D26] py-3 text-sm font-semibold text-white hover:bg-[#5E141B] cursor-pointer"
            >
              Proceed to Express Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
