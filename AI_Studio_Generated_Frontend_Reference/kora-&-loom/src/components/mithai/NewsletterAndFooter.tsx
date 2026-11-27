import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { CATEGORY_TILES, MithaiCategory } from '../../data/mithaiData';
import { useToast } from '../../context/ToastContext';

interface NewsletterAndFooterProps {
  onSelectCategory: (cat: MithaiCategory) => void;
}

export function NewsletterAndFooter({ onSelectCategory }: NewsletterAndFooterProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValid) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    setError(null);
    setSubscribed(true);
    showToast('Subscribed to fresh festive batch alerts!');
  };

  return (
    <>
      {/* 15. Newsletter Subscription */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="rounded-2xl border border-[#E6DDD0] bg-[#F4EDE2] p-6 sm:p-10">
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7C1D26]">
              Join the Fresh Batch Circle
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#231712]">
              Early access to seasonal Mango Barfi &amp; Diwali Gift Boxes
            </h2>
            <p className="text-sm text-[#635147]">
              Receive fresh kitchen dispatch dates and festive bundle offers—zero spam.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#7C1D26]/30 bg-white px-5 py-3 text-sm font-semibold text-[#7C1D26]">
                <CheckCircle2 className="h-4 w-4" />
                <span>You&apos;re on the list! Watch your inbox for our next small-batch drop.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate className="mx-auto flex max-w-md flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  className="min-h-[46px] flex-1 rounded-xl border border-[#E6DDD0] bg-white px-4 py-2.5 text-sm text-[#231712] focus:border-[#7C1D26] focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[46px] rounded-xl bg-[#7C1D26] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5E141B] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
            {error && <p className="text-xs font-medium text-[#7C1D26]">{error}</p>}
          </div>
        </div>
      </section>

      {/* 16. Complete Footer */}
      <footer className="border-t border-[#E6DDD0] bg-[#231712] text-[#FCF9F4] pb-16 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <p className="font-display text-2xl font-bold">Madhura Mithai</p>
              <p className="text-sm leading-relaxed text-[#FCF9F4]/75">
                Handcrafted pure-ghee South &amp; North Indian sweets, real-fruit barfis, and crisp savouries made fresh daily in small batches.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FDE68A]">
                Shop Delicacies
              </h3>
              <ul className="space-y-2 text-sm text-[#FCF9F4]/85">
                {CATEGORY_TILES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        const el = document.getElementById('bestsellers');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-white hover:underline cursor-pointer"
                    >
                      {cat.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FDE68A]">
                Customer Care
              </h3>
              <ul className="space-y-2 text-sm text-[#FCF9F4]/85">
                <li>
                  <a href="#bestsellers" className="hover:text-white hover:underline">
                    Bestsellers &amp; Pricing
                  </a>
                </li>
                <li>
                  <a href="#special-collections" className="hover:text-white hover:underline">
                    Wedding &amp; Corporate Gifting
                  </a>
                </li>
                <li>
                  <a href="#brand-story" className="hover:text-white hover:underline">
                    Shelf Life &amp; Packaging
                  </a>
                </li>
                <li>
                  <a href="#shop-by-category" className="hover:text-white hover:underline">
                    Pan-India Express Shipping
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FDE68A]">
                Kitchen &amp; Contact
              </h3>
              <ul className="space-y-2.5 text-sm text-[#FCF9F4]/85">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#FDE68A] mt-0.5 shrink-0" />
                  <span>42 West Masi Street, Madurai &amp; Alwarpet Kitchen, Chennai</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#FDE68A] shrink-0" />
                  <span className="tabular-nums">+91 98400 11223 (9 AM – 8 PM)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#FDE68A] shrink-0" />
                  <span>care@madhuramithai.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/15 pt-6 text-xs text-[#FCF9F4]/70 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Madhura Mithai Foods. 100% Pure Vegetarian Kitchen.</p>
            <p>Sample E-commerce Homepage Prototype · Fresh Batch Packaging</p>
          </div>
        </div>
      </footer>
    </>
  );
}
