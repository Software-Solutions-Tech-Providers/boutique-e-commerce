import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Gift,
  LogOut,
  MapPin,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { useStore } from '../context/StoreContext';
import { Order } from '../types/store';
import { formatINR } from '../utils/commerce';

const TRACK_STAGES = ['Confirmed', 'Weaving & QC', 'Dispatched', 'In Transit', 'Delivered'];

export const AccountPage: React.FC = () => {
  const {
    view,
    currentUser,
    orders,
    products,
    recentlyViewed,
    coupons,
    loyaltyPoints,
    referralSharesCount,
    redeemLoyaltyVoucher,
    recordReferralShare,
    reorderOrder,
    setAuthOpen,
    logout,
    switchDemoRole,
    updateProfile,
    addAddress,
    removeAddress,
    updateOrderStatus,
    requestOrderReturn,
    applyCoupon,
    navigate,
    notify,
  } = useStore();

  const initialTab = view.page === 'account' && view.tab ? view.tab : 'orders';
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'track' | 'rewards'>(
    initialTab
  );
  const [referralCopied, setReferralCopied] = useState(false);
  const [trackQuery, setTrackQuery] = useState(
    (view.page === 'account' && view.orderNumber) || orders[0]?.orderNumber || ''
  );

  // Profile form
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');
  const [waOptIn, setWaOptIn] = useState(currentUser?.marketingOptIn.whatsapp ?? true);
  const [emailOptIn, setEmailOptIn] = useState(currentUser?.marketingOptIn.email ?? true);
  const [birthdayMonth, setBirthdayMonth] = useState(currentUser?.celebrationDates?.birthdayMonth || '');
  const [anniversaryMonth, setAnniversaryMonth] = useState(currentUser?.celebrationDates?.anniversaryMonth || '');
  const [celebrationConsent, setCelebrationConsent] = useState(
    currentUser?.celebrationDates?.consent ?? false
  );

  // Address form
  const [addrOpen, setAddrOpen] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');

  // Return modal inline
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Shade variation / Sizing exchange');

  React.useEffect(() => {
    if (view.page === 'account' && view.tab) setActiveTab(view.tab);
    if (view.page === 'account' && view.orderNumber) setTrackQuery(view.orderNumber);
  }, [view]);

  const userOrders = currentUser
    ? currentUser.role === 'customer'
      ? orders.filter(
          (o) =>
            o.userId === currentUser.id ||
            o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
        )
      : orders
    : [];

  const trackedOrder = orders.find(
    (o) => o.orderNumber.toLowerCase() === trackQuery.trim().toLowerCase()
  );

  const downloadInvoice = (ord: Order) => {
    const content = [
      `VASTRA ATELIER — TAX INVOICE (${ord.orderNumber})`,
      `Customer: ${ord.customerName} | ${ord.customerPhone}`,
      `Address: ${ord.shippingAddress.line1}, ${ord.shippingAddress.city} - ${ord.shippingAddress.pincode}`,
      `Total: ${formatINR(ord.totalAmount)} (GST Included: ${formatINR(ord.taxAmount)})`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${ord.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">Patron Portal</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
            {currentUser ? currentUser.name : 'Order Tracking & Account'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser ? (
            <>
              <span className="text-xs text-[var(--text-secondary)] mr-2">
                Role: <strong className="uppercase text-[var(--text-primary)]">{currentUser.role}</strong>
              </span>
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2 text-xs font-medium border border-[var(--border-color)] rounded-md inline-flex items-center gap-1.5 hover:border-[var(--text-primary)] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-semibold rounded-md cursor-pointer"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] overflow-x-auto max-w-full">
        {[
          { id: 'track', label: 'Track Order', icon: Search },
          { id: 'orders', label: 'Order History', icon: Package },
          { id: 'rewards', label: 'Rewards & Referrals', icon: Award },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'profile', label: 'Profile & Consent', icon: UserIcon },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-4 py-2.5 text-xs font-medium inline-flex items-center gap-1.5 border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === t.id
                  ? 'border-[var(--accent)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Track Order */}
      {activeTab === 'track' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-8 space-y-6 max-w-4xl">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Track Your Atelier Shipment
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Enter your order reference (e.g. VA-2026-1042) to inspect live weaving, quality
              control, and courier milestones.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="VA-2026-1042"
              className="min-w-0 flex-1 px-3.5 py-2.5 text-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md uppercase tabular-nums"
            />
          </div>

          {trackedOrder ? (
            <div className="space-y-6 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-color)] text-xs">
                <div>
                  <span className="text-[var(--text-secondary)]">Order: </span>
                  <strong className="text-[var(--text-primary)] tabular-nums">
                    {trackedOrder.orderNumber}
                  </strong>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Current Stage: </span>
                  <strong className="text-[var(--accent)]">{trackedOrder.orderStatus}</strong>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Payment: </span>
                  <strong className="uppercase text-[var(--text-primary)]">{trackedOrder.paymentStatus}</strong>
                </div>
              </div>

              {/* Milestone Stepper — stacked cleanly on mobile, 5-column bar on tablet/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2">
                {TRACK_STAGES.map((stage, idx) => {
                  const activeIdx = TRACK_STAGES.indexOf(trackedOrder.orderStatus);
                  const reached = activeIdx >= idx;
                  return (
                    <div
                      key={stage}
                      className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5"
                    >
                      <div
                        className={`w-6 sm:w-full h-1.5 rounded-full shrink-0 ${
                          reached ? 'bg-[var(--accent)]' : 'bg-[var(--border-color)]'
                        }`}
                      />
                      <p
                        className={`text-xs sm:text-[11px] font-medium ${
                          reached ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-70'
                        }`}
                      >
                        {stage}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Timeline Log */}
              <div className="space-y-3 pt-2">
                {trackedOrder.timeline.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {ev.status} ·{' '}
                        <span className="font-normal text-[var(--text-secondary)]">
                          {new Date(ev.timestamp).toLocaleString('en-IN')}
                        </span>
                      </p>
                      <p className="text-[var(--text-secondary)] mt-0.5">{ev.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              No order found matching &ldquo;{trackQuery}&rdquo;. Try <strong>VA-2026-1042</strong>.
            </p>
          )}
        </div>
      )}

      {/* Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {!currentUser ? (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-8 text-center">
              <p className="text-sm text-[var(--text-secondary)]">Sign in to view your order history.</p>
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="mt-3 px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-medium rounded-md cursor-pointer"
              >
                Sign In
              </button>
            </div>
          ) : userOrders.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">You have not placed any orders yet.</p>
          ) : (
            userOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)] text-xs">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                    </span>
                    <span className="font-medium text-[var(--accent)]">{ord.orderStatus}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => reorderOrder(ord.id)}
                      className="px-3 py-1.5 min-h-[36px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-medium rounded inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Reorder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTrackQuery(ord.orderNumber);
                        setActiveTab('track');
                      }}
                      className="px-3 py-1.5 min-h-[36px] border border-[var(--border-color)] rounded hover:border-[var(--text-primary)] cursor-pointer"
                    >
                      Track
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadInvoice(ord)}
                      className="px-3 py-1.5 min-h-[36px] border border-[var(--border-color)] rounded hover:border-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Invoice
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Just received my handloom weaves from Vastra Atelier (${ord.items[0]?.name || 'Boutique Silk'})! Explore their archive.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 min-h-[36px] border border-[var(--border-color)] rounded hover:border-[#25D366] inline-flex items-center gap-1 text-[var(--text-primary)]"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" /> Share
                    </a>
                    {['Confirmed', 'Weaving & QC'].includes(ord.orderStatus) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(ord.id, 'Cancelled', 'Cancelled by patron prior to dispatch.')
                        }
                        className="px-3 py-1.5 min-h-[36px] border border-rose-300 text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    {ord.orderStatus === 'Delivered' && (
                      <button
                        type="button"
                        onClick={() => setReturnOrderId(ord.id)}
                        className="px-3 py-1.5 min-h-[36px] border border-[var(--border-color)] text-[var(--text-secondary)] rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Return
                      </button>
                    )}
                  </div>
                </div>

                {returnOrderId === ord.id && (
                  <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded flex flex-col sm:flex-row gap-2 text-xs">
                    <input
                      type="text"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="min-w-0 flex-1 px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        requestOrderReturn(ord.id, returnReason);
                        setReturnOrderId(null);
                      }}
                      className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-surface)] rounded cursor-pointer shrink-0"
                    >
                      Submit Return Request
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    {ord.items.map((it, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-11 h-11 object-cover rounded bg-[var(--bg-subtle)] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">{it.name}</p>
                          <p className="text-[var(--text-secondary)]">
                            {it.selectedColor} · Qty {it.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sm:text-right tabular-nums">
                    <p className="text-xs text-[var(--text-secondary)]">Total Paid</p>
                    <p className="text-base font-semibold text-[var(--text-primary)]">
                      {formatINR(ord.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Personalized Retention Shelf (Order-Aware Recommendations + Recently Viewed) */}
          {(() => {
            const orderedIds = new Set(userOrders.flatMap((o) => o.items.map((i) => i.productId)));
            const preferredOccasions = new Set(
              products.filter((p) => orderedIds.has(p.id)).map((p) => p.occasion)
            );
            const tailoredPicks = products
              .filter(
                (p) =>
                  !orderedIds.has(p.id) &&
                  (preferredOccasions.size > 0
                    ? preferredOccasions.has(p.occasion)
                    : p.isBestSeller || p.isNewArrival)
              )
              .slice(0, 3);

            const recentList = recentlyViewed
              .map((id) => products.find((p) => p.id === id))
              .filter((p): p is NonNullable<typeof p> => Boolean(p))
              .slice(0, 3);

            const displayPicks = tailoredPicks.length > 0 ? tailoredPicks : recentList;
            if (displayPicks.length === 0) return null;

            return (
              <div className="pt-8 border-t border-[var(--border-color)] space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Curated For Your Wardrobe
                      </p>
                      <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                        {preferredOccasions.size > 0
                          ? 'Recommended From Your Past Purchases'
                          : 'Recently Viewed Weaves'}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate({ page: 'catalog', category: 'all' })}
                      className="text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
                    >
                      Explore More
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                    {displayPicks.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>

                {tailoredPicks.length > 0 && recentList.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                      Recently Viewed Weaves
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                      {recentList.map((p) => (
                        <ProductCard key={`rv-${p.id}`} product={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Loyalty Rewards & Referral Advocacy */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--accent-gold)] font-semibold">
                  Atelier Loyalty Circle
                </p>
                <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] mt-1 tabular-nums">
                  {loyaltyPoints.toLocaleString('en-IN')} Points
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Tier: <strong className="text-[var(--text-primary)]">{loyaltyPoints >= 1000 ? 'Gold Zari Patron' : 'Silver Loom Patron'}</strong> · Earn 1 pt per ₹100 spent &amp; +150 pts per review
                </p>
              </div>
              <Award className="w-8 h-8 text-[var(--accent-gold)] shrink-0" />
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Redeem ₹500 Instant Voucher</p>
                <p className="text-[var(--text-secondary)] mt-0.5">
                  Exchange 500 points for code <strong>LOYALTY500</strong> (applied directly to your bag).
                </p>
              </div>
              <button
                type="button"
                disabled={loyaltyPoints < 500}
                onClick={redeemLoyaltyVoucher}
                className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white dark:text-[#141416] font-semibold rounded-md cursor-pointer whitespace-nowrap shrink-0"
              >
                Redeem 500 Pts
              </button>
            </div>

            {currentUser?.celebrationDates?.consent &&
            (currentUser.celebrationDates.birthdayMonth ||
              currentUser.celebrationDates.anniversaryMonth) ? (
              <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-xs space-y-1">
                <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                  Celebration Month Offer Active (Consented)
                </p>
                <p className="text-emerald-700 dark:text-emerald-300">
                  Registered months:{' '}
                  {[
                    currentUser.celebrationDates.birthdayMonth &&
                      `Birthday (${currentUser.celebrationDates.birthdayMonth})`,
                    currentUser.celebrationDates.anniversaryMonth &&
                      `Anniversary (${currentUser.celebrationDates.anniversaryMonth})`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}{' '}
                  — You will receive a private atelier privilege voucher during your celebration month.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg border border-[var(--border-color)] text-xs flex items-center justify-between gap-3">
                <p className="text-[var(--text-secondary)]">
                  Want a birthday or anniversary textile voucher? Opt in under Profile settings.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="text-[var(--accent)] font-semibold hover:underline shrink-0 cursor-pointer"
                >
                  Set Dates →
                </button>
              </div>
            )}

            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Exclusive Member Offers
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {coupons
                  .filter((c) => c.active)
                  .slice(0, 4)
                  .map((c) => (
                    <div
                      key={c.code}
                      className="p-3 rounded-lg border border-[var(--border-color)] flex flex-col justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold text-[var(--accent)]">{c.code}</p>
                        <p className="text-[var(--text-secondary)] mt-0.5">{c.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const res = applyCoupon(c.code);
                          notify(res.ok ? `${c.code} applied to bag` : res.message, res.ok ? 'success' : 'error');
                        }}
                        className="text-left text-[11px] font-semibold text-[var(--text-primary)] hover:underline cursor-pointer"
                      >
                        Apply to Bag →
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                  Patron Advocacy &amp; Gifting
                </p>
                <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] mt-1">
                  Refer a Friend, Earn Together
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Gift ₹500 off on your friend&apos;s first silk or handloom weave and earn +100 Patron Points every time you share.
                </p>
              </div>
              <Gift className="w-8 h-8 text-[var(--accent)] shrink-0" />
            </div>

            {(() => {
              const code = `VASTRA-${(currentUser?.name.split(' ')[0] || 'PATRON').toUpperCase()}15`;
              const refMsg = `Use my Vastra Atelier referral code ${code} for complimentary craftsmanship privileges on authentic handloom sarees & fabrics!`;
              return (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-[var(--text-secondary)]">Your Referral Code</p>
                      <p className="text-base font-semibold tracking-wider text-[var(--text-primary)] tabular-nums">
                        {code}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard?.writeText) {
                          navigator.clipboard.writeText(refMsg).catch(() => {});
                        }
                        setReferralCopied(true);
                        notify('Referral invite copied!', 'success');
                        setTimeout(() => setReferralCopied(false), 2500);
                      }}
                      className="px-3.5 py-2 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-md font-medium inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {referralCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {referralCopied ? 'Copied' : 'Copy Invite'}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(refMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={recordReferralShare}
                      className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-md inline-flex items-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      Invite via WhatsApp (+100 Pts)
                    </a>
                    <span className="text-[var(--text-secondary)] tabular-nums">
                      Invites shared: <strong className="text-[var(--text-primary)]">{referralSharesCount}</strong>
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Saved Addresses */}
      {activeTab === 'addresses' && currentUser && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Saved Delivery Addresses
            </h2>
            <button
              type="button"
              onClick={() => setAddrOpen((v) => !v)}
              className="px-3.5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-medium rounded-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Address
            </button>
          </div>

          {addrOpen && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAddress({
                  label: addrLabel,
                  fullName: currentUser.name,
                  phone: currentUser.phone,
                  line1: addrLine1,
                  city: addrCity,
                  state: addrState,
                  pincode: addrPin,
                  isDefault: currentUser.addresses.length === 0,
                });
                setAddrOpen(false);
                setAddrLine1('');
              }}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
            >
              <input
                type="text"
                required
                value={addrLabel}
                onChange={(e) => setAddrLabel(e.target.value)}
                placeholder="Label (Home / Studio)"
                className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />
              <input
                type="text"
                required
                maxLength={6}
                value={addrPin}
                onChange={(e) => setAddrPin(e.target.value.replace(/\D/g, ''))}
                placeholder="6-Digit PIN Code"
                className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />
              <input
                type="text"
                required
                value={addrLine1}
                onChange={(e) => setAddrLine1(e.target.value)}
                placeholder="Street & Building"
                className="sm:col-span-2 px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />
              <input
                type="text"
                required
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
                placeholder="City"
                className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />
              <input
                type="text"
                required
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
                placeholder="State"
                className="px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />
              <button
                type="submit"
                className="sm:col-span-2 py-2.5 bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium rounded cursor-pointer"
              >
                Save Address
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentUser.addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-[var(--text-primary)]">{addr.label}</p>
                  <p className="text-[var(--text-secondary)]">{addr.line1}</p>
                  <p className="text-[var(--text-secondary)]">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAddress(addr.id)}
                  aria-label="Remove address"
                  className="text-[var(--text-secondary)] hover:text-rose-600 self-start cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile & Role / Consent */}
      {activeTab === 'profile' && currentUser && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 max-w-2xl space-y-5 text-xs">
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Profile &amp; Communication Consent
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-[var(--text-secondary)] mb-1">Mobile Number</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={waOptIn}
                onChange={(e) => setWaOptIn(e.target.checked)}
              />
              <span>WhatsApp Business notifications (order status, restock alerts, previews)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={emailOptIn}
                onChange={(e) => setEmailOptIn(e.target.checked)}
              />
              <span>Email Loom Dispatch &amp; GST Invoices</span>
            </label>
          </div>

          <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
            <p className="font-semibold text-[var(--text-primary)]">
              Birthday &amp; Anniversary Privilege Offers (Optional, With Consent)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Birthday Month</label>
                <select
                  value={birthdayMonth}
                  onChange={(e) => setBirthdayMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                >
                  <option value="">Prefer not to share</option>
                  {[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Anniversary Month</label>
                <select
                  value={anniversaryMonth}
                  onChange={(e) => setAnniversaryMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                >
                  <option value="">Prefer not to share</option>
                  {[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-start gap-2 cursor-pointer text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={celebrationConsent}
                onChange={(e) => setCelebrationConsent(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Yes, I consent to Vastra Atelier sending me private celebration-month offers during my selected month(s).
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={() =>
              updateProfile({
                name: nameInput,
                phone: phoneInput,
                marketingOptIn: {
                  whatsapp: waOptIn,
                  email: emailOptIn,
                  sms: currentUser.marketingOptIn.sms,
                },
                celebrationDates: {
                  birthdayMonth: birthdayMonth || undefined,
                  anniversaryMonth: anniversaryMonth || undefined,
                  consent: celebrationConsent,
                },
              })
            }
            className="px-5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-semibold rounded cursor-pointer"
          >
            Save Preferences
          </button>

          <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
            <p className="font-semibold text-[var(--text-primary)]">Switch Evaluation Role</p>
            <div className="flex flex-wrap gap-2">
              {(['customer', 'staff', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchDemoRole(r)}
                  className={`px-3.5 py-2 rounded border capitalize cursor-pointer ${
                    currentUser.role === r
                      ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
