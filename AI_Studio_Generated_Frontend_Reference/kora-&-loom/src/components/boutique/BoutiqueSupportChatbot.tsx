import React, { useEffect, useRef, useState } from 'react';
import { Globe, Instagram, Send, Sparkles, X } from 'lucide-react';
import { SupportedLanguage, useLanguage } from '../../context/LanguageContext';
import { BRAND_INFO } from '../../data/boutiqueData';
import { LanguageSelector } from './LanguageSelector';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isError?: boolean;
}

function WhatsAppSupportIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a9.9 9.9 0 0 0-8.54 14.92L2.2 21.8l5-1.3A9.9 9.9 0 1 0 12 2Zm5.77 13.97c-.24.67-1.4 1.28-1.94 1.36-.5.07-1.13.1-1.82-.12-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.18-4.94-4.37-.14-.2-1.18-1.57-1.18-3s.75-2.12 1.02-2.41c.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.24.59.82 2 .9 2.14.07.15.12.32.02.52-.1.2-.15.32-.29.49-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.6 1.98 1.1.98 2.02 1.28 2.31 1.43.29.14.46.12.63-.07.17-.2.72-.84.91-1.13.2-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.12.07.7-.17 1.37Z" />
    </svg>
  );
}

export function BoutiqueSupportChatbot() {
  const { chatLanguage, setChatLanguage, chatT } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'greeting', role: 'assistant', text: chatT.chatbotGreeting },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const prevLangRef = useRef<SupportedLanguage>(chatLanguage);

  // Keep ONLY chatbot greeting/responses synchronized when chatbot language changes
  useEffect(() => {
    if (prevLangRef.current !== chatLanguage) {
      prevLangRef.current = chatLanguage;
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === 'greeting') {
          return [{ id: 'greeting', role: 'assistant', text: chatT.chatbotGreeting }];
        }
        return [
          ...prev,
          { id: `lang-${Date.now()}`, role: 'assistant', text: chatT.chatbotGreeting },
        ];
      });
    }
  }, [chatLanguage, chatT.chatbotGreeting]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          language: chatLanguage,
          history: nextMessages
            .filter((m) => !m.isError)
            .slice(-8)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not reach AI support assistant.');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
        },
      ]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unable to connect to AI support.';
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: errMsg,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Compact Floating Action Dock: Separate Instagram Icon + WhatsApp-Style "Help" Support Icon */}
      {!open && (
        <div className="fixed bottom-14 right-2.5 z-40 flex flex-col items-end gap-2 md:bottom-5 md:right-5">
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${BRAND_INFO.name} Instagram`}
            title={`Instagram ${BRAND_INFO.instagramHandle}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-lg transition-transform hover:scale-105"
          >
            <Instagram className="h-5 w-5" />
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Help"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#1EBE5D] active:scale-[0.98] cursor-pointer"
          >
            <WhatsAppSupportIcon className="h-4 w-4 shrink-0" />
            <span>{chatT.helpLabel}</span>
          </button>
        </div>
      )}

      {/* Multilingual AI Support Chatbot Panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={chatT.chatbotTitle}
          className="fixed bottom-14 right-2 left-2 z-50 flex max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-[#E6DDD0] bg-[#FCF9F4] shadow-2xl sm:left-auto sm:right-5 sm:w-[370px] md:bottom-5"
        >
          {/* Header + Independent Chatbot Language Selector */}
          <div className="border-b border-[#E6DDD0] bg-[#075E54] px-3.5 py-3 text-white space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="h-4 w-4 text-[#FDE68A] shrink-0" />
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold">{chatT.chatbotTitle}</p>
                  <p className="truncate text-[10px] text-white/85">{chatT.chatbotSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close AI assistant"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chatbot-Only Language Selector */}
            <div className="flex items-center gap-1.5 rounded-lg bg-black/20 px-2.5 py-1">
              <Globe className="h-3.5 w-3.5 text-[#FDE68A] shrink-0" />
              <span className="text-[11px] font-medium text-white/90 shrink-0">
                {chatT.languageLabel}:
              </span>
              <LanguageSelector
                value={chatLanguage}
                onChange={setChatLanguage}
                label={chatT.languageLabel}
                variant="chatbot"
              />
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[210px] max-h-[42vh]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#DCF8C6] text-[#231712] border border-[#C5E8A8]'
                      : msg.isError
                        ? 'border border-red-300 bg-red-50 text-red-800'
                        : 'border border-[#E6DDD0] bg-white text-[#231712]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl border border-[#E6DDD0] bg-white px-3 py-2 text-xs text-[#635147]">
                  {chatT.chatbotTyping}
                </div>
              </div>
            )}
          </div>

          {/* Quick Question Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-[#E6DDD0] bg-[#F4EDE2]/60 px-3 py-2">
            {chatT.quickPrompts.map((qp) => (
              <button
                key={qp}
                type="button"
                disabled={loading}
                onClick={() => sendMessage(qp)}
                className="shrink-0 rounded-full border border-[#E6DDD0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#231712] hover:border-[#075E54] hover:text-[#075E54] cursor-pointer disabled:opacity-50"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5 border-t border-[#E6DDD0] bg-white p-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chatT.chatbotPlaceholder}
              aria-label={chatT.chatbotPlaceholder}
              className="h-9 min-w-0 flex-1 rounded-full border border-[#E6DDD0] bg-[#FCF9F4] px-3.5 text-xs text-[#231712] focus:border-[#075E54] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#1EBE5D] disabled:opacity-45 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
