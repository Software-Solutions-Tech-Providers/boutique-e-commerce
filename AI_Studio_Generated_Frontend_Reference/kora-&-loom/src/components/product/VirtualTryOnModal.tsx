import { useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';

interface VirtualTryOnModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: () => void;
}

export function VirtualTryOnModal({ open, onClose, product, onAddToCart }: VirtualTryOnModalProps) {
  const [selectedBlouse, setSelectedBlouse] = useState<'matching' | 'contrast-gold' | 'black-velvet'>('matching');
  const [pleatStyle, setPleatStyle] = useState<'classic' | 'seedha-pallu' | 'modern-belted'>('classic');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E5E0D8] bg-[#FAF9F6] p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14532D] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-[#1C1917]">Virtual Drape Studio</h3>
              <p className="text-xs text-[#57534E]">Visual drape preview &amp; blouse pairing simulator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drape studio"
            className="rounded p-1.5 text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Studio Preview Canvas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-center">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-inner">
            <SafeImage
              src={product.images[0]?.url}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/65 px-3 py-2 text-white backdrop-blur-xs text-xs space-y-0.5">
              <p className="font-medium truncate">{product.name}</p>
              <p className="text-[11px] text-white/80">
                Style: {pleatStyle === 'classic' ? 'Classic 6-Pleat Nivi' : pleatStyle === 'seedha-pallu' ? 'Gujarati Seedha Pallu' : 'Contemporary Belted'}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Blouse Pairing Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                1. Select Blouse Pairing
              </label>
              <div className="space-y-2">
                {[
                  { id: 'matching', label: 'Matching Unstitched Blouse Piece', hint: 'Included with saree (0.9m)' },
                  { id: 'contrast-gold', label: 'Raw Silk Antique Zari Blouse', hint: '+₹1,899 (Ready-to-wear)' },
                  { id: 'black-velvet', label: 'Hand-Embroidered Velvet Blouse', hint: '+₹2,299 (Celebration edit)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedBlouse(item.id as typeof selectedBlouse)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors flex items-center justify-between text-xs ${
                      selectedBlouse === item.id
                        ? 'border-[#14532D] bg-[#14532D]/5 font-semibold text-[#14532D]'
                        : 'border-[#E5E0D8] bg-white text-[#1C1917] hover:border-[#57534E]'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-[#1C1917]">{item.label}</p>
                      <p className="text-[11px] text-[#57534E]">{item.hint}</p>
                    </div>
                    {selectedBlouse === item.id && <Check className="h-4 w-4 text-[#14532D]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Drape Pallu Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                2. Drape Height &amp; Fall
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'classic', label: 'Classic Nivi' },
                  { id: 'seedha-pallu', label: 'Seedha Pallu' },
                  { id: 'modern-belted', label: 'Modern Belted' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPleatStyle(s.id as typeof pleatStyle)}
                    className={`rounded-md border p-2 text-center transition-colors ${
                      pleatStyle === s.id
                        ? 'border-[#14532D] bg-[#14532D] text-white font-semibold'
                        : 'border-[#E5E0D8] bg-white text-[#57534E] hover:border-[#1C1917]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-[#F2EFE9] p-3 text-[11px] text-[#57534E] space-y-1">
              <p className="font-semibold text-[#1C1917]">Need custom fall &amp; pico stitched?</p>
              <p>Mention your measurements or notes during checkout. Our master tailors finish edges before dispatch.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E0D8] pt-4">
          <div className="text-left w-full sm:w-auto">
            <span className="text-xs text-[#57534E]">Ready to order this look</span>
            <p className="text-xl font-bold text-[#1C1917] tabular-nums">{formatINR(product.price)}</p>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-md border border-[#E5E0D8] bg-white px-5 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onAddToCart();
                onClose();
              }}
              className="flex-1 sm:flex-none rounded-md bg-[#14532D] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] transition-colors"
            >
              Add Drape to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
