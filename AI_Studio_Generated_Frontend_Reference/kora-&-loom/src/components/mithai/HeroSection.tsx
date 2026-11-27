import { ArrowRight, CheckCircle2, Truck } from 'lucide-react';
import { MITHAI_IMAGES } from '../../data/mithaiData';
import { SafeImage } from '../common/SafeImage';

interface HeroSectionProps {
  onShopBestsellers: () => void;
  onShopCombos: () => void;
}

export function HeroSection({ onShopBestsellers, onShopCombos }: HeroSectionProps) {
  return (
    <section id="top" className="mx-auto max-w-7xl px-3 pt-4 sm:px-6 lg:pt-6">
      <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-[#E6DDD0] bg-white lg:grid-cols-12">
        {/* Visual first on mobile so shoppers immediately see what we craft */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:order-2 lg:col-span-7">
          <SafeImage
            src={MITHAI_IMAGES.hero}
            alt="Assorted pure-ghee Mysore Pak, Kaju Katli, and pistachio ladoo gift hamper"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-4 p-5 sm:p-8 lg:order-1 lg:col-span-5 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7C1D26]">
            Pure Cow-Ghee &amp; Real-Fruit Mithai
          </p>
          <h1 className="font-display text-3xl font-semibold leading-[1.12] text-[#231712] sm:text-4xl lg:text-[42px] text-balance">
            Fresh small-batch sweets &amp; crisp savouries, delivered across India.
          </h1>
          <p className="text-sm leading-relaxed text-[#635147] sm:text-base">
            Slow-cooked in brass urulis with A2 cow ghee, real Alphonso mangoes, and cold-pressed oils—zero artificial colours or preservatives.
          </p>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap pt-1">
            <button
              type="button"
              onClick={onShopBestsellers}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#7C1D26] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5E141B] cursor-pointer"
            >
              <span>Shop Bestsellers</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onShopCombos}
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-[#E6DDD0] bg-[#FCF9F4] px-5 py-3 text-sm font-semibold text-[#231712] hover:bg-[#F4EDE2] transition-colors cursor-pointer"
            >
              Explore Gift Combos
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#E6DDD0] pt-4 text-xs text-[#635147]">
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-[#7C1D26] shrink-0" />
              <span>Free Delivery ₹799+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#7C1D26] shrink-0" />
              <span>Packed Fresh Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
