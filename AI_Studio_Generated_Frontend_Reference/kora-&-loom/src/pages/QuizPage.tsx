import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';

type QuizOccasion = 'wedding' | 'festive' | 'office';
type QuizFabric = 'silk' | 'breathable' | 'blouse';
type QuizBudget = 'under-1500' | '1500-3000' | 'heirloom';

export function QuizPage() {
  const { addToCart } = useStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [occasion, setOccasion] = useState<QuizOccasion>('festive');
  const [fabric, setFabric] = useState<QuizFabric>('silk');
  const [budget, setBudget] = useState<QuizBudget>('1500-3000');

  const recommendations = useMemo(() => {
    const scored = PRODUCTS.map((p) => {
      let score = 0;
      if (occasion === 'wedding' && p.occasion === 'Bridal & Festive') score += 4;
      if (occasion === 'festive' && (p.occasion === 'Festive' || p.occasion === 'Bridal & Festive')) score += 4;
      if (occasion === 'office' && (p.occasion === 'Office & Daywear' || p.occasion === 'Casual & Office')) score += 4;

      if (fabric === 'silk' && p.category === 'Silk Sarees') score += 4;
      if (fabric === 'breathable' && (p.category === 'Cotton Sarees' || p.category === 'Linen Sarees')) score += 4;
      if (fabric === 'blouse' && (p.category === 'Blouses' || p.category === 'Jewellery')) score += 4;

      if (budget === 'under-1500' && p.price <= 1500) score += 3;
      if (budget === '1500-3000' && p.price >= 1400 && p.price <= 3000) score += 3;
      if (budget === 'heirloom' && p.price >= 2100) score += 3;

      return { product: p, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.product);
  }, [occasion, fabric, budget]);

  const handleReset = () => {
    setStep(1);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#14532D]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>30-Second Boutique Consultation</span>
        </p>
        <h1 className="font-display text-4xl font-semibold text-[#1C1917]">Find Your Ideal Drape</h1>
        <p className="text-sm text-[#57534E]">
          Answer three quick questions about your occasion, drape comfort, and budget for tailored weave matches.
        </p>
      </div>

      {step < 4 ? (
        <div className="mx-auto max-w-xl rounded-xl border border-[#E5E0D8] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#57534E] tabular-nums">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% complete</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#F2EFE9] overflow-hidden">
            <div className="h-full bg-[#14532D] transition-all" style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                1. What occasion are you shopping for?
              </h2>
              <div className="space-y-2.5">
                {[
                  { id: 'wedding', title: 'Wedding & Bridal Trousseau', desc: 'Rich zari silks that photograph and hold structure all day' },
                  { id: 'festive', title: 'Diwali, Puja & Family Gatherings', desc: 'Effortless festive glow without heavy weight' },
                  { id: 'office', title: 'Office, Travel & Everyday Poise', desc: 'Featherlight cottons & breathable linens under 350g' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setOccasion(opt.id as QuizOccasion);
                      setStep(2);
                    }}
                    className={`w-full rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                      occasion === opt.id ? 'border-[#14532D] bg-[#14532D]/5' : 'border-[#E5E0D8] hover:border-[#57534E]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#1C1917]">{opt.title}</p>
                    <p className="mt-0.5 text-xs text-[#57534E]">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                2. Which fabric feel do you prefer?
              </h2>
              <div className="space-y-2.5">
                {[
                  { id: 'silk', title: 'Pure & Soft Mulberry Silks', desc: 'Kanchipuram, Banarasi Katan & Arani soft silk' },
                  { id: 'breathable', title: 'Airy Cotton-Silk & Tissue Linen', desc: 'Maheshwari, Chanderi & Kalyani handloom weaves' },
                  { id: 'blouse', title: 'Ready-Made Blouses & Temple Jewellery', desc: 'Complete an existing saree in your wardrobe' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setFabric(opt.id as QuizFabric);
                      setStep(3);
                    }}
                    className={`w-full rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                      fabric === opt.id ? 'border-[#14532D] bg-[#14532D]/5' : 'border-[#E5E0D8] hover:border-[#57534E]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#1C1917]">{opt.title}</p>
                    <p className="mt-0.5 text-xs text-[#57534E]">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#57534E] hover:text-[#1C1917]"
              >
                ← Back to Step 1
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                3. Select your preferred budget range
              </h2>
              <div className="space-y-2.5">
                {[
                  { id: 'under-1500', title: 'Everyday Value (Under ₹1,500)', desc: 'Great for daily wear & multi-saree Buy More – Save More bundles' },
                  { id: '1500-3000', title: 'Celebration Sweet Spot (₹1,500 – ₹3,000)', desc: 'Chanderi, Soft Silk & Banarasi Katan favourites' },
                  { id: 'heirloom', title: 'Heirloom & Gifting Sets (₹2,500+)', desc: 'Qualifies automatically for Free Express Insured Shipping' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setBudget(opt.id as QuizBudget);
                      setStep(4);
                    }}
                    className={`w-full rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                      budget === opt.id ? 'border-[#14532D] bg-[#14532D]/5' : 'border-[#E5E0D8] hover:border-[#57534E]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#1C1917]">{opt.title}</p>
                    <p className="mt-0.5 text-xs text-[#57534E]">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-[#57534E] hover:text-[#1C1917]"
              >
                ← Back to Step 2
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#E5E0D8] bg-white p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#14532D] mt-0.5 shrink-0" />
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                  Your Top 3 Boutique Matches
                </h2>
                <p className="text-xs text-[#57534E]">
                  Curated for {occasion} wear · {fabric} preference · {budget} range.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  recommendations.forEach((p, idx) => addToCart(p, { quantity: 1, openDrawer: idx === recommendations.length - 1 }));
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#14532D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F3F22] whitespace-nowrap cursor-pointer"
              >
                <span>Add All 3 to Bag</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E0D8] px-3 py-2 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
