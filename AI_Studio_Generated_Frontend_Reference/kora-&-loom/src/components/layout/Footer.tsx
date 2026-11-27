import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [shopOpen, setShopOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);

  // New arrivals ticker slide
  const [arrivalSlide, setArrivalSlide] = useState(0);
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const arrivalItems = [
    { title: 'Every Day New Arrivals', subtitle: 'Fresh weaver batches from Kanchipuram & Banaras added daily' },
    { title: 'Pure Silk Mark Verified', subtitle: '100% authentic mulberry & Katan silk with testing certification' },
    { title: '7-Day Doorstep Exchange', subtitle: 'Hassle-free size and drape swaps with free pan-India pickup' },
  ];

  // Auto-advance highlight banner to the right; pauses on hover/focus and stops on manual control
  useEffect(() => {
    if (!autoAdvance || isPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setSlideDir('next');
      setArrivalSlide((prev) => (prev + 1) % arrivalItems.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [autoAdvance, isPaused, arrivalItems.length]);

  const handleNextArrival = () => {
    setAutoAdvance(false);
    setSlideDir('next');
    setArrivalSlide((prev) => (prev + 1) % arrivalItems.length);
  };

  const handlePrevArrival = () => {
    setAutoAdvance(false);
    setSlideDir('prev');
    setArrivalSlide((prev) => (prev === 0 ? arrivalItems.length - 1 : prev - 1));
  };

  const handleBannerTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleBannerTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 35) return;
    if (delta < 0) handleNextArrival();
    else handlePrevArrival();
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    showToast('Subscribed! You’ll receive our weekly handloom curation drops.');
    setEmail('');
  };

  return (
    <footer className="border-t border-[#E5E0D8] bg-[#FAF9F6] text-[#1C1917]">
      {/* 1. Value Proposition Banner Carousel */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={handleBannerTouchStart}
          onTouchEnd={handleBannerTouchEnd}
          className="flex items-center justify-between rounded-xl border border-[#E5E0D8] bg-[#F2EFE9] p-4 sm:p-5 touch-pan-y"
        >
          <button
            type="button"
            onClick={handlePrevArrival}
            aria-label="Previous highlight"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#57534E] hover:bg-white/70 hover:text-[#1C1917] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex-1 overflow-hidden px-2">
            <div
              key={arrivalSlide}
              data-dir={slideDir}
              className="kl-banner-slide flex items-center justify-center gap-3 text-center"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-xs text-[#14532D]">
                <Tag className="h-5 w-5" />
              </span>
              <div className="text-left min-w-0">
                <p className="font-display text-base sm:text-lg font-semibold text-[#1C1917] truncate">
                  {arrivalItems[arrivalSlide].title}
                </p>
                <p className="text-xs text-[#57534E] hidden sm:block truncate">
                  {arrivalItems[arrivalSlide].subtitle}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-1.5" aria-label="Highlight slides">
              {arrivalItems.map((item, idx) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    setAutoAdvance(false);
                    setSlideDir(idx >= arrivalSlide ? 'next' : 'prev');
                    setArrivalSlide(idx);
                  }}
                  aria-label={`Show ${item.title}`}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === arrivalSlide ? 'w-4 bg-[#14532D]' : 'w-1.5 bg-[#1C1917]/20 hover:bg-[#1C1917]/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextArrival}
            aria-label="Next highlight"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#57534E] hover:bg-white/70 hover:text-[#1C1917] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
        {/* 2. Newsletter Subscription matching Screenshot 1 */}
        <div className="space-y-3 text-left">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1C1917]">
            Sign Up For Exclusive Offers
          </h3>
          <p className="text-xs leading-relaxed text-[#57534E]">
            We send you new release &amp; offer information to your mail. Strictly, no for spams.
          </p>

          <form onSubmit={handleNewsletter} className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email Address"
              className="flex-1 rounded-full border border-[#E5E0D8] bg-[#F2EFE9] px-5 py-3 text-xs text-[#1C1917] placeholder:text-[#57534E]/70 focus:border-[#14532D] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-[#C4A482] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B28F6B] transition-colors cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>

        {/* 3. Circular Social Icons matching Screenshot 1 */}
        <div className="flex items-center gap-3 pt-2">
          {[
            { label: 'Facebook', symbol: 'f' },
            { label: 'Instagram', symbol: 'IG' },
            { label: 'Pinterest', symbol: 'P' },
            { label: 'YouTube', symbol: 'YT' },
            { label: 'Twitter', symbol: 'X' },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D6C5B2] text-xs font-bold text-[#1C1917] hover:bg-[#C4A482] transition-colors"
            >
              {s.symbol}
            </button>
          ))}
        </div>

        {/* 4. App Download Store Badges matching Screenshot 1 */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white">
            <span className="text-lg">▶</span>
            <div className="text-left text-[10px] leading-tight">
              <p className="text-white/70">GET IT ON</p>
              <p className="font-semibold text-xs text-white">Google Play</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white">
            <span className="text-lg"></span>
            <div className="text-left text-[10px] leading-tight">
              <p className="text-white/70">Download on the</p>
              <p className="font-semibold text-xs text-white">App Store</p>
            </div>
          </div>
        </div>

        {/* 5. Mobile Accordion Navigation matching Screenshot 1 */}
        <div className="divide-y divide-[#E5E0D8] border-y border-[#E5E0D8]">
          {/* Shop */}
          <div>
            <button
              type="button"
              onClick={() => setShopOpen((prev) => !prev)}
              className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917]"
            >
              <span>Shop</span>
              {shopOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
            {shopOpen && (
              <div className="space-y-2 pb-4 text-xs text-[#57534E]">
                <p><Link to="/collections/silk-sarees" className="hover:text-[#1C1917]">Heirloom Silk Sarees</Link></p>
                <p><Link to="/collections/cotton-linen" className="hover:text-[#1C1917]">Summer Cottons &amp; Linens</Link></p>
                <p><Link to="/collections/blouses-jewellery" className="hover:text-[#1C1917]">Ready-Made Blouses &amp; Jhumkas</Link></p>
                <p><Link to="/collections/under-1500" className="hover:text-[#1C1917]">Everyday Under ₹1,500</Link></p>
                <p><Link to="/campaign/diwali" className="hover:text-[#1C1917]">The Diwali Loom Edit</Link></p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <button
              type="button"
              onClick={() => setQuickLinksOpen((prev) => !prev)}
              className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917]"
            >
              <span>Quick Links</span>
              {quickLinksOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
            {quickLinksOpen && (
              <div className="space-y-2 pb-4 text-xs text-[#57534E]">
                <p><Link to="/account" className="hover:text-[#1C1917]">Track Your Order</Link></p>
                <p><Link to="/quiz" className="hover:text-[#1C1917]">30-Second Saree Finder</Link></p>
                <p><Link to="/offers" className="hover:text-[#1C1917]">Buy More – Save More Offers</Link></p>
                <p><Link to="/wishlist" className="hover:text-[#1C1917]">Your Saved Wishlist</Link></p>
              </div>
            )}
          </div>

          {/* Store Policies */}
          <div>
            <button
              type="button"
              onClick={() => setPoliciesOpen((prev) => !prev)}
              className="flex w-full items-center justify-between py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#1C1917]"
            >
              <span>Store Policies</span>
              {policiesOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
            {policiesOpen && (
              <div className="space-y-2 pb-4 text-xs text-[#57534E]">
                <p><Link to="/support" className="hover:text-[#1C1917]">7-Day Easy Returns &amp; Exchanges</Link></p>
                <p><Link to="/support" className="hover:text-[#1C1917]">Free Shipping &amp; COD Policies</Link></p>
                <p><Link to="/support" className="hover:text-[#1C1917]">Silk Mark Authenticity Guarantee</Link></p>
                <p><Link to="/support" className="hover:text-[#1C1917]">Privacy Policy &amp; Terms</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* 6. Copyright & Credits matching Screenshot 1 */}
        <div className="space-y-4 pt-2 text-center text-xs text-[#57534E]">
          <p>© {new Date().getFullYear()}, Kora &amp; Loom. All Rights Reserved.</p>

          {/* Payment Badges Row matching Screenshot 1 */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="rounded bg-[#1A1F71] px-2.5 py-1 text-[11px] font-bold text-white tracking-wider">VISA</span>
            <span className="rounded bg-[#EB001B] px-2.5 py-1 text-[11px] font-bold text-white tracking-wider">Mastercard</span>
            <span className="rounded bg-[#00A1E0] px-2.5 py-1 text-[11px] font-bold text-white tracking-wider">Maestro</span>
            <span className="rounded bg-black px-2.5 py-1 text-[11px] font-bold text-white tracking-wider"> Pay</span>
            <span className="rounded bg-white border border-[#E5E0D8] px-2.5 py-1 text-[11px] font-bold text-[#1C1917] tracking-wider">G Pay</span>
            <span className="rounded bg-[#14532D] px-2.5 py-1 text-[11px] font-bold text-white tracking-wider">UPI / COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
