import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Lock, RotateCcw, ShieldCheck, Smartphone, Truck, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { useAuth } from '../context/AuthContext';
import { getCartKey, getEffectiveLineTotal, useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { estimateDeliveryByPincode } from '../utils/delivery';
import { formatINR } from '../utils/formatters';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, promoCode, promoDiscount, shippingFee, cartTotal, clearCart } = useStore();
  const { user, storeCredit, placeOrder, login } = useAuth();

  const [isGuest, setIsGuest] = useState(!user);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('');
  const [useStoreCredit, setUseStoreCredit] = useState(storeCredit > 0);
  const [formError, setFormError] = useState<string | null>(null);

  const deliveryInfo = estimateDeliveryByPincode(pincode);
  const creditOffset = useStoreCredit && storeCredit > 0 ? Math.min(storeCredit, cartTotal) : 0;
  const finalPayable = Math.max(0, cartTotal - creditOffset);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-3xl font-semibold text-[#1C1917]">Your Bag is Empty</h1>
        <p className="text-sm text-[#57534E]">Add a handloom saree or blouse to proceed with express checkout.</p>
        <Link
          to="/collections"
          className="inline-block rounded-md bg-[#14532D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0F3F22]"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanPin = pincode.replace(/\D/g, '');

    if (!name.trim()) {
      setFormError('Please enter your full name for delivery.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number for delivery updates.');
      return;
    }
    if (!address.trim() || !city.trim()) {
      setFormError('Please enter your complete street address and city.');
      return;
    }
    if (cleanPin.length !== 6) {
      setFormError('Please enter a valid 6-digit Indian pincode.');
      return;
    }
    if (paymentMethod === 'UPI' && upiId.trim() && !upiId.includes('@')) {
      setFormError('Your UPI ID looks incomplete (example: ananya@okaxis). Or leave blank to pay via QR on next step.');
      return;
    }

    setFormError(null);
    const createdOrder = placeOrder({
      customerName: name.trim(),
      phone: cleanPhone,
      email: email.trim() || 'guest@koraandloom.in',
      address: address.trim(),
      city: city.trim(),
      pincode: cleanPin,
      isGuest,
      paymentMethod,
      items: cart,
      subtotal: cartSubtotal,
      discount: promoDiscount,
      shippingFee,
      total: cartTotal,
      useStoreCredit,
    });

    clearCart();
    navigate(`/order-confirmation/${createdOrder.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#E5E0D8] pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#1C1917]">Express Boutique Checkout</h1>
          <p className="text-xs text-[#57534E]">
            No forced account creation · Zero surprise fees at the final step
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14532D]">
          <Lock className="h-3.5 w-3.5" />
          <span>256-Bit Encrypted · UPI / Cards / COD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left: Minimal High-Conversion Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Guest vs Account Toggle */}
          <div className="rounded-lg border border-[#E5E0D8] bg-white p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#1C1917]">Checkout Mode</span>
              <div className="flex items-center gap-1 rounded-md bg-[#F2EFE9] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setIsGuest(true)}
                  className={`rounded px-3 py-1.5 font-semibold cursor-pointer ${isGuest ? 'bg-white text-[#1C1917] shadow-sm' : 'text-[#57534E]'
                    }`}
                >
                  Guest Checkout (Fastest)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsGuest(false);
                    if (!user) {
                      login('ananya@example.com', 'Ananya Sundaram');
                      setName('Ananya Sundaram');
                      setPhone('8124536947');
                      setEmail('ananya@example.com');
                      setAddress('18 Kasturi Ranga Road, Alwarpet');
                      setCity('Chennai');
                      setPincode('600018');
                    }
                  }}
                  className={`rounded px-3 py-1.5 font-semibold cursor-pointer ${!isGuest ? 'bg-white text-[#1C1917] shadow-sm' : 'text-[#57534E]'
                    }`}
                >
                  {user ? `Signed in (${user.name.split(' ')[0]})` : 'Demo Sign In'}
                </button>
              </div>
            </div>
            <p className="text-xs text-[#57534E]">
              {isGuest
                ? 'Continue as guest—no password required. We only ask for delivery essentials.'
                : 'Using saved shipping address & instant order history sync.'}
            </p>
          </div>

          {/* Essential Shipping Fields Only */}
          <div className="rounded-lg border border-[#E5E0D8] bg-white p-5 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">1. Delivery Details</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meenakshi Iyer"
                  className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm focus:border-[#14532D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">Mobile / WhatsApp (10 digits) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm tabular-nums focus:border-[#14532D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">House / Street / Area *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No., Street, Locality"
                className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm focus:border-[#14532D] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Chennai"
                  className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm focus:border-[#14532D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="600018"
                  className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm tabular-nums focus:border-[#14532D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For invoice copy"
                  className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm focus:border-[#14532D] focus:outline-none"
                />
              </div>
            </div>

            {deliveryInfo && (
              <div className="flex items-center gap-2 rounded-md bg-[#FAF9F6] border border-[#E5E0D8] px-3.5 py-2.5 text-xs text-[#14532D] font-medium">
                <Truck className="h-4 w-4 shrink-0" />
                <span>
                  {deliveryInfo.windowLabel} to {deliveryInfo.pincode} · {deliveryInfo.dispatchNote}
                </span>
              </div>
            )}
          </div>

          {/* Payment Options: UPI, Cards, COD */}
          <div className="rounded-lg border border-[#E5E0D8] bg-white p-5 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">2. Choose Payment Method</h2>

            {storeCredit > 0 && (
              <label className="flex items-center justify-between rounded-md border border-[#14532D]/40 bg-[#14532D]/5 p-3 text-sm cursor-pointer">
                <span className="font-medium text-[#1C1917]">
                  Apply Instant Store Credit ({formatINR(storeCredit)} available)
                </span>
                <input
                  type="checkbox"
                  checked={useStoreCredit}
                  onChange={(e) => setUseStoreCredit(e.target.checked)}
                  className="h-4 w-4 accent-[#14532D]"
                />
              </label>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  id: 'UPI' as const,
                  title: 'UPI (GPay / PhonePe)',
                  sub: 'Instant & zero surcharge',
                  icon: Smartphone,
                },
                {
                  id: 'Card' as const,
                  title: 'Credit / Debit Card',
                  sub: 'Visa, Mastercard, RuPay',
                  icon: CreditCard,
                },
                {
                  id: 'COD' as const,
                  title: 'Cash on Delivery',
                  sub: 'Pay on doorstep arrival',
                  icon: Wallet,
                },
              ].map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`rounded-lg border p-3.5 text-left transition-colors cursor-pointer ${active
                        ? 'border-[#14532D] bg-[#14532D]/5 ring-1 ring-[#14532D]'
                        : 'border-[#E5E0D8] hover:border-[#57534E]'
                      }`}
                  >
                    <Icon className={`h-4 w-4 mb-2 ${active ? 'text-[#14532D]' : 'text-[#57534E]'}`} />
                    <p className="text-xs font-semibold text-[#1C1917]">{method.title}</p>
                    <p className="mt-0.5 text-[11px] text-[#57534E]">{method.sub}</p>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'UPI' && (
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  UPI ID (optional—leave blank to scan QR)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okaxis"
                  className="w-full max-w-sm rounded-md border border-[#E5E0D8] px-3 py-2 text-sm focus:border-[#14532D] focus:outline-none"
                />
              </div>
            )}

            {paymentMethod === 'COD' && (
              <p className="text-xs text-[#57534E] rounded bg-[#FAF9F6] p-3 border border-[#E5E0D8]">
                Cash or UPI on delivery is available at zero extra COD fee. Inspect your outer seal upon arrival.
              </p>
            )}
          </div>

          {formError && (
            <div role="alert" className="rounded-md border border-[#991B1B]/30 bg-[#991B1B]/5 p-3.5 text-sm text-[#991B1B]">
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#14532D] px-6 py-4 text-base font-semibold text-white hover:bg-[#0F3F22] transition-colors cursor-pointer tabular-nums"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>
              {paymentMethod === 'COD'
                ? `Place COD Order · ${formatINR(finalPayable)}`
                : `Complete Order · ${formatINR(finalPayable)}`}
            </span>
          </button>
        </form>

        {/* Right: Transparent Order Summary */}
        <aside className="lg:col-span-5 rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-5 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">Order Summary</h2>

          <ul className="divide-y divide-[#E5E0D8] max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <li key={getCartKey(item)} className="flex gap-3 py-3">
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-14 rounded object-cover shrink-0 bg-[#F2EFE9]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1C1917] truncate">{item.name}</p>
                  <p className="text-xs text-[#57534E] tabular-nums">
                    Qty {item.quantity} {item.variant ? `· ${item.variant}` : ''}
                    {item.isSubscription ? ' · Monthly Refill' : ''}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#1C1917] tabular-nums shrink-0">
                  {formatINR(getEffectiveLineTotal(item))}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-[#E5E0D8] pt-4 text-sm tabular-nums">
            <div className="flex justify-between text-[#57534E]">
              <span>Subtotal</span>
              <span>{formatINR(cartSubtotal)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#14532D]">
                <span>Promo ({promoCode})</span>
                <span>−{formatINR(promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#57534E]">
              <span>Shipping (No hidden charges)</span>
              <span>{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
            </div>
            {creditOffset > 0 && (
              <div className="flex justify-between text-[#14532D]">
                <span>Store Credit Applied</span>
                <span>−{formatINR(creditOffset)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#E5E0D8] pt-3 text-base font-semibold text-[#1C1917]">
              <span>Total Payable</span>
              <span>{formatINR(finalPayable)}</span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] p-3.5 text-xs text-[#57534E]">
            <p className="flex items-center gap-2 text-[#1C1917] font-semibold">
              <ShieldCheck className="h-4 w-4 text-[#14532D] shrink-0" />
              <span>100% Buyer Protection Guarantee</span>
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 text-[#14532D] shrink-0" />
              <span>7-day doorstep exchange or instant 110% store credit</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
