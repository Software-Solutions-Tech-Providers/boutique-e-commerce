import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Heart, ShoppingBag, Smartphone, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBoutiqueCart } from '../../context/BoutiqueCartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { BRAND_INFO, getBoutiqueProductDetailPath, SAREE_PRODUCTS } from '../../data/boutiqueData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

interface BoutiqueUtilityModalsProps {
  wishlistOpen: boolean;
  onCloseWishlist: () => void;
  accountOpen: boolean;
  onCloseAccount: () => void;
}

export function BoutiqueUtilityModals({
  wishlistOpen,
  onCloseWishlist,
  accountOpen,
  onCloseAccount,
}: BoutiqueUtilityModalsProps) {
  const { showToast } = useToast();
  const { wishlistIds, toggleWishlist, addToCart, openCart } = useBoutiqueCart();
  const { t } = useLanguage();

  const [phoneInput, setPhoneInput] = useState('');
  const [otpStage, setOtpStage] = useState<'phone' | 'otp' | 'signed_in'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [signedPhone, setSignedPhone] = useState('');

  const savedProducts = SAREE_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phoneInput.replace(/\D/g, '');
    if (digits.length < 10) {
      showToast('Enter a valid 10-digit mobile number.', 'info');
      return;
    }
    setOtpStage('otp');
    showToast('Sample OTP ready: enter 1234 to preview member view', 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 4) {
      showToast('Enter the 4-digit OTP code (demo: 1234).', 'info');
      return;
    }
    setSignedPhone(phoneInput);
    setOtpStage('signed_in');
    showToast(`Signed in to ${BRAND_INFO.name}`);
  };

  return (
    <>
      {/* Wishlist Modal */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div className="fixed inset-0 bg-black/50" onClick={onCloseWishlist} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.wishlist}
            className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-[#E6DDD0] bg-[#FCF9F4] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E6DDD0] bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#7C1D26] fill-current" />
                <h2 className="font-display text-xl font-semibold text-[#231712]">
                  {t.wishlist} ({savedProducts.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseWishlist}
                aria-label="Close wishlist"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#635147] hover:bg-[#F4EDE2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {savedProducts.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <p className="font-display text-xl font-semibold text-[#231712]">{t.noSavedSarees}</p>
                  <p className="text-xs text-[#635147]">{t.noSavedSareesDesc}</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {savedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center gap-3 rounded-xl border border-[#E6DDD0] bg-white p-3"
                    >
                      <Link
                        to={getBoutiqueProductDetailPath(product)}
                        onClick={onCloseWishlist}
                        className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F4EDE2]"
                      >
                        <SafeImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1 space-y-1">
                        <Link
                          to={getBoutiqueProductDetailPath(product)}
                          onClick={onCloseWishlist}
                          className="block truncate text-sm font-semibold text-[#231712] hover:text-[#7C1D26]"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-[#635147] tabular-nums">
                          {product.sku} · {formatINR(product.price)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(product, product.defaultOption, 1);
                              onCloseWishlist();
                              openCart();
                            }}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#7C1D26] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#5E141B] cursor-pointer"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>{t.moveToBag}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id, product.name)}
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#E6DDD0] px-3 py-2 text-xs text-[#635147] hover:text-[#7C1D26] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{t.remove}</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-[#E6DDD0] bg-white px-5 py-3 flex justify-end">
              <Link
                to="/wishlist"
                onClick={onCloseWishlist}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C1D26] hover:underline"
              >
                <span>Open Full Wishlist Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Express Mobile OTP Sign-In Modal */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div className="fixed inset-0 bg-black/50" onClick={onCloseAccount} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Boutique Member Sign In"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-t-2xl sm:rounded-2xl border border-[#E6DDD0] bg-[#FCF9F4] p-5 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E6DDD0] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#7C1D26]" />
                <h2 className="font-display text-xl font-semibold text-[#231712]">{t.expressOtpTitle}</h2>
              </div>
              <button
                type="button"
                onClick={onCloseAccount}
                aria-label="Close sign in"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#635147] hover:bg-[#F4EDE2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {otpStage === 'signed_in' ? (
              <div className="mt-5 space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#7C1D26]" />
                <div className="space-y-1">
                  <p className="font-display text-xl font-semibold text-[#231712]">Welcome back!</p>
                  <p className="text-xs text-[#635147] tabular-nums">Signed in with +91 {signedPhone}</p>
                </div>
                <p className="rounded-xl border border-[#E6DDD0] bg-white p-3 text-xs text-[#635147]">
                  Enjoy saved saree wishlists, quick boutique dispatch tracking, and express Cash on Delivery checkout.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStage('phone');
                    setPhoneInput('');
                    setOtpCode('');
                    setSignedPhone('');
                  }}
                  className="min-h-[44px] w-full rounded-xl border border-[#E6DDD0] bg-white text-xs font-semibold text-[#231712] hover:bg-[#F4EDE2] cursor-pointer"
                >
                  {t.signOut}
                </button>
              </div>
            ) : otpStage === 'otp' ? (
              <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
                <p className="text-xs text-[#635147] tabular-nums">
                  Enter the 4-digit sample OTP for <strong>+91 {phoneInput}</strong> (demo code: 1234).
                </p>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit OTP"
                  className="min-h-[46px] w-full rounded-xl border border-[#E6DDD0] bg-white px-4 py-2.5 text-center text-base font-semibold tracking-widest tabular-nums focus:border-[#7C1D26] focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpStage('phone')}
                    className="min-h-[44px] flex-1 rounded-xl border border-[#E6DDD0] bg-white text-xs font-semibold text-[#231712]"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    className="min-h-[44px] flex-1 rounded-xl bg-[#7C1D26] text-xs font-semibold text-white hover:bg-[#5E141B] cursor-pointer"
                  >
                    Verify &amp; Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRequestOtp} className="mt-5 space-y-4">
                <p className="text-xs leading-relaxed text-[#635147]">{t.otpPrompt}</p>
                <div className="flex items-center rounded-xl border border-[#E6DDD0] bg-white px-3 focus-within:border-[#7C1D26]">
                  <span className="border-r border-[#E6DDD0] pr-2.5 text-xs font-semibold text-[#635147] tabular-nums">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit Mobile Number"
                    className="min-h-[46px] flex-1 bg-transparent px-3 py-2 text-sm tabular-nums text-[#231712] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-[46px] w-full rounded-xl bg-[#7C1D26] py-3 text-sm font-semibold text-white hover:bg-[#5E141B] cursor-pointer"
                >
                  {t.continueOtp}
                </button>
              </form>
            )}
            <div className="mt-4 border-t border-[#E6DDD0] pt-3 text-center">
              <Link
                to="/account"
                onClick={onCloseAccount}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C1D26] hover:underline"
              >
                <span>Open Full Account &amp; Orders</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
