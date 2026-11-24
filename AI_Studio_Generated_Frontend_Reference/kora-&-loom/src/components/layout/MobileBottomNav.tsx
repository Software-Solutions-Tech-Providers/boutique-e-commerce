import React, { useState } from 'react';
import { Gift, Home, MessageCircle, Search, Shirt, ShoppingBag, User, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';

interface MobileBottomNavProps {
  onOpenVirtualTryOn?: () => void;
}

export function MobileBottomNav({ onOpenVirtualTryOn }: MobileBottomNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cartCount, openCart } = useStore();
  const { user, storeCredit } = useAuth();
  const [rewardsOpen, setRewardsOpen] = useState(false);

  // WhatsApp click handler
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Kora & Loom Stylist! I am exploring your handloom boutique (${window.location.href}) and have a question about fabric drape & COD.`
    );
    window.open(`https://wa.me/918124536947?text=${text}`, '_blank');
  };

  return (
    <>
      {/* 1. Floating Hanger Pill on Right Edge matching Screenshots 1, 2, 3, 4, 6 */}
      {onOpenVirtualTryOn && (
        <button
          type="button"
          onClick={onOpenVirtualTryOn}
          aria-label="Virtual Drape & Lookbook Studio"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center rounded-l-xl bg-[#5B1B29] p-2.5 text-white shadow-xl hover:bg-[#45121E] transition-all cursor-pointer"
        >
          <Shirt className="h-5 w-5" />
          <span className="sr-only">Try it on</span>
        </button>
      )}

      {/* 2. Floating WhatsApp Round Green Button matching Screenshots 1, 2, 3, 4, 5 */}
      <button
        type="button"
        onClick={handleWhatsApp}
        aria-label="Chat with boutique stylist on WhatsApp"
        className="fixed bottom-16 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <MessageCircle className="h-7 w-7 fill-white" />
      </button>

      {/* 3. Floating "Rewards" Pill Button matching Screenshots 1, 2, 3, 4, 5 */}
      <button
        type="button"
        onClick={() => setRewardsOpen(true)}
        aria-label="View boutique rewards & store credits"
        className="fixed bottom-16 left-4 z-40 flex items-center gap-1.5 rounded-full bg-[#D6C5B2] px-3.5 py-1.5 text-xs font-bold text-[#1C1917] shadow-lg hover:bg-[#C4A482] transition-all cursor-pointer"
      >
        <Gift className="h-3.5 w-3.5 text-[#14532D]" />
        <span>Rewards</span>
      </button>

      {/* Rewards Popup Modal */}
      {rewardsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#14532D]" />
                <h3 className="font-display text-xl font-semibold text-[#1C1917]">Loom Loyalty Rewards</h3>
              </div>
              <button
                type="button"
                onClick={() => setRewardsOpen(false)}
                className="p-1 text-[#57534E] hover:text-[#1C1917]"
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
              className="w-full rounded-md bg-[#14532D] py-2 text-xs font-semibold text-white hover:bg-[#0F3F22]"
            >
              View Order History &amp; Credits
            </button>
          </div>
        </div>
      )}

      {/* 4. Fixed Mobile Bottom Navigation Bar (Home, Madras Sarees/Kora, Search, Account) matching Screenshots 1-7 */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-[#E5E0D8] bg-[#FAF9F6]/95 backdrop-blur-md px-2 md:hidden"
      >
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${pathname === '/' ? 'text-[#14532D] font-bold' : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/collections"
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${pathname.startsWith('/collections') ? 'text-[#14532D] font-bold' : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
        >
          <Shirt className="h-4 w-4" />
          <span>Kora &amp; Loom</span>
        </Link>

        <Link
          to="/collections?search=true"
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-[#57534E] hover:text-[#1C1917]"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Link>

        <Link
          to="/account"
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${pathname === '/account' ? 'text-[#14532D] font-bold' : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
        >
          <User className="h-4 w-4" />
          <span>Account</span>
        </Link>
      </nav>
    </>
  );
}
