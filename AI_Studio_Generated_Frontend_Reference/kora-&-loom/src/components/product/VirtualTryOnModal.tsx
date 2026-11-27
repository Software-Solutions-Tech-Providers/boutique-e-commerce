import { useEffect, useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';
import { ProductModalShell } from './ProductModalShell';

export type BlousePairingId = 'matching' | 'contrast-gold' | 'black-velvet';
export type PleatStyleId = 'classic' | 'seedha-pallu' | 'modern-belted';

export interface VirtualTryOnSelection {
  pleatStyle: PleatStyleId;
  drapeLabel: string;
  selectedBlouse: BlousePairingId;
  blouseLabel: string;
  addonProductId?: string;
  blouseAddonPrice: number;
}

interface VirtualTryOnModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (selection: VirtualTryOnSelection) => void;
}

const BLOUSE_PAIRINGS: ReadonlyArray<{
  id: BlousePairingId;
  label: string;
  hint: string;
  addonPrice: number;
  addonProductId?: string;
  swatchColor: string;
}> = [
  {
    id: 'matching',
    label: 'Matching Unstitched Blouse Piece',
    hint: 'Included with saree (0.9m)',
    addonPrice: 0,
    swatchColor: '#14532D',
  },
  {
    id: 'contrast-gold',
    label: 'Raw Silk Antique Zari Blouse',
    hint: '+₹1,899 (Ready-to-wear)',
    addonPrice: 1899,
    addonProductId: 'kalamkari-silk-blouse',
    swatchColor: '#B45309',
  },
  {
    id: 'black-velvet',
    label: 'Hand-Embroidered Velvet Blouse',
    hint: '+₹2,299 (Celebration edit)',
    addonPrice: 2299,
    addonProductId: 'banarasi-brocade-blouse',
    swatchColor: '#1C1917',
  },
];

const PLEAT_STYLES: ReadonlyArray<{
  id: PleatStyleId;
  label: string;
  fullTitle: string;
  imageIndex: number;
  imageClass: string;
}> = [
  {
    id: 'classic',
    label: 'Classic Nivi',
    fullTitle: 'Classic 6-Pleat Nivi',
    imageIndex: 0,
    imageClass: 'object-cover scale-100',
  },
  {
    id: 'seedha-pallu',
    label: 'Seedha Pallu',
    fullTitle: 'Gujarati Seedha Pallu',
    imageIndex: 1,
    imageClass: 'object-cover scale-105',
  },
  {
    id: 'modern-belted',
    label: 'Modern Belted',
    fullTitle: 'Contemporary Belted',
    imageIndex: 3,
    imageClass: 'object-cover scale-110',
  },
];

export function VirtualTryOnModal({ open, onClose, product, onAddToCart }: VirtualTryOnModalProps) {
  const [selectedBlouse, setSelectedBlouse] = useState<BlousePairingId>('matching');
  const [pleatStyle, setPleatStyle] = useState<PleatStyleId>('classic');

  useEffect(() => {
    setSelectedBlouse('matching');
    setPleatStyle('classic');
  }, [product.id]);

  const activeBlouse = BLOUSE_PAIRINGS.find((b) => b.id === selectedBlouse) || BLOUSE_PAIRINGS[0];
  const activePleat = PLEAT_STYLES.find((p) => p.id === pleatStyle) || PLEAT_STYLES[0];
  const blouseAddonPrice = activeBlouse.addonPrice;
  const totalLookPrice = product.price + blouseAddonPrice;

  const previewSlot = product.images[activePleat.imageIndex] || product.images[0];
  const pairedBlouseProduct = activeBlouse.addonProductId
    ? PRODUCTS.find((p) => p.id === activeBlouse.addonProductId)
    : undefined;

  return (
    <ProductModalShell
      open={open}
      onClose={onClose}
      ariaLabel="Virtual Drape Studio"
      maxWidthClass="max-w-2xl"
      backdropClassName="bg-black/70"
      panelClassName="rounded-2xl bg-[#FAF9F6] p-4 sm:p-6 space-y-5 sm:space-y-6"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#E5E0D8] pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14532D] text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1C1917] truncate">
              Virtual Drape Studio
            </h3>
            <p className="text-xs text-[#57534E] truncate">Visual drape preview &amp; blouse pairing simulator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close drape studio"
          className="rounded p-1.5 text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] shrink-0 active:scale-95 transition-transform"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Studio Preview Canvas */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 items-center">
        <div className="relative aspect-[4/3] sm:aspect-[3/4] max-h-[38dvh] sm:max-h-none w-full overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-inner">
          <SafeImage
            src={previewSlot?.url}
            alt={previewSlot?.alt || product.name}
            className={`h-full w-full transition-all duration-300 ${activePleat.imageClass}`}
          />

          {/* Paired Blouse Inset Swatch */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#1C1917] backdrop-blur-xs shadow-xs">
              {previewSlot?.label || 'Draped View'}
            </span>

            <div className="flex items-center gap-1.5 rounded-full bg-white/95 pl-1.5 pr-2.5 py-1 shadow-sm backdrop-blur-xs border border-[#E5E0D8]">
              {pairedBlouseProduct ? (
                <SafeImage
                  src={pairedBlouseProduct.images[0]?.url}
                  alt={activeBlouse.label}
                  className="h-5 w-5 rounded-full object-cover shrink-0"
                />
              ) : (
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: activeBlouse.swatchColor }}
                />
              )}
              <span className="text-[10px] font-semibold text-[#1C1917] truncate max-w-[130px]">
                {blouseAddonPrice > 0 ? `+${formatINR(blouseAddonPrice)} Blouse` : 'Matching Blouse'}
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/70 px-3 py-2 text-white backdrop-blur-xs text-xs space-y-0.5">
            <p className="font-medium truncate">{product.name}</p>
            <p className="text-[11px] text-white/85 truncate">
              {activePleat.fullTitle} · {activeBlouse.label}
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Blouse Pairing Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              1. Select Blouse Pairing
            </label>
            <div className="space-y-2">
              {BLOUSE_PAIRINGS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedBlouse(item.id)}
                  className={`w-full rounded-lg border p-2.5 sm:p-3 text-left transition-colors flex items-center justify-between gap-2 text-xs active:scale-[0.99] ${
                    selectedBlouse === item.id
                      ? 'border-[#14532D] bg-[#14532D]/5 font-semibold text-[#14532D]'
                      : 'border-[#E5E0D8] bg-white text-[#1C1917] hover:border-[#57534E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: item.swatchColor }}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-[#1C1917]">{item.label}</p>
                      <p className="text-[11px] text-[#57534E]">{item.hint}</p>
                    </div>
                  </div>
                  {selectedBlouse === item.id && <Check className="h-4 w-4 text-[#14532D] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Drape Pallu Style Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              2. Drape Height &amp; Fall
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
              {PLEAT_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPleatStyle(s.id)}
                  className={`rounded-md border px-1.5 py-2 text-center leading-tight transition-colors active:scale-95 ${
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

      {/* Itemized Dynamic Pricing Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E5E0D8] pt-4">
        <div className="text-left w-full sm:w-auto space-y-0.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#57534E] tabular-nums">
            <span>Saree {formatINR(product.price)}</span>
            <span>+</span>
            <span>
              Paired Blouse{' '}
              {blouseAddonPrice > 0 ? formatINR(blouseAddonPrice) : 'Included'}
            </span>
          </div>
          <p className="text-xl font-bold text-[#1C1917] tabular-nums">
            {formatINR(totalLookPrice)}
          </p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none rounded-md border border-[#E5E0D8] bg-white px-5 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFE9] active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onAddToCart({
                pleatStyle,
                drapeLabel: activePleat.label,
                selectedBlouse,
                blouseLabel: activeBlouse.label,
                addonProductId: activeBlouse.addonProductId,
                blouseAddonPrice,
              });
              onClose();
            }}
            className="flex-1 sm:flex-none rounded-md bg-[#14532D] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22] active:scale-95 transition-all"
          >
            Add Drape to Bag · {formatINR(totalLookPrice)}
          </button>
        </div>
      </div>
    </ProductModalShell>
  );
}
