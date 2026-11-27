import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Minus,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Smartphone,
  Star,
  Tag,
  Truck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BRAND_INFO, SAREE_PRODUCTS } from '../../data/boutiqueData';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';
import { BoutiqueLogoMark } from './BoutiqueLogoMark';

interface BoutiqueHowToOrderProps {
  onStartShopping: () => void;
}

const STEP_DURATION_MS = 4000;
const TOTAL_STEPS = 6;
const TOTAL_DURATION_MS = STEP_DURATION_MS * TOTAL_STEPS;

export function BoutiqueHowToOrder({ onStartShopping }: BoutiqueHowToOrderProps) {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);

  const demoProduct = SAREE_PRODUCTS[0];
  const altProduct = SAREE_PRODUCTS[1];

  useEffect(() => {
    if (!isPlaying) return;
    let last = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setElapsedMs((prev) => (prev + dt) % TOTAL_DURATION_MS);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  const activeStep = Math.min(TOTAL_STEPS - 1, Math.floor(elapsedMs / STEP_DURATION_MS));
  const stepProgress = (elapsedMs % STEP_DURATION_MS) / STEP_DURATION_MS;
  const progressPct = Math.min(100, (elapsedMs / TOTAL_DURATION_MS) * 100);
  const currentSec = Math.floor(elapsedMs / 1000);

  const jumpToStep = (idx: number) => {
    setElapsedMs(idx * STEP_DURATION_MS + 100);
  };

  // Dynamic realistic state driven by activeStep & stepProgress
  const searchTyped = 'Kanchipuram Emerald'.slice(
    0,
    Math.max(1, Math.floor('Kanchipuram Emerald'.length * Math.min(1, stepProgress * 1.35)))
  );
  const demoQty = activeStep < 2 ? 1 : activeStep === 2 && stepProgress < 0.45 ? 1 : 2;
  const bagCount = activeStep < 3 ? 0 : activeStep === 3 && stepProgress < 0.45 ? 0 : demoQty;
  const demoSubtotal = demoProduct.price * demoQty;
  const offerApplied = activeStep > 4 || (activeStep === 4 && stepProgress > 0.42);
  const demoDiscount = offerApplied ? Math.round(demoSubtotal * 0.1) : 0;
  const demoTotal = demoSubtotal - demoDiscount;
  const orderPlaced = activeStep === 5 && stepProgress > 0.55;

  return (
    <section
      id="how-to-order"
      aria-labelledby="how-to-order-heading"
      className="scroll-mt-14 w-full px-2 sm:px-4 lg:px-6"
    >
      <div className="rounded-xl border border-[#E6DDD0] bg-[#F4EDE2]/70 p-3 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="how-to-order-heading"
              className="font-display text-lg sm:text-2xl font-semibold text-[#231712]"
            >
              {t.howToOrderTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#635147]">{t.howToOrderSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={onStartShopping}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#7C1D26] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#5E141B] transition-colors cursor-pointer"
          >
            <span>{t.howToOrderStartShopping}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-stretch">
          {/* Realistic Live-Screen Ordering Walkthrough */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden rounded-xl border border-[#E6DDD0] bg-[#1D120D] shadow-sm">
            {/* Simulated Browser / Storefront Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[#E6DDD0] bg-[#FCF9F4] px-3 py-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <BoutiqueLogoMark className="h-6 w-6 rounded-md shrink-0" />
                <span className="font-display text-xs sm:text-sm font-bold text-[#231712] truncate">
                  {BRAND_INFO.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-[#7C1D26] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-white tabular-nums">
                  STEP {activeStep + 1} / {TOTAL_STEPS}
                </span>
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#E6DDD0] bg-white text-[#231712]">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {bagCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#7C1D26] px-1 text-[9px] font-bold text-white tabular-nums">
                      {bagCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Scene Stage */}
            <div className="relative flex-1 min-h-[275px] sm:min-h-[305px] bg-[#FCF9F4] p-3 sm:p-4 flex flex-col justify-center">
              {/* STEP 1: Browse or Search Sarees */}
              {activeStep === 0 && (
                <div className="space-y-2.5">
                  <div className="relative flex items-center rounded-full border-2 border-[#7C1D26] bg-white px-3 py-2 shadow-xs">
                    <Search className="h-4 w-4 text-[#7C1D26] shrink-0 mr-2" />
                    <span className="text-xs sm:text-sm font-medium text-[#231712]">
                      {searchTyped}
                      <span className="inline-block w-0.5 h-3.5 bg-[#7C1D26] ml-0.5 animate-pulse align-middle" />
                    </span>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[t.allSarees, t.categories['Kanchipuram Silks'], t.categories['Banarasi & Soft Silks']].map(
                      (catLabel, i) => (
                        <span
                          key={catLabel}
                          className={`rounded-md px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold ${
                            i === 1 && stepProgress > 0.35
                              ? 'bg-[#7C1D26] text-white'
                              : 'border border-[#E6DDD0] bg-white text-[#635147]'
                          }`}
                        >
                          {catLabel}
                        </span>
                      )
                    )}
                  </div>

                  {/* Real Saree Matches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[demoProduct, altProduct].map((item, i) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2.5 rounded-xl border bg-white p-2 transition-all ${
                          i === 0 && stepProgress > 0.55
                            ? 'border-[#7C1D26] ring-2 ring-[#7C1D26]/20 shadow-sm'
                            : 'border-[#E6DDD0]'
                        }`}
                      >
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-12 rounded-lg object-cover shrink-0 bg-[#F4EDE2]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-xs font-semibold text-[#231712]">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-[#635147] truncate">{item.sku}</p>
                          <p className="text-xs font-bold text-[#7C1D26] tabular-nums">
                            {formatINR(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Select Product */}
              {activeStep === 1 && (
                <div className="rounded-xl border border-[#E6DDD0] bg-white p-3 shadow-xs grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-4 sm:col-span-4 aspect-[3/4] overflow-hidden rounded-lg bg-[#F4EDE2]">
                    <SafeImage
                      src={demoProduct.image}
                      alt={demoProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="col-span-8 sm:col-span-8 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-[#635147]">
                      <span>{demoProduct.sku} · {t.categories[demoProduct.category]}</span>
                      <span className="inline-flex items-center gap-0.5 font-semibold text-[#231712]">
                        <Star className="h-3 w-3 fill-[#B4690E] text-[#B4690E]" />
                        {demoProduct.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#231712] leading-snug">
                      {demoProduct.name}
                    </h3>
                    <p className="text-[11px] text-[#635147] line-clamp-2">{demoProduct.fabricSpec}</p>
                    <p className="text-base font-bold text-[#231712] tabular-nums">
                      {formatINR(demoProduct.price)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {demoProduct.drapeOptions.map((opt, idx) => (
                        <span
                          key={opt.label}
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                            idx === 0
                              ? 'border-[#7C1D26] bg-[#7C1D26]/10 text-[#7C1D26]'
                              : 'border-[#E6DDD0] bg-[#FCF9F4] text-[#635147]'
                          }`}
                        >
                          {opt.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Select Quantity (+ / -) */}
              {activeStep === 2 && (
                <div className="rounded-xl border border-[#E6DDD0] bg-white p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                  <SafeImage
                    src={demoProduct.image}
                    alt={demoProduct.name}
                    className="h-24 w-20 rounded-lg object-cover shrink-0 bg-[#F4EDE2]"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <p className="font-display text-sm font-semibold text-[#231712]">
                        {demoProduct.name}
                      </p>
                      <p className="text-xs text-[#635147] tabular-nums">
                        {formatINR(demoProduct.price)} × {demoQty} ={' '}
                        <strong className="text-[#7C1D26]">{formatINR(demoSubtotal)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative inline-flex h-10 items-center rounded-lg border-2 border-[#7C1D26] bg-[#FCF9F4]">
                        <span className="flex h-full w-9 items-center justify-center text-[#231712]">
                          <Minus className="h-3.5 w-3.5" />
                        </span>
                        <span className="w-8 text-center text-sm font-bold text-[#231712] tabular-nums">
                          {demoQty}
                        </span>
                        <span
                          className={`flex h-full w-9 items-center justify-center rounded-r-md transition-colors ${
                            stepProgress > 0.35
                              ? 'bg-[#7C1D26] text-white'
                              : 'text-[#7C1D26]'
                          }`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </span>

                        {stepProgress > 0.25 && (
                          <span className="pointer-events-none absolute -bottom-3 -right-2 rounded-full bg-white p-1 shadow-md border border-[#E6DDD0] text-[#7C1D26]">
                            <MousePointerClick className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-medium text-[#635147]">
                        Tap + or − before adding
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Add to Cart */}
              {activeStep === 3 && (
                <div className="rounded-xl border border-[#E6DDD0] bg-white p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                  <SafeImage
                    src={demoProduct.image}
                    alt={demoProduct.name}
                    className="h-24 w-20 rounded-lg object-cover shrink-0 bg-[#F4EDE2]"
                  />
                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-sm font-semibold text-[#231712]">
                          {demoProduct.name}
                        </p>
                        <p className="text-xs font-bold text-[#231712] tabular-nums">
                          {formatINR(demoSubtotal)} ({demoQty} pcs)
                        </p>
                      </div>
                      {stepProgress > 0.45 && (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                          {t.inBagLabel}: {demoQty}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <div
                        className={`flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg text-xs sm:text-sm font-semibold text-white transition-colors ${
                          stepProgress > 0.45 ? 'bg-emerald-700' : 'bg-[#7C1D26]'
                        }`}
                      >
                        {stepProgress > 0.45 ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Added to Saree Bag ({demoQty})</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4" />
                            <span>{t.addToCart}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Open Bag & Apply Offer */}
              {activeStep === 4 && (
                <div className="rounded-xl border border-[#E6DDD0] bg-white p-3 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 rounded-lg bg-[#F4EDE2]/80 px-2.5 py-1.5 text-[11px] font-medium text-[#231712]">
                    <Truck className="h-3.5 w-3.5 text-[#7C1D26] shrink-0" />
                    <span>{t.freeDeliveryLine} — FREE</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs border-b border-[#E6DDD0] pb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <SafeImage
                        src={demoProduct.image}
                        alt={demoProduct.name}
                        className="h-10 w-8 rounded object-cover shrink-0"
                      />
                      <span className="truncate font-semibold text-[#231712]">
                        {demoProduct.name} × {demoQty}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums text-[#231712] shrink-0">
                      {formatINR(demoSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-[#E6DDD0] bg-[#FCF9F4] px-2.5 py-1.5 text-xs font-semibold text-[#231712]">
                      <Tag className="h-3.5 w-3.5 text-[#7C1D26] shrink-0" />
                      <span>KORA10</span>
                    </div>
                    <span
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        offerApplied
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#7C1D26] text-white'
                      }`}
                    >
                      {offerApplied ? '✓ Applied (−10%)' : 'Apply Offer'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5 tabular-nums">
                    <span className="text-[#635147]">
                      {offerApplied ? `Offer (KORA10): −${formatINR(demoDiscount)}` : t.subtotal}
                    </span>
                    <span className="text-sm font-bold text-[#7C1D26]">
                      {t.totalPayable}: {formatINR(demoTotal)}
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 6: Checkout & Payment */}
              {activeStep === 5 && (
                <div className="rounded-xl border border-[#E6DDD0] bg-white p-3 shadow-xs space-y-2.5">
                  {orderPlaced ? (
                    <div className="py-3 text-center space-y-1.5">
                      <CheckCircle2 className="h-9 w-9 text-emerald-700 mx-auto" />
                      <p className="font-display text-base sm:text-lg font-semibold text-[#231712]">
                        Order #KL-4821 Confirmed!
                      </p>
                      <p className="text-xs text-[#635147]">
                        Paid {formatINR(demoTotal)} via G Pay UPI · Dispatching to pincode 600001
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="rounded-lg border border-[#E6DDD0] bg-[#FCF9F4] px-2.5 py-1.5">
                          <span className="block text-[9px] text-[#635147]">Delivery Pincode</span>
                          <span className="font-semibold text-[#231712] tabular-nums">600001</span>
                        </div>
                        <div className="rounded-lg border border-[#E6DDD0] bg-[#FCF9F4] px-2.5 py-1.5">
                          <span className="block text-[9px] text-[#635147]">{t.totalPayable}</span>
                          <span className="font-bold text-[#7C1D26] tabular-nums">
                            {formatINR(demoTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
                        <div className="flex items-center justify-center gap-1 rounded-lg border-2 border-[#7C1D26] bg-[#7C1D26]/10 py-2 text-[#7C1D26]">
                          <Smartphone className="h-3.5 w-3.5" />
                          <span>G Pay / PhonePe</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 rounded-lg border border-[#E6DDD0] bg-[#FCF9F4] py-2 text-[#635147]">
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>VISA / MC</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 rounded-lg border border-[#E6DDD0] bg-[#FCF9F4] py-2 text-[#635147]">
                          <Truck className="h-3.5 w-3.5" />
                          <span>COD</span>
                        </div>
                      </div>

                      <div className="flex min-h-[38px] items-center justify-center rounded-lg bg-[#7C1D26] text-xs font-semibold text-white">
                        {t.placeOrder} · {formatINR(demoTotal)}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Player Controls Bar */}
            <div className="flex items-center gap-2.5 bg-[#231712] px-3 py-2 text-white">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause walkthrough' : 'Play walkthrough'}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7C1D26] text-white hover:bg-[#5E141B] cursor-pointer"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  jumpToStep(0);
                  setIsPlaying(true);
                }}
                aria-label="Replay ordering guide"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <div className="flex-1 flex items-center gap-2">
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progressPct)}
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"
                >
                  <div
                    className="h-full bg-[#FDE68A] transition-all duration-100"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium tabular-nums text-[#E6DDD0] shrink-0">
                  0:{currentSec.toString().padStart(2, '0')} / 0:24
                </span>
              </div>
            </div>
          </div>

          {/* 6 Realistic Customer Steps */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
            {t.howToOrderSteps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => jumpToStep(idx)}
                  className={`flex items-start gap-2.5 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#7C1D26] bg-white shadow-xs ring-1 ring-[#7C1D26]/30'
                      : 'border-[#E6DDD0] bg-white/80 hover:border-[#635147]'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums ${
                      isActive ? 'bg-[#7C1D26] text-white' : 'bg-[#F4EDE2] text-[#231712]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-[#231712]">{step.title}</p>
                    <p className="text-[11px] leading-snug text-[#635147]">{step.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
