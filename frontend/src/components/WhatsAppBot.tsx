import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Globe, Send, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LANGUAGE_OPTIONS, LanguageCode } from '../i18n/translations';
import { Product } from '../types/store';
import { checkPincodeServiceability, formatINR } from '../utils/commerce';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  recommendedProducts?: Product[];
}

export const WhatsAppBot: React.FC = () => {
  const { language, setLanguage, t, orders, products, navigate } = useStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'bot-welcome',
      sender: 'bot',
      text: t.bot.greeting,
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Sync greeting when language changes if conversation is still at initial state
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'bot-welcome') {
        return [{ id: 'bot-welcome', sender: 'bot', text: t.bot.greeting }];
      }
      return prev;
    });
  }, [language, t.bot.greeting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const buildBotResponse = (query: string): Omit<ChatMessage, 'id' | 'sender'> => {
    const clean = query.trim();
    const lower = clean.toLowerCase();

    // 1. Order tracking match (e.g. VA-2026-1042)
    const orderMatch = clean.match(/VA-\d{4}-\d{3,5}/i);
    if (orderMatch) {
      const ord = orders.find(
        (o) => o.orderNumber.toLowerCase() === orderMatch[0].toLowerCase()
      );
      if (ord) {
        const latest = ord.timeline[ord.timeline.length - 1];
        return {
          text: `${ord.orderNumber}: ${ord.orderStatus} (${formatINR(ord.totalAmount)} · ${
            ord.paymentStatus.toUpperCase()
          }). ${latest?.note || ''}`,
        };
      }
      return {
        text: `Order ${orderMatch[0].toUpperCase()} was not found. Try VA-2026-1042 or check your Account Orders tab.`,
      };
    }

    // 2. 6-digit Indian PIN code check
    const pinMatch = clean.match(/\b[1-9][0-9]{5}\b/);
    if (pinMatch) {
      const est = checkPincodeServiceability(pinMatch[0]);
      return {
        text: `PIN ${pinMatch[0]}: ${est.message}`,
      };
    }

    // 3. Track order intent without order number
    if (
      lower.includes('track') ||
      lower.includes('order') ||
      lower.includes('ऑर्डर') ||
      lower.includes('ஆர்டர்') ||
      lower.includes('ఆర్డర్') ||
      lower.includes('ಆರ್ಡರ್') ||
      lower.includes('commande')
    ) {
      return {
        text: `${t.bot.trackPrompt} (Latest: ${orders[0]?.orderNumber || 'VA-2026-1042'} — ${
          orders[0]?.orderStatus || 'In Transit'
        })`,
      };
    }

    // 4. Care guide intent
    if (
      lower.includes('care') ||
      lower.includes('wash') ||
      lower.includes('clean') ||
      lower.includes('देखभाल') ||
      lower.includes('பராமரிப்பு') ||
      lower.includes('సంరక్షణ') ||
      lower.includes('ಆರೈಕೆ') ||
      lower.includes('soin')
    ) {
      return { text: t.bot.careReply };
    }

    // 5. Product / Saree / Fabric recommendation intent
    const productKeywords = [
      'saree',
      'silk',
      'cotton',
      'linen',
      'bridal',
      'kurti',
      'dress',
      'blouse',
      'banarasi',
      'kanjivaram',
      'recommend',
      'साड़ी',
      'புடவை',
      'చీర',
      'ಸೀರೆ',
      'sari',
    ];
    if (productKeywords.some((k) => lower.includes(k))) {
      const matched = products.filter((p) => {
        const hay = `${p.name} ${p.fabricType} ${p.occasion} ${p.subcategory}`.toLowerCase();
        return clean
          .toLowerCase()
          .split(/\s+/)
          .some((token) => token.length > 2 && hay.includes(token));
      });
      const picks = (matched.length > 0 ? matched : products.filter((p) => p.isBestSeller)).slice(
        0,
        2
      );
      return {
        text:
          matched.length > 0
            ? `Here are curated Vastra Atelier weaves matching "${clean}":`
            : 'Here are two signature boutique best-sellers from our loom archive:',
        recommendedProducts: picks,
      };
    }

    // 6. PIN prompt intent
    if (
      lower.includes('pin') ||
      lower.includes('delivery') ||
      lower.includes('पिन') ||
      lower.includes('பின்கோட்') ||
      lower.includes('పిన్') ||
      lower.includes('ಪಿನ್')
    ) {
      return {
        text: 'Please send any 6-digit Indian PIN code (e.g. 400001, 560001, 600001) to check delivery speed and COD availability.',
      };
    }

    return { text: t.bot.fallbackReply };
  };

  const sendMessage = (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: clean,
    };

    const reply = buildBotResponse(clean);
    const botMsg: ChatMessage = {
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      ...reply,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const lastUserText =
    [...messages].reverse().find((m) => m.sender === 'user')?.text || t.bot.greeting;
  const whatsappHandoffUrl = `https://wa.me/919820011223?text=${encodeURIComponent(
    `[Language: ${language.toUpperCase()}] Hello Vastra Atelier WhatsApp: ${lastUserText}`
  )}`;

  return (
    <div
      className={`fixed right-4 z-40 no-print ${
        open ? 'bottom-4' : 'bottom-[72px] md:bottom-4'
      }`}
    >
      {open ? (
        <div
          className="w-[340px] sm:w-[370px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          role="dialog"
          aria-label={t.bot.title}
        >
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{t.bot.title}</p>
                <p className="text-[11px] text-emerald-100 truncate">{t.bot.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center gap-1 bg-white/15 rounded px-1.5 py-1">
                <Globe className="w-3 h-3 text-emerald-100" />
                <select
                  aria-label="Chat language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="bg-transparent text-[11px] font-medium text-white focus:outline-none cursor-pointer"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code} className="text-black">
                      {opt.nativeLabel}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close WhatsApp assistant"
                className="p-1 text-emerald-100 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="h-64 sm:h-80 overflow-y-auto p-3.5 space-y-3 bg-[var(--bg-subtle)] text-xs"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-xl leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#075E54] text-white rounded-br-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="mt-2 space-y-1.5 w-[88%]">
                    {msg.recommendedProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          navigate({ page: 'product', slug: p.slug });
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-left cursor-pointer"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[var(--text-primary)] truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[var(--text-secondary)] tabular-nums">
                            {formatINR(p.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 bg-[var(--bg-surface)] border-t border-[var(--border-color)] flex gap-1.5 overflow-x-auto">
            {[
              { label: t.bot.quickTrack, prompt: 'Track VA-2026-1042' },
              { label: t.bot.quickRecommend, prompt: 'Recommend silk saree' },
              { label: t.bot.quickPincode, prompt: 'Check PIN 400001' },
              { label: t.bot.quickCare, prompt: 'Silk care' },
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => sendMessage(q.prompt)}
                className="px-2.5 py-1 text-[11px] font-medium bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md whitespace-nowrap shrink-0 hover:border-[var(--accent)] cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input + WhatsApp Handoff */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-2.5 bg-[var(--bg-surface)] border-t border-[var(--border-color)] space-y-2"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.bot.placeholder}
                className="min-w-0 flex-1 px-3 py-2 text-xs bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[#075E54]"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="px-3 py-2 bg-[#075E54] hover:bg-[#064e46] text-white rounded-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <a
              href={whatsappHandoffUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 text-[11px] font-medium text-[#075E54] dark:text-emerald-400 hover:underline flex items-center justify-center gap-1"
            >
              {t.bot.openWhatsApp} <ExternalLink className="w-3 h-3" />
            </a>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="WhatsApp"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <span>WhatsApp</span>
        </button>
      )}
    </div>
  );
};
