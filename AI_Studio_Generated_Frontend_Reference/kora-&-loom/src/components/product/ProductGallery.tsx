import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from 'lucide-react';
import { ProductImageSlot } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface ProductGalleryProps {
  productName: string;
  images: ProductImageSlot[];
  hasVideoPreview?: boolean;
  videoCaption?: string;
  salePercent?: number;
}

export function ProductGallery({
  productName,
  images,
  hasVideoPreview = true,
  videoCaption = '18-sec Natural Daylight Loom & Drape Fall Walkthrough',
  salePercent = 12,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const activeSlot = images[activeIndex] || images[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Frame matching Screenshot 7 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-[#E5E0D8] bg-[#F2EFE9] group select-none">
        <SafeImage
          src={activeSlot.url}
          alt={activeSlot.alt}
          fallbackTitle={productName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Top-Left Sale Badge */}
        {salePercent > 0 && (
          <div className="absolute top-3 left-3 bg-[#E11D48] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white rounded-xs shadow-sm">
            Sale {salePercent}%
          </div>
        )}

        {/* Top-Right Purpose Slot Label */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-[#1C1917] rounded shadow-xs">
          {activeSlot.label}
        </span>

        {/* Bottom-Left Zoom Icon Button */}
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="Zoom saree weave detail"
          className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1C1917] shadow-md hover:bg-white transition-all cursor-pointer"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Video Drape Pill Button */}
        {hasVideoPreview && (
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            aria-label="Watch drape video"
            className="absolute bottom-3 left-14 inline-flex items-center gap-1.5 rounded-full bg-[#1C1917]/90 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xs hover:bg-[#1C1917] shadow-md transition-all cursor-pointer"
          >
            <Play className="h-3 w-3 fill-white" />
            <span className="hidden sm:inline">Drape Video</span>
          </button>
        )}

        {/* Bottom-Right Prev & Next Navigation Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E0D8] bg-white/95 text-[#1C1917] shadow-sm hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E0D8] bg-white/95 text-[#1C1917] shadow-sm hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Thumbnails Row with Left/Right Arrows matching Screenshot 7 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Scroll thumbnails left"
          className="flex h-8 w-6 shrink-0 items-center justify-center rounded text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="grid flex-1 grid-cols-4 gap-2">
          {images.map((slot, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${slot.label}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[3/4] w-full overflow-hidden rounded-md border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#14532D] ring-2 ring-[#14532D] shadow-xs'
                    : 'border-[#E5E0D8] opacity-75 hover:opacity-100 hover:border-[#57534E]'
                }`}
              >
                <SafeImage src={slot.url} alt={slot.alt} className="h-full w-full object-cover" />
                <span className="sr-only">{slot.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Scroll thumbnails right"
          className="flex h-8 w-6 shrink-0 items-center justify-center rounded text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Fullscreen High-Resolution Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xs">
          <div className="relative max-h-[92vh] max-w-4xl w-full overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] px-4 py-3 bg-[#FAF9F6]">
              <div>
                <p className="font-display text-lg font-semibold text-[#1C1917]">{productName}</p>
                <p className="text-xs text-[#57534E]">{activeSlot.label} · High-Definition Weave Inspector</p>
              </div>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="Close zoomed view"
                className="rounded p-1.5 text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1 overflow-auto p-2 bg-[#1C1917]/5 flex items-center justify-center min-h-[400px]">
              <SafeImage
                src={activeSlot.url}
                alt={activeSlot.alt}
                className="max-h-[75vh] w-auto object-contain cursor-zoom-out"
                onClick={() => setZoomOpen(false)}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E5E0D8] text-xs text-[#57534E] bg-white">
              <span>Photo {activeIndex + 1} of {images.length}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="rounded border border-[#E5E0D8] px-3 py-1 hover:bg-[#F2EFE9]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded border border-[#E5E0D8] px-3 py-1 hover:bg-[#F2EFE9]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Drape Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] px-4 py-3 bg-[#FAF9F6]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <p className="text-xs uppercase tracking-wider text-white/80">Natural Daylight Drape Walkthrough</p>
                <p className="mt-1 text-sm font-medium">{videoCaption}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                    <div className="h-full w-3/4 bg-white" />
                  </div>
                  <span className="text-[10px] text-white/80 tabular-nums">0:18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
