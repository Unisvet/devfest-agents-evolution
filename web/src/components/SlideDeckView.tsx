import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Cpu,
  ExternalLink,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  LayoutGrid,
  Maximize2,
  Minimize2,
  PanelTop,
  PanelTopClose,
  Printer,
  QrCode,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { SLIDES_DATA } from '../data/slidesData';
import { DemoExecutionMode, NavView } from '../types/presentation';
import { soundEngine } from '../utils/soundEngine';
import { FormattedText, stripMarkdownLinks } from './FormattedText';
import { SlideWidgetRenderer } from './SlideWidgetRenderer';
import { VisualPanoramaSlideBody } from './VisualPanoramaSlideBody';

// Optional local-only presenter cues loaded exclusively when gitignored
// `web/src/data/speakerNotes.local.ts` exists on the presenter's machine.
// On GitHub / GitHub Pages CI builds this resolves to `{}` with zero notes bundled.
const localNotesModules = import.meta.glob<{ LOCAL_SPEAKER_NOTES?: Record<string, string> }>(
  '../data/speakerNotes.local.ts',
  { eager: true }
);
const LOCAL_NOTES: Record<string, string> =
  Object.values(localNotesModules)[0]?.LOCAL_SPEAKER_NOTES ?? {};
const HAS_LOCAL_NOTES = Object.keys(LOCAL_NOTES).length > 0;

function getInitialSlideIndex(total: number): number {
  if (typeof window === 'undefined') return 0;
  const raw = window.location.hash.replace(/^#/, '').trim();
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= total) {
    return parsed - 1;
  }
  return 0;
}

function parseBulletKicker(bullet: string): { kicker: string | null; body: string } {
  const colonIdx = bullet.indexOf(': ');
  if (colonIdx > 0 && colonIdx <= 48) {
    return {
      kicker: bullet.slice(0, colonIdx),
      body: bullet.slice(colonIdx + 2),
    };
  }
  return { kicker: null, body: bullet };
}

export const SlideDeckView: React.FC<{
  demoMode: DemoExecutionMode;
  onToggleDemoMode: () => void;
  onOpenPdfView: () => void;
  onSelectView: (v: NavView) => void;
  cinemaMode: boolean;
  onToggleCinemaMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}> = ({
  demoMode,
  onToggleDemoMode,
  onOpenPdfView,
  onSelectView,
  cinemaMode,
  onToggleCinemaMode,
  soundEnabled,
  onToggleSound,
}) => {
  const total = SLIDES_DATA.length;
  const [slideIdx, setSlideIdx] = useState<number>(() => getInitialSlideIndex(total));
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [showOverview, setShowOverview] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [mediaTab, setMediaTab] = useState<'widget' | 'illustration'>('widget');
  const [activeEpochIdx, setActiveEpochIdx] = useState<number | null>(null);
  const [oscIdle, setOscIdle] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const idleTimerRef = useRef<number | null>(null);

  const slide = SLIDES_DATA[slideIdx];
  const progressPct = ((slideIdx + 1) / total) * 100;

  // Sync URL #1 .. #N hash like Marp / Bespoke decks
  useEffect(() => {
    const targetHash = `#${slideIdx + 1}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [slideIdx]);

  useEffect(() => {
    setActiveEpochIdx(null);
    setShowQrModal(false);
  }, [slideIdx]);

  // Play the Lyria 3.5 orchestral overture on Slide 1 whenever Stage Audio Cues are enabled
  useEffect(() => {
    if (soundEnabled && slideIdx === 0) {
      soundEngine.startSlide1Overture();
    } else {
      soundEngine.stopSlide1Overture();
    }
    return () => {
      soundEngine.stopSlide1Overture();
    };
  }, [soundEnabled, slideIdx]);

  useEffect(() => {
    const onHashChange = () => {
      const idx = getInitialSlideIndex(total);
      setSlideIdx(idx);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [total]);

  // Reset media tab to illustration if a slide has one & widget isn't a live demo / closing blueprint
  useEffect(() => {
    if (
      slide.illustration &&
      !slide.widget.startsWith('demo-') &&
      slide.widget !== 'closing-blueprint'
    ) {
      setMediaTab('illustration');
    } else {
      setMediaTab('widget');
    }
  }, [slideIdx, slide.illustration, slide.widget]);

  // Auto-fade floating OSC bar after inactivity in Cinema/Fullscreen mode
  const wakeOsc = useCallback(() => {
    setOscIdle(false);
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    if (cinemaMode) {
      idleTimerRef.current = window.setTimeout(() => {
        setOscIdle(true);
      }, 3200);
    }
  }, [cinemaMode]);

  useEffect(() => {
    wakeOsc();
    window.addEventListener('mousemove', wakeOsc);
    window.addEventListener('keydown', wakeOsc);
    return () => {
      window.removeEventListener('mousemove', wakeOsc);
      window.removeEventListener('keydown', wakeOsc);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [wakeOsc]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const goNext = useCallback(() => {
    setSlideIdx((prev) => {
      if (prev < total - 1) {
        soundEngine.playSlideTransition('next');
        return prev + 1;
      }
      return prev;
    });
  }, [total]);

  const goPrev = useCallback(() => {
    setSlideIdx((prev) => {
      if (prev > 0) {
        soundEngine.playSlideTransition('prev');
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName)) {
        if (e.key === 'Escape') {
          if (showQrModal) setShowQrModal(false);
          else if (showOverview) setShowOverview(false);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (showQrModal) setShowQrModal(false);
        else if (showOverview) setShowOverview(false);
        else if (showNotes) setShowNotes(false);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key.toLowerCase() === 'q' && slide.number === 1) {
        setShowQrModal((s) => !s);
      } else if (e.key.toLowerCase() === 'n' && HAS_LOCAL_NOTES) {
        setShowNotes((s) => !s);
      } else if (e.key.toLowerCase() === 'o' || e.key.toLowerCase() === 'g') {
        setShowOverview((s) => !s);
      } else if (e.key.toLowerCase() === 'i' && slide.illustration && slide.layout !== 'visual-panorama') {
        setMediaTab((t) => (t === 'illustration' ? 'widget' : 'illustration'));
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (slide.layout === 'visual-panorama' && slide.panoramaEpochs) {
        if (e.key === '0') {
          setActiveEpochIdx(null);
        } else if (/^[1-9]$/.test(e.key)) {
          const idx = Number.parseInt(e.key, 10) - 1;
          if (idx < slide.panoramaEpochs.length) {
            setActiveEpochIdx((prev) => (prev === idx ? null : idx));
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, showNotes, showOverview, showQrModal, slide.illustration, slide.layout, slide.number, slide.panoramaEpochs, toggleFullscreen]);

  const metricBadgeStyle = (accent: 'cyan' | 'emerald' | 'purple' | 'amber') => {
    switch (accent) {
      case 'cyan':
        return 'border-cyan-500/35 bg-cyan-950/25 text-cyan-200';
      case 'emerald':
        return 'border-emerald-500/35 bg-emerald-950/25 text-emerald-200';
      case 'purple':
        return 'border-purple-500/35 bg-purple-950/25 text-purple-200';
      case 'amber':
        return 'border-amber-500/35 bg-amber-950/25 text-amber-200';
    }
  };

  const kickerColorClass = (idx: number) => {
    if (idx === 0) return 'text-cyan-300';
    if (idx === 1) return 'text-amber-300';
    if (idx === 2) return 'text-emerald-300';
    return 'text-purple-300';
  };

  const narrativeChars =
    stripMarkdownLinks(slide.keyTakeaway).length +
    slide.bullets.reduce((acc, b) => acc + stripMarkdownLinks(b).length, 0);
  const isConciseSlide = narrativeChars < 530 && slide.bullets.length <= 3;
  const isDenseSlide = slide.bullets.length >= 4 || narrativeChars > 660;

  return (
    <div
      className={`relative w-full flex-1 flex flex-col justify-between overflow-x-hidden ${
        cinemaMode ? 'min-h-screen' : 'min-h-[calc(100vh-3.25rem)]'
      }`}
    >
      {/* Top 4px Full-Screen-Width Progress Bar */}
      <div className="h-[4px] w-full bg-slate-900/90 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(34,211,238,0.65)]"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Full-Screen-Width 16:9 Stage Section */}
      <section className="relative w-full flex-1 flex flex-col justify-between px-6 sm:px-8 lg:px-12 xl:px-14 pt-3 pb-12">
        {/* Full-Width Slide Header (100% width across both columns, inspired by wbh-sre-deck) */}
        <header className="w-full border-b border-slate-700/45 pb-2.5 mb-3 xl:mb-4">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="shrink-0 px-3.5 py-0.5 rounded-full text-xs sm:text-sm xl:text-[15px] font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/35">
                {slide.act}
              </span>
              <span className="text-base sm:text-lg xl:text-xl 2xl:text-[1.28rem] font-semibold text-cyan-200/95 truncate min-w-0">
                <FormattedText text={slide.subtitle} />
              </span>
            </div>

            {/* Floating-style Top-Right Date / Time / Pagination Badges */}
            <div className="flex items-center gap-2 shrink-0 font-mono">
              {slide.number === 1 && (
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  title="Show Live Presentation QR Code (Shortcut: Q)"
                  className="no-print inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/55 hover:bg-emerald-400 hover:text-slate-950 shadow-[0_0_16px_rgba(52,211,153,0.28)] transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Show QR Code</span>
                </button>
              )}
              <a
                href="https://devfest.gdg-stuttgart.dev/"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit DevFest Stuttgart 2026 Official Website"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-slate-900/90 text-slate-100 border border-cyan-400/45 hover:border-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 shadow transition"
              >
                <span>DevFest Stuttgart • Nov 21, 2026</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
              </a>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-slate-900/85 text-slate-200 border border-slate-700/80">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                {slide.timeRange}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-slate-950 text-cyan-300 border border-slate-800">
                {String(slide.number).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>
          </div>

          <h1 className="w-full text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-[2.95rem] 2xl:text-[3.3rem] font-extrabold tracking-tight text-white leading-[1.1]">
            {slide.title}
          </h1>
        </header>

        {/* Slide Body: Full-Width Panoramic Image Showcase OR Universal 2-Column Split */}
        {slide.layout === 'visual-panorama' ? (
          <VisualPanoramaSlideBody
            slide={slide}
            activeEpochIdx={activeEpochIdx}
            onSelectEpoch={setActiveEpochIdx}
          />
        ) : (
        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 xl:gap-8 items-stretch min-h-0">
          {/* Left Narrative Column (Clean Typographic Point Cards) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            <div className="flex-1 flex flex-col gap-3">
              {/* Core Architectural Thesis Callout */}
              <div
                className={`shrink-0 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-cyan-950/25 border border-cyan-500/40 shadow-lg flex flex-col justify-center ${
                  slide.number === 1
                    ? 'p-5 xl:p-6'
                    : 'p-4 sm:p-5 xl:p-5'
                }`}
              >
                <div
                  className={`text-sm xl:text-[15px] font-mono font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-2 ${
                    slide.number === 1 ? 'mb-2.5' : 'mb-2'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" /> Core Architectural Thesis
                </div>
                <p
                  className={`whitespace-pre-line font-normal tracking-[-0.01em] ${
                    slide.number === 1
                      ? 'text-xl sm:text-2xl lg:text-[1.48rem] xl:text-[1.66rem] 2xl:text-[1.82rem] text-white leading-[1.34] xl:leading-[1.38]'
                      : isDenseSlide
                        ? 'text-base sm:text-lg lg:text-[1.24rem] xl:text-[1.38rem] 2xl:text-[1.52rem] text-slate-50 leading-[1.33] xl:leading-[1.36]'
                        : isConciseSlide
                          ? 'text-lg sm:text-xl lg:text-[1.42rem] xl:text-[1.58rem] 2xl:text-[1.74rem] text-white leading-[1.38]'
                          : 'text-lg sm:text-xl lg:text-[1.32rem] xl:text-[1.48rem] 2xl:text-[1.62rem] text-slate-50 leading-[1.36] xl:leading-[1.4]'
                  }`}
                >
                  <FormattedText text={slide.keyTakeaway} />
                </p>
              </div>

              {/* Clean Non-Slop Typographic Stack (.points-stack) */}
              <div className={`flex-1 flex flex-col ${isDenseSlide ? 'gap-2' : 'gap-2.5 xl:gap-3'}`}>
                {slide.bullets.map((b, i) => {
                  const { kicker, body } = parseBulletKicker(b);
                  const bodyLines = body.split('\n').filter(Boolean);
                  const isMultiLine = bodyLines.length > 1;
                  const isQuoteHighlight = i === 3;
                  const bulletImage = slide.bulletImages?.[i];
                  return (
                    <div
                      key={b}
                      className={`flex-1 flex ${
                        bulletImage ? 'flex-row items-center gap-3.5 sm:gap-4' : 'flex-col justify-center'
                      } rounded-xl border transition ${
                        isDenseSlide || slide.number === 1 ? 'px-4 py-2.5 sm:px-5 sm:py-2.5' : 'px-4 py-3 sm:px-5 sm:py-3.5'
                      } ${
                        isQuoteHighlight
                          ? 'bg-gradient-to-r from-purple-950/40 via-slate-900/70 to-emerald-950/30 border-purple-400/35 hover:border-purple-300/55'
                          : 'bg-white/[0.04] hover:bg-white/[0.065] border-white/[0.1]'
                      }`}
                    >
                      <div className={bulletImage ? 'flex-1 min-w-0 flex flex-col justify-center' : 'contents'}>
                        {kicker ? (
                          <>
                            <span
                              className={`block font-mono font-semibold uppercase tracking-wider mb-1 ${
                                isConciseSlide
                                  ? 'text-sm xl:text-[15px] 2xl:text-base'
                                  : 'text-xs sm:text-sm xl:text-[15px] 2xl:text-base'
                              } ${kickerColorClass(i)}`}
                            >
                              {kicker}
                            </span>
                            {isMultiLine ? (
                              <ul className="space-y-1">
                                {bodyLines.map((line) => (
                                  <li
                                    key={line}
                                    className="flex items-start gap-2.5 text-base sm:text-lg lg:text-[1.16rem] xl:text-[1.26rem] 2xl:text-[1.36rem] font-normal text-slate-100 leading-snug"
                                  >
                                    <span className={`mt-2 w-2 h-2 rounded-full shrink-0 bg-current ${kickerColorClass(i)}`} />
                                    <span>
                                      <FormattedText text={line} />
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p
                                className={`font-normal leading-[1.32] ${
                                  isQuoteHighlight
                                    ? 'text-base lg:text-[1.1rem] xl:text-[1.2rem] 2xl:text-[1.32rem] text-purple-50'
                                    : isDenseSlide
                                      ? 'text-base lg:text-[1.1rem] xl:text-[1.22rem] 2xl:text-[1.34rem] text-slate-100'
                                      : isConciseSlide
                                        ? 'text-base sm:text-lg lg:text-[1.22rem] xl:text-[1.34rem] 2xl:text-[1.46rem] text-slate-100'
                                        : 'text-base sm:text-lg lg:text-[1.16rem] xl:text-[1.28rem] 2xl:text-[1.4rem] text-slate-100'
                                }`}
                              >
                                <FormattedText text={body} />
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="flex items-start gap-3">
                            <span
                              className={`font-mono text-base font-semibold mt-0.5 shrink-0 ${kickerColorClass(i)}`}
                            >
                              0{i + 1}
                            </span>
                            <p
                              className={`font-normal leading-[1.34] ${
                                isConciseSlide
                                  ? 'text-base sm:text-lg lg:text-[1.22rem] xl:text-[1.34rem] 2xl:text-[1.46rem] text-slate-100'
                                  : 'text-base sm:text-lg lg:text-[1.16rem] xl:text-[1.28rem] 2xl:text-[1.4rem] text-slate-100'
                              }`}
                            >
                              <FormattedText text={body} />
                            </p>
                          </div>
                        )}
                      </div>
                      {bulletImage && (
                        <img
                          src={bulletImage.src}
                          alt={bulletImage.alt}
                          className="h-24 sm:h-28 xl:h-32 w-auto max-w-[5.75rem] object-contain rounded-md border border-white/15 bg-slate-950/60 shadow-lg shadow-black/50 shrink-0"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Metrics + Optional Slide 1 Speaker Badge */}
            <div className="space-y-2.5 pt-0.5 shrink-0">
              {slide.metrics && (
                <div className="grid grid-cols-3 gap-2.5">
                  {slide.metrics.map((m) =>
                    m.href ? (
                      <a
                        key={m.label}
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open ${m.href}`}
                        className={`block rounded-xl border px-3 py-2.5 transition hover:brightness-125 hover:border-white/40 ${metricBadgeStyle(m.accent)}`}
                      >
                        <div className="text-xs sm:text-[13px] xl:text-sm font-mono opacity-95 truncate">
                          {m.label}
                        </div>
                        <div className="text-sm sm:text-[15px] xl:text-base 2xl:text-[1.05rem] font-extrabold font-mono tracking-tight leading-tight mt-0.5 underline decoration-current/45 underline-offset-2">
                          {m.value}
                        </div>
                      </a>
                    ) : (
                      <div
                        key={m.label}
                        className={`rounded-xl border px-3 py-2.5 ${metricBadgeStyle(m.accent)}`}
                      >
                        <div className="text-xs sm:text-[13px] xl:text-sm font-mono opacity-95 truncate">
                          {m.label}
                        </div>
                        <div className="text-sm sm:text-[15px] xl:text-base 2xl:text-[1.05rem] font-extrabold font-mono tracking-tight leading-tight mt-0.5">
                          {m.value}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              {slide.number === 1 && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-900/90 border border-cyan-400/35 px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-base flex items-center justify-center shrink-0">
                      SM
                    </div>
                    <div>
                      <div className="text-base xl:text-lg font-extrabold text-white leading-tight">
                        Svetlana Meissner
                      </div>
                      <div className="text-xs sm:text-sm xl:text-[14.5px] font-mono text-cyan-300">
                        AI Researcher &amp; Architect • Wireless Systems, Brandenburg University of Technology BTU
                      </div>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm xl:text-[14.5px] font-mono font-semibold text-emerald-300">
                    45-Min Single-Track Keynote + Codelab
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Media / Interactive Demo / Illustration Column */}
          <div className="lg:col-span-7 flex flex-col min-h-[420px] lg:min-h-0">
            {slide.illustration && (
              <div className="flex items-center justify-end gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setMediaTab('illustration')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-semibold border transition ${
                    mediaTab === 'illustration'
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Illustration (I)
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('widget')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-semibold border transition ${
                    mediaTab === 'widget'
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Interactive View (I)
                </button>
              </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 w-full">
              {slide.illustration && mediaTab === 'illustration' ? (
                <figure className="relative flex-1 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-[#060911] shadow-[0_18px_42px_rgba(0,0,0,0.55)] min-h-[420px]">
                  <img
                    src={slide.illustration.src}
                    alt={slide.illustration.alt}
                    className={`w-full h-full ${
                      slide.illustration.fit === 'contain' ? 'object-contain p-4' : 'object-cover'
                    }`}
                  />
                  {slide.illustration.caption && (
                    <figcaption className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 text-sm xl:text-base font-mono text-slate-100">
                      {slide.illustration.caption}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <SlideWidgetRenderer
                  widget={slide.widget}
                  mode={demoMode}
                  onToggleMode={onToggleDemoMode}
                />
              )}
            </div>
          </div>
        </div>
        )}

        {/* Subtle "...made with Antigravity" Bottom-Right Signature */}
        <div className="pointer-events-none hidden md:inline-flex items-center gap-1.5 absolute bottom-3 right-8 lg:right-14 font-mono text-xs text-slate-400">
          <span>...made with</span>
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <strong className="text-cyan-400 font-bold">Antigravity</strong>
        </div>
      </section>

      {/* Local-Only Floating Speaker Notes Drawer (rendered only when local notes file exists) */}
      {HAS_LOCAL_NOTES && showNotes && LOCAL_NOTES[slide.id] && (
        <div className="no-print fixed bottom-16 left-6 right-6 lg:left-14 lg:right-14 z-30 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-amber-500/45 p-5 text-sm sm:text-base xl:text-lg text-amber-100 font-mono leading-relaxed shadow-2xl flex items-start justify-between gap-4">
          <div>
            <strong className="text-amber-300 uppercase mr-2">
              [Local Speaker Cue • Slide {slide.number} • {slide.timeRange}]:
            </strong>
            <FormattedText text={LOCAL_NOTES[slide.id]} />
          </div>
          <button
            type="button"
            onClick={() => setShowNotes(false)}
            className="p-1 rounded-lg text-amber-300 hover:bg-amber-500/20 shrink-0"
            title="Close Speaker Notes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bespoke/Marp-Inspired Floating On-Screen Controls (OSC) at Bottom-Center */}
      <div
        onMouseEnter={() => setOscIdle(false)}
        className={`no-print fixed bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.65)] transition-opacity duration-300 ${
          oscIdle && cinemaMode ? 'opacity-15 hover:opacity-100' : 'opacity-95 hover:opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={slideIdx === 0}
          title="Previous Slide (←)"
          className="p-1.5 rounded-full text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowOverview((s) => !s)}
          title="Open Slide Overview Grid (Shortcut: O)"
          className="px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-100 hover:bg-slate-800/90 transition min-w-[84px] text-center"
        >
          {slide.number} / {total}
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={slideIdx === total - 1}
          title="Next Slide (→ or Space)"
          className="p-1.5 rounded-full bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400 hover:text-slate-950 disabled:opacity-30 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="h-4 w-px bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => setShowOverview((s) => !s)}
          title="Slide Overview Grid (O)"
          className={`p-1.5 rounded-full transition ${
            showOverview ? 'bg-cyan-500/25 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {HAS_LOCAL_NOTES && (
          <button
            type="button"
            onClick={() => setShowNotes((s) => !s)}
            title="Toggle Local Presenter Notes (N)"
            className={`p-1.5 rounded-full transition ${
              showNotes ? 'bg-amber-500/25 text-amber-200' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onToggleSound}
          title="Toggle Stage Audio Cues (M)"
          className={`p-1.5 rounded-full transition ${
            soundEnabled ? 'bg-purple-500/25 text-purple-200' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {cinemaMode && (
          <button
            type="button"
            onClick={() => onSelectView('demos')}
            title="Switch to Demos Lab"
            className="p-1.5 rounded-full text-slate-300 hover:bg-slate-800 transition"
          >
            <FlaskConical className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenPdfView}
          title="16:9 Organizer PDF View (P)"
          className="p-1.5 rounded-full text-slate-300 hover:bg-slate-800 transition"
        >
          <Printer className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleCinemaMode}
          title="Toggle Top Bar / Cinema Stage Mode (C)"
          className={`p-1.5 rounded-full transition ${
            cinemaMode ? 'bg-cyan-500/25 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          {cinemaMode ? <PanelTop className="w-4 h-4" /> : <PanelTopClose className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title="Toggle Browser Fullscreen (F)"
          className="p-1.5 rounded-full text-slate-300 hover:bg-slate-800 transition"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Full-Screen QR Code Popup Modal (Slide 1 — Shortcut: Q) */}
      {showQrModal && (
        <div
          className="no-print fixed inset-0 z-50 bg-slate-950/88 backdrop-blur-lg flex items-center justify-center p-6"
          onClick={() => setShowQrModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Live Presentation QR Code"
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border border-emerald-400/45 p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.75)] flex flex-col items-center text-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              title="Close QR Code (Esc)"
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-400/35">
              <QrCode className="w-3.5 h-3.5" /> DevFest Stuttgart 2026 • Live Deck
            </span>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Scan to Follow Along
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Interactive slides, live demos &amp; learning hub
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-2xl border-4 border-emerald-400/30">
              <img
                src="media/devfest-stuttgart-2026-qrcode.png"
                alt="QR code linking to the DevFest Stuttgart 2026 interactive presentation"
                className="w-60 h-60 sm:w-72 sm:h-72 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            <a
              href="https://unisvet.github.io/devfest-agents-evolution/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 text-xs sm:text-sm font-mono font-semibold text-cyan-300 transition"
            >
              <span>unisvet.github.io/devfest-agents-evolution</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>

            <div className="text-xs font-mono text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Esc</kbd> or click outside to close
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Slide Overview Grid Modal (Marp 'O' key style) */}
      {showOverview && (
        <div className="no-print fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-xl overflow-y-auto p-6 sm:p-10">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-300">
                Slide Deck Overview • {total} Widescreen Slides
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Jump to Any Slide (Press <kbd className="px-2 py-0.5 rounded bg-slate-800 text-xs">O</kbd> or{' '}
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-xs">Esc</kbd> to Close)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowOverview(false)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {SLIDES_DATA.map((s, idx) => {
              const active = idx === slideIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playSlideTransition(idx >= slideIdx ? 'next' : 'prev');
                    setSlideIdx(idx);
                    setShowOverview(false);
                  }}
                  className={`text-left rounded-2xl overflow-hidden border transition flex flex-col justify-between ${
                    active
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.25)]'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  {s.illustration && (
                    <div className="w-full aspect-video bg-slate-950 overflow-hidden border-b border-slate-800/80">
                      <img
                        src={s.illustration.src}
                        alt={s.illustration.alt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 font-bold">
                          #{String(s.number).padStart(2, '0')}
                        </span>
                        <span className="text-slate-300">{s.timeRange}</span>
                      </div>
                      <div className="text-base font-extrabold text-white line-clamp-2 leading-snug">
                        {s.title}
                      </div>
                      <div className="text-xs text-slate-300 line-clamp-1 mt-1">{s.subtitle}</div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800/80">
                      <span className="text-emerald-300 truncate">{s.act}</span>
                      <span className="text-purple-300 shrink-0 ml-1">
                        {s.layout === 'visual-panorama'
                          ? '🖼 Full Panorama'
                          : s.illustration
                            ? '🖼 + Interactive'
                            : s.widget}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
