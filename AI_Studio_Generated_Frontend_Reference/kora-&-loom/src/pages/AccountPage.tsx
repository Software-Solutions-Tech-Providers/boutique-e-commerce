import React, { useState } from 'react';
import { Bell, CheckCircle2, LogOut, Package, RefreshCw, RotateCcw, Star, Truck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '../components/common/SafeImage';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { OrderRecord } from '../types';
import { formatINR } from '../utils/formatters';

const TRACK_STAGES = ['Confirmed', 'Weaving & QC', 'Dispatched', 'Out for Delivery', 'Delivered'] as const;

export function AccountPage() {
  const {
    user,
    login,
    register,
    logout,
    orders,
    storeCredit,
    reorderReminders,
    toggleReorderReminder,
    requestExchange,
  } = useAuth();
  const { addToCart } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('ananya@example.com');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [exchangeModalOrder, setExchangeModalOrder] = useState<OrderRecord | null>(null);
  const [exchangeReason, setExchangeReason] = useState('Need a different blouse size / drape color');
  const [exchangeResolution, setExchangeResolution] = useState<
    'Size/Drape Exchange' | 'Instant 110% Store Credit'
  >('Instant 110% Store Credit');

  const careProduct = PRODUCTS.find((p) => p.id === 'silk-care-kit')!;
  const isCareReminderOn = reorderReminders.includes('silk-care-kit');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      login(email.trim() || 'ananya@example.com');
    } else {
      register({
        name: name.trim() || 'Boutique Guest',
        email: email.trim(),
        phone: phone.trim() || '8124536947',
        address: '18 Kasturi Ranga Road',
        city: 'Chennai',
        pincode: '600018',
      });
    }
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeModalOrder) return;
    const firstItem = exchangeModalOrder.items[0];
    requestExchange(
      exchangeModalOrder.id,
      firstItem.sku,
      exchangeReason,
      exchangeResolution,
      firstItem.unitPrice * firstItem.quantity
    );
    setExchangeModalOrder(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-10">
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5E0D8] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
            Customer Hub &amp; Live Tracking
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-[#1C1917]">
            {user ? `Welcome back, ${user.name}` : 'Orders, Tracking & Boutique Account'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-[#E5E0D8] bg-white px-4 py-2.5 text-xs tabular-nums">
            <span className="text-[#57534E]">Store Credit: </span>
            <strong className="text-sm text-[#14532D]">{formatINR(storeCredit)}</strong>
          </div>
          {user && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E0D8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9] cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left: Orders & Tracking */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">Order History &amp; Delivery Tracking</h2>

          {orders.map((order) => {
            const stageIndex = TRACK_STAGES.indexOf(order.status);
            return (
              <article
                key={order.id}
                className="rounded-xl border border-[#E5E0D8] bg-white p-5 sm:p-6 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#14532D]" />
                      <span className="text-sm font-semibold text-[#1C1917] tabular-nums">
                        Order #{order.id}
                      </span>
                      <span className="text-xs text-[#57534E]">· {order.createdAt}</span>
                    </div>
                    <p className="text-xs text-[#57534E]">
                      {order.estimatedDelivery} · Paid via {order.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right tabular-nums">
                    <p className="text-base font-semibold text-[#1C1917]">{formatINR(order.total)}</p>
                    <p className="text-xs font-semibold text-[#14532D]">{order.status}</p>
                  </div>
                </div>

                {/* Live Stepper */}
                <div className="grid grid-cols-5 gap-2 text-[11px]">
                  {TRACK_STAGES.map((stage, idx) => {
                    const reached = idx <= stageIndex;
                    return (
                      <div key={stage} className="space-y-1.5">
                        <div className={`h-1.5 rounded-full ${reached ? 'bg-[#14532D]' : 'bg-[#E5E0D8]'}`} />
                        <span className={`block truncate ${reached ? 'font-semibold text-[#1C1917]' : 'text-[#57534E]'}`}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <ul className="space-y-3">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.sku}`} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-12 rounded object-cover shrink-0 bg-[#F2EFE9]"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.productId}`}
                            className="block truncate text-sm font-semibold text-[#1C1917] hover:text-[#14532D]"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-[#57534E] tabular-nums">
                            {item.sku} · Qty {item.quantity}
                            {item.variant ? ` · ${item.variant}` : ''}
                            {item.isSubscription ? ' · Monthly Refill' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const prod = PRODUCTS.find((p) => p.id === item.productId);
                            if (prod) addToCart(prod, { quantity: 1 });
                          }}
                          className="inline-flex items-center gap-1 rounded border border-[#E5E0D8] px-2.5 py-1.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9] cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Retention Actions: Exchange Instead of Refund + Delivery Review Request */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E0D8] pt-4 text-xs">
                  {order.exchangeRequested ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#14532D]">
                      <CheckCircle2 className="h-4 w-4" />
                      Exchange Requested: {order.exchangeRequested.resolution}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setExchangeModalOrder(order)}
                      className="inline-flex items-center gap-1.5 font-semibold text-[#14532D] hover:underline cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Need an Exchange or +10% Instant Store Credit?</span>
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <Link
                      to={`/product/${order.items[0].productId}#reviews`}
                      className="inline-flex items-center gap-1 font-semibold text-[#B45309] hover:underline"
                    >
                      <Star className="h-3.5 w-3.5" />
                      <span>Leave Verified Delivery Review</span>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Right: Account Auth + Reorder Reminders */}
        <aside className="lg:col-span-4 space-y-6">
          {!user ? (
            <div className="rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-4">
              <div className="flex gap-1 rounded-md bg-[#F2EFE9] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 rounded py-1.5 font-semibold cursor-pointer ${authMode === 'login' ? 'bg-white text-[#1C1917] shadow-sm' : 'text-[#57534E]'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 rounded py-1.5 font-semibold cursor-pointer ${authMode === 'register' ? 'bg-white text-[#1C1917] shadow-sm' : 'text-[#57534E]'
                    }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-sm focus:border-[#14532D] focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit WhatsApp / Mobile"
                      className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-sm focus:border-[#14532D] focus:outline-none"
                    />
                  </>
                )}
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-sm focus:border-[#14532D] focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-[#14532D] py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] cursor-pointer"
                >
                  {authMode === 'login' ? 'Sign In Instantly' : 'Register Boutique Account'}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-2 text-sm">
              <h2 className="font-display text-2xl font-semibold text-[#1C1917]">Saved Delivery Address</h2>
              <p className="font-semibold text-[#1C1917]">{user.name}</p>
              <p className="text-[#57534E]">{user.address}</p>
              <p className="text-[#57534E] tabular-nums">
                {user.city} · {user.pincode}
              </p>
              <p className="text-[#57534E] tabular-nums">WhatsApp: +91 {user.phone}</p>
            </div>
          )}

          {/* Reorder Reminders & Subscription Control */}
          <div className="rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#14532D]">
              <Bell className="h-4 w-4" />
              <span>Reorder Reminders &amp; Care</span>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Get a gentle 30-day reminder to refresh your cedar blocks and silk wash before monsoon moisture sets in.
            </p>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E5E0D8] bg-[#FAF9F6] p-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#1C1917]">{careProduct.name}</p>
                <p className="text-[11px] text-[#57534E] tabular-nums">₹450/mo refill plan</p>
              </div>
              <button
                type="button"
                onClick={() => toggleReorderReminder(careProduct.id, careProduct.name)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${isCareReminderOn
                  ? 'bg-[#14532D] text-white'
                  : 'border border-[#E5E0D8] bg-white text-[#1C1917]'
                  }`}
              >
                {isCareReminderOn ? 'Active' : 'Enable'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#57534E] pt-1">
              <Truck className="h-3.5 w-3.5 text-[#14532D]" />
              <span>Free reverse pickup on all exchanges</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Exchange Instead of Refund Modal */}
      {exchangeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#E5E0D8] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
                Exchange or Instant Store Credit
              </h3>
              <button type="button" onClick={() => setExchangeModalOrder(null)} aria-label="Close">
                <X className="h-5 w-5 text-[#57534E]" />
              </button>
            </div>

            <form onSubmit={handleExchangeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">Reason</label>
                <select
                  value={exchangeReason}
                  onChange={(e) => setExchangeReason(e.target.value)}
                  className="w-full rounded-md border border-[#E5E0D8] px-3 py-2 text-sm focus:border-[#14532D] focus:outline-none"
                >
                  <option>Need a different blouse size / drape color</option>
                  <option>Prefer another weave for the occasion</option>
                  <option>Received wrong item or weave flaw</option>
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#1C1917]">Choose Preferred Resolution</p>
                <button
                  type="button"
                  onClick={() => setExchangeResolution('Instant 110% Store Credit')}
                  className={`w-full rounded-lg border p-3 text-left cursor-pointer ${exchangeResolution === 'Instant 110% Store Credit'
                    ? 'border-[#14532D] bg-[#14532D]/5 ring-1 ring-[#14532D]'
                    : 'border-[#E5E0D8]'
                    }`}
                >
                  <p className="text-sm font-semibold text-[#14532D]">
                    Instant 110% Store Credit (Recommended)
                  </p>
                  <p className="text-xs text-[#57534E] mt-0.5 tabular-nums">
                    Get {formatINR(Math.round(exchangeModalOrder.items[0].unitPrice * 1.1))} immediately (+10% bonus) to pick any other saree without waiting 7 days for bank refunds.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setExchangeResolution('Size/Drape Exchange')}
                  className={`w-full rounded-lg border p-3 text-left cursor-pointer ${exchangeResolution === 'Size/Drape Exchange'
                    ? 'border-[#14532D] bg-[#14532D]/5 ring-1 ring-[#14532D]'
                    : 'border-[#E5E0D8]'
                    }`}
                >
                  <p className="text-sm font-semibold text-[#1C1917]">Free Size / Drape Replacement</p>
                  <p className="text-xs text-[#57534E] mt-0.5">
                    Doorstep pickup tomorrow + express dispatch of replacement.
                  </p>
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-[#14532D] py-3 text-xs font-semibold text-white hover:bg-[#0F3F22] cursor-pointer"
              >
                Confirm {exchangeResolution}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
