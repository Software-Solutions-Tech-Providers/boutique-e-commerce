import { useEffect, useState } from 'react';
import { Gift, Home, MessageCircle, Search, Shirt, User, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';

interface MobileBottomNavProps {
  onOpenVirtualTryOn?: () => void;
}

export function MobileBottomNav({ onOpenVirtualTryOn }: MobileBottomNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { storeCredit } = useAuth();
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const isProductPage = pathname.startsWith('/product/');

  useEffect(() => {
    if (!rewardsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRewardsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [rewardsOpen]);

  // WhatsApp click handler
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Kora & Loom Stylist! I am exploring your handloom boutique (${window.location.href}) and have a question about fabric drape & COD.`
    );
    window.open(`https://wa.me/918124536947?text=${text}`, '_blank');
  };

  return (
    <>
      {/* 1. Floating Hanger Pill on Right Edge (hidden on PDPs where Try-On lives directly on the page) */}
      {!isProductPage && onOpenVirtualTryOn && (
        <button
          type="button"
          onClick={onOpenVirtualTryOn}
          aria-label="Virtual Drape & Lookbook Studio"
          className="fixed right-0 top-[42%] -translate-y-1/2 z-30 flex items-center justify-center rounded-l-xl bg-[#5B1B29] p-2 sm:p-2.5 text-white shadow-xl hover:bg-[#45121E] active:scale-95 transition-all cursor-pointer"
        >
          <Shirt className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Try it on</span>
        </button>
      )}

      {/* 2. Floating WhatsApp Round Green Button */}
      <button
        type="button"
        onClick={handleWhatsApp}
        aria-label="Chat with boutique stylist on WhatsApp"
        className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom)+var(--pdp-sticky-offset,0px))] md:bottom-6 right-3 sm:right-4 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-105 active:scale-95 transition-[bottom,transform] duration-200 cursor-pointer"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 fill-white" />
      </button>

      {/* 3. Floating "Rewards" Pill Button (hidden on mobile PDPs to prevent chrome overload) */}
      {!isProductPage && (
        <button
          type="button"
          onClick={() => setRewardsOpen(true)}
          aria-label="View boutique rewards & store credits"
          className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom)+var(--pdp-sticky-offset,0px))] md:bottom-6 left-3 sm:left-4 z-40 flex items-center gap-1.5 rounded-full bg-[#D6C5B2] px-3 sm:px-3.5 py-2 text-xs font-bold text-[#1C1917] shadow-lg hover:bg-[#C4A482] active:scale-95 transition-[bottom,background-color,transform] duration-200 cursor-pointer"
        >
          <Gift className="h-3.5 w-3.5 text-[#14532D]" />
          <span>Rewards</span>
        </button>
      )}

      {/* Rewards Popup Modal */}
      {rewardsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
          onClick={() => setRewardsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Loom Loyalty Rewards"
        >
          <div
            className="w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Gift className="h-5 w-5 text-[#14532D] shrink-0" />
                <h3 className="font-display text-xl font-semibold text-[#1C1917] truncate">Loom Loyalty Rewards</h3>
              </div>
              <button
                type="button"
                onClick={() => setRewardsOpen(false)}
                aria-label="Close rewards modal"
                className="p-1.5 text-[#57534E] hover:text-[#1C1917] touch-manipulation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#57534E]">
              <div className="rounded-lg bg-[#FAF9F6] p-3 border border-[#E5E0D8] space-y-1">
                <span className="font-semibold text-[#1C1917]">Your Available Store Credit</span>
                <p className="text-xl font-bold text-[#14532D] tabular-nums">{formatINR(storeCredit)}</p>
                <p className="text-[11px]">Applied automatically on your next saree or blouse order.</p>
              </div>
              <div className="space-y-1 pt-1">
                <p className="font-semibold text-[#1C1917]">Earn with Every Purchase:</p>
                <p>• 10% back in instant store credits on verified reviews.</p>
                <p>• Free express upgrade on orders over ₹2,500.</p>
                <p>• 110% credit value on size and drape exchanges.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setRewardsOpen(false);
                navigate('/account');
              }}
              className="w-full rounded-md bg-[#14532D] py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] touch-manipulation"
            >
              View Order History &amp; Credits
            </button>
          </div>
        </div>
      )}

      {/* 4. Fixed Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex min-h-14 items-center justify-around border-t border-[#E5E0D8] bg-[#FAF9F6]/95 backdrop-blur-md px-2 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <Link
          to="/"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors touch-manipulation ${pathname === '/' ? 'text-[#14532D] font-bold' : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/collections"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors touch-manipulation ${pathname.startsWith('/collections') ? 'text-[#14532D] font-bold' : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
        >
          <Shirt className="h-4 w-4" />
          <span>Kora &amp; Loom</span>
        </Link>

        <Link
          to="/collections?search=true"
          className="flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#57534E] hover:text-[#1C1917] touch-manipulation"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Link>

        <Link
          to="/account"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors touch-manipulation ${pathname === '/account' ? 'text-[#14532D] font-bold' : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
        >
          <User className="h-4 w-4" />
          <span>Account</span>
        </Link>
      </nav>
    </>
  );
}
