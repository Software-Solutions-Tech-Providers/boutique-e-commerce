import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Product } from '../types/store';

interface ProductDrapeReelProps {
  product: Product;
  variant?: 'card' | 'detail';
  autoPlay?: boolean;
  onNavigateProduct?: () => void;
  formattedPrice?: string;
}

const SCENE_DURATION_MS = 4000;
const TICK_MS = 100;

const isExternalProductVideo = (url?: string): url is string => {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  if (!clean) return false;
  // Never play generic unrelated demo clips (e.g., flower show)
  if (clean.includes('flower.mp4') || clean.includes('interactive-examples.mdn.mozilla.net')) {
    return false;
  }
  return true;
};

export const ProductDrapeReel: React.FC<ProductDrapeReelProps> = ({
  product,
  variant = 'detail',
  autoPlay = false,
  onNavigateProduct,
  formattedPrice,
}) => {
  const hasCustomVideo = isExternalProductVideo(product.videoUrl);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const scenes = useMemo(() => {
    const imgs = product.images.length > 0 ? product.images : [''];
    return [
      {
        label: 'Full Drape',
        detail: `${product.fabricType} · ${product.weaveOrigin.split(',')[0]}`,
        image: imgs[0],
        transformStart: 'scale(1.02) translate3d(0%, 0%, 0)',
        transformEnd: 'scale(1.14) translate3d(-2%, -1.5%, 0)',
        origin: 'center center',
      },
      {
        label: 'Pallu & Border',
        detail: product.subtitle,
        image: imgs[1] || imgs[0],
        transformStart: 'scale(1.16) translate3d(2%, 1%, 0)',
        transformEnd: 'scale(1.28) translate3d(-2.5%, -2%, 0)',
        origin: 'center 35%',
      },
      {
        label: 'Weave Macro',
        detail: product.materialComposition,
        image: imgs[2] || imgs[1] || imgs[0],
        transformStart: 'scale(1.32) translate3d(-1.5%, 1.5%, 0)',
        transformEnd: 'scale(1.46) translate3d(2%, -1.5%, 0)',
        origin: 'center 65%',
      },
    ];
  }, [product]);

  const totalDurationMs = scenes.length * SCENE_DURATION_MS;

  // Reset playback state when switching products
  useEffect(() => {
    setElapsedMs(0);
    setPlaying(autoPlay);
    setVideoFailed(false);
  }, [product.id, autoPlay]);

  // Advance motion lookbook timer when playing synthetic drape reel
  useEffect(() => {
    if ((hasCustomVideo && !videoFailed) || !playing) return;
    const timer = window.setInterval(() => {
      setElapsedMs((prev) => (prev + TICK_MS) % totalDurationMs);
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [hasCustomVideo, videoFailed, playing, totalDurationMs]);

  const activeSceneIdx = Math.min(
    scenes.length - 1,
    Math.floor(elapsedMs / SCENE_DURATION_MS)
  );
  const sceneProgress = (elapsedMs % SCENE_DURATION_MS) / SCENE_DURATION_MS;

  const formatSeconds = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    return `00:${String(sec).padStart(2, '0')}`;
  };

  const toggleCustomVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setVideoFailed(true));
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  };

  // Case 1: Product has a genuine custom uploaded/admin video URL
  if (hasCustomVideo && !videoFailed) {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={product.videoUrl}
          poster={product.images[0]}
          muted={muted}
          loop
          playsInline
          autoPlay={autoPlay}
          controls={variant === 'detail'}
          preload="metadata"
          onError={() => setVideoFailed(true)}
          onClick={variant === 'card' ? toggleCustomVideoPlay : undefined}
          className="w-full h-full object-cover cursor-pointer"
        />

        {variant === 'card' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                className="w-8 h-8 rounded-full bg-black/55 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-xs cursor-pointer"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCustomVideoPlay();
                }}
                aria-label={playing ? 'Pause drape video' : 'Play drape video'}
                className="w-8 h-8 rounded-full bg-white/90 text-[#141416] hover:bg-white flex items-center justify-center shadow-sm cursor-pointer"
              >
                {playing ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 ml-0.5" />
                )}
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-neutral-300">
                {product.fabricType} · {product.weaveOrigin.split(',')[0]}
              </p>
              {onNavigateProduct ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateProduct();
                  }}
                  className="text-left block w-full cursor-pointer"
                >
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2 hover:underline font-sans">
                    {product.name}
                  </h3>
                </button>
              ) : (
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 font-sans">
                  {product.name}
                </h3>
              )}
              {formattedPrice && (
                <p className="text-sm font-semibold tabular-nums pt-0.5">{formattedPrice}</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Case 2: Product-Specific Drape Lookbook Motion Video (built strictly from this product's own weave photos)
  const currentScene = scenes[activeSceneIdx];

  return (
    <div
      onClick={() => setPlaying((p) => !p)}
      className="relative w-full h-full bg-neutral-950 overflow-hidden select-none cursor-pointer group"
      role="region"
      aria-label={`${product.name} drape reel`}
    >
      {scenes.map((scene, idx) => {
        const isActive = idx === activeSceneIdx;
        return (
          <img
            key={`${product.id}-scene-${idx}`}
            src={scene.image}
            alt={`${product.name} — ${scene.label}`}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              transformOrigin: scene.origin,
              transform: isActive && playing ? scene.transformEnd : scene.transformStart,
              transition: isActive
                ? 'opacity 700ms ease, transform 4200ms cubic-bezier(0.22, 1, 0.36, 1)'
                : 'opacity 700ms ease',
            }}
          />
        );
      })}

      {/* Specular Silk Sheen Sweep during active drape playback */}
      {playing && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"
        />
      )}

      {/* Measured Contrast Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />

      {/* Top Controls: Scene Progress Segments + Play/Pause/Restart */}
      <div className="absolute top-3 inset-x-3 flex flex-col gap-2 z-10">
        <div className="grid grid-cols-3 gap-1.5" onClick={(e) => e.stopPropagation()}>
          {scenes.map((scene, idx) => {
            const fillPercent =
              idx < activeSceneIdx
                ? 100
                : idx === activeSceneIdx
                ? Math.round(sceneProgress * 100)
                : 0;
            return (
              <button
                key={scene.label}
                type="button"
                onClick={() => {
                  setElapsedMs(idx * SCENE_DURATION_MS);
                  setPlaying(true);
                }}
                aria-label={`Jump to ${scene.label}`}
                className="group/bar py-1 cursor-pointer text-left"
              >
                <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E5C98B] transition-all duration-100"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] text-white">
          <span className="px-2 py-0.5 rounded bg-black/55 backdrop-blur-xs font-medium tracking-wide truncate">
            {currentScene.label} · {formatSeconds(elapsedMs)} / {formatSeconds(totalDurationMs)}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setElapsedMs(0);
                setPlaying(true);
              }}
              aria-label="Replay drape reel"
              className="w-7 h-7 rounded-full bg-black/55 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-xs cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPlaying((p) => !p);
              }}
              aria-label={playing ? 'Pause drape reel' : 'Play drape reel'}
              className="w-8 h-8 rounded-full bg-white/95 text-[#141416] hover:bg-white flex items-center justify-center shadow-sm cursor-pointer"
            >
              {playing ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Product Info Overlay */}
      {variant === 'card' ? (
        <div className="absolute inset-x-0 bottom-0 p-4 text-white space-y-1 z-10">
          <p className="text-[11px] uppercase tracking-wider text-neutral-300 truncate">
            {currentScene.detail}
          </p>
          {onNavigateProduct ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateProduct();
              }}
              className="text-left block w-full cursor-pointer"
            >
              <h3 className="text-sm font-semibold leading-snug line-clamp-2 hover:underline font-sans">
                {product.name}
              </h3>
            </button>
          ) : (
            <h3 className="text-sm font-semibold leading-snug line-clamp-2 font-sans">
              {product.name}
            </h3>
          )}
          {formattedPrice && (
            <p className="text-sm font-semibold tabular-nums pt-0.5">{formattedPrice}</p>
          )}
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white flex flex-wrap items-end justify-between gap-2 z-10">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-[#E5C98B] font-medium">
              Product Drape Lookbook · Scene {activeSceneIdx + 1}/3
            </p>
            <p className="text-xs sm:text-sm font-medium text-neutral-100 truncate mt-0.5">
              {currentScene.detail}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {scenes.map((scene, idx) => (
              <button
                key={`pill-${scene.label}`}
                type="button"
                onClick={() => {
                  setElapsedMs(idx * SCENE_DURATION_MS);
                  setPlaying(true);
                }}
                className={`px-2 py-1 text-[11px] rounded cursor-pointer transition-colors ${
                  idx === activeSceneIdx
                    ? 'bg-white text-[#141416] font-semibold'
                    : 'bg-black/55 text-neutral-200 hover:bg-black/75'
                }`}
              >
                {scene.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
