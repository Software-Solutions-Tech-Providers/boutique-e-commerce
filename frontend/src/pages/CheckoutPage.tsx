import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Download,
  Lock,
  Plus,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address, Order, PaymentMethod } from '../types/store';
import {
  calculateUnitPrice,
  checkPincodeServiceability,
  formatINR,
} from '../utils/commerce';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    products,
    currentUser,
    cartSummary,
    appliedCouponCode,
    applyCoupon,
    addAddress,
    placeOrder,
    navigate,
  } = useStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentUser?.addresses[0]?.id || 'new'
  );
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay_upi');
  const [upiId, setUpiId] = useState('patron@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const selectedSavedAddress: Address | undefined = currentUser?.addresses.find(
    (a) => a.id === selectedAddressId
  );
  const activePincode =
    selectedSavedAddress && selectedAddressId !== 'new' ? selectedSavedAddress.pincode : pincode;
  const pinCheck = activePincode ? checkPincodeServiceability(activePincode) : null;

  const downloadInvoice = (ord: Order) => {
    const lines = [
      'VASTRA ATELIER TEXTILES PVT. LTD. — TAX INVOICE',
      `Invoice / Order No: ${ord.orderNumber}`,
      `Date: ${new Date(ord.createdAt).toLocaleString('en-IN')}`,
      `Customer: ${ord.customerName} (${ord.customerPhone})`,
      `Ship To: ${ord.shippingAddress.line1}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state} - ${ord.shippingAddress.pincode}`,
      `Payment Method: ${ord.paymentMethod.toUpperCase()} (${ord.paymentStatus.toUpperCase()})`,
      ord.razorpayPaymentId ? `Razorpay Ref: ${ord.razorpayPaymentId}` : '',
      '------------------------------------------------------------',
      ...ord.items.map(
        (it) =>
          `${it.name} [${it.selectedColor} · ${
            it.unitType === 'piece' ? it.selectedSize : `${it.measureQuantity} ${it.unitType}s`
          }] x${it.quantity}  =  ${formatINR(it.lineTotal)}`
      ),
      '------------------------------------------------------------',
      `Subtotal: ${formatINR(ord.subtotal)}`,
      `Discount: -${formatINR(ord.discountAmount)}`,
      `Textile GST (5%): ${formatINR(ord.taxAmount)}`,
      `Insured Shipping: ${ord.shippingCharge === 0 ? 'Complimentary' : formatINR(ord.shippingCharge)}`,
      `GRAND TOTAL: ${formatINR(ord.totalAmount)}`,
    ].filter(Boolean);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VastraAtelier-Invoice-${ord.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold">
                Order Confirmed
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mt-1">
                Thank you, {confirmedOrder.customerName}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Order <strong className="text-[var(--text-primary)]">{confirmedOrder.orderNumber}</strong> is
                confirmed. Automated WhatsApp &amp; Email receipts have been dispatched to{' '}
                {confirmedOrder.customerPhone}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg text-xs">
            <div>
              <p className="text-[var(--text-secondary)]">Order Reference</p>
              <p className="font-semibold text-[var(--text-primary)] mt-0.5 tabular-nums">
                {confirmedOrder.orderNumber}
              </p>
            </div>
            <div>
              <p className="text-[var(--text-secondary)]">Payment Status</p>
              <p className="font-semibold text-[var(--text-primary)] mt-0.5 uppercase">
                {confirmedOrder.paymentStatus} · {confirmedOrder.paymentMethod.replace('razorpay_', '')}
              </p>
            </div>
            <div>
              <p className="text-[var(--text-secondary)]">Total Paid</p>
              <p className="font-semibold text-[var(--text-primary)] mt-0.5 tabular-nums">
                {formatINR(confirmedOrder.totalAmount)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] font-sans">Ordered Pieces</h2>
            {confirmedOrder.items.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="flex items-center justify-between gap-4 py-2 border-b border-[var(--border-color)] text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded bg-[var(--bg-subtle)] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{item.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {item.selectedColor} ·{' '}
                      {item.unitType === 'piece'
                        ? item.selectedSize
                        : `${item.measureQuantity} ${item.unitType}s`}{' '}
                      × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[var(--text-primary)] tabular-nums shrink-0">
                  {formatINR(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => downloadInvoice(confirmedOrder)}
              className="px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg-surface)] text-xs font-medium rounded-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download GST Invoice
            </button>
            <button
              type="button"
              onClick={() =>
                navigate({
                  page: 'account',
                  tab: 'track',
                  orderNumber: confirmedOrder.orderNumber,
                })
              }
              className="px-5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-medium rounded-md cursor-pointer"
            >
              Track Shipment
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'catalog', category: 'all' })}
              className="px-5 py-2.5 border border-[var(--border-color)] text-xs font-medium rounded-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
          Your Atelier Bag is Empty
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Select handloom sarees or custom yardage before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={() => navigate({ page: 'catalog', category: 'all' })}
          className="mt-5 px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-sm font-medium rounded-md cursor-pointer"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  const resolveShippingDetails = () => {
    if (selectedSavedAddress && selectedAddressId !== 'new') {
      return {
        customerName: currentUser?.name || selectedSavedAddress.fullName,
        customerEmail: currentUser?.email || guestEmail || 'guest@vastraatelier.in',
        customerPhone: selectedSavedAddress.phone,
        shippingAddress: {
          label: selectedSavedAddress.label,
          fullName: selectedSavedAddress.fullName,
          phone: selectedSavedAddress.phone,
          line1: selectedSavedAddress.line1,
          line2: selectedSavedAddress.line2,
          city: selectedSavedAddress.city,
          state: selectedSavedAddress.state,
          pincode: selectedSavedAddress.pincode,
        },
      };
    }

    return {
      customerName: guestName.trim(),
      customerEmail: guestEmail.trim(),
      customerPhone: guestPhone.trim(),
      shippingAddress: {
        label: 'Delivery',
        fullName: guestName.trim(),
        phone: guestPhone.trim(),
        line1: line1.trim(),
        line2: line2.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
      },
    };
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (selectedAddressId === 'new') {
      const check = checkPincodeServiceability(pincode);
      if (!check.valid) {
        setPaymentError(check.message);
        return;
      }
      if (currentUser) {
        addAddress({
          label: 'Home / Studio',
          fullName: guestName.trim(),
          phone: guestPhone.trim(),
          line1: line1.trim(),
          line2: line2.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
          isDefault: currentUser.addresses.length === 0,
        });
      }
    }

    if (paymentMethod === 'cod') {
      if (pinCheck && !pinCheck.codAvailable) {
        setPaymentError('Cash on Delivery is unavailable for this PIN code. Choose Razorpay.');
        return;
      }
      const details = resolveShippingDetails();
      const ord = placeOrder({
        ...details,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
      });
      setConfirmedOrder(ord);
      return;
    }

    // Open tokenized Razorpay Checkout modal (never stores raw card credentials)
    setRazorpayModalOpen(true);
  };

  const executeRazorpayResult = (outcome: 'success' | 'fail') => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      if (outcome === 'fail') {
        setRazorpayModalOpen(false);
        setPaymentError(
          'Razorpay transaction declined by issuing bank. No amount was debited — please retry or choose another method.'
        );
        return;
      }
      const details = resolveShippingDetails();
      const ord = placeOrder({
        ...details,
        paymentMethod,
        paymentStatus: 'paid',
        razorpayPaymentId: `pay_Rzp${Math.floor(100000 + Math.random() * 899999)}VA`,
      });
      setRazorpayModalOpen(false);
      setConfirmedOrder(ord);
    }, 650);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            {currentUser ? 'Patron Checkout' : 'Guest Checkout'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
            Secure Checkout
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Lock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>256-bit TLS Encrypted · Razorpay PCI-DSS</span>
        </div>
      </div>

      {paymentError && (
        <div className="mt-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-sm text-rose-800 dark:text-rose-200 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{paymentError}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Delivery & Payment Method */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-5">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              1. Delivery Address &amp; Contact
            </h2>

            {currentUser && currentUser.addresses.length > 0 && (
              <div className="space-y-2.5">
                {currentUser.addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      selectedAddressId === addr.id
                        ? 'border-[var(--accent)] bg-[var(--bg-subtle)]'
                        : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div className="text-xs space-y-0.5 min-w-0">
                      <p className="font-semibold text-[var(--text-primary)]">
                        {addr.fullName} · {addr.label}
                      </p>
                      <p className="text-[var(--text-secondary)]">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} —{' '}
                        <span className="tabular-nums font-medium">{addr.pincode}</span>
                      </p>
                      <p className="text-[var(--text-secondary)] tabular-nums">{addr.phone}</p>
                    </div>
                  </label>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedAddressId('new')}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded border cursor-pointer ${
                    selectedAddressId === 'new'
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-subtle)]'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> Add a New Delivery Address
                </button>
              </div>
            )}

            {(selectedAddressId === 'new' || !currentUser || currentUser.addresses.length === 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Full Name"
                  className="px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-xs"
                />
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Mobile Number (+91 ...)"
                  className="px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-xs"
                />
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Email for GST Invoice & Tracking"
                  className="sm:col-span-2 px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-xs"
                />
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="House / Flat / Building & Street"
                  className="sm:col-span-2 px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-xs"
                />
                <input
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="Landmark (Optional)"
                  className="sm:col-span-2 px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-xs"
                />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-xs"
                />
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="State"
                  className="px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-xs"
                />
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-Digit PIN Code"
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-xs tabular-nums"
                  />
                  {pinCheck && (
                    <p
                      className={`text-xs mt-1.5 ${
                        pinCheck.valid ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {pinCheck.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                2. Payment Method (Razorpay)
              </h2>
              <span className="text-xs text-[var(--text-secondary)]">Zero Card Storage</span>
            </div>

            <div className="space-y-2.5 text-sm">
              {[
                {
                  id: 'razorpay_upi',
                  label: 'UPI (Google Pay, PhonePe, BHIM, Paytm)',
                  sub: 'Instant verification via Razorpay UPI intent',
                  icon: Smartphone,
                },
                {
                  id: 'razorpay_card',
                  label: 'Credit / Debit Card (Visa, Mastercard, RuPay)',
                  sub: 'Tokenized 3DS checkout hosted securely by Razorpay',
                  icon: CreditCard,
                },
                {
                  id: 'razorpay_netbanking',
                  label: 'Net Banking & Wallets',
                  sub: 'HDFC, ICICI, SBI, Axis & major wallets',
                  icon: Wallet,
                },
                {
                  id: 'cod',
                  label: 'Cash on Delivery (COD)',
                  sub:
                    pinCheck && !pinCheck.codAvailable
                      ? 'Unavailable for entered PIN code'
                      : 'Pay via Cash or UPI QR at doorstep',
                  icon: ShieldCheck,
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const disabled = opt.id === 'cod' && pinCheck !== null && !pinCheck.codAvailable;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer ${
                      disabled ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      paymentMethod === opt.id
                        ? 'border-[var(--accent)] bg-[var(--bg-subtle)]'
                        : 'border-[var(--border-color)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      disabled={disabled}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id as PaymentMethod)}
                      className="mt-1"
                    />
                    <Icon className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                    <div className="text-xs min-w-0">
                      <p className="font-semibold text-[var(--text-primary)]">{opt.label}</p>
                      <p className="text-[var(--text-secondary)] mt-0.5">{opt.sub}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {paymentMethod === 'razorpay_upi' && (
              <div className="p-3.5 bg-[var(--bg-subtle)] rounded-md border border-[var(--border-color)]">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Enter UPI ID for Instant Collect
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okaxis"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                />
              </div>
            )}

            {paymentMethod === 'razorpay_netbanking' && (
              <div className="p-3.5 bg-[var(--bg-subtle)] rounded-md border border-[var(--border-color)]">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Select Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded"
                >
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 space-y-5 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Order Summary</h2>

            <div className="divide-y divide-[var(--border-color)] max-h-72 overflow-y-auto pr-1">
              {cart.map((ci) => {
                const prod = products.find((p) => p.id === ci.productId);
                if (!prod) return null;
                const unitPrice = calculateUnitPrice(prod.price, ci.measureQuantity, ci.unitType);
                return (
                  <div key={ci.id} className="py-3 flex gap-3 text-xs">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-14 h-14 object-cover rounded bg-[var(--bg-subtle)] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--text-primary)] truncate">{prod.name}</p>
                      <p className="text-[var(--text-secondary)] mt-0.5">
                        {ci.selectedColor} · Qty {ci.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums shrink-0">
                      {formatINR(unitPrice * ci.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder={appliedCouponCode || 'Promo code (ATELIER10)'}
                className="min-w-0 flex-1 px-3 py-2 text-xs bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded uppercase"
              />
              <button
                type="button"
                onClick={() => {
                  const res = applyCoupon(couponInput);
                  setCouponError(res.ok ? '' : res.message);
                }}
                className="px-4 py-2 text-xs font-medium bg-[var(--text-primary)] text-[var(--bg-surface)] rounded cursor-pointer shrink-0"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-rose-600">{couponError}</p>}

            <div className="space-y-2 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] tabular-nums">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[var(--text-primary)] font-medium">{formatINR(cartSummary.subtotal)}</span>
              </div>
              {cartSummary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({cartSummary.coupon?.code})</span>
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
              <div className="flex justify-between pt-3 border-t border-[var(--border-color)] text-base font-semibold text-[var(--text-primary)]">
                <span>Total Payable</span>
                <span>{formatINR(cartSummary.totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-sm font-semibold rounded-md transition-colors cursor-pointer"
            >
              {paymentMethod === 'cod'
                ? `Place COD Order (${formatINR(cartSummary.totalAmount)})`
                : `Pay ${formatINR(cartSummary.totalAmount)} via Razorpay`}
            </button>
          </div>
        </aside>
      </form>

      {/* Tokenized Razorpay Hosted Checkout Simulation Modal */}
      {razorpayModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Razorpay Secure Checkout"
        >
          <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#1E2B4F] text-white p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-300">Razorpay Trusted Business</p>
                <p className="font-display text-xl font-semibold">Vastra Atelier Textiles</p>
              </div>
              <div className="text-right tabular-nums shrink-0">
                <p className="text-xs text-neutral-300">Payable</p>
                <p className="text-lg font-semibold">{formatINR(cartSummary.totalAmount)}</p>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <p className="text-xs text-[var(--text-secondary)]">
                Selected method:{' '}
                <strong className="text-[var(--text-primary)]">
                  {paymentMethod.replace('razorpay_', '').toUpperCase()}
                </strong>
                {paymentMethod === 'razorpay_upi' ? ` (${upiId})` : ''}
                {paymentMethod === 'razorpay_netbanking' ? ` (${selectedBank})` : ''}
              </p>

              <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-subtle)] p-3 rounded border border-[var(--border-color)]">
                Razorpay handles tokenization and 3DS authentication directly. Raw card numbers are
                never collected or stored by Vastra Atelier.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={() => executeRazorpayResult('success')}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md cursor-pointer"
                >
                  {paymentProcessing ? 'Verifying with Bank...' : 'Authorize & Complete Payment'}
                </button>
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={() => executeRazorpayResult('fail')}
                  className="w-full py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium rounded-md cursor-pointer"
                >
                  Simulate Bank Decline (Test Failure Handling)
                </button>
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={() => setRazorpayModalOpen(false)}
                  className="w-full py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel &amp; Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
