import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from 'lucide-react';
import { ProductImageSlot } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { ProductModalShell } from './ProductModalShell';

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
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
    setSlideDir('next');
    setAutoSlideEnabled(true);
    setZoomOpen(false);
    setVideoOpen(false);
  }, [images]);

  // Auto-slide media initially; permanently stops once the user interacts with gallery/video controls
  useEffect(() => {
    if (!autoSlideEnabled || zoomOpen || videoOpen || images.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setSlideDir('next');
      setActiveIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => window.clearInterval(timer);
  }, [autoSlideEnabled, zoomOpen, videoOpen, images.length]);

  const safeIndex = activeIndex < images.length ? activeIndex : 0;
  const activeSlot = images[safeIndex] || images[0];

  // Only the draped-in-use slot carries the video walkthrough (not every product photo)
  const videoSlotIndex = images.findIndex((img) => img.label === 'Draped in Use');
  const isVideoSlot = hasVideoPreview && (videoSlotIndex >= 0 ? safeIndex === videoSlotIndex : safeIndex === 0);

  const handlePrev = () => {
    setAutoSlideEnabled(false);
    setSlideDir('prev');
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setAutoSlideEnabled(false);
    setSlideDir('next');
    setActiveIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectIndex = (idx: number) => {
    setAutoSlideEnabled(false);
    setSlideDir(idx >= safeIndex ? 'next' : 'prev');
    setActiveIndex(idx);
  };

  const handleOpenZoom = () => {
    setAutoSlideEnabled(false);
    setZoomOpen(true);
  };

  const handleOpenVideo = () => {
    setAutoSlideEnabled(false);
    setVideoOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) handleNext();
    else handlePrev();
  };

  return (
    <div className="space-y-2.5">
      {/* Main Image Frame: fits mobile portraits cleanly & caps height on short-viewport laptops */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-[#E5E0D8] bg-[#F2EFE9] group select-none touch-pan-y lg:aspect-auto lg:h-[min(66dvh,37rem)] xl:h-[min(70dvh,41rem)]"
      >
        <div key={safeIndex} data-dir={slideDir} className="h-full w-full kl-gallery-swap">
          <SafeImage
            src={activeSlot.url}
            alt={activeSlot.alt}
            fallbackTitle={productName}
            className="h-full w-full object-cover kl-gallery-zoom"
          />
        </div>

        {/* Top-Left Sale Badge */}
        {salePercent > 0 && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#E11D48] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white rounded-xs shadow-sm">
            Sale {salePercent}%
          </div>
        )}

        {/* Top-Right Purpose Slot Label */}
        <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 max-w-[55%] truncate bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-[#1C1917] rounded shadow-xs">
          {activeSlot.label}
        </span>

        {/* Bottom Overlay Bar */}
        <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenZoom}
              aria-label="Expand image fullscreen"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1C1917] shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {isVideoSlot && (
              <button
                type="button"
                onClick={handleOpenVideo}
                aria-label="Watch drape video"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#1C1917]/90 px-3 text-[11px] font-semibold text-white backdrop-blur-xs hover:bg-[#1C1917] active:scale-95 shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Play className="h-3 w-3 fill-white shrink-0" />
                <span className="sm:hidden">Video</span>
                <span className="hidden sm:inline">Drape Video</span>
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="flex h-9 w-9 items-center justify-center rounded border border-[#E5E0D8] bg-white/95 text-[#1C1917] shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="flex h-9 w-9 items-center justify-center rounded border border-[#E5E0D8] bg-white/95 text-[#1C1917] shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous media"
            className="flex h-9 w-7 shrink-0 items-center justify-center rounded text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            className={
              images.length <= 4
                ? 'grid flex-1 grid-cols-4 gap-2'
                : 'flex flex-1 gap-2 overflow-x-auto snap-x no-scrollbar'
            }
          >
            {images.map((slot, idx) => {
              const isActive = idx === safeIndex;
              const slotIsVideo = hasVideoPreview && (videoSlotIndex >= 0 ? idx === videoSlotIndex : idx === 0);

              return (
                <button
                  key={`${slot.label}-${idx}`}
                  type="button"
                  onClick={() => handleSelectIndex(idx)}
                  className={`relative aspect-[3/4] overflow-hidden rounded-md border text-left transition-all cursor-pointer ${
                    images.length > 4 ? 'w-16 sm:w-20 shrink-0 snap-start' : 'w-full'
                  } ${
                    isActive
                      ? 'border-[#14532D] ring-2 ring-[#14532D] shadow-xs'
                      : 'border-[#E5E0D8] opacity-75 hover:opacity-100 hover:border-[#57534E]'
                  }`}
                >
                  <SafeImage src={slot.url} alt={slot.alt} className="h-full w-full object-cover" />
                  {slotIsVideo && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-white"
                    >
                      <Play className="h-2.5 w-2.5 fill-white ml-0.5" />
                    </span>
                  )}
                  <span className="sr-only">{slot.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next media"
            className="flex h-9 w-7 shrink-0 items-center justify-center rounded text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#1C1917] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Fullscreen Vertical Mobile / Centered Desktop Zoom Modal */}
      <ProductModalShell
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        ariaLabel="High-definition saree weave inspector"
        maxWidthClass="max-w-4xl"
        backdropClassName="bg-black/95 sm:bg-black/90"
        panelClassName="bg-[#1C1917] sm:bg-white p-0 flex flex-col overflow-hidden"
        fullScreenOnMobile
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/15 sm:border-[#E5E0D8] px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:py-3 bg-[#1C1917] sm:bg-[#FAF9F6] text-white sm:text-[#1C1917] shrink-0">
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold truncate">{productName}</p>
            <p className="text-xs text-white/70 sm:text-[#57534E] truncate">
              {activeSlot.label} · High-Definition Weave Inspector
            </p>
          </div>
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Close zoomed view"
            className="rounded p-2 text-white/80 hover:bg-white/10 sm:text-[#57534E] sm:hover:bg-[#F2EFE9] sm:hover:text-[#1C1917] shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 min-h-0 w-full overflow-hidden bg-[#1C1917] sm:bg-[#1C1917]/5 p-0 sm:p-4 flex items-center justify-center touch-pan-y"
        >
          <div key={safeIndex} data-dir={slideDir} className="h-full w-full flex items-center justify-center kl-gallery-swap">
            <SafeImage
              src={activeSlot.url}
              alt={activeSlot.alt}
              className="h-full w-full object-contain sm:h-auto sm:max-h-[74dvh] sm:w-auto cursor-zoom-out"
              onClick={() => setZoomOpen(false)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:py-2.5 border-t border-white/15 sm:border-[#E5E0D8] text-xs text-white/80 sm:text-[#57534E] bg-[#1C1917] sm:bg-white shrink-0">
          <span className="tabular-nums">
            Photo {safeIndex + 1} of {images.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="rounded border border-white/25 sm:border-[#E5E0D8] px-3 py-1.5 hover:bg-white/10 sm:hover:bg-[#F2EFE9] active:scale-95 transition-all"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded border border-white/25 sm:border-[#E5E0D8] px-3 py-1.5 hover:bg-white/10 sm:hover:bg-[#F2EFE9] active:scale-95 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </ProductModalShell>

      {/* Video Drape Modal */}
      <ProductModalShell
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        ariaLabel="Drape walkthrough preview"
        maxWidthClass="max-w-xl"
        backdropClassName="bg-black/80"
        panelClassName="bg-white p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#E5E0D8] px-4 py-3 bg-[#FAF9F6]">
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold text-[#1C1917] truncate">{productName}</p>
            <p className="text-xs text-[#57534E] truncate">{videoCaption}</p>
          </div>
          <button
            type="button"
            onClick={() => setVideoOpen(false)}
            aria-label="Close drape preview"
            className="rounded p-2 text-[#57534E] hover:bg-[#F2EFE9] shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative aspect-[3/4] sm:aspect-video max-h-[65dvh] sm:max-h-none bg-[#1C1917] overflow-hidden">
          <SafeImage
            src={(videoSlotIndex >= 0 ? images[videoSlotIndex]?.url : images[0]?.url) || images[0].url}
            alt={videoCaption}
            className="h-full w-full object-cover opacity-90 scale-105 transition-transform duration-[4000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
            <p className="text-[11px] sm:text-xs uppercase tracking-wider text-white/80">
              Natural Daylight Drape Walkthrough
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium">{videoCaption}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                <div className="h-full w-3/4 bg-white" />
              </div>
              <span className="text-[10px] text-white/80 tabular-nums">0:18</span>
            </div>
          </div>
        </div>
      </ProductModalShell>
    </div>
  );
}
