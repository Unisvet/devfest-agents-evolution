import React from 'react';
import { ArrowLeft, Cpu, Printer, Sparkles } from 'lucide-react';
import { SLIDES_DATA } from '../data/slidesData';
import { DemoExecutionMode } from '../types/presentation';
import { FormattedText, stripMarkdownLinks } from './FormattedText';
import { SlideWidgetRenderer } from './SlideWidgetRenderer';
import { VisualPanoramaSlideBody } from './VisualPanoramaSlideBody';

function printMetricAccentStyle(accent: 'cyan' | 'emerald' | 'purple' | 'amber'): {
  card: string;
  value: string;
} {
  switch (accent) {
    case 'cyan':
      return { card: 'border-cyan-500/35 bg-cyan-950/25', value: 'text-cyan-300' };
    case 'emerald':
      return { card: 'border-emerald-500/35 bg-emerald-950/25', value: 'text-emerald-300' };
    case 'purple':
      return { card: 'border-purple-500/35 bg-purple-950/25', value: 'text-purple-300' };
    case 'amber':
      return { card: 'border-amber-500/35 bg-amber-950/25', value: 'text-amber-300' };
  }
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

export const PrintPdfDeckView: React.FC<{
  demoMode: DemoExecutionMode;
  onBackToDeck: () => void;
}> = ({ demoMode, onBackToDeck }) => {
  return (
    <div className="w-full pb-16">
      {/* Screen-only Action Banner */}
      <div className="no-print w-full px-6 sm:px-10 lg:px-14 xl:px-20 py-6">
        <div className="rounded-2xl bg-slate-900/85 border border-cyan-500/40 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">
              16:9 Conference Organizer Backup Generator • Full-Width Edition
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5">
              Export All {SLIDES_DATA.length} Widescreen Slides to PDF
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Click <strong>Save as 16:9 PDF</strong> below and select <em>Destination: Save as PDF</em> (Background graphics enabled, Margins: None).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBackToDeck}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Interactive Deck
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg transition"
            >
              <Printer className="w-4 h-4" /> Save as 16:9 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stacked 16:9 Full-Width Printable Slide Sheets */}
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 space-y-8 print:px-0 print:space-y-0">
        {SLIDES_DATA.map((slide) => {
          const narrativeChars =
            stripMarkdownLinks(slide.keyTakeaway).length +
            slide.bullets.reduce((acc, b) => acc + stripMarkdownLinks(b).length, 0);
          const isConciseSlide = narrativeChars < 530 && slide.bullets.length <= 3;
          const isDenseSlide = slide.bullets.length >= 4 || narrativeChars > 660;

          return (
          <section
            key={slide.id}
            className="print-slide-page w-full rounded-3xl print:rounded-none bg-[#070b17] border border-slate-800 print:border-0 px-8 py-6 lg:px-12 lg:py-8 flex flex-col justify-between"
          >
            {/* Full-Width Slide Header */}
            <header className="w-full border-b border-slate-700/50 pb-2">
              <div className="flex items-center justify-between text-sm font-mono text-cyan-300 mb-1">
                <span>
                  {slide.act} • <FormattedText text={slide.subtitle} />
                </span>
                <span>
                  {slide.timeRange} • Slide {String(slide.number).padStart(2, '0')} /{' '}
                  {String(SLIDES_DATA.length).padStart(2, '0')}
                </span>
              </div>
              <h2 className="w-full text-3xl lg:text-[2.5rem] font-extrabold text-white leading-tight">
                {slide.title}
              </h2>
            </header>

            {/* Body: Full-Width Panorama OR Universal 2-Column Body */}
            {slide.layout === 'visual-panorama' ? (
              <VisualPanoramaSlideBody slide={slide} staticPrint />
            ) : (
            <div className="grid grid-cols-12 gap-6 items-stretch my-auto py-3 flex-1 min-h-0">
              <div className="col-span-5 flex flex-col justify-between gap-2.5">
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="shrink-0 rounded-xl bg-slate-950 border border-cyan-500/40 p-4 flex flex-col justify-center">
                    <div
                      className={`text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 ${
                        slide.number === 1 ? 'mb-2' : 'mb-1.5'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" /> Core Architectural Thesis
                    </div>
                    <p
                      className={`whitespace-pre-line font-normal tracking-[-0.01em] ${
                        slide.number === 1
                          ? 'text-[20px] text-white leading-[1.36]'
                          : isDenseSlide
                            ? 'text-[15.5px] text-slate-50 leading-snug'
                            : isConciseSlide
                              ? 'text-[19px] text-white leading-snug'
                              : 'text-[17px] text-slate-100 leading-snug'
                      }`}
                    >
                      <FormattedText text={slide.keyTakeaway} />
                    </p>
                  </div>

                  <div className={`flex-1 flex flex-col ${isDenseSlide ? 'gap-2' : 'gap-2.5'}`}>
                    {slide.bullets.map((b, i) => {
                      const { kicker, body } = parseBulletKicker(b);
                      const bodyLines = body.split('\n').filter(Boolean);
                      const isMultiLine = bodyLines.length > 1;
                      const accentClass =
                        i === 0
                          ? 'text-cyan-300'
                          : i === 1
                            ? 'text-amber-300'
                            : i === 2
                              ? 'text-emerald-300'
                              : 'text-purple-300';
                      const isQuoteHighlight = i === 3;
                      const bulletImage = slide.bulletImages?.[i];
                      return (
                        <div
                          key={b}
                          className={`flex-1 flex ${
                            bulletImage ? 'flex-row items-center gap-3' : 'flex-col justify-center'
                          } rounded-xl border px-4 ${
                            isDenseSlide ? 'py-2' : 'py-2.5'
                          } ${
                            isQuoteHighlight
                              ? 'bg-purple-950/35 border-purple-400/35'
                              : 'bg-white/[0.04] border-white/[0.1]'
                          }`}
                        >
                          <div className={bulletImage ? 'flex-1 min-w-0 flex flex-col justify-center' : 'contents'}>
                            {kicker ? (
                              <>
                                <span
                                  className={`block font-mono text-xs font-semibold uppercase tracking-wider mb-0.5 ${accentClass}`}
                                >
                                  {kicker}
                                </span>
                                {isMultiLine ? (
                                  <ul className="space-y-1">
                                    {bodyLines.map((line) => (
                                      <li
                                        key={line}
                                        className="flex items-start gap-2 text-[17px] font-normal text-slate-100 leading-snug"
                                      >
                                        <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-current ${accentClass}`} />
                                        <span>
                                          <FormattedText text={line} />
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p
                                    className={`font-normal leading-snug ${
                                      isDenseSlide
                                        ? 'text-[14px] text-slate-100'
                                        : isConciseSlide
                                          ? 'text-[16.5px] text-slate-100'
                                          : 'text-[15.5px] text-slate-100'
                                    }`}
                                  >
                                    <FormattedText text={body} />
                                  </p>
                                )}
                              </>
                            ) : (
                              <p
                                className={`font-normal leading-snug ${
                                  isConciseSlide
                                    ? 'text-[16.5px] text-slate-100'
                                    : 'text-[15.5px] text-slate-100'
                                }`}
                              >
                                <FormattedText text={body} />
                              </p>
                            )}
                          </div>
                          {bulletImage && (
                            <img
                              src={bulletImage.src}
                              alt={bulletImage.alt}
                              className="h-20 w-auto max-w-[4.5rem] object-contain rounded-md border border-white/15 bg-slate-950/60 shadow-md shrink-0"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {slide.metrics && (
                  <div className="grid grid-cols-3 gap-2 shrink-0">
                    {slide.metrics.map((m) => {
                      const style = printMetricAccentStyle(m.accent);
                      return m.href ? (
                        <a
                          key={m.label}
                          href={m.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block rounded-xl border px-3 py-2 ${style.card}`}
                        >
                          <div className="text-xs font-mono text-slate-300 truncate">{m.label}</div>
                          <div className={`text-base font-extrabold font-mono mt-0.5 truncate underline decoration-current/45 underline-offset-2 ${style.value}`}>
                            {m.value}
                          </div>
                        </a>
                      ) : (
                        <div
                          key={m.label}
                          className={`rounded-xl border px-3 py-2 ${style.card}`}
                        >
                          <div className="text-xs font-mono text-slate-300 truncate">{m.label}</div>
                          <div className={`text-base font-extrabold font-mono mt-0.5 truncate ${style.value}`}>
                            {m.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="col-span-7 flex flex-col min-h-0">
                {slide.illustration && !slide.widget.startsWith('demo-') && slide.widget !== 'closing-blueprint' ? (
                  <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 bg-[#060911] flex items-center justify-center">
                    <img
                      src={slide.illustration.src}
                      alt={slide.illustration.alt}
                      className={`w-full h-full ${
                        slide.illustration.fit === 'contain' ? 'object-contain p-3' : 'object-cover'
                      }`}
                    />
                  </div>
                ) : (
                  <SlideWidgetRenderer widget={slide.widget} mode={demoMode} staticPrint />
                )}
              </div>
            </div>
            )}

            <footer className="text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>
                Svetlana Meissner •{' '}
                <a
                  href="https://devfest.gdg-stuttgart.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  DevFest Stuttgart 2026
                </a>{' '}
                • github.com/Unisvet/devfest-agents-evolution
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                ...made with <Cpu className="w-3 h-3 text-cyan-400" />{' '}
                <strong className="text-cyan-400">Antigravity</strong>
              </span>
            </footer>
          </section>
          );
        })}
      </div>
    </div>
  );
};
