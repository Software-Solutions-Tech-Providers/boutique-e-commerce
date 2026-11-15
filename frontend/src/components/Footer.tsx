import React, { useState } from 'react';
import {
  ArrowUp,
  Award,
  ChevronDown,
  Globe,
  Mail,
  MapPin,
  Moon,
  Phone,
  RotateCcw,
  Ruler,
  Sun,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LANGUAGE_OPTIONS, LanguageCode } from '../i18n/translations';
import { BrandLogo } from './BrandLogo';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const { navigate, categories, theme, setTheme, language, setLanguage, currentUser } =
    useStore();

  const [openMobileSection, setOpenMobileSection] = useState<'shop' | 'care' | null>(null);

  const toggleMobileSection = (key: 'shop' | 'care') => {
    setOpenMobileSection((prev) => (prev === key ? null : key));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#141416] text-neutral-300 no-print mt-20 border-t border-neutral-800">
      {/* Top Boutique Assurance Pillars */}
      <div className="border-b border-neutral-800/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[#E5C98B] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Silk Mark &amp; Handloom Certified
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Sourced directly from Varanasi, Kanchipuram &amp; Phulia master looms.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#E5C98B] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Insured Pan-India Dispatch
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Complimentary courier delivery on boutique orders above ₹4,999.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Ruler className="w-5 h-5 text-[#E5C98B] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Custom Metre &amp; Yard Cuts
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Continuous single-piece fabric cuts tailored to your measurements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-[#E5C98B] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                7-Day Atelier Return Policy
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Hassle-free exchanges and verified quality inspection on every piece.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editorial Footer Columns */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Brand & Direct Concierge */}
        <div className="sm:col-span-2 lg:col-span-4 space-y-4">
          <div className="text-white">
            <BrandLogo className="[&_span]:text-white" />
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            An artisanal Indian textile house dedicated to heirloom Banarasi katan silks,
            korvai Kanjivarams, breathable Jamdani cottons, and bespoke couture yardage.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <a
              href="mailto:concierge@vastraatelier.in"
              className="flex items-center gap-2.5 text-neutral-300 hover:text-white min-h-[36px]"
            >
              <Mail className="w-4 h-4 text-[#E5C98B] shrink-0" />
              <span>concierge@vastraatelier.in</span>
            </a>
            <a
              href="tel:+912249011122"
              className="flex items-center gap-2.5 text-neutral-300 hover:text-white tabular-nums min-h-[36px]"
            >
              <Phone className="w-4 h-4 text-[#E5C98B] shrink-0" />
              <span>+91 22 4901 1122 · Mon–Sat, 10:30–19:30 IST</span>
            </a>
            <p className="flex items-start gap-2.5 text-neutral-400 pt-0.5">
              <MapPin className="w-4 h-4 text-[#E5C98B] shrink-0 mt-0.5" />
              <span>14 Kala Ghoda Courtyard, Fort, Mumbai 400001</span>
            </p>
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/919820011223?text=Hello%20Vastra%20Atelier%2C%20I%20would%20like%20assistance%20with%20a%20textile%20selection."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#141416] bg-[#E5C98B] hover:bg-[#d8b873] px-4 py-2.5 rounded-md transition-colors min-h-[42px]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Collections Links (Accordion on Mobile, Open on Tablet/Desktop) */}
        <div className="lg:col-span-2 border-t border-neutral-800 sm:border-t-0 pt-4 sm:pt-0">
          <button
            type="button"
            onClick={() => toggleMobileSection('shop')}
            className="w-full sm:hidden flex items-center justify-between py-2 text-left text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
          >
            <span>Collections</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                openMobileSection === 'shop' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <h4 className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-white mb-4">
            Collections
          </h4>

          <ul
            className={`space-y-1.5 text-sm text-neutral-400 mt-2 sm:mt-0 ${
              openMobileSection === 'shop' ? 'block' : 'hidden sm:block'
            }`}
          >
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'catalog', category: cat.id })}
                  className="hover:text-white transition-colors cursor-pointer py-1 text-left w-full"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => navigate({ page: 'categories' })}
                className="text-[#E5C98B] hover:text-white transition-colors cursor-pointer py-1 text-left w-full font-medium"
              >
                All Categories ({categories.length})
              </button>
            </li>
          </ul>
        </div>

        {/* Client Care Links (Accordion on Mobile, Open on Tablet/Desktop) */}
        <div className="lg:col-span-3 border-t border-neutral-800 sm:border-t-0 pt-4 sm:pt-0">
          <button
            type="button"
            onClick={() => toggleMobileSection('care')}
            className="w-full sm:hidden flex items-center justify-between py-2 text-left text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
          >
            <span>Client Services</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                openMobileSection === 'care' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <h4 className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-white mb-4">
            Client Services
          </h4>

          <ul
            className={`space-y-1.5 text-sm text-neutral-400 mt-2 sm:mt-0 ${
              openMobileSection === 'care' ? 'block' : 'hidden sm:block'
            }`}
          >
            <li>
              <button
                type="button"
                onClick={() => navigate({ page: 'account', tab: 'track' })}
                className="hover:text-white transition-colors cursor-pointer py-1 text-left"
              >
                Track Your Shipment
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate({ page: 'account', tab: 'rewards' })}
                className="hover:text-white transition-colors cursor-pointer py-1 text-left"
              >
                Loyalty Rewards &amp; Referrals
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate({ page: 'reviews' })}
                className="hover:text-white transition-colors cursor-pointer py-1 text-left"
              >
                Patron Reviews &amp; Photos
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate({ page: 'info', section: 'about' })}
                className="hover:text-white transition-colors cursor-pointer py-1 text-left"
              >
                About Us &amp; Weaving Clusters
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate({ page: 'info', section: 'contact' })}
                className="hover:text-white transition-colors cursor-pointer py-1 text-left"
              >
                Contact Atelier Concierge
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate({ page: 'info', section: 'faq' })}
                className="hover:text-white transition-colors cursor-pointer py-1 text-left"
              >
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate({ page: 'info', section: 'returns' })}
                className="hover:text-white transition-colors cursor-pointer py-1 text-left"
              >
                Return &amp; Refund Policy
              </button>
            </li>
            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff') && (
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'admin' })}
                  className="text-[#E5C98B] hover:text-white transition-colors cursor-pointer py-1 text-left"
                >
                  Atelier Admin Console
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Storefront Theme, Language & Payments */}
        <div className="sm:col-span-2 lg:col-span-3 border-t border-neutral-800 sm:border-t-0 pt-5 sm:pt-0 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
            Atelier Preferences
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 text-xs">
            <div className="flex items-center justify-between gap-2 bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 min-h-[42px]">
              <span className="text-neutral-300">Theme</span>
              <div
                role="group"
                aria-label="Footer theme selector"
                className="inline-flex items-center gap-1 bg-neutral-950 p-0.5 rounded border border-neutral-800"
              >
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    theme === 'light'
                      ? 'bg-[#E5C98B] text-[#141416]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#E5C98B] text-[#141416]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3 h-3" /> Dark
                </button>
              </div>
            </div>

            <label className="flex items-center justify-between gap-2 bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2.5 min-h-[42px]">
              <span className="inline-flex items-center gap-2 text-neutral-300">
                <Globe className="w-3.5 h-3.5 text-[#E5C98B]" /> Language
              </span>
              <select
                aria-label="Footer language selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code} className="text-black">
                    {opt.nativeLabel}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="pt-1 space-y-1.5 text-xs text-neutral-400">
            <p className="text-neutral-300 font-medium">Accepted Payment Methods</p>
            <p>Razorpay Secure · UPI · Visa / Mastercard / RuPay · Net Banking · COD</p>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Back-to-Top Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5">
            <span>© 2026 Vastra Atelier Textiles Pvt. Ltd. · All rights reserved.</span>
            <button
              type="button"
              onClick={() => navigate({ page: 'info', section: 'privacy' })}
              className="hover:text-white cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'info', section: 'terms' })}
              className="hover:text-white cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
