import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Headset,
  Instagram,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import {
  BOUTIQUE_CATEGORIES,
  BoutiqueCategory,
  BRAND_INFO,
  getBoutiqueCategoryPath,
} from '../../data/boutiqueData';
import { BoutiqueLogoMark } from './BoutiqueLogoMark';

interface BoutiqueNewsletterAndFooterProps {
  onSelectCategory?: (cat: 'All' | BoutiqueCategory) => void;
  onOpenAccount?: () => void;
}

function WhatsAppBadgeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a9.9 9.9 0 0 0-8.54 14.92L2.2 21.8l5-1.3A9.9 9.9 0 1 0 12 2Zm5.77 13.97c-.24.67-1.4 1.28-1.94 1.36-.5.07-1.13.1-1.82-.12-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.18-4.94-4.37-.14-.2-1.18-1.57-1.18-3s.75-2.12 1.02-2.41c.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.24.59.82 2 .9 2.14.07.15.12.32.02.52-.1.2-.15.32-.29.49-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.6 1.98 1.1.98 2.02 1.28 2.31 1.43.29.14.46.12.63-.07.17-.2.72-.84.91-1.13.2-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.12.07.7-.17 1.37Z" />
    </svg>
  );
}

function PaymentAcceptBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {/* Google Pay */}
      <div
        aria-label="Google Pay"
        title="Google Pay"
        className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-white/25"
      >
        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold tracking-tight text-[#3C4043]">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#5F6368] font-medium">Pay</span>
        </span>
      </div>

      {/* PhonePe */}
      <div
        aria-label="PhonePe"
        title="PhonePe"
        className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-white/25"
      >
        <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold tracking-tight text-[#5F259F]">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#5F259F] text-[8px] font-extrabold text-white">
            पे
          </span>
          <span>PhonePe</span>
        </span>
      </div>

      {/* VISA */}
      <div
        aria-label="VISA"
        title="VISA"
        className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-white/25"
      >
        <span className="font-sans text-xs sm:text-sm font-black italic tracking-tighter text-[#1A1F71]">
          VISA
        </span>
      </div>

      {/* Mastercard */}
      <div
        aria-label="Mastercard"
        title="Mastercard"
        className="flex h-12 w-12 sm:h-14 sm:w-14 flex-col items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-white/25"
      >
        <span className="flex items-center -space-x-1.5" aria-hidden="true">
          <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
          <span className="h-4 w-4 rounded-full bg-[#F79E1B]/90" />
        </span>
        <span className="mt-0.5 text-[7px] font-semibold tracking-tight text-[#231F20]">
          mastercard
        </span>
      </div>

      {/* PayPal */}
      <div
        aria-label="PayPal"
        title="PayPal"
        className="flex h-12 w-12 sm:h-14 sm:w-14 flex-col items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-white/25"
      >
        <span className="text-xs font-black italic leading-none text-[#003087]">P</span>
        <span className="mt-0.5 text-[8px] font-bold tracking-tight text-[#0079C1]">PayPal</span>
      </div>
    </div>
  );
}

export function BoutiqueNewsletterAndFooter({
  onSelectCategory,
  onOpenAccount,
}: BoutiqueNewsletterAndFooterProps) {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null);

  const handleSupportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = mobileNumber.replace(/\D/g, '');
    if (digits.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'info');
      return;
    }
    setSubmittedNumber(digits.slice(-10));
    setMobileNumber('');
    showToast('Thank you! Our shop team will contact you shortly.');
  };

  const scrollToSection = (id: string, fallbackRoute = '/') => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate(fallbackRoute);
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const handleCategoryClick = (cat: 'All' | BoutiqueCategory) => {
    if (onSelectCategory && pathname === '/') {
      onSelectCategory(cat);
      scrollToSection('bestsellers');
      return;
    }
    navigate(getBoutiqueCategoryPath(cat));
  };

  const handleBrandTopClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const phoneHref = BRAND_INFO.phone.replace(/\s+/g, '');
  const whatsappUrl = `https://wa.me/${phoneHref.replace(/^\+/, '')}`;

  return (
    <div className="space-y-4">
      {/* Customer Support Callback Request Section */}
      <section id="customer-support" aria-labelledby="support-heading" className="w-full px-2 sm:px-4 lg:px-6 pt-4">
        <div className="rounded-xl border border-[#E6DDD0] bg-[#F4EDE2] p-3.5 sm:p-5 lg:flex lg:items-center lg:justify-between lg:gap-6">
          <div className="max-w-xl space-y-1">
            <p className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#7C1D26]">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{t.supportBadge}</span>
            </p>
            <h2 id="support-heading" className="font-display text-base sm:text-xl font-semibold text-[#231712] leading-snug">
              {t.supportPrompt}
            </h2>
          </div>

          <div className="mt-3 w-full max-w-md lg:mt-0">
            {submittedNumber ? (
              <div className="flex items-center justify-between gap-2.5 rounded-xl border border-[#E6DDD0] bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-[#231712]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#7C1D26] shrink-0" />
                  <span>
                    {t.callbackConfirmed} <strong className="tabular-nums">{submittedNumber}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedNumber(null)}
                  className="shrink-0 text-xs font-semibold text-[#7C1D26] underline cursor-pointer"
                >
                  {t.edit}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupportRequest} className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="boutique-support-mobile" className="sr-only">
                  {t.mobilePlaceholder}
                </label>
                <input
                  id="boutique-support-mobile"
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={14}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={t.mobilePlaceholder}
                  className="min-h-[42px] flex-1 rounded-lg border border-[#E6DDD0] bg-white px-3.5 py-2 text-sm text-[#231712] tabular-nums focus:border-[#7C1D26] focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[42px] shrink-0 rounded-lg bg-[#7C1D26] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5E141B] transition-colors cursor-pointer"
                >
                  {t.requestCallback}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Complete Full-Width Footer with Centered "Kora + Logo + Loom" */}
      <footer className="w-full border-t border-[#E6DDD0] bg-[#231712] text-[#FCF9F4] pb-16 md:pb-0">
        <div className="w-full px-3 py-5 sm:px-5 lg:px-6 2xl:px-10">
          {/* Centered Brand Mark: Kora + Logo + Loom */}
          <div className="flex flex-col items-center justify-center border-b border-white/15 pb-4 text-center">
            <a
              href="#/"
              onClick={handleBrandTopClick}
              aria-label={`${BRAND_INFO.name} Top`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap group"
            >
              <span className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#FDE68A] transition-colors">
                {BRAND_INFO.firstWord}
              </span>
              <BoutiqueLogoMark className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg shrink-0" />
              <span className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#FDE68A] transition-colors">
                {BRAND_INFO.secondWord}
              </span>
            </a>
            <p className="mt-1 text-xs text-[#FDE68A]">{t.tagline}</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Complete Customer Care Contact Details with WhatsApp CTA + Call + Mail */}
            <div className="space-y-2.5 text-xs text-[#E6DDD0]/90">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FDE68A]">
                {t.customerCareTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1EBE5D] transition-colors"
                >
                  <WhatsAppBadgeIcon className="h-4 w-4 shrink-0" />
                  <span>{t.chatOnWhatsApp}</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white tabular-nums hover:text-[#FDE68A]"
                >
                  {BRAND_INFO.phone}
                </a>
              </div>

              <div className="space-y-1.5">
                <p className="flex items-center gap-2 tabular-nums">
                  <Phone className="h-3.5 w-3.5 text-[#FDE68A] shrink-0" />
                  <span>
                    <strong className="font-semibold text-white">{t.forCallLabel}:</strong>{' '}
                    <a
                      href={`tel:${phoneHref}`}
                      className="font-semibold text-white hover:text-[#FDE68A] hover:underline"
                    >
                      {BRAND_INFO.phone}
                    </a>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#FDE68A] shrink-0" />
                  <a
                    href={`mailto:${BRAND_INFO.email}`}
                    className="hover:text-[#FDE68A] hover:underline break-all"
                  >
                    {BRAND_INFO.email}
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#FDE68A] shrink-0 mt-0.5" />
                  <span>{t.careHoursNote}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Headset className="h-3.5 w-3.5 text-[#FDE68A] shrink-0 mt-0.5" />
                  <span>{t.careExchangeNote}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#FDE68A] shrink-0 mt-0.5" />
                  <span>{BRAND_INFO.fullAddress}</span>
                </p>
              </div>
            </div>

            {/* Shop Categories */}
            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FDE68A]">
                {t.shopSareesHeading}
              </h3>
              <ul className="mt-2 space-y-1.5 text-xs text-[#E6DDD0]/85">
                {BOUTIQUE_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className="hover:text-white hover:underline underline-offset-4 text-left cursor-pointer"
                    >
                      {t.categories[cat.id]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore Store + Help Guides */}
            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FDE68A]">
                {t.exploreStoreHeading}
              </h3>
              <ul className="mt-2 space-y-1.5 text-xs text-[#E6DDD0]/85">
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick('All')}
                    className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {t.bestSellers}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('new-arrivals', '/collections')}
                    className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {t.newArrivals}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('how-to-order', '/support')}
                    className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {t.howToOrderTitle}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => (onOpenAccount ? onOpenAccount() : navigate('/account'))}
                    className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {t.howToCreateAccount}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('instagram-favorites', '/')}
                    className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {t.igFavoritesTitle}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('reviews', '/')}
                    className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {t.happyCustomers}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('customer-support', '/support')}
                    className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {t.supportBadge}
                  </button>
                </li>
              </ul>
            </div>

            {/* Delivery & Follow Us on Social Media */}
            <div className="space-y-3">
              <div>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FDE68A]">
                  {t.shippingPaymentsHeading}
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs text-[#E6DDD0]/85 leading-relaxed">
                  <li>{t.freeDeliveryLine}</li>
                  <li>{t.exchangeLine}</li>
                  <li>{t.paymentMethodsLine}</li>
                  <li>{t.hoursLine}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FDE68A]">
                  {t.followUsSocial}
                </h3>
                <div className="mt-2 flex items-center gap-2.5">
                  <a
                    href={BRAND_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${BRAND_INFO.instagramHandle}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#FDE68A] hover:text-[#FDE68A] transition-colors"
                  >
                    <Instagram className="h-4 w-4 shrink-0" />
                    <span>{BRAND_INFO.instagramHandle}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Accepted Payment Methods Strip (G Pay, PhonePe, VISA, Mastercard, PayPal) */}
          <div className="mt-6 border-t border-white/15 pt-5 text-center space-y-3">
            <h3 className="font-sans text-sm font-bold tracking-wide text-[#FDE68A]">
              {t.weAcceptTitle}
            </h3>
            <PaymentAcceptBadges />
          </div>

          <div className="mt-5 border-t border-white/15 pt-3 text-center text-[11px] text-[#E6DDD0]/75">
            <p>© {new Date().getFullYear()} {BRAND_INFO.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
