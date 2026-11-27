import { ArrowRight, Droplets, Flame, Leaf, ShieldCheck } from 'lucide-react';
import { MithaiCategory, SPECIAL_COLLECTIONS } from '../../data/mithaiData';
import { SafeImage } from '../common/SafeImage';

interface TrustAndCollectionsSectionProps {
  onSelectCollection: (cat: MithaiCategory) => void;
}

const TRUST_PILLARS = [
  {
    icon: Flame,
    title: '100% Pure Cow Ghee',
    desc: 'Zero vanaspati or refined vegetable shortening—every batch is slow-cooked in A2 cow ghee.',
  },
  {
    icon: Leaf,
    title: 'Real Fruit & Whole Nuts',
    desc: 'Ratnagiri Alphonso pulp, damask rose gulkand, and W180 Goa cashews—never synthetic flavours.',
  },
  {
    icon: Droplets,
    title: 'Cold-Pressed Savouries',
    desc: 'Crisp butter murukku and Madras mixture prepared in cold-pressed groundnut oil with zero palm oil.',
  },
  {
    icon: ShieldCheck,
    title: 'Insulated Fresh Transit',
    desc: 'Food-grade airtight tins cushioned in thermal sleeves so sweets arrive unbroken and aromatic.',
  },
];

export function TrustAndCollectionsSection({ onSelectCollection }: TrustAndCollectionsSectionProps) {
  return (
    <>
      {/* 10. Why Choose Our Brand / Trust Factors */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7C1D26]">
            The Madhura Promise
          </p>
          <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-semibold text-[#231712]">
            Why Families Trust Our Kitchen
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-xl border border-[#E6DDD0] bg-white p-5 space-y-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4EDE2] text-[#7C1D26]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-sans text-base font-semibold text-[#231712]">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#635147]">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 11. Special Collections */}
      <section id="special-collections" className="mx-auto max-w-7xl px-3 sm:px-6 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7C1D26]">
            Curated for Every Gathering
          </p>
          <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-semibold text-[#231712]">
            Special Occasion Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {SPECIAL_COLLECTIONS.map((col) => (
            <article
              key={col.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#E6DDD0] bg-white"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F4EDE2]">
                <SafeImage
                  src={col.image}
                  alt={col.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5 gap-4">
                <div className="space-y-1.5">
                  <h3 className="font-display text-2xl font-semibold text-[#231712]">{col.title}</h3>
                  <p className="text-xs leading-relaxed text-[#635147]">{col.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCollection(col.filterCategory);
                    const el = document.getElementById('bestsellers');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#7C1D26] px-4 py-2 text-xs font-semibold text-[#7C1D26] hover:bg-[#7C1D26] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{col.ctaLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
