import React, { useState } from 'react';
import { CheckCircle2, CreditCard, MessageCircle, RotateCcw, Truck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function SupportPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('Sizing & Drape Guidance');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    showToast('Our styling & care desk will reply within 2 hours.');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-12">
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
          Policies &amp; Styling Support
        </p>
        <h1 className="font-display text-4xl font-semibold text-[#1C1917]">
          Returns, Shipping &amp; Customer Care
        </h1>
        <p className="text-sm text-[#57534E]">
          Everything you need to know before placing your order—explained in plain language.
        </p>
      </div>

      {/* Policy Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-2">
          <Truck className="h-5 w-5 text-[#14532D]" />
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">Delivery &amp; Free Shipping</h2>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Orders dispatch within 24 hours and arrive in 2–4 business days across India. Orders ₹2,500+ ship free; below ₹2,500 carries a flat ₹120 insured delivery fee shown upfront.
          </p>
        </article>

        <article className="rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-2">
          <RotateCcw className="h-5 w-5 text-[#14532D]" />
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">7-Day Easy Exchanges &amp; Refunds</h2>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Unworn sarees and blouses with tags intact qualify for free doorstep pickup within 7 days. Choose an instant 110% store credit swap or a 5-day bank/UPI refund.
          </p>
        </article>

        <article className="rounded-xl border border-[#E5E0D8] bg-white p-6 space-y-2">
          <CreditCard className="h-5 w-5 text-[#14532D]" />
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">UPI, Cards &amp; COD</h2>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Pay seamlessly via Google Pay, PhonePe, UPI ID, Credit/Debit Cards, or Cash on Delivery with zero hidden COD surcharge.
          </p>
        </article>
      </div>

      {/* Contact & Boutique Stylist Desk */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5 space-y-4 rounded-xl border border-[#E5E0D8] bg-white p-6">
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">Store FAQ Highlights</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-[#1C1917]">Can I order without creating an account?</p>
              <p className="text-[#57534E] mt-0.5">
                Yes, Guest Checkout is enabled by default for every order.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#1C1917]">How do I match a video saree SKU?</p>
              <p className="text-[#57534E] mt-0.5">
                Click Search in the top bar and enter the SKU code shown in our reel (e.g., KL-KNC-101 or KL-MHS-089).
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#1C1917]">What if my blouse size is sold out?</p>
              <p className="text-[#57534E] mt-0.5">
                Tap Notify Me on the sold-out size button—we message you on WhatsApp as soon as the next tailor batch finishes.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-xl border border-[#E5E0D8] bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-[#14532D]" />
            <h2 className="font-display text-2xl font-semibold text-[#1C1917]">Message Our Boutique Desk</h2>
          </div>

          {submitted ? (
            <div className="rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] p-6 space-y-2">
              <p className="flex items-center gap-2 font-semibold text-[#14532D]">
                <CheckCircle2 className="h-5 w-5" />
                <span>Request Received</span>
              </p>
              <p className="text-sm text-[#57534E]">
                Thank you, {name}. Our Chennai studio stylist desk will respond shortly on {contact || 'your contact details'}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm focus:border-[#14532D] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="WhatsApp Number or Email"
                  className="rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm focus:border-[#14532D] focus:outline-none"
                />
              </div>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm focus:border-[#14532D] focus:outline-none"
              >
                <option>Sizing &amp; Drape Guidance</option>
                <option>Order Status / Exchange</option>
                <option>Bulk Wedding / Festive Gifting</option>
                <option>Blouse Matching Request</option>
              </select>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your saree SKU code or question..."
                className="w-full rounded-md border border-[#E5E0D8] px-3 py-2.5 text-sm focus:border-[#14532D] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-[#14532D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0F3F22] cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
