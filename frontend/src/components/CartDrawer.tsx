import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { calculateUnitPrice, formatINR } from '../utils/commerce';

export const CartDrawer: React.FC = () => {
  const {
    cartOpen,
    setCartOpen,
    cart,
    products,
    cartSummary,
    appliedCouponCode,
    updateCartItemQty,
    removeCartItem,
    applyCoupon,
    removeCoupon,
    navigate,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  if (!cartOpen) return null;

  const progress = Math.min(
    100,
    Math.round((cartSummary.subtotal / cartSummary.freeShippingThreshold) * 100)
  );
  const remainingForFreeShipping = Math.max(
    0,
    cartSummary.freeShippingThreshold - cartSummary.subtotal
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    setCouponFeedback(res.message);
    if (res.ok) setCouponInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[var(--border-color)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
              Your Atelier Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-xs">
            <p className="text-[var(--text-secondary)] mb-1.5">
              {remainingForFreeShipping === 0
                ? 'Complimentary insured courier delivery unlocked.'
                : `Add ${formatINR(remainingForFreeShipping)} more for complimentary insured shipping.`}
            </p>
            <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[var(--border-color)]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-[var(--text-secondary)] opacity-40 mb-3" />
              <p className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Your bag is empty
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xs">
                Explore handwoven Banarasi silks, Kanjivarams, and bespoke fabrics by the metre.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate({ page: 'catalog', category: 'all' });
                }}
                className="mt-5 px-5 py-2.5 bg-[var(--accent)] text-white dark:text-[#141416] text-sm font-medium rounded-md hover:bg-[var(--accent-hover)] cursor-pointer"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              const unitPrice = calculateUnitPrice(
                product.price,
                item.measureQuantity,
                item.unitType
              );
              return (
                <div key={item.id} className="py-4 flex gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded bg-[var(--bg-subtle)] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCartOpen(false);
                          navigate({ page: 'product', slug: product.slug });
                        }}
                        className="text-sm font-semibold text-[var(--text-primary)] text-left hover:text-[var(--accent)] line-clamp-2 cursor-pointer"
                      >
                        {product.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        aria-label="Remove item"
                        className="text-[var(--text-secondary)] hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {item.selectedColor} ·{' '}
                      {item.unitType === 'piece'
                        ? item.selectedSize
                        : `${item.measureQuantity} ${item.unitType}${
                            item.measureQuantity > 1 ? 's' : ''
                          }`}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[var(--border-color)] rounded">
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.id, 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                        {formatINR(unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Price Breakdown */}
        {cart.length > 0 && (
          <div className="border-t border-[var(--border-color)] px-6 py-4 bg-[var(--bg-subtle)] space-y-4">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1 min-w-0">
                <Tag className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon (ATELIER10 / FESTIVE15)"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded focus:outline-none focus:border-[var(--accent)] uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-medium bg-[var(--text-primary)] text-[var(--bg-surface)] rounded cursor-pointer"
              >
                Apply
              </button>
            </form>

            {appliedCouponCode && cartSummary.coupon && (
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded">
                <span>
                  Coupon <strong>{cartSummary.coupon.code}</strong> applied (-
                  {formatINR(cartSummary.discountAmount)})
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {couponFeedback && !cartSummary.coupon && (
              <p className="text-xs text-rose-600 dark:text-rose-400">{couponFeedback}</p>
            )}

            <div className="space-y-1.5 text-xs text-[var(--text-secondary)] tabular-nums">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[var(--text-primary)] font-medium">
                  {formatINR(cartSummary.subtotal)}
                </span>
              </div>
              {cartSummary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Atelier Discount</span>
                  <span>-{formatINR(cartSummary.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Textile GST (5%)</span>
                <span>{formatINR(cartSummary.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span>
                  {cartSummary.shippingCharge === 0
                    ? 'Complimentary'
                    : formatINR(cartSummary.shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--border-color)] text-sm font-semibold text-[var(--text-primary)]">
                <span>Total Payable</span>
                <span>{formatINR(cartSummary.totalAmount)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCartOpen(false);
                navigate({ page: 'checkout' });
              }}
              className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-sm font-semibold rounded-md transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
