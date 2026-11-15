import React, { useState } from 'react';
import { Check, ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { InfoSectionSlug } from '../types/store';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

const FAQ_ITEMS = [
  {
    q: 'Are Vastra Atelier silk sarees Silk Mark certified?',
    a: 'Yes. Every pure mulberry silk saree woven in Varanasi, Kanchipuram, and Chanderi ships with an official Silk Mark India authentication tag and unbleached cotton storage bag.',
  },
  {
    q: 'How are fabrics sold by the metre or yard cut?',
    a: 'All yardage orders are cut as a single continuous uninterrupted piece from the bolt. You can switch between metres and yards directly on the product page in 0.5-unit increments.',
  },
  {
    q: 'What are the delivery timelines and Cash on Delivery (COD) rules?',
    a: 'Metro PIN codes deliver within 2–3 business days with complimentary insured courier shipping on orders above ₹4,999. COD is available across serviceable domestic PIN codes.',
  },
  {
    q: 'How do returns and exchanges work for boutique textiles?',
    a: 'Unworn, unwashed sarees and dress materials with intact loom tags are eligible for a 7-day return or exchange directly from your Order History portal.',
  },
  {
    q: 'Can I book a bridal trousseau video consultation?',
    a: 'Yes — tap WhatsApp or use our Contact form below to schedule a live drape inspection from our Kala Ghoda, Mumbai flagship studio.',
  },
];

export const InfoPage: React.FC = () => {
  const { view, navigate, notify } = useStore();
  const section: InfoSectionSlug = view.page === 'info' ? view.section : 'about';

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const navTabs: { id: InfoSectionSlug; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'faq', label: 'FAQs' },
    { id: 'returns', label: 'Returns & Refunds' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setContactSent(true);
    notify('Your message has been received by our Mumbai atelier desk.', 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-8">
      <div className="pb-4 border-b border-[var(--border-color)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Vastra Atelier House
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-1">
            {navTabs.find((t) => t.id === section)?.label || 'About Us'}
          </h1>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-lg overflow-x-auto max-w-full text-xs">
          {navTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate({ page: 'info', section: t.id })}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                section === t.id
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {section === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 sm:p-8 space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
              Direct-from-Loom Artisanal Indian Textiles
            </h2>
            <p>
              Founded in Kala Ghoda, Mumbai, Vastra Atelier partners directly with over 65
              master weaving families across Varanasi, Kanchipuram, Phulia, Chanderi, and
              Pochampally. Every piece passes a 14-point warp density, zari purity, and
              colourfastness check before entering our boutique archive.
            </p>
            <p>
              Whether you are commissioning a bridal Banarasi heirloom, draping an airy Dhakai
              Jamdani for warm afternoons, or ordering custom continuous yardage by the metre for
              bespoke tailoring, our craft promise prioritizes provenance, fair artisan wages, and
              enduring wearability.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: '65+ Master Looms', body: 'Direct fair-trade partnerships in 5 Indian clusters.' },
              { title: '100% Silk Mark', body: 'Authenticated mulberry, korvai, and katan silks.' },
              { title: 'Custom Yardage', body: 'Precision continuous metre and yard cuts.' },
              { title: 'Insured Pan-India', body: 'Complimentary courier shipping above ₹4,999.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 space-y-1.5"
              >
                <h3 className="text-sm font-semibold text-[var(--text-primary)] font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 space-y-5 text-xs">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Mumbai Flagship &amp; Stylist Desk
            </h2>
            <div className="space-y-3 text-[var(--text-secondary)]">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>14 Kala Ghoda Courtyard, Fort, Mumbai 400001, Maharashtra</span>
              </p>
              <p className="flex items-center gap-2.5 tabular-nums">
                <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>+91 22 4901 1122 · Mon–Sat, 10:30–19:30 IST</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>concierge@vastraatelier.in</span>
              </p>
            </div>
            <a
              href="https://wa.me/919820011223?text=Hello%20Vastra%20Atelier%2C%20I%20would%20like%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold"
            >
              <WhatsAppIcon className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>

          <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
              Send a Textile or Bridal Enquiry
            </h2>
            {contactSent ? (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Thank you. Our textile stylist will respond within 4 business hours.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full Name"
                    className="px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
                  />
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email Address"
                    className="px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Share product SKU, custom yardage needs, or appointment date..."
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-semibold rounded-md cursor-pointer"
                >
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {section === 'faq' && (
        <div className="max-w-3xl divide-y divide-[var(--border-color)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q} className="p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left text-sm font-semibold text-[var(--text-primary)] cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--text-secondary)] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {section === 'returns' && (
        <div className="max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            7-Day Atelier Return &amp; Exchange Policy
          </h2>
          <p>
            Ready-to-wear sarees, kurtis, and unstitched dress material sets are eligible for an
            exchange or full refund within 7 days of delivery, provided the textile is unworn,
            unwashed, and retains its original Vastra Atelier &amp; Silk Mark tags.
          </p>
          <p>
            Custom-cut fabric yardage measured specifically to your order (by the metre or yard)
            is eligible for replacement in the rare event of a weaving flaw or transit damage.
          </p>
          <p>
            Prepaid refunds settle to the original Razorpay payment source within 3–5 business days
            after quality inspection.
          </p>
        </div>
      )}

      {section === 'privacy' && (
        <div className="max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Privacy &amp; Data Protection Policy
          </h2>
          <p>
            Vastra Atelier collects only the contact, shipping address, and preference data
            required to fulfil textile orders, issue GST invoices, and share updates you explicitly
            opt into.
          </p>
          <p>
            All online payments use tokenized checkout — card numbers and UPI PINs are never stored
            on storefront systems.
          </p>
        </div>
      )}

      {section === 'terms' && (
        <div className="max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 sm:p-8 space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            Terms &amp; Conditions
          </h2>
          <p>
            Handwoven textiles carry subtle slubs, reed marks, and organic dye variations that are
            hallmarks of authentic handloom craftsmanship rather than defects.
          </p>
          <p>
            All prices displayed are inclusive of applicable boutique handloom packaging. Standard
            5% Indian Textile GST applies at checkout.
          </p>
        </div>
      )}
    </div>
  );
};
