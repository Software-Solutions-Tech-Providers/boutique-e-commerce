import React, { useState } from 'react';
import { CheckCircle2, Heart, ShoppingBag, Smartphone, X } from 'lucide-react';
import { useMithaiCart } from '../../context/MithaiCartContext';
import { useToast } from '../../context/ToastContext';
import { MITHAI_PRODUCTS } from '../../data/mithaiData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

interface UtilityModalsProps {
  wishlistOpen: boolean;
  onCloseWishlist: () => void;
  accountOpen: boolean;
  onCloseAccount: () => void;
}

export function UtilityModals({
  wishlistOpen,
  onCloseWishlist,
  accountOpen,
  onCloseAccount,
}: UtilityModalsProps) {
  const { wishlistIds, toggleWishlist, addToCart, openCart } = useMithaiCart();
  const { showToast } = useToast();

  const [mobile, setMobile] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp' | 'signedIn'>('phone');
  const [otp, setOtp] = useState('');

  const savedItems = MITHAI_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.replace(/\D/g, '').length < 10) {
      showToast('Enter a valid 10-digit mobile number.', 'info');
      return;
    }
    setOtpStep('otp');
    showToast('Demo OTP sent (enter any 4 digits).');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length < 4) return;
    setOtpStep('signedIn');
    showToast('Signed in via Express Mobile OTP!');
  };

  return (
    <>
      {/* Wishlist Sheet / Modal */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 sm:p-4">
          <div className="fixed inset-0" onClick={onCloseWishlist} />
          <div className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[#FCF9F4] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6DDD0] pb-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#7C1D26] fill-[#7C1D26]" />
                <h3 className="font-display text-2xl font-semibold text-[#231712]">
                  Saved Sweets ({savedItems.length})
                </h3>
              </div>
              <button type="button" onClick={onCloseWishlist} aria-label="Close wishlist" className="p-1.5 text-[#635147]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {savedItems.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#635147]">
                Tap the heart icon on any delicacy to save it for later.
              </p>
            ) : (
              <ul className="space-y-3">
                {savedItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#E6DDD0] bg-white p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#231712]">{item.name}</p>
                        <p className="text-xs text-[#635147] tabular-nums">
                          {item.defaultWeight} · {formatINR(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(item, item.defaultWeight, 1);
                          onCloseWishlist();
                          openCart();
                        }}
                        className="inline-flex h-9 items-center gap-1 rounded-lg bg-[#7C1D26] px-3 text-xs font-semibold text-white cursor-pointer"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item.id, item.name)}
                        aria-label={`Remove ${item.name}`}
                        className="p-2 text-[#635147] hover:text-[#7C1D26]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Express Mobile OTP Sign-In Modal */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 sm:p-4">
          <div className="fixed inset-0" onClick={onCloseAccount} />
          <div className="relative z-10 w-full max-w-sm rounded-t-3xl sm:rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6DDD0] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#7C1D26]" />
                <h3 className="font-display text-2xl font-semibold text-[#231712]">Express OTP Login</h3>
              </div>
              <button type="button" onClick={onCloseAccount} aria-label="Close login" className="p-1.5 text-[#635147]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {otpStep === 'signedIn' ? (
              <div className="space-y-3 py-2 text-center">
                <CheckCircle2 className="h-9 w-9 text-[#7C1D26] mx-auto" />
                <p className="text-sm font-semibold text-[#231712]">Signed in with +91 {mobile}</p>
                <p className="text-xs text-[#635147]">
                  Saved addresses and festive order updates are active for your session.
                </p>
                <button
                  type="button"
                  onClick={onCloseAccount}
                  className="w-full rounded-lg bg-[#7C1D26] py-2.5 text-xs font-semibold text-white"
                >
                  Continue Shopping
                </button>
              </div>
            ) : otpStep === 'otp' ? (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <p className="text-xs text-[#635147]">Enter 4-digit OTP sent to +91 {mobile}</p>
                <input
                  type="text"
                  maxLength={4}
                  inputMode="numeric"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit code"
                  className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2.5 text-center text-base tracking-widest tabular-nums focus:border-[#7C1D26] focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[44px] w-full rounded-lg bg-[#7C1D26] py-2.5 text-xs font-semibold text-white cursor-pointer"
                >
                  Verify &amp; Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <p className="text-xs text-[#635147]">
                  Sign in quickly with your mobile number to view past sweet boxes &amp; track orders.
                </p>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2.5 text-sm tabular-nums focus:border-[#7C1D26] focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[44px] w-full rounded-lg bg-[#7C1D26] py-2.5 text-xs font-semibold text-white cursor-pointer"
                >
                  Send OTP
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
