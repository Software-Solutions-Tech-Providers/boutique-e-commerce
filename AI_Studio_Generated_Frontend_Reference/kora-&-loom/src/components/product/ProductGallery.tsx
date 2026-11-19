import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { ProductImageSlot } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface ProductGalleryProps {
  productName: string;
  images: ProductImageSlot[];
  hasVideoPreview: boolean;
  videoCaption: string;
}

export function ProductGallery({ productName, images, hasVideoPreview, videoCaption }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const activeSlot = images[activeIndex] || images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-[#E5E0D8] bg-[#F2EFE9]">
        <SafeImage
          src={activeSlot.url}
          alt={activeSlot.alt}
          fallbackTitle={productName}
          className="h-full w-full object-cover"
        />

        <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-xs font-medium text-[#1C1917]">
          {activeSlot.label}
        </span>

        {hasVideoPreview && (
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-[#1C1917]/90 px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1C1917] transition-colors cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Watch Drape Video</span>
          </button>
        )}
      </div>

      {/* 4 Purposeful Thumbnails: Showcase, In Use, Scale, Detail */}
      <div className="grid grid-cols-4 gap-2.5">
        {images.slice(0, 4).map((slot, idx) => (
          <button
            key={slot.label}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`group flex flex-col overflow-hidden rounded-md border text-left transition-colors cursor-pointer ${
              idx === activeIndex ? 'border-[#14532D] ring-1 ring-[#14532D]' : 'border-[#E5E0D8] hover:border-[#57534E]'
            }`}
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9]">
              <SafeImage src={slot.url} alt={slot.alt} className="h-full w-full object-cover" />
            </div>
            <span className="truncate px-1.5 py-1 text-[11px] font-medium text-[#57534E] group-hover:text-[#1C1917]">
              {slot.label}
            </span>
          </button>
        ))}
      </div>

      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] px-4 py-3">
              <div>
                <p className="font-display text-lg font-semibold text-[#1C1917]">{productName}</p>
                <p className="text-xs text-[#57534E]">{videoCaption}</p>
              </div>
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                aria-label="Close drape preview"
                className="rounded p-1.5 text-[#57534E] hover:bg-[#F2EFE9]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-[#1C1917] overflow-hidden">
              <SafeImage
                src={images[1]?.url || images[0].url}
                alt={videoCaption}
                className="h-full w-full object-cover opacity-90 scale-105 transition-transform duration-[4000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <p className="text-xs uppercase tracking-wider text-white/80">Natural Daylight Loom Walkthrough</p>
                <p className="mt-1 text-sm font-medium">{videoCaption}</p>
                <div className="mt-3 h-1 w-full rounded-full bg-white/30 overflow-hidden">
                  <div className="h-full w-2/3 bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
