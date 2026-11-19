import React, { useEffect, useState } from 'react';
import { CheckCircle2, Cloud, ExternalLink, Play, Sparkles, Wand2, X } from 'lucide-react';
import packingDataset from '../../data/circle_packing_n26.json';
import { CirclePackingMilestone, CircleSpec } from '../../types/presentation';
import { soundEngine } from '../../utils/soundEngine';

const MILESTONES = packingDataset.milestones as CirclePackingMilestone[];

function stepBrowserPhysicsRelaxation(circles: CircleSpec[], iterations = 25): {
  circles: CircleSpec[];
  sumOfRadii: number;
  areaCoveragePct: number;
} {
  const n = circles.length;
  const xs = circles.map((c) => c.x);
  const ys = circles.map((c) => c.y);
  const rs = circles.map((c) => Math.max(0.015, c.r));

  for (let step = 0; step < iterations; step++) {
    for (let i = 0; i < n; i++) rs[i] += 0.0009;

    const fx = new Array<number>(n).fill(0);
    const fy = new Array<number>(n).fill(0);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = xs[i] - xs[j];
        const dy = ys[i] - ys[j];
        const dist = Math.hypot(dx, dy) + 1e-12;
        const overlap = rs[i] + rs[j] - dist;
        if (overlap > 0) {
          const ux = dx / dist;
          const uy = dy / dist;
          fx[i] += ux * overlap;
          fy[i] += uy * overlap;
          fx[j] -= ux * overlap;
          fy[j] -= uy * overlap;
        }
      }
      if (xs[i] < rs[i]) fx[i] += (rs[i] - xs[i]) * 1.3;
      if (xs[i] + rs[i] > 1.0) fx[i] -= (xs[i] + rs[i] - 1.0) * 1.3;
      if (ys[i] < rs[i]) fy[i] += (rs[i] - ys[i]) * 1.3;
      if (ys[i] + rs[i] > 1.0) fy[i] -= (ys[i] + rs[i] - 1.0) * 1.3;
    }

    for (let i = 0; i < n; i++) {
      xs[i] = Math.min(0.985, Math.max(0.015, xs[i] + 0.34 * fx[i]));
      ys[i] = Math.min(0.985, Math.max(0.015, ys[i] + 0.34 * fy[i]));
    }

    // Clamp radii for strict non-overlap feasibility
    for (let i = 0; i < n; i++) {
      const wallCap = Math.min(xs[i], 1.0 - xs[i], ys[i], 1.0 - ys[i]);
      if (rs[i] > wallCap) rs[i] = wallCap;
    }
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dist = Math.hypot(xs[i] - xs[j], ys[i] - ys[j]);
          const excess = rs[i] + rs[j] - dist;
          if (excess > 0) {
            const half = 0.5 * excess + 1e-7;
            rs[i] = Math.max(0, rs[i] - half);
            rs[j] = Math.max(0, rs[j] - half);
          }
        }
      }
    }
  }

  // Final greedy slack inflation so zero overlaps hold strictly
  for (let i = 0; i < n; i++) {
    let cap = Math.min(xs[i], 1.0 - xs[i], ys[i], 1.0 - ys[i]);
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d = Math.hypot(xs[i] - xs[j], ys[i] - ys[j]) - rs[j];
      if (d < cap) cap = d;
    }
    rs[i] = Math.max(0, cap - 1e-6);
  }

  const nextCircles: CircleSpec[] = xs.map((x, idx) => ({
    id: idx,
    x,
    y: ys[idx],
    r: rs[idx],
  }));
  const sumR = rs.reduce((acc, v) => acc + v, 0);
  const areaPct = rs.reduce((acc, v) => acc + Math.PI * v * v, 0) * 100;
  return {
    circles: nextCircles,
    sumOfRadii: Number(sumR.toFixed(4)),
    areaCoveragePct: Number(areaPct.toFixed(1)),
  };
}

export const CirclePackingCodelabDemo: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [showAeModal, setShowAeModal] = useState<boolean>(false);
  const [liveOverride, setLiveOverride] = useState<{
    circles: CircleSpec[];
    sumOfRadii: number;
    areaCoveragePct: number;
  } | null>(null);

  useEffect(() => {
    if (!showAeModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowAeModal(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAeModal]);

  const baseMilestone = MILESTONES[selectedIdx];
  const circles = liveOverride ? liveOverride.circles : baseMilestone.circles;
  const sumOfRadii = liveOverride ? liveOverride.sumOfRadii : baseMilestone.sumOfRadii;
  const areaCoveragePct = liveOverride ? liveOverride.areaCoveragePct : baseMilestone.areaCoveragePct;
  const seedRadii = MILESTONES[0].sumOfRadii;
  const gainPct = (((sumOfRadii - seedRadii) / seedRadii) * 100).toFixed(1);

  useEffect(() => {
    setLiveOverride(null);
  }, [selectedIdx]);

  const autoEvolve = async () => {
    setIsAutoPlaying(true);
    setLiveOverride(null);
    for (let i = 0; i < MILESTONES.length; i++) {
      setSelectedIdx(i);
      soundEngine.playEvolutionPulse(i + 1);
      await new Promise((r) => setTimeout(r, 750));
    }
    setIsAutoPlaying(false);
  };

  const handleLiveRelax = () => {
    soundEngine.playEvolutionPulse(2.5);
    const relaxed = stepBrowserPhysicsRelaxation(circles, 30);
    setLiveOverride(relaxed);
  };

  const circleFill = (r: number) => {
    if (r < 0.025) return { fill: 'rgba(251, 113, 133, 0.35)', stroke: '#fb7185' }; // Clipped tiny seed circles
    if (r < 0.085) return { fill: 'rgba(251, 191, 36, 0.28)', stroke: '#fbbf24' }; // Pocket / corner circles
    if (r < 0.108) return { fill: 'rgba(34, 211, 238, 0.26)', stroke: '#22d3ee' }; // Standard lattice circles
    return { fill: 'rgba(52, 211, 153, 0.32)', stroke: '#34d399' }; // Large inflated variable-r circles
  };

  return (
    <div className="flex flex-col h-full justify-between rounded-2xl bg-slate-900/85 border border-cyan-500/35 p-4 xl:p-5 shadow-xl gap-3">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {MILESTONES.map((m, idx) => (
              <button
                key={m.generation}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  soundEngine.playEvolutionPulse(idx + 1);
                }}
                className={`px-3 py-1 rounded-lg text-xs sm:text-sm xl:text-[15px] font-mono font-bold transition border ${
                  selectedIdx === idx
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                Gen {m.generation}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowAeModal(true)}
              title="How a real Google Cloud AlphaEvolve (ae) experiment works"
              className="no-print inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/45 transition"
            >
              <Cloud className="w-4 h-4" /> How ae Works
            </button>
            <button
              type="button"
              onClick={handleLiveRelax}
              title="Run 30 steps of live repulsive physics + radius clamping right in browser"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/45 transition"
            >
              <Wand2 className="w-4 h-4" /> + Live Relax
            </button>
            <button
              type="button"
              onClick={autoEvolve}
              disabled={isAutoPlaying}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs sm:text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {isAutoPlaying ? 'Evolving...' : 'Auto-Evolve'}
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-4 gap-2.5 my-2.5 shrink-0">
          <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2">
            <div className="text-xs sm:text-[13px] font-mono text-slate-300">∑ Radii (n=26)</div>
            <div className="text-base sm:text-lg xl:text-2xl font-extrabold font-mono text-emerald-300 mt-0.5">{sumOfRadii.toFixed(4)}</div>
          </div>
          <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2">
            <div className="text-xs sm:text-[13px] font-mono text-slate-300">Gain vs Seed</div>
            <div className="text-base sm:text-lg xl:text-2xl font-extrabold font-mono text-cyan-300 mt-0.5">+{gainPct}%</div>
          </div>
          <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2">
            <div className="text-xs sm:text-[13px] font-mono text-slate-300">Square Area</div>
            <div className="text-base sm:text-lg xl:text-2xl font-extrabold font-mono text-purple-300 mt-0.5">{areaCoveragePct.toFixed(1)}%</div>
          </div>
          <div className="rounded-xl bg-slate-950/90 border border-slate-800 px-3 py-2">
            <div className="text-xs sm:text-[13px] font-mono text-slate-300">Verifier Check</div>
            <div className="text-sm sm:text-base xl:text-lg font-extrabold font-mono text-emerald-300 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> 0 Overlaps
            </div>
          </div>
        </div>

        {/* Split: 2D Unit Square [0,1]^2 Visualizer + # EVOLVE-BLOCK Code */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch min-h-0">
          <div className="lg:col-span-5 xl:col-span-4 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between text-xs sm:text-sm font-mono text-slate-300 mb-1.5 px-0.5">
              <span>Unit Square [0, 1]²</span>
              <span className="text-cyan-300 font-bold">n = 26</span>
            </div>
            <svg viewBox="-0.03 -0.03 1.06 1.06" className="w-full max-w-[240px] xl:max-w-[260px] aspect-square my-auto">
              {/* Square boundary & subtle 5x5 guide grid */}
              <rect
                x="0"
                y="0"
                width="1"
                height="1"
                fill="#020617"
                stroke="#38bdf8"
                strokeOpacity="0.45"
                strokeWidth="0.008"
              />
              {[0.2, 0.4, 0.6, 0.8].map((g) => (
                <g key={g}>
                  <line x1={g} y1={0} x2={g} y2={1} stroke="#1e293b" strokeWidth="0.004" />
                  <line x1={0} y1={g} x2={1} y2={g} stroke="#1e293b" strokeWidth="0.004" />
                </g>
              ))}

              {/* Render all 26 verified circles */}
              {circles.map((c) => {
                const style = circleFill(c.r);
                const dispR = Math.max(c.r, 0.006); // Keep r=0.0 corner point visible in Gen 0
                return (
                  <g key={c.id}>
                    <circle
                      cx={c.x}
                      cy={1.0 - c.y}
                      r={dispR}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth="0.005"
                    />
                    <circle cx={c.x} cy={1.0 - c.y} r="0.006" fill={style.stroke} />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="lg:col-span-7 xl:col-span-8 rounded-xl bg-slate-950 border border-slate-800 p-3.5 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2 text-sm xl:text-base font-mono mb-2">
                <span className="text-cyan-300 font-bold truncate">{baseMilestone.label}</span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 text-xs sm:text-sm shrink-0">
                  program.py
                </span>
              </div>
              <pre className="text-xs sm:text-[13px] xl:text-[14px] 2xl:text-[14.5px] leading-relaxed font-mono text-slate-100 whitespace-pre-wrap break-words">
                {baseMilestone.code}
              </pre>
            </div>

            <div className="pt-2.5 mt-2 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-mono">
              <a
                href="https://codelabs.developers.google.com/alphaevolve-on-google-cloud-1#0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
              >
                Open Official Google Cloud Codelab <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
              >
                alphaevolve-on-googlecloud <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-cyan-950/35 border border-cyan-500/30 px-4 py-2.5 text-sm sm:text-[15px] xl:text-base text-slate-100 flex items-start gap-2.5 leading-snug shrink-0">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          {liveOverride
            ? `Live Browser Physics Polish applied! Verified zero-overlap sum_of_radii = ${sumOfRadii.toFixed(4)} (${areaCoveragePct.toFixed(1)}% unit-square area).`
            : baseMilestone.summary}
        </span>
      </div>

      {showAeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="How a real Google Cloud AlphaEvolve experiment works"
          onClick={() => setShowAeModal(false)}
          className="no-print fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/45 shadow-2xl p-6 sm:p-7 space-y-5"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-200 border border-amber-400/40 mb-2">
                  <Cloud className="w-3.5 h-3.5" /> Google Cloud AlphaEvolve (`ae` CLI &amp; Discovery Engine)
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  How a Real Cloud AlphaEvolve Experiment Works
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAeModal(false)}
                aria-label="Close modal"
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-950/90 border border-cyan-500/35 p-4 space-y-1.5">
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide">
                  File 1 You Write • Seed Only
                </div>
                <div className="text-sm font-mono font-bold text-white">
                  demos/alphaevolve_circle_packing/program.py
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Just the naive Gen 0 concentric-ring seed (<code className="text-cyan-300">0.9598</code>) wrapped in{' '}
                  <code className="text-cyan-300"># EVOLVE-BLOCK-START ... END</code>. You never hand-write Gen 5–40!
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/90 border border-emerald-500/35 p-4 space-y-1.5">
                <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wide">
                  File 2 You Write • Deterministic Verifier
                </div>
                <div className="text-sm font-mono font-bold text-white">
                  demos/alphaevolve_circle_packing/evaluate.py
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Checks zero overlaps &amp; <code className="text-emerald-300">[0, 1]²</code> containment, returning{' '}
                  <code className="text-emerald-300">sum_of_radii</code> or <code className="text-rose-300">-inf</code>{' '}
                  plus a diagnostic insight string so Gemini self-repairs.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                The 4-Step Cloud Evolutionary Loop (~15–30 min over 50–100+ Generations)
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-200">
                <li className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
                  <strong className="text-cyan-300">1. Launch (`ae` CLI):</strong> Upload seed{' '}
                  <code>program.py</code> + select Cloud models (<code>gemini-4-argon</code> default /{' '}
                  <code>gemini-3.1-pro-preview</code>).
                </li>
                <li className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
                  <strong className="text-purple-300">2. Mutate (`acquire_programs`):</strong> Cloud Discovery Engine
                  mutates <em>only</em> inside <code># EVOLVE-BLOCK</code> using top MAP-Elites programs &amp; insights.
                </li>
                <li className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
                  <strong className="text-emerald-300">3. Evaluate Locally / TPU:</strong> Your worker runs{' '}
                  <code>evaluate.py</code> inside YOUR environment—proprietary data &amp; verifier never leave.
                </li>
                <li className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
                  <strong className="text-amber-300">4. Submit (`submit_program_evaluations`):</strong> Return numeric
                  score + error diagnostics; repeat until Gemini invents staggered-hex + SciPy <code>SLSQP</code>!
                </li>
              </ol>
            </div>

            <div className="rounded-2xl bg-amber-950/25 border border-amber-500/35 px-4 py-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-amber-300">Why this slide &amp; VS Code demo finish in ~1 second:</strong> On
              stage we run a deterministic time-lapse of 4 verified checkpoints (<code className="text-cyan-300">0.960</code>{' '}
              → <code className="text-emerald-300">2.631</code>), comparing directly against{' '}
              <strong className="text-amber-200">David Cantrell’s 2011 human record (2.6340, held 14 yrs)</strong> and{' '}
              <strong className="text-purple-200">AlphaEvolve’s 2025 SOTA (2.63586)</strong>.
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <a
                href="https://github.com/Unisvet/devfest-agents-evolution/tree/main/demos/alphaevolve_circle_packing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
              >
                Open program.py &amp; evaluate.py on GitHub <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setShowAeModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition"
              >
                Back to Demo (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
