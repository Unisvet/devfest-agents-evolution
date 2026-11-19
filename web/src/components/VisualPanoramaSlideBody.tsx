import React from 'react';
import { Sparkles } from 'lucide-react';
import { SlideDefinition, SlidePanoramaEpoch } from '../types/presentation';

const EPOCH_ACCENT_STYLES: Record<
  SlidePanoramaEpoch['accent'],
  { border: string; activeBorder: string; badge: string; glow: string }
> = {
  amber: {
    border: 'border-amber-400/35 hover:border-amber-300/70',
    activeBorder: 'border-amber-300 bg-amber-950/55 shadow-[0_0_24px_rgba(251,191,36,0.28)]',
    badge: 'text-amber-300',
    glow: 'ring-amber-300/75',
  },
  cyan: {
    border: 'border-cyan-400/35 hover:border-cyan-300/70',
    activeBorder: 'border-cyan-300 bg-cyan-950/55 shadow-[0_0_24px_rgba(34,211,238,0.28)]',
    badge: 'text-cyan-300',
    glow: 'ring-cyan-300/75',
  },
  purple: {
    border: 'border-purple-400/35 hover:border-purple-300/70',
    activeBorder: 'border-purple-300 bg-purple-950/55 shadow-[0_0_24px_rgba(192,132,252,0.28)]',
    badge: 'text-purple-300',
    glow: 'ring-purple-300/75',
  },
  emerald: {
    border: 'border-emerald-400/40 hover:border-emerald-300/75',
    activeBorder: 'border-emerald-300 bg-emerald-950/55 shadow-[0_0_24px_rgba(52,211,153,0.3)]',
    badge: 'text-emerald-300',
    glow: 'ring-emerald-300/80',
  },
};

/**
 * Full-width panoramic image slide layout with aligned epoch overlays and a
 * full-width Core Architectural Thesis callout bar, shared between live stage
 * presentation and 16:9 organizer PDF export.
 */
export const VisualPanoramaSlideBody: React.FC<{
  slide: SlideDefinition;
  activeEpochIdx?: number | null;
  onSelectEpoch?: (idx: number | null) => void;
  staticPrint?: boolean;
}> = ({ slide, activeEpochIdx = null, onSelectEpoch, staticPrint = false }) => {
  const epochs = slide.panoramaEpochs ?? [];
  const gridColsClass =
    epochs.length === 5
      ? staticPrint
        ? 'grid-cols-5'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
      : staticPrint
        ? 'grid-cols-4'
        : 'grid-cols-2 lg:grid-cols-4';

  const hasSpotlight = !staticPrint && activeEpochIdx !== null && activeEpochIdx >= 0 && activeEpochIdx < epochs.length;

  return (
    <div className={`w-full flex-1 flex flex-col min-h-0 ${staticPrint ? 'gap-3 py-2' : 'gap-3.5 xl:gap-4'}`}>
      {/* Full-Width Panoramic Artwork Stage */}
      <div
        className={`relative w-full flex-1 rounded-2xl overflow-hidden border border-white/15 bg-[#050814] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-end ${
          staticPrint ? 'min-h-0' : 'min-h-[360px] lg:min-h-[400px]'
        }`}
      >
        {slide.illustration && (
          <img
            src={slide.illustration.src}
            alt={slide.illustration.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Interactive Column Spotlight Mask (Live Presentation Only) */}
        {hasSpotlight && epochs.length > 0 && (
          <div
            className={`pointer-events-none hidden lg:grid absolute inset-0 z-10 ${
              epochs.length === 5 ? 'grid-cols-5' : 'grid-cols-4'
            }`}
          >
            {epochs.map((ep, idx) => {
              const isSelected = idx === activeEpochIdx;
              const style = EPOCH_ACCENT_STYLES[ep.accent];
              return (
                <div
                  key={ep.step}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? `bg-transparent ring-2 ring-inset ${style.glow}`
                      : 'bg-[#040711]/65 backdrop-blur-[1px]'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Bottom Gradient Scrim for Crisp Projector Contrast */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#040711]/95 via-[#040711]/65 to-transparent z-10" />

        {/* Aligned Epoch Strip Anchored Directly Under Each Visual Panel */}
        {epochs.length > 0 && (
          <div
            className={`relative z-20 grid ${gridColsClass} ${
              staticPrint ? 'gap-2.5 p-3' : 'gap-2.5 xl:gap-3.5 p-3.5 sm:p-4 xl:p-5'
            }`}
          >
            {epochs.map((ep, idx) => {
              const style = EPOCH_ACCENT_STYLES[ep.accent];
              const isSelected = hasSpotlight && idx === activeEpochIdx;
              const isDimmed = hasSpotlight && idx !== activeEpochIdx;

              const cardClasses = `text-left rounded-xl backdrop-blur-md border transition-all duration-200 ${
                staticPrint ? 'px-3 py-2.5 bg-[#060a16]/85' : 'px-3.5 py-3 xl:px-4 xl:py-3.5 bg-[#060a16]/80'
              } ${isSelected ? style.activeBorder : style.border} ${
                isDimmed ? 'opacity-55 hover:opacity-95' : 'opacity-100'
              }`;

              const content = (
                <>
                  <div className="flex items-center justify-between gap-2 font-mono mb-1">
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        staticPrint ? 'text-xs' : 'text-sm xl:text-base'
                      } ${style.badge}`}
                    >
                      {ep.step}
                    </span>
                    <span
                      className={`text-slate-300 truncate ${
                        staticPrint ? 'text-xs' : 'text-xs sm:text-sm xl:text-[15px]'
                      }`}
                    >
                      {ep.era}
                    </span>
                  </div>
                  <div
                    className={`font-extrabold text-white leading-tight ${
                      staticPrint
                        ? 'text-[17px]'
                        : 'text-base sm:text-lg xl:text-[1.32rem] 2xl:text-[1.48rem]'
                    }`}
                  >
                    {ep.label}
                  </div>
                  <p
                    className={`text-slate-100 leading-snug mt-1 ${
                      staticPrint
                        ? 'text-[13.5px]'
                        : 'text-sm sm:text-[15px] xl:text-[1.04rem] 2xl:text-[1.14rem]'
                    }`}
                  >
                    {ep.insight}
                  </p>
                </>
              );

              if (staticPrint) {
                return (
                  <div key={ep.step} className={cardClasses}>
                    {content}
                  </div>
                );
              }

              return (
                <button
                  key={ep.step}
                  type="button"
                  onClick={() => onSelectEpoch?.(isSelected ? null : idx)}
                  className={`${cardClasses} cursor-pointer`}
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Width Core Architectural Thesis Footer Bar */}
      <div
        className={`shrink-0 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-950/95 to-cyan-950/30 border border-cyan-500/40 shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 ${
          staticPrint ? 'px-5 py-3' : 'px-5 py-3.5 xl:px-6 xl:py-4'
        }`}
      >
        <div className="min-w-0">
          <div
            className={`font-mono font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-2 mb-1 ${
              staticPrint ? 'text-xs' : 'text-sm xl:text-base'
            }`}
          >
            <Sparkles className={staticPrint ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />
            Core Architectural Thesis
          </div>
          <p
            className={`whitespace-pre-line font-normal text-slate-50 leading-snug ${
              staticPrint
                ? 'text-[18px]'
                : 'text-lg sm:text-xl lg:text-[1.32rem] xl:text-[1.48rem] 2xl:text-[1.62rem]'
            }`}
          >
            {slide.keyTakeaway}
          </p>
        </div>

        {!staticPrint && epochs.length > 0 && (
          <div className="shrink-0 hidden xl:flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 font-mono text-sm text-slate-200">
              {hasSpotlight
                ? 'Click era or press 0 to show all'
                : `Click era or press 1–${epochs.length} to spotlight`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
