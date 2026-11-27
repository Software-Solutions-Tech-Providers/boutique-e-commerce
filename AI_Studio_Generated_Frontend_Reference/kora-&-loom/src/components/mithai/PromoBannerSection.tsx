import { ArrowRight, Sparkles } from 'lucide-react';
import { useMithaiCart } from '../../context/MithaiCartContext';
import { MITHAI_IMAGES } from '../../data/mithaiData';
import { SafeImage } from '../common/SafeImage';

interface PromoBannerSectionProps {
  onExploreCombos: () => void;
}

export function PromoBannerSection({ onExploreCombos }: PromoBannerSectionProps) {
  const { applyPromo, openCart } = useMithaiCart();

  const handleApplyOffer = () => {
    const res = applyPromo('SWEET10');
    if (!res.ok) {
      onExploreCombos();
    } else {
      openCart();
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-6">
      <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-[#E6DDD0] bg-[#7C1D26] text-white md:grid-cols-12">
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 md:col-span-7">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#FDE68A]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Celebration Tiered Savings</span>
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl text-balance">
            Save 10% on ₹1,499+ · Save 15% on ₹2,499+ Festive Boxes
          </h2>
          <p className="text-sm text-white/85 leading-relaxed max-w-xl">
            Stock up on Heritage Cow-Ghee Mysore Pak, Pistachio Kaju Katli, and gift hampers with insulated pan-India transit included free above ₹799.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleApplyOffer}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-[#7C1D26] hover:bg-[#FCF9F4] transition-colors cursor-pointer"
            >
              <span>Apply SWEET10</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onExploreCombos}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/35 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Browse Celebration Boxes
            </button>
          </div>
        </div>

        <div className="aspect-[16/9] md:aspect-auto md:col-span-5">
          <SafeImage
            src={MITHAI_IMAGES.combo}
            alt="Ribbon-tied festive Indian sweet and savoury gift box"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
